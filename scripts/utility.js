
var ROLE =require("role");
var _ =require("lodash");
//var utility =
module.exports = {
    crepsWithMoves: function (creeps){

        "use strict";
        return _.filter(creeps, function (n){

            return n.memory.move;

        });

    },
    moveCreepsWithStoredMove: function (creeps){

        "use strict";
        var creepsWithMoves = this.crepsWithMoves(creeps);
        _.forEach(creepsWithMoves, function (creep) {

            creep.move(creep.memory.move);
            creep.memory.move = null;
        });
    },
    initializeRoomMemory: function (roomName){

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

        for(var f in look) {

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
        for(var objId in destArray) {

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
        for(var y = pos.y - 1; y <= pos.y + 1; y++) {

            for(var x = pos.x - 1; x <= pos.x + 1; x++) {

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
        for(var y = creep.pos.y - 1; y <= creep.pos.y + 1; y++) {

            for(var x = creep.pos.x - 1; x <= creep.pos.x + 1; x++) {

                if (pos) {

                    for(var spName in pos) {

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
        for(var spId in spawns) {

            if (spawns[spId][pos.x + (50 * pos.y)] < bestDist) {

                bestDist = spawns[spId][pos.x + (50 * pos.y)];
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
    creepHitsRatio: function (n) { return -n.hits / n.hitsMax; },
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
        return creep.pos.findClosest(Game.HOSTILE_CREEPS, { filter: function (c) { return c.owner.username !== 'Source Keeper'; } });
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
    foo: 1,

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
    walkHead: function (creep, accumulator) {

        if (creep && creep.memory.head) {
            var nextCreep = Game.getObjectById(creep.memory.head);
            if (accumulator && accumulator.length > 0)
                return this.walkHead(nextCreep, _.intersection(accumulator, [creep.memory.head]));
            return this.walkHead(nextCreep, [creep.memory.head]);
        }

        if (accumulator && accumulator.length > 0)
            return accumulator;
        return [];
    },
    walkTail: function (creep, accumulator) {
        if (creep && creep.memory.tail) {
            var nextCreep = Game.getObjectById(creep.memory.tail);
            if (accumulator && accumulator.length > 0)
                return this.walkHead(nextCreep, _.intersection(accumulator, [creep.memory.tail]));
            return this.walkHead(nextCreep, [creep.memory.tail]);
        }

        if (accumulator && accumulator.length > 0)
            return accumulator;
        return [];
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
            myTail.say('moving');
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
            subCreep.pickup(best[0]);
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
            subCreep.say('moving');
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
            if (distanceToSpawn <= distanceToOtherCreep) {
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
    createBasicProfile : function (distanceToNearestSource) {
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
        console.log('set packersWant: ' + parseInt(basic.profile[1].WANT) + ' population to:' + parseInt(basic.population));
        return basic;
    }
};
