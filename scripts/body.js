/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('body'); // -> 'a thing'
 */
module.exports = {
    CAPTIAN: [
        { parts: [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE] }
    ],
    BRUTE: [
        { parts: [Game.ATTACK, Game.ATTACK, Game.MOVE, Game.MOVE, Game.MOVE] }
    ],
    BRUTE2: [
        { parts: [Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.MOVE, Game.MOVE] }
    ],
    ARCHER: [
        { parts: [Game.TOUGH, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE] }
    ],
    BUILDER: [
        { parts: [Game.CARRY, Game.CARRY, Game.MOVE, Game.MOVE] },
    ],
    BUILDER2: [
        { parts: [Game.CARRY, Game.CARRY, Game.CARRY, Game.MOVE, Game.MOVE] },
    ],
    BUILDERWORKER: [
        { parts: [Game.MOVE, Game.CARRY, Game.CARRY, Game.CARRY, Game.WORK] },
    ],
    MINER: [
        { parts: [Game.MOVE, Game.CARRY, Game.WORK, Game.WORK, Game.WORK] }
    ],
    MEDIC: [
        { parts: [Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL] }
    ],
    PACKER: [
        { parts: [Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY] }
    ]
};