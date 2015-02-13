var _ = require('lodash');
module.exports = {
    bodyPartIsATTACK: function (part) { return part.type == Game.ATTACK; },
    bodyPartIsRANGED_ATTACK: function (part) { return part.type == Game.RANGED_ATTACK; },
    bodyPartIsANY_ATTACK: function (part) { return part.type == Game.ATTACK || part.type == Game.RANGED_ATTACK; },
    creepCanAttack: function (n) {
        var hasAttackOrRangedAttack = _.some(n.body, this.bodyPartIsANY_ATTACK);
        return hasAttackOrRangedAttack;
    },
    creepIsRanged: function (n) {
        var hasAttackOrRangedAttack = _.some(n.body, this.bodyPartIsRANGED_ATTACK);
        return hasAttackOrRangedAttack;
    },
    creepIsCloseRanged:  function (n) {
        var hasAttackOrRangedAttack = _.some(n.body, this.bodyPartIsATTACK);
    return hasAttackOrRangedAttack;
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