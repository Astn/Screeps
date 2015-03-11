var _ = require('lodash');
var BODY = require('body');
var ROLE = require('role');
var STATE = require('state');
var PROFILE = require('profile');
var utility = {
    crepsWithMoves: function (creeps) {

        "use strict";
        return _.filter(creeps, function (n) {

            return n.memory.move;

        });

    },
    moveCreepsWithStoredMove: function (creeps) {

        "use strict";
        var creepsWithMoves = this.crepsWithMoves(creeps);
        _.forEach(creepsWithMoves, function (creep) {

            creep.move(creep.memory.move);
            creep.memory.move = null;
        });
    },
    initializeRoomMemory: function (roomName) {

        "use strict";
        Memory.myRooms = {};

        if (!Memory.myRooms[roomName]) {

            Memory.myRooms[roomName] = {};
        }
        if (!Memory.myRooms[roomName].map) {

            Memory.myRooms[roomName].map = {
                nextPos: { x: 0, y: 0, },
                done: false,
                spawns: {},
                sources: {},
            };
        }
    },
    terrainType: function (pos) {

        "use strict";
        var map = Memory.myRooms[pos.roomName].map;
        if (!map.terrain) {

            map.terrain = new Array(50 * 50);
        }
        if (map.terrain[pos.x + (50 * pos.y)] !== null) {

            return map.terrain[pos.x + (50 * pos.y)];
        }
        var look = Game.rooms[pos.roomName].lookAt(pos);

        for (var f in look) {

            if (look[f].terrain) {

                map.terrain[pos.x + (50 * pos.y)] = look[f].terrain;
                break;
            }
        }

        return map.terrain[pos.x + (50 * pos.y)];
    },
    movementCost: function (terrainType) {

        "use strict";
        if (terrainType === "plain") {

            return 2;
        }
        if (terrainType === "swamp") {

            return 10;
        }
        if (terrainType === "road") {

            return 1;
        }
        if (terrainType === "rampart") {

            return 2;
        }
        if (terrainType === "wall") {

            return 1000;
        }
    },

    mapDestinationsIn: function (fromPos, destArray, memoryHash, filter) {

        "use strict";
        for (var objId in destArray) {

            var dest = destArray[objId];
            if (filter && filter(dest)) {

                continue;
            }

            if (!memoryHash[dest.id]) {

                memoryHash[dest.id] = new Array(50 * 50);
            }
            var room = dest.room;
            var pathTo = room.findPath(fromPos, dest.pos, {
                ignoreCreeps: true,
                ignoreDestructibleStructures: true,
                heuristicWeight: 1
            });

            if (pathTo.length > 0) {

                var totalWeight = _.reduce(pathTo, function (accumulator, step) {

                    var stepPos = room.getPositionAt(step.x, step.y);
                    var terrain = this.terrainType(stepPos);
                    var cost = this.movementCost(terrain);
                    return accumulator + cost;
                }, 0, this);
                //console.log('dist: '+parseInt(pathTo.length)+ ' weight:'+parseInt(totalWeight));
                memoryHash[dest.id][fromPos.x + (50 * fromPos.y)] = [pathTo.length, totalWeight, ];
            }
        }
    },
    updateMap: function (roomName) {

        var room = Game.rooms[roomName];
        if (!Memory.myRooms || !Memory.myRooms[roomName]) {

            this.initializeRoomMemory(roomName);
        }
        var map = Memory.myRooms[roomName].map;
        if (map.done === true) {

            return false;
        }

        var currentPos = room.getPositionAt(map.nextPos.x, map.nextPos.y);

        //increment posiition
        if (map.nextPos.x === 49 && map.nextPos.y !== 49) {

            map.nextPos.x = 0;
            map.nextPos.y++;
        } else if (map.nextPos.x === 49 && map.nextPos.y === 49) {

            map.done = true;
            console.log('done mapping');
            return false;
        } else {

            map.nextPos.x++;
        }

        if (!currentPos) {

            console.log('no position for x:' + parseInt(map.nextPos.x) + ' y:' + parseInt(map.nextPos.y));
            return true;
        }

        var terrain = this.terrainType(currentPos);
        //console.log(terrain);
        if (terrain === 'wall') {

            return true;
        }

        this.mapDestinationsIn(currentPos, Game.spawns, map.spawns, function (spawn) {

            return spawn.room.name !== roomName;
        });
        this.mapDestinationsIn(currentPos, room.find(Game.SOURCES), map.sources);

        return true;

    },
    nextPosOnMap: function (pos, map) {

        var bestXY = { x: pos.x, y: pos.y };
        var bestDist = 10000;
        for (var y = pos.y - 1; y <= pos.y + 1; y++) {

            for (var x = pos.x - 1; x <= pos.x + 1; x++) {

                if (map[x + (50 * y)] && map[x + (50 * y)][1] && map[x + (50 * y)][1] < bestDist) {

                    bestXY = { x: x, y: y };
                    bestDist = map[x + (50 * y)][1];
                }
            }
        }
        return bestXY;
    },
    directionToNearestSpawn: function (creep) {

        /*Directions
            Game.TOP	1
            Game.TOP_RIGHT	2
            Game.RIGHT	3
            Game.BOTTOM_RIGHT	4
            Game.BOTTOM	5
            Game.BOTTOM_LEFT	6
            Game.LEFT	7
            Game.TOP_LEFT	8
        */
        var directionLookup = [
          Game.TOP_LEFT,
          Game.TOP,
          Game.TOP_RIGHT,
          Game.LEFT,
          0,
          Game.RIGHT,
          Game.BOTTOM_LEFT,
          Game.BOTTOM,
          Game.BOTTOM_RIGHT,
        ];

        var pos = Memory.myRooms[creep.room.name].map.spawns;
        var bestDist = 100;
        var bestXY = { x: creep.pos.x, y: creep.pos.y };
        for (var y = creep.pos.y - 1; y <= creep.pos.y + 1; y++) {

            for (var x = creep.pos.x - 1; x <= creep.pos.x + 1; x++) {

                if (pos) {

                    for (var spName in pos) {

                        if (pos[spName][x + (50 * y)] < pos[spName][creep.pos.x + (50 * creep.pos.y)]) {

                            bestXY = { x: x, y: y };
                            bestDist = pos[spName][x + (50 * y)];
                        }
                    }
                }
            }
        }
        var offset = { x: bestXY.x - creep.pos.x, y: bestXY.y - creep.pos.y };
        offset.x++;
        offset.y++;
        console.log('for x:' + parseInt(creep.pos.x) + ' y:' + parseInt(creep.pos.y) + ' best x:' + parseInt(bestXY.x) + ' y:' + parseInt(bestXY.y) + ' offset x:' + parseInt(offset.x) + ' y:' + parseInt(offset.y));
        return directionLookup[offset.x + (3 * offset.y)];
    },
    positionDistanceToNearestSpawn: function (room, obj) {

        var pos;
        if (obj.pos) {

            pos = obj.pos;
        }
        else {

            pos = obj;
        }
        var spawns = Memory.myRooms[room.name].map.spawns;
        var bestDist = 100;
        for (var spId in spawns) {

            if (spawns[spId][pos.x + (50 * pos.y)][0] < bestDist) {

                bestDist = spawns[spId][pos.x + (50 * pos.y)][0];
            }
        }
        return bestDist;
    },
    setStartTimeAndInitializeMemory: function () {
        var creepCt = _.transform(Game.creeps, function (acc) {
            return acc + 1;
        }, 0);
        for (var spawnName in Game.spawns) {
            var spawn = Game.spawns[spawnName];
            if (creepCt === 0 && spawn.energy === 1000) {
                Memory.startTime = Game.time;
                Memory.creeps = {};
                Memory.mine = {};
                this.initializeRoomMemory(spawn.room.name);
                console.log('starting...');
            }

        }
    },
    samePos: function (pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    },
    touching: function (pos1, pos2) {
        return this.samePos({ x: pos1.x - 1, y: pos1.y }, pos2) // left
            || this.samePos({ x: pos1.x + 1, y: pos1.y }, pos2) // right
            || this.samePos({ x: pos1.x, y: pos1.y - 1 }, pos2) // up
            || this.samePos({ x: pos1.x, y: pos1.y + 1 }, pos2) // down
            || this.samePos({ x: pos1.x - 1, y: pos1.y - 1 }, pos2) // upleft
            || this.samePos({ x: pos1.x + 1, y: pos1.y - 1 }, pos2) // upright
            || this.samePos({ x: pos1.x - 1, y: pos1.y + 1 }, pos2) // downleft
            || this.samePos({ x: pos1.x + 1, y: pos1.y + 1 }, pos2); // downright
    },
    linearDistance: function (pos1, pos2) {
        var x = pos1.x - pos2.x;
        var y = pos1.y - pos2.y;
        return Math.sqrt(x * x + y * y);
    },

    creepCanAttack: function (n) {
        var count = _.filter(n.body, function (part) {
            return part.type === Game.ATTACK || part.type === Game.RANGED_ATTACK;
        }).length;
        return count > 0;
    },
    creepIsRanged: function (n) { return _.filter(n.body, function (part) { return part.type === Game.RANGED_ATTACK; }).length > 0; },
    creepIsCloseRanged: function (n) { return _.filter(n.body, function (part) { return part.type === Game.ATTACK; }).length > 0; },
    creepIsMiner: function (n) { return n.memory.role === ROLE.MINER; },
    creepIsPacker: function (n) { return n.memory.role === ROLE.PACKER; },
    firstPosAlongPathTo: function (n, creep) {
        if (n) {
            var path = creep.pos.findPathTo(n);
            if (path.length > 0) {
                return path[0];
            }
        }
        return null;
    },
    exitsArray: [Game.EXIT_TOP, Game.EXIT_LEFT, Game.EXIT_RIGHT, Game.EXIT_BOTTOM],
    posBehindCreep: function (creep) {
        // find paths to each of the exits
        var fullPaths = _.map(this.exitsArray, function (n) { return creep.pos.findClosest(n); });
        var firstPaths = _.map(fullPaths, function (n) {
            if (n) {
                var path = creep.pos.findPathTo(n);
                if (path.length > 0) {
                    return path[0];
                }
            }
            return null;
        });
        // remove nulls
        firstPaths = _.filter(firstPaths, function (f) { return f !== null; });
        // make an average position if the len is > 1;
        var inFrontOfCreep = {
            x: 0,
            y: 0
        };
        if (firstPaths.length > 1) {
            var summed = _.reduce(firstPaths, function (agg, f) {
                return { x: (agg.x + f.x), y: (agg.y + f.y) };
            }, inFrontOfCreep);
            var avged = { x: Math.round(summed.x / firstPaths.length), y: Math.round(summed.y / firstPaths.length) };
            return {
                x: creep.pos.x + (avged.x - creep.pos.x),
                y: creep.pos.y + (avged.y - creep.pos.y)
            };
        }
        else if (firstPaths.length === 1) {
            inFrontOfCreep = {
                x: firstPaths[0].x,
                y: firstPaths[0].y
            };
        }
        var behindCreep = {
            x: creep.pos.x + (creep.pos.x - inFrontOfCreep.x),
            y: creep.pos.y + (creep.pos.y - inFrontOfCreep.y)
        };

        return behindCreep;
    },
    sumPosX: function (sum, n) { return sum + n.pos.x; },
    sumPosY: function (sum, n) { return sum + n.pos.y; },
    creepHitsRatio: function (n) { return n.hits / n.hitsMax; },
    creepIsDamaged: function (n) { return (n.hits < n.hitsMax); },
    chooseSpawn: function (creep) {
        var spawn = {};
        for (var sp in Game.spawns) {
            if (Game.spawns[sp].room === creep.room) {
                spawn = Game.spawns[sp];
                break;
            }
        }
        return spawn;
    },
    chooseHostile: function (creep) {
        //if(!range){
        //  range = 1;
        //}
        //else if(range > 15){


        // need to pick the guy that is close enough with the lowest hits left


        return creep.pos.findClosest(Game.HOSTILE_CREEPS, {
            ignoreCreeps: true,
            filter: function (c) { return c.owner.username !== 'Source Keeper'; } });
        //}
        /*var hostile = null;
        var hostileCreeps = creep.pos.findInRange(Game.HOSTILE_CREEPS, range);
        if (hostileCreeps.length > 0) {
            hostile = hostileCreeps[0];
        }
        else {
            hostileCreeps = this.chooseHostile(creep, range + 3);
        }
        return hostile;
        */
    },


    chooseTransferTargetTouching: function (pos) {
        var ext = pos.findClosest(Game.MY_STRUCTURES, {
            filter: function (n) {
                return n.structureType === Game.STRUCTURE_EXTENSION && n.energy < n.energyCapacity;
            }
        });
        if (ext && pos.inRangeTo(ext.pos, 1)) {
            return ext;
        }
        else {
            var spawn = pos.findClosest(Game.MY_SPAWNS);
            if (spawn && pos.inRangeTo(spawn.pos, 1)) {
                return spawn;
            }
        }
    },
    walkLink: function (creep, property, abortIf, accumulator) {
        if (creep && creep.memory[property]) {
            if (abortIf && abortIf(creep.memory[property])) {
                return _.intersection(accumulator, [creep.memory[property]]);
            }

            var nextCreep = Game.getObjectById(creep.memory[property]);
            if (accumulator && accumulator.length > 0)
                return this.walkLink(nextCreep, property, abortIf, _.intersection(accumulator, [creep.memory[property]]));
            return this.walkLink(nextCreep, property, abortIf, [creep.memory[property]]);
        }

        if (accumulator && accumulator.length > 0)
            return accumulator;
        return [];
    },
    walkHead: function (creep, abortIf, accumulator){
        return this.walkLink(creep,"head", abortIf, accumulator);
    },
    walkTail: function (creep, abortIf, accumulator) {
        return this.walkLink(creep, "tail", abortIf, accumulator);
    },
    simpleTail: function (myTailId) {

        if (myTailId === null || myTailId === undefined)
            return;

        var myTail = Game.getObjectById(myTailId);
        if (!myTail)
            return;

        var myHead = Game.getObjectById(myTail.memory.head);
        if (!myHead) {
            myTail.memory.head = undefined;
            return;
        }
        if (!this.touching(myTail.pos, myHead.pos)) {
            myTail.moveTo(myHead.pos);
        }


        var best = myTail.pos.findInRange(Game.DROPPED_ENERGY, 1);
        if (best.length > 0) {
            myTail.pickup(best[0]);
        }

        var spawn = myTail.pos.findInRange(Game.MY_SPAWNS, 1);
        if (myTail.energy && spawn.length > 0) {
            myTail.transferEnergy(spawn[0]);
            // break off rest of tail if its there
            if (myTail.memory.tail) {
                var newHead = Game.getObjectById(myTail.memory.tail);
                if (newHead)
                    newHead.memory.head = undefined;
            }
            // block off the tail so no one attaches to to it
            myTail.memory.tail = null;
        }
        else if (myTail.energy && myTail.memory.tail) {
            myTail.transferEnergy(Game.getObjectById(myTail.memory.tail));
        }
        else if (myTail.energy) {
            myTail.dropEnergy();
            myTail.say('dropping');
        }

        this.simpleTail(myTail.memory.tail);
    },
    stretchTail: function (subCreepId) {

        if (subCreepId === null || subCreepId === undefined)
            return;

        // is this a valid object?
        var subCreep = Game.getObjectById(subCreepId);
        if (!subCreep)
            return;

        // if we dont have a valid head clean up our link
        // and get out of here
        var myHead = Game.getObjectById(subCreep.memory.head);
        if (!myHead) {
            subCreep.memory.head = undefined;
            return;
        }
        // check that if we have a tail reference it is still valid
        // null is a valid value for a terminated tail
        var myTail;
        if (subCreep.memory.tail !== undefined) {
            myTail = Game.getObjectById(subCreep.memory.tail);
            if (!myTail) {
                subCreep.memory.tail = undefined;
            }
        }

        // pickup enery next to us, or what could be next to us after we move
        var best = subCreep.pos.findInRange(Game.DROPPED_ENERGY, 1);
        if (best.length > 0) {
            // pickup the biggest one.
            var biggest = best[0];
            for(var b in best){
                if(best[b].energy > biggest.energy){
                    biggest = best[b];
                }
            }
            subCreep.pickup(biggest);
        }
        else {
            best = subCreep.pos.findInRange(Game.DROPPED_ENERGY, 2);
            if (best.length > 0) {
                subCreep.pickup(best[0]);
            }
        }

        // idea is:
        // if no energy, move to head
        // if energy and tail, move to tail,transfer
        //    if close to structure, transfer
        // if no tail, move to structure and transfer

        // if no energy, move to head
        if (subCreep.energy === 0 && !this.touching(subCreep.pos, myHead.pos)) {
            subCreep.moveTo(myHead);
        }
            // if energy and tail, move to tail,transfer
            //    if close to structure, transfer on the way
        else if (subCreep.energy > 0 && myTail) {

            subCreep.moveTo(myTail);
            // is there a structure next to us
            var nextNow = this.chooseTransferTargetTouching(subCreep.pos);
            // or next to where we are going?
            if (!nextNow && this.touching(subCreep.pos, myHead.pos))
                nextNow = this.chooseTransferTargetTouching(myHead.pos);

            if (nextNow && nextNow.engery < nextNow.energyCapacity) {
                subCreep.transferEnergy(nextNow);
            }
            else {
                subCreep.transferEnergy(myTail);
            }
        }
            // if no tail, move to structure and transfer
        else if (subCreep.energy > 0) {
            // if there is another creep, same type
            // part of a different body, that is closer to
            // us then the spawner, then go to that.
            // otherwise go to the spawner and transferEnergy

            var idsInMyBody = _.intersection(this.walkHead(subCreep), this.walkTail(subCreep));

            var closestCreepOtherBody = subCreep.pos.findClosest(Game.MY_CREEPS, {
                filter: function (other) {
                    var found = false;
                    for (var i in idsInMyBody) {
                        if (idsInMyBody[i] === other.id)
                            found = true;
                    }
                    return other.memory.role === subCreep.memory.role && !found;
                }
            });

            var distanceToOtherCreep = 100;
            if (closestCreepOtherBody) {
                var pathToOtherCreep = subCreep.pos.findPathTo(closestCreepOtherBody);
                if (pathToOtherCreep.length > 0) {
                    distanceToOtherCreep = pathToOtherCreep.length;
                }
            }

            var distanceToSpawn = 100;
            var spawn = subCreep.pos.findClosest(Game.MY_SPAWNS);
            if (spawn) {
                var pathToSpawn = subCreep.pos.findPathTo(spawn);
                if (pathToSpawn.length > 0) {
                    distanceToSpawn = pathToSpawn.length;
                }
            }
            var destination;
            if (true) { //distanceToSpawn <= distanceToOtherCreep) {
                destination = spawn;
            }
            else {
                destination = closestCreepOtherBody;
            }

            if (destination) {
                subCreep.moveTo(destination);
                // is there a structure next to us, including spawns
                var xtNow = this.chooseTransferTargetTouching(subCreep.pos);
                // or next to where we are going?
                if (!xtNow && this.touching(subCreep.pos, destination.pos))
                    xtNow = this.chooseTransferTargetTouching(destination.pos);

                if (xtNow && xtNow.engery < xtNow.energyCapacity) {
                    subCreep.transferEnergy(xtNow);
                }
                else {
                    subCreep.transferEnergy(destination);
                }
            }
        }

        // if we have the energy, and are next to a spawn now
        // then break off the rest of the tail
        var spawnsInRange = subCreep.pos.findInRange(Game.MY_SPAWNS, 1);
        if (subCreep.energy && spawnsInRange.length > 0) {
            subCreep.transferEnergy(spawnsInRange[0]);
            // break off rest of tail if its there
            if (subCreep.memory.tail) {
                var newHead = Game.getObjectById(subCreep.memory.tail);
                if (newHead)
                    newHead.memory.head = undefined;
            }
            // block off the tail so no one attaches to to it
            subCreep.memory.tail = null;
        }

        this.stretchTail(subCreep.memory.tail);
    },
    tradePlaces: function (creep, pathStep) {
        if (Math.random() * 5 > 2)
            return;
        // swap is good, cause it prevents enemy from just hammering on one enemy.
        // check if we should swap places with the creep next to us if we are trying to go that way.
        var atThatSpot = creep.room.lookAt(pathStep.x, pathStep.y);
        var isACreepThere = _.some(atThatSpot, function (n) { return n.type === 'creep'; });
        if (isACreepThere) {
            var justCreeps = _.filter(atThatSpot, function (n) { return n.type === 'creep'; });

            var otherCreep = _.first(justCreeps).creep;
            if (otherCreep.my) {
                var isCloseAttacker = _.some(otherCreep.body, function (part) { return part.type === Game.ATTACK; });
                var amICoseAttacker = _.some(creep.body, function (part) { return part.type === Game.ATTACK; });
                var directionToMySpotFromTheirSpot = 0;
                if (pathStep.direction >= 4)
                    directionToMySpotFromTheirSpot = pathStep.direction - 4;
                else
                    directionToMySpotFromTheirSpot = pathStep.direction + 4;
                if (!otherCreep.memory) {
                    otherCreep.memory = {};
                }
                if (amICoseAttacker || !isCloseAttacker)
                    otherCreep.memory.move = directionToMySpotFromTheirSpot;
            }
        }
    },
    createBasicProfile: function (distanceToNearestSource) {
        var wantPackers = Math.max(1, (distanceToNearestSource - 2) / 2);
        var basic = {
            time: 0,
            toughness: 6,
            population: wantPackers + 1, // 1 for current position
            profile: [
            {
                PRIORITY: 1,
                ROLE: ROLE.MINER,
                STATE: STATE.SPAWNING,
                BODY: BODY.MINER,
                WANT: 1,
                HAVE: 0
            }, {
                PRIORITY: 2,
                ROLE: ROLE.PACKER,
                STATE: STATE.SPAWNING,
                BODY: BODY.PACKER,
                WANT: wantPackers,// 1 for the miner, 1 for our current position
                HAVE: 0,
            }]
        };
        //console.log('set packersWant: ' + parseInt(basic.profile[1].WANT) + ' population to:' + parseInt(basic.population));
        return basic;
    }
};
var minerBrain = {
    think: function (creep) {
        var source;
        if (creep.memory.head === undefined) {
            //utility.simpleTail(creep.memory.tail);
            utility.stretchTail(creep.memory.tail);
        }

        switch (creep.memory.state) {
            case STATE.NONE:
                {
                    creep.memory.state = STATE.MOVE_TO_HARVEST;
                    creep.memory.target = null;
                    break;
                }
            case STATE.MOVE_TO_HARVEST:
                {
                    var activeSources = creep.room.find(Game.SOURCES_ACTIVE);
                    var shortestPath = 1000;
                    var nearest = null;
                    for (var as in activeSources) {
                        var asPath = creep.room.findPath(creep.pos, activeSources[as].pos, {
                            ignoreCreeps: false
                        });
                        if (asPath.length < shortestPath) {
                            shortestPath = asPath.length;
                            nearest = activeSources[as];
                        }
                    }

                    if (!nearest) {
                        creep.suicide();
                        break;
                    }
                    creep.memory.target = nearest.id;
                    source = nearest;

                    if (source) {

                        if (creep.pos.inRangeTo(source.pos, 1)) {
                            creep.memory.state = STATE.HARVESTING;
                            this.think(creep);
                        } else {

                            var moveResult = creep.moveTo(source);
                            if (moveResult === Game.ERR_NO_PATH) {
                                creep.memory.state = STATE.NONE;
                            }
                        }
                    }
                    else {
                        creep.memory.state = STATE.NONE;
                    }
                    break;
                }
            case STATE.HARVESTING:
                {
                    source = Game.getObjectById(creep.memory.target);
                    if (source) {
                        var code = creep.harvest(source);
                        if (code === Game.OK) {
                            creep.memory.digIn = true;
                            creep.memory.target = source.id;
                            // if our harvest pile gets over 100, then get another packer in our tail.
                            var items = creep.room.lookAt(creep.pos);
                            var pile = _.filter(items, function(item){return item.type == 'energy'});
                            if(pile.length > 0){
                                var energyDrop = pile[0].energy;
                                if(energyDrop.energy > 100){
                                        creep.memory.grow = true;
                                }else {
                                    creep.memory.grow = false;
                                }
                            }
                        }
                        else {
                            creep.say(code);
                        }
                        if (creep.energy > 0 && creep.energy === creep.energyCapacity) {
                            creep.dropEnergy();
                        }
                    } else {
                        creep.say('no source');
                        creep.memory.state = STATE.NONE;
                    }
                    break;
                }
            default:
                console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
        }
    }
};

var bruteBrain = {
    think: function (creep, otherHostile) {
        var runAway;
        var hostile;
        var ranged = utility.creepIsRanged(creep);
        var close = utility.creepIsCloseRanged(creep);
        var useOtherHostile = false;
        if (otherHostile && ranged) {
            //useOtherHostile = creep.pos.inRangeTo(otherHostile, 4);
            //i/f(useOtherHostile)
            hostile = otherHostile;
        } else if (otherHostile && close) {
            //useOtherHostile = creep.pos.inRangeTo(otherHostile, 2);
            //if (useOtherHostile)
            hostile = otherHostile;
        }
        var maxRoamingDistance = 4;
        if (close) {
            maxRoamingDistance = 4;
        }
        if(creep.room.survivalInfo){
        //    maxRoamingDistance += (creep.room.survivalInfo.wave  / 3 )
        }


        var closestSpawn = creep.pos.findClosest(Game.MY_SPAWNS);
        if (closestSpawn) {
            var tooCloseToSpawn = creep.pos.inRangeTo(closestSpawn, 2);
            if (tooCloseToSpawn) {
                var doors = _.union(creep.room.find(Game.EXIT_TOP),creep.room.find(Game.EXIT_BOTTOM),creep.room.find(Game.EXIT_LEFT),creep.room.find(Game.EXIT_RIGHT));
                var door = creep.pos.findClosest(doors);
                if(door){
                    creep.moveTo(door);
                }
            }
            var pathToSpawn = creep.room.findPath(creep.pos, closestSpawn.pos, {
                ignoreCreeps: true
            });
        }

        switch (creep.memory.state) {
            case STATE.NONE:
                {

                    hostile = utility.chooseHostile(creep);

                    if (hostile) {
                        //creep.say(hostile.owner.username);
                        //console.log(hostile.owner.username);
                        creep.memory.state = STATE.ATTACKING;
                        return this.think(creep, hostile);
                    }
                    else {
                    //    creep.say('duh..');
                    }
                    break;
                }

            case STATE.ATTACKING:
                {
                    var spawn = utility.chooseSpawn(creep);
                    hostile = utility.chooseHostile(creep);
                    if (!hostile || !hostile.pos) {
                        creep.say('none');
                        creep.memory.state = STATE.NONE;
                        break;
                    }

                    var distFromSpawn = utility.positionDistanceToNearestSpawn(creep.room, creep);

                    //console.log('distFromSpawn '+ parseInt(distFromSpawn));
                    if (distFromSpawn <= maxRoamingDistance){
                        creep.moveTo(hostile);
                    }
                    else if (distFromSpawn === maxRoamingDistance){
                        var toSpawn = utility.directionToNearestSpawn(creep);
                        creep.move(toSpawn)
                    }
                    /*
                    if (ranged && creep.pos.inRangeTo(hostile.pos, 1)) {
                        var toSpawn = utility.directionToNearestSpawn(creep);
                        creep.move(toSpawn);
                    }
                    */
                    var attackResult;
                    if (ranged) {
                        attackResult = creep.rangedAttack(hostile);
                    }
                    else {
                        attackResult = creep.attack(hostile);
                    }
                    if (attackResult === Game.ERR_NOT_IN_RANGE) {
                        /*var ignoreCreeps = Math.random() * 100 < 80;
                        var nearestCreepPath = creep.pos.findPathTo(hostile, {
                            ignoreCreeps: ignoreCreeps,
                            ignoreDestructibleStructures: true
                        });
                        if (nearestCreepPath.length > 0) {
                            utility.tradePlaces(creep, nearestCreepPath[0]);
                            var distFromSpawn = utility.positionDistanceToNearestSpawn(creep.room, nearestCreepPath[0]);
                            if (distFromSpawn <= maxRoamingDistance)
                                creep.move(nearestCreepPath[0].direction);
                        }
                        */

                    }


                    return hostile;
                    break;
                }
            default: {
                console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
                creep.memory.state = STATE.NONE;
            }
        }
    }
};

var medicBrain = {
    think: function (creep) {

        var injured;
        var closestSpawn = creep.pos.findClosest(Game.MY_SPAWNS);
        if (closestSpawn) {

            var tooCloseToSpawn = creep.pos.inRangeTo(closestSpawn, 3);
            if (tooCloseToSpawn) {
                var door = creep.pos.findClosest(Game.EXIT_TOP);
                creep.moveTo(door);
            }
            // make sure that we dont go beyond our limit
            var pathToSpawn = creep.room.findPath(creep.pos, closestSpawn.pos, {
                ignoreCreeps: true
            });
            if (pathToSpawn.length > 15) {
                creep.move(pathToSpawn[0].direction);
            }
        }

        if (creep.memory.head === undefined) {
            creep.say('pie');
            // try to find a head
            // first look for a BRUTE without a tail OR with a creep.memory.grow === true
            var head = creep.pos.findClosest(Game.MY_CREEPS, {
                filter: function (cc) {
                        return cc.id !== creep.id && (cc.memory.role === ROLE.ARCHER || cc.memory.role === ROLE.BRUTE ) && (cc.memory.tail === undefined);
                    }
                });

            // first creep of Same Role without a tail and we bind up.
            //if (!head)
            //    head = creep.pos.findClosest(Game.MY_CREEPS, { filter: function (cc) { return cc.id !== creep.id && cc.memory.role === creep.memory.role && cc.memory.tail === undefined; } });

            if (head) {
                head.memory.tail = creep.id;
                creep.memory.head = head.id;
                creep.say('slave');
                // we are now a body part of the head. State will stay at none forever.
                return;
            } else {
                creep.say('master');
            }

            // wag the tail
            // dont need to wag medics.
        }
        else{
            var myHead = Game.getObjectById(creep.memory.head);
            if(myHead.memory.role === ROLE.MEDIC){
                creep.memory.head = undefined;
                myHead.memory.tail = undefined;
            }
        }

        switch (creep.memory.state) {
            case STATE.NONE:
                {
                    //injured = creep.pos.findClosest(Game.MY_CREEPS, { filter: utility.creepIsDamaged });

                    //if (injured || creep.pos.findClosest(Game.HOSTILE_CREEPS)) {
                        creep.memory.state = STATE.HEALING;
                        creep.memory.target = null;
                    //}




                    break;
                }
            case STATE.HEALING:
                {
                    if(creep.memory.head){
                        var myHead = Game.getObjectById(creep.memory.head);
                        if(myHead){
                            creep.moveTo(myHead);

                            if(myHead.hits < myHead.hitsMax){
                                creep.heal(myHead);
                            }
                        }
                    }


                    if (!injured) {
                        var foundCreeps = [];
                        var injuredCreeps = creep.room.lookAtArea( creep.pos.y - 2, creep.pos.x -2, creep.pos.y+2, creep.pos.x +2);
                        for(var aa in injuredCreeps){
                            var ic1 = injuredCreeps[aa];
                            for(var bb in ic1){
                                var ic2 = ic1[bb];
                                for(var cc in ic2){
                                    if(ic2[cc].type === 'creep' && ic2[cc].creep.my === true){
                                        foundCreeps.push(ic2[cc].creep);
                                    }
                                }
                            }
                        }

                        injuredCreeps = _.filter(foundCreeps, utility.creepIsDamaged);
                        var shortestPath = 1000;
                        var mostInjured = {};
                        if (injuredCreeps.length) {
                            _.sortBy(injuredCreeps, utility.creepHitsRatio);
                            mostInjured = injuredCreeps[0];
                            injured = mostInjured;
                        }
                    }
                    if (injured) {
                        if (!creep.memory.target) {
                            creep.memory.target = injured.id;
                        }

                        if (!injured.pos)
                            break;

                        var inRange = creep.pos.inRangeTo(injured.pos, 3);
                        var inClose = creep.pos.inRangeTo(injured.pos, 1);
                        if (!injured.memory) {
                            injured.memory = { pain: 0 };
                        }
                        if (inClose) {
                            creep.heal(injured);
                            injured.memory.pain += 2;
                        } else if (inRange) {
                            creep.rangedHeal(injured);
                            injured.memory.pain += 2;

                        }

                    }

                    break;
                }
            case STATE.MOVE_TO_TRANSFER:
                {
                    var spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (spawn) {
                        creep.moveTo(spawn);
                        if (creep.pos.inRangeTo(spawn.pos, 3)) {
                            creep.memory.state = STATE.NONE;
                        }
                    }
                    break;
                }
            default:
                {
                    creep.memory.state = STATE.NONE;
                    console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
                }
        }
    }
};

var builderBrain = {
    bestSiteOrSpawn: function (someCreep) {
        var place = someCreep.pos.findClosest(Game.CONSTRUCTION_SITES, { filter: function (item) { return item.progress > 0 } });
        if (!place)
            place = someCreep.pos.findClosest(Game.CONSTRUCTION_SITES);
        if (!place)
            place = someCreep.pos.findClosest(Game.MY_SPAWNS);
        return place;
    },
    think: function (creep) {

        var site;
        var spawn;
        var source;



        // die gracefully
        if (creep.memory.tail && creep.ticksToLive < 2) {
            var newHead = Game.getObjectById(creep.memory.tail);
            if (newHead) {
                newHead.memory.head = undefined;
            }
            // block off the tail so no one attaches to to it
            creep.memory.tail = null;
        }

        if (creep.memory.head === undefined) {
            creep.say('pie');
            // try to find a head
            // first look for a miner without a tail OR with a creep.memory.grow === true
            var head = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function (cc) {
                                return cc.id !== creep.id && cc.memory.role === ROLE.MINER && (cc.memory.grow === true);
                            }
                        });
            if(head){
                // find the tail that is blocked with null and attach anyway.
                var specialHead;
                var currentId = head.memory.tail;
                while(true){
                    var temp = Game.getObjectById(currentId);
                    if(temp){
                        specialHead = temp;
                        currentId = specialHead.memory.tail;
                    }
                    else{
                        break;
                    }
                }
                // change the head to be the last creep in the tail of the miner tail we found because It wanted to grow.
                head = specialHead;
            }

            if (!head) {
                head = creep.pos.findClosest(Game.MY_CREEPS, {
                filter: function (cc) {
                        return cc.id !== creep.id && cc.memory.role === ROLE.MINER && (cc.memory.tail === undefined);
                    }
                });
            }
            // first creep of same type without a tail and we bind up.
            if (!head)
                head = creep.pos.findClosest(Game.MY_CREEPS, { filter: function (cc) { return cc.id !== creep.id && cc.memory.role === creep.memory.role && cc.memory.tail === undefined; } });

            if (head) {
                head.memory.tail = creep.id;
                creep.memory.head = head.id;
                creep.say('slave');
                // we are now a body part of the head. State will stay at none forever.
                return;
            } else {
                creep.say('master');
            }

            // wag the tail

            console.log(creep.memory.tail);
            //utility.simpleTail(creep.memory.tail);
            utility.stretchTail(creep.memory.tail);
        }
        else {
            // this creep had a link to another as its head
            // so it can take no actions on its own.


            return;
        }

        if (creep.pos.findInRange(Game.HOSTILE_CREEPS, 4).length > 0) {
            var closestSpawn = creep.pos.findClosest(Game.MY_SPAWNS);
            if (closestSpawn) {
                creep.moveTo(closestSpawn);
                creep.memory.state = STATE.NONE;
                return
            }
        }

        switch (creep.memory.state) {
            case STATE.NONE: {



                creep.memory.target = null;
                if (!Memory.drops)
                    Memory.drops = [];

                // refresh energy numbers
                var best = creep.pos.findClosest(Game.DROPPED_ENERGY, {
                    filter: function (drop) {
                        return drop.energy >= creep.energyCapacity;
                    }
                });

                if (!best) {
                    best = creep.pos.findClosest(Game.DROPPED_ENERGY);
                }

                if (best) {

                    // reserve some energy and set target
                    creep.memory.target = best.id;
                    creep.memory.state = STATE.MOVE_TO_HARVEST;

                }
                else {
                    // bucket
                    var passTheBucket = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function (f) {
                            return f.energy > 0;
                        }
                    });
                    if (passTheBucket) {
                        creep.memory.target = passTheBucket.id;
                        creep.memory.state = STATE.MOVE_TO_HARVEST;
                    }
                    // make a random move.
                }
                break;
            }
            case STATE.MOVE_TO_HARVEST: {

                if (!creep.memory.target) {
                    creep.memory.state = STATE.NONE;
                    break;
                }
                source = Game.getObjectById(creep.memory.target);

                if (source) {
                    if (creep.pos.inRangeTo(source.pos, 1)) {
                        creep.memory.state = STATE.HARVESTING;
                        this.think(creep);
                    }
                    else {
                        var moveResult = creep.moveTo(source);
                        if (moveResult === Game.ERR_NO_PATH) {
                            creep.memory.state = STATE.NONE;
                        }
                    }
                }
                else {
                    creep.memory.state = STATE.NONE;
                }
                break;
            }
            case STATE.HARVESTING: {
                source = creep.pos.findClosest(Game.DROPPED_ENERGY, { filter: function (n) { return n.energy > creep.energy; } });
                if (!source) {
                    source = creep.pos.findClosest(Game.DROPPED_ENERGY, { filter: function (n) { return n.energy > creep.energy * 0.5; } });
                }
                if (!source) {
                    source = creep.pos.findClosest(Game.DROPPED_ENERGY, { filter: function (n) { return n.energy > creep.energy * 0.25; } });
                }
                if (!source) {
                    source = creep.pos.findClosest(Game.DROPPED_ENERGY);
                }
                if (source) {

                    creep.pickup(source);
                    // unreserve energy

                    // check if there is more close energy and grab it
                    var drop = creep.pos.findClosest(Game.DROPPED_ENERGY);
                    if (creep.pos.inRangeTo(drop, 1) && creep.energy < creep.energyCapacity) {
                        creep.memory.target = drop.id;
                        creep.pickup(drop);
                        drop = creep.pos.findClosest(Game.DROPPED_ENERGY);
                        if (creep.pos.inRangeTo(drop, 1) && creep.energy < creep.energyCapacity) {
                            creep.memory.target = drop.id;
                            creep.pickup(drop);
                        }
                    }
                    else if (creep.pos.inRangeTo(drop, 3) && creep.energy < creep.energyCapacity) {
                        creep.memory.target = drop.id;
                        creep.moveTo(drop);
                    }
                    else {
                        creep.memory.state = STATE.MOVE_TO_TRANSFER;
                    }
                }
                break;
            }
            case STATE.MOVE_TO_TRANSFER: {



                site = creep.pos.findClosest(Game.CONSTRUCTION_SITES, { filter: function (item) { return item.progress > 0 } });
                if (!site)
                    site = creep.pos.findClosest(Game.CONSTRUCTION_SITES);
                if (creep.getActiveBodyparts(Game.WORK) && site) {
                    creep.moveTo(site);
                    if (creep.pos.inRangeTo(site.pos, 1)) {
                        creep.memory.state = STATE.TRANSFERING;
                        this.think(creep);
                        break;
                    }
                }
                else {
                    var ext = creep.pos.findClosest(Game.MY_STRUCTURES, {
                        filter: function (n) {
                            return n.structureType === Game.STRUCTURE_EXTENSION && n.energy < n.energyCapacity;
                        }
                    });
                    if (ext) {
                        creep.moveTo(ext);
                        if (creep.pos.inRangeTo(ext.pos, 1)) {
                            creep.memory.state = STATE.TRANSFERING;
                            this.think(creep);
                            break;
                        }
                    }
                    else {
                        //creep.say('nope');
                        spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                        if (spawn) {
                            var direction = utility.directionToNearestSpawn(creep);
                            if (direction) {
                                creep.say(direction);
                                creep.move(direction);
                            }
                            else {
                                creep.moveTo(spawn);
                            }

                            if (creep.pos.inRangeTo(spawn.pos, 1)) {
                                creep.memory.state = STATE.TRANSFERING;
                                this.think(creep);
                                break;
                            }
                        }
                    }

                }
                break;
            }
            case STATE.TRANSFERING: {
                site = creep.pos.findClosest(Game.CONSTRUCTION_SITES, { filter: function (item) { return item.progress > 0 } });
                if (!site) {
                    site = creep.pos.findClosest(Game.CONSTRUCTION_SITES);
                }
                //var repair = creep.pos.findClosest(Game.MY_STRUCTURES, {
                //    filter: function (item) {
                //        return item.hits < item.hitsMax;
                //    }
                //});

                if (creep.getActiveBodyparts(Game.WORK) > 0 && (site)) {//(site || repair)) {
                    if (site) {
                        var result = creep.build(site);
                        if (result === Game.ERR_NOT_IN_RANGE) {
                            creep.moveTo(site);
                        }
                        if (result === Game.ERR_INVALID_TARGET) {
                            spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                            creep.moveTo(spawn);
                        }
                    }
                    //else {
                    //    creep.moveTo(repair);
                    //    creep.repair(repair);
                    //}

                    if (creep.energy === 0) {
                        creep.memory.state = STATE.NONE;
                        this.think(creep);
                        break;
                    }
                    else {
                        break;
                    }
                }
                else {
                    var ext2 = creep.pos.findClosest(Game.MY_STRUCTURES, { filter: function (n) { return n.structureType === Game.STRUCTURE_EXTENSION && n.energy < n.energyCapacity; } });
                    if (ext2) {
                        creep.transferEnergy(ext2);
                        if (creep.energy === 0) {
                            creep.memory.state = STATE.NONE;
                            this.think(creep);

                        }
                        return;
                    }
                    spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (spawn) {
                        creep.transferEnergy(spawn, creep.energy);
                        creep.memory.state = STATE.NONE;
                        this.think(creep);
                        break;
                    }
                }
                break;
            }
            default: {
                console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
                creep.memory.state = STATE.NONE;
            }


        }
    }
};

var machine = {
    chew: function (creep, foundHostile) {

        // only job is to put any spawning creep into none state
        switch (creep.memory.state) {
            case STATE.NONE:
                {
                    break;
                }
            case STATE.SPAWNING:
                {
                    var found = false;
                    for (var s in Game.spawns) {

                        if (Game.spawns[s].spawning === creep) {
                            found = true;
                        }
                    }
                    if (!found) {
                        creep.memory.state = STATE.NONE;
                    }
                    break;
                }
            default:
                break;
        }

        // if we dont have a valid head clean up our link
        // and get out of here
        if(creep.memory.head){
            var myHead = Game.getObjectById(creep.memory.head);
            if (!myHead) {
                creep.memory.head = undefined;
            }
        }
        // check that if we have a tail reference it is still valid
        // null is a valid value for a terminated tail
        if (creep.memory.tail) {
            var myTail = Game.getObjectById(creep.memory.tail);
            if (!myTail) {
                creep.memory.tail = undefined;
            }
        }

        switch (creep.memory.role) {
            case ROLE.MINER:
                {
                    minerBrain.think(creep);
                    break;
                }
            case ROLE.BRUTE:
                {
                    return bruteBrain.think(creep, foundHostile);
                    break;
                }
            case ROLE.ARCHER:
                {
                    bruteBrain.think(creep);
                    break;
                }
            case ROLE.CAPTAIN:
                {
                    bruteBrain.think(creep);
                    break;
                }
            case ROLE.MEDIC:
                {
                    medicBrain.think(creep);
                    break;
                }
            case ROLE.PACKER:
                {
                    builderBrain.think(creep);
                    break;
                }
            case ROLE.WORKER:
                {
                    builderBrain.think(creep);
                    break;
                }
            default:
                {
                    break;
                }
        }
    },
    chewAll: function (creeps) {
        var foundHostile = null;
        for (var i = 0; i < creeps.length; i++) {
             /*
            // clean up dead heads and tails
            if(creeps[i].memory.head){
                var myHead = Game.getObjectById(creeps[i].memory.head);
                if (!myHead) {
                    creeps[i].memory.head = undefined;
                }
            }
            if (creeps[i].memory.tail) {
                var myTail = Game.getObjectById(creeps[i].memory.tail);
                if (!myTail) {
                    creeps[i].memory.tail = undefined;
                }
            }
            */
            // if there is a loop, break it.
            var seedIds = [];
            creeps[i].id
            var headStuff = utility.walkHead(creeps[i], function (oid) { return oid === creeps[i].id });
            var tailStuff = utility.walkTail(creeps[i], function (oid) { return oid === creeps[i].id });
            if (_.indexOf(headStuff, creeps[i].id) > -1) {
                // walked the head and got back to myself.. ugh.
                creeps[i].say('hcircles');
                var myhead = Game.getObjectById(creeps[i].memory.head);
                myhead.memory.tail = undefined;
                creeps[i].memory.head = undefined;
            } else if (_.indexOf(tailStuff, creeps[i].id) > -1) {
                // walked the head and got back to myself.. ugh.
                creeps[i].say('hcircles');
                var mytail = Game.getObjectById(creeps[i].memory.tail);
                mytail.memory.head = undefined;
                creeps[i].memory.tail = undefined;
            }
            foundHostile = this.chew(creeps[i], foundHostile);
        }

    }
};

var spawner =
{
    remember: function (creep, state, role) {
        if (!creep.memory) {
            creep.memory = {
                state: state,
                role: role
            };
        } else {
            creep.memory.state = state;
        }
    },
    _settings: [],
    profile: function (settings) {
        this._settings = settings;
    },
    spawn: function () {
        var result = [];

        var duration = 0;
        if (Memory.startTime) {
            duration = Game.time - Memory.startTime;
        }
        for (var s in Game.spawns) {

            var spawn = Game.spawns[s];
            if (spawn.spawning === null && spawn.energy > 200) {

                // find the settings that are for a population more then, but closest to what we have.
                var weHave = spawn.room.find(Game.MY_CREEPS).length;
                var weHaveMiners = spawn.room.find(Game.MY_CREEPS, { filter: utility.creepIsMiner }).length > 0;
                var weHavePackers = spawn.room.find(Game.MY_CREEPS, { filter: utility.creepIsPacker }).length > 0;
                if (weHavePackers && weHaveMiners && spawn.energy < 50) {
                    continue;
                }

                // specify our first profile to have a miner and
                // enough packers to get to the spawner
                var sources = spawn.room.find(Game.SOURCES);
                var bestDistance = 100;
                for (var s in sources) {
                    var source = sources[s];
                    var thisDist = Math.round(utility.linearDistance(spawn.pos, source.pos));
                    if (thisDist < bestDistance)
                        bestDistance = thisDist;
                }
                var basic = utility.createBasicProfile(bestDistance);


                // we need to know how many packers we have so the below PICKONE can be done right!!
                var packerCount = spawn.room.find(Game.MY_CREEPS, { filter: utility.creepIsPacker }).length;

                var closestDiff = 0;
                var closestSettingsPop = null;
                var toughScale = 0;
                var closestSettings = null;
                var settingTime = 0;
                var pickOne = function (setting) {
                    if (!closestSettingsPop || (closestSettingsPop && closestSettingsPop.population <= weHave - packerCount)) {

                        closestSettingsPop = setting;
                        closestSettings = setting.profile;
                        toughScale = setting.toughness;
                        settingTime = setting.time;
                        closestDiff = closestSettingsPop.population - weHave;
                    }
                };
                if (weHave < basic.population) {
                    pickOne(basic);
                }
                else {
                    this._settings.forEach(pickOne);
                }


                // TODO: before the sort will work we need to collect the number of creeps we have in each state
                // so check creep.memory.role and accumulate it to update how many we have.

                if (closestSettings.length > 0) {

                    closestSettings.forEach(function (x) {

                        x.HAVE = spawn.room.find(Game.MY_CREEPS, {
                            filter: function (f) {
                                return f.memory.role === x.ROLE;
                            }
                        }).length;

                        x.TOTAL = spawn.room.find(Game.MY_CREEPS).length;
                        x.RATIO = x.HAVE / x.TOTAL;
                        x.TARGET = x.WANT / (closestSettings.reduce(function (a, b) {
                            return a + b.WANT;
                        }, 0));
                    });
                }
                else{
                    console.log('ack, no closest settings');
                }
                // alternativly we could store state in our spawns and collect that.

                var onesWeWant = _.filter(closestSettings, function (n) {
                    console.log('want:'+parseInt(n.WANT)+'have:'+parseInt(n.HAVE));
                    return n.WANT - n.HAVE > 0; });

                console.log('len: '+parseInt(onesWeWant.length)+ ' we want: ' + onesWeWant);
                var orderByRatio = _.sortBy(onesWeWant, function (n) { return n.HAVE / n.WANT; });
                var thenByPriority = _.sortBy(orderByRatio, function (n) { return n.PRIORITY; });

                var current = thenByPriority[0];

                // see if any of our miners want their tails to grow.
                var shouldGrow = false;
                for(var tmp in Memory.creeps){
                    if(Memory.creeps[tmp].grow === true  ){
                        if(Memory.creeps[tmp].lastGrow && Game.time - Memory.creeps[tmp].lastGrow < 30){
                            continue;
                        }

                        Memory.creeps[tmp].grow = false;
                        Memory.creeps[tmp].lastGrow = Game.time;
                        shouldGrow = true;
                        console.log('Grow it!!');
                        current = basic.profile[1]; // should be a basic packer;
                        break;
                    }
                }

                // check if anything about to die
                var creepToReplace;
                var isReplacing;
                var foundCreeps =spawn.room.find(Game.MY_CREEPS);
                for(var tmp in foundCreeps){
                    tmp = foundCreeps[tmp];
                    if(tmp.ticksToLive < 300 && tmp.memory.replacing === undefined){
                        isReplacing = true;
                        current = {
                            ROLE: tmp.memory.role,
                            STATE: STATE.SPAWNING,
                            BODY: [{parts: tmp.body}]
                        };
                        shouldGrow = true;
                        creepToReplace = tmp;
                        break;
                    }
                }

                if (duration > 0 && settingTime > 0 && shouldGrow === false && spawn.energy < 5900) {
                    if (settingTime > duration) {
                        console.log("too soon.. " + parseInt(settingTime) + " > " + parseInt(duration));
                        return; // its too early to use these.
                    }
                }



                if (current && current.BODY) {
                    for (var i = 0; i < current.BODY.length; i++) {
                        var extAvail = _.filter(Game.structures, function (n) { return n.structureType === Game.STRUCTURE_EXTENSION && n.energy === n.energyCapacity; }).length;


                        var parts = current.BODY[i].parts.slice(0);
                        var toughScaleMod = 1;
                        if (_.some(parts, function (f) { return f === Game.RANGED_ATTACK; })) {
                            toughScaleMod = 1;
                        }
                        if (_.some(parts, function (f) { return f === Game.ATTACK || f === Game.RANGED_ATTACK; })) {
                            var toughness = [];
                            for (var j = 0; j < toughScale / toughScaleMod; j++) {
                                toughness.push(Game.TOUGH);
                            }
                            for (var k = 0; k < extAvail; k++) {
                                parts.push(Game.ATTACK);
                            }
                            parts = toughness.concat(parts);
                        }

                        var id = 1;
                        var name = current.ROLE + ' ' + parseInt(spawn.room.find(Game.CREEPS).length);
                        var buildCode = spawn.createCreep(parts, name, { state: current.STATE, role: current.ROLE });
                        var tries = 2;
                        while (buildCode === -3 && --tries > 0) {

                            spawn.createCreep(parts, current.ROLE + ' ' + parseInt(++id), { state: current.STATE, role: current.ROLE });
                        }

                        if(isReplacing===true){
                            creepToReplace.memory.replacing = true;
                        }

                        if (buildCode >= 0) {
                            result.push({
                                body: current.BODY,
                                code: buildCode,
                                have: current.HAVE,
                                role: current.ROLE
                            });
                            break;
                        }
                    }
                }
            }
        }
        return result;
    }
};


spawner.profile(PROFILE);


utility.setStartTimeAndInitializeMemory();



var spawnResult = spawner.spawn();



for (var roomName in Game.rooms) {

    var room = Game.getRoom(roomName);
    if (!room)
        continue;

    var myCreeps = room.find(Game.MY_CREEPS);


    machine.chewAll(myCreeps);

    // override moves based on memory set
    utility.moveCreepsWithStoredMove(myCreeps);
}

var overCpu = false;

for (var roomName in Game.rooms) {
    var updateMapCtr = 0;
    while (overCpu === false && updateMapCtr < 50) {

        // use extra cycles to update map
        updateMapCtr++;
        Game.getUsedCpu(function (cpu) {
            if (cpu > Game.cpuLimit * .80) {
                overCpu = true;
                console.log("Over CPU, aborting");
            }
        });


        if (utility.updateMap(roomName) === false) {
            break;
        }
    }
}
