/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('body'); // -> 'a thing'
 */
module.exports = {
    CAPTIAN: [
        [Game.TOUGH, Game.TOUGH, Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK],
        [Game.TOUGH, Game.MOVE, Game.RANGED_ATTACK]
    ],
    BRUTE: [
        [Game.TOUGH, Game.TOUGH, Game.TOUGH, Game.MOVE, Game.MOVE, Game.MOVE, Game.ATTACK, Game.ATTACK, Game.ATTACK],
        [Game.TOUGH, Game.TOUGH, Game.MOVE, Game.MOVE, Game.ATTACK, Game.ATTACK, Game.ATTACK],
        [Game.TOUGH, Game.TOUGH, Game.MOVE, Game.ATTACK, Game.ATTACK],
        [Game.TOUGH, Game.MOVE, Game.ATTACK, Game.ATTACK]
    ],
    ARCHER: [
        [Game.TOUGH, Game.MOVE, Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK],
        [Game.TOUGH, Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK],
        [Game.TOUGH, Game.MOVE, Game.RANGED_ATTACK]
    ],
    BUILDER: [
        [Game.MOVE, Game.WORK, Game.WORK, Game.WORK, Game.CARRY, Game.CARRY],
        [Game.MOVE, Game.WORK, Game.WORK, Game.CARRY],
        [Game.MOVE, Game.WORK, Game.CARRY]
    ],
    MINER: [
        [Game.MOVE, Game.WORK, Game.WORK, Game.WORK, Game.CARRY, Game.CARRY],
        [Game.MOVE, Game.WORK, Game.WORK, Game.CARRY],
        [Game.MOVE, Game.WORK, Game.CARRY]
    ],
    MEDIC: [
        [Game.TOUGH, Game.TOUGH, Game.MOVE, Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL, Game.HEAL],
        [Game.TOUGH, Game.MOVE, Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL],
        [Game.TOUGH, Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL],
        [Game.TOUGH, Game.MOVE, Game.HEAL]
    ]
};