var _ = require('lodash');
module.exports = {
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
    tradePlaces: function(creep, pathStep){
        // swap is good, cause it prevents enemy from just hammering on one enemy.
        // check if we should swap places with the creep next to us if we are trying to go that way.
        var atThatSpot = creep.room.lookAt(pathStep.x, pathStep.y);
        var isACreepThere = _.some(atThatSpot, function (n) { return n.type == 'creep' });
        if (isACreepThere) {
            var justCreeps = _.filter(atThatSpot, function (n) { return n.type == 'creep' });
                            
            var otherCreep = _.first(justCreeps).creep;
            if (otherCreep.my) {
                var isCloseAttacker = _.some(otherCreep.body, function (part) { return part.type == Game.ATTACK; });

                var directionToMySpotFromTheirSpot = 0;
                if (pathStep.direction >= 4)
                    directionToMySpotFromTheirSpot = pathStep.direction - 4;
                else
                    directionToMySpotFromTheirSpot = pathStep.direction + 4;
                if (!otherCreep.memory) {
                    otherCreep.memory = {};
                }
                otherCreep.memory.move = directionToMySpotFromTheirSpot;
            }
        }
    }
}