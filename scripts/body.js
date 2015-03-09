/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('body'); // -> 'a thing'
 */
module.exports = {
    CAPTAIN: [{
        parts: [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE]
    }],
    BRUTE: [{
        parts: [Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.MOVE]
    }],
    BRUTE2: [{
        parts: [Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.MOVE]
    }],
    ARCHER: [{
        parts: [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE]
    }],
    BUILDER: [{
        parts: [Game.CARRY, Game.WORK, Game.CARRY, Game.CARRY, Game.MOVE]
    }, ],
    BUILDER2: [{
        parts: [Game.CARRY, Game.WORK, Game.CARRY, Game.CARRY, Game.MOVE]
    }, ],
    BUILDERWORKER: [{
        parts: [Game.CARRY, Game.CARRY, Game.CARRY, Game.WORK, Game.MOVE]
    }, ],
    MINER: [{
        parts: [Game.WORK, Game.WORK, Game.WORK, Game.WORK, Game.MOVE]
    }],
    MEDIC: [{
        parts: [Game.HEAL, Game.HEAL, Game.HEAL, Game.HEAL, Game.MOVE]
    }],
    PACKER: [{
        parts: [ Game.CARRY, Game.MOVE]
    }]
};
