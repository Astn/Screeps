var ROLE = require('role');
var _ = require('lodash');
module.exports = {
    simpleFormation: [

       { leader: false, type: 'ATTACK', leaderOffset: { x: -1, y: 0 } },
       { leader: true, type: 'ATTACK', leaderOffset: { x: 0, y: 0 } },
       { leader: false, type: 'ATTACK', leaderOffset: { x: 1, y: 0 } },

       { leader: false, type: 'ATTACK', leaderOffset: { x: -1, y: -1 } },
       { leader: false, type: 'HEAL', leaderOffset: { x: 0, y: -1 } },
       { leader: false, type: 'ATTACK', leaderOffset: { x: 1, y: -1 } },
    ],
    bodyPartIsATTACK: function (part) { return part.type == Game.ATTACK; },
    bodyPartIsRANGED_ATTACK: function (part) { return part.type == Game.RANGED_ATTACK; },
    bodyPartIsANY_ATTACK: function (part) { return part.type == Game.ATTACK || part.type == Game.RANGED_ATTACK; },
    creepCanAttack: function (n) { return _.some(n.body, this.bodyPartIsANY_ATTACK); },
    creepIsRanged: function (n) { return _.some(n.body, this.bodyPartIsRANGED_ATTACK); },
    creepIsCloseRanged:  function (n) { return _.some(n.body, this.bodyPartIsATTACK); },
    creepIsMiner: function (n) { return n.memory.role == ROLE.MINER; },
    creepIsPacker: function (n) { return n.memory.role == ROLE.PACKER; },
    firstPosAlongPathTo: function (target) {
        if (target) {
            var path = creep.pos.findPathTo(target);
            if (path.length > 0) {
                return path[0];
            }
        }
        return null;
    },
    exitsArray: [Game.EXIT_TOP, Game.EXIT_LEFT, Game.EXIT_RIGHT, Game.EXIT_BOTTOM],
    posBehindCreep: function(creep){
        // find paths to each of the exits
        var firstPaths = _.map(this.exitsArray, function (n) { return this.firstPosAlongPathTo(creep.pos.findClosest(n)); });
        // remove nulls
        _.filter(firstPaths, function (f) { return f !== null; });
        // make an average position if the len is > 1;
        var inFrontOfCreep = { x: 0, y: 0 };
        if (firstPaths.length > 1) {
            var summed = _.reduce(firstPaths, function (agg, f) { return { x: agg.x + f.x, y: agg.y + f.y } }, { x: 0, y: 0 });
            inFrontOfCreep = {
                x: Math.round(summed.x / firstPaths.length),
                y: Math.round(summed.y / firstPaths.length)
            };
        }
        else if (firstPaths.length === 1) {
            inFrontOfCreep = { x: firstPaths[0].x, y: firstPaths[0].y };
        }
        var behindCreep = {
            x: creep.pos.x - (inFrontOfCreep.x - creep.pos.x),
            y: creep.pos.y - (inFrontOfCreep.y - creep.pos.y)
        };
        return behindCreep;
    },
    sumPosX: function (sum, n) { return sum + n.pos.x; },
    sumPosY: function (sum, n) { return sum + n.pos.y; },
    creepHitsRatio: function (n) { return n.hits / n.hitsMax; },
    creepIsDamaged: function (n) { return (n.hits < n.hitsMax);},
    chooseSpawn: function (creep) {
        var spawn = {};
        for (var sp in Game.spawns) {
            if (Game.spawns[sp].room == creep.room) {
                spawn = Game.spawns[sp];
                break;
            }
        }
        return spawn;
    },
    chooseHostile: function (creep) {
        var hostile = null;
        var hostileCreeps = creep.pos.findInRange(Game.HOSTILE_CREEPS, 1);
        if (hostileCreeps.length) {
            hostile = hostileCreeps[0];
        }
        else {
            hostileCreeps = creep.pos.findInRange(Game.HOSTILE_CREEPS, 3);
            if (hostileCreeps.length) {
                hostile = hostileCreeps[0];
            } else {
                hostileCreeps = creep.pos.findInRange(Game.HOSTILE_CREEPS, 30);
                if (hostileCreeps.length) {
                    hostile = hostileCreeps[0];
                }
            }
        }
        return hostile;
    },
    tradePlaces: function (creep, pathStep) {
        if (Math.random() * 5 > 2)
            return;
        // swap is good, cause it prevents enemy from just hammering on one enemy.
        // check if we should swap places with the creep next to us if we are trying to go that way.
        var atThatSpot = creep.room.lookAt(pathStep.x, pathStep.y);
        var isACreepThere = _.some(atThatSpot, function (n) { return n.type == 'creep' });
        if (isACreepThere) {
            var justCreeps = _.filter(atThatSpot, function (n) { return n.type == 'creep' });
                            
            var otherCreep = _.first(justCreeps).creep;
            if (otherCreep.my) {
                var isCloseAttacker = _.some(otherCreep.body, function (part) { return part.type == Game.ATTACK; });
                var amICoseAttacker = _.some(creep.body, function (part) { return part.type == Game.ATTACK; });
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
    }
}