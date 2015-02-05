/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('body'); // -> 'a thing'
 */
module.exports = {
    CAPTIAN: [
        {parts:[Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK]}
    ],
    BRUTE: [
        {parts:[Game.MOVE,Game.MOVE,Game.MOVE, Game.ATTACK, Game.ATTACK]}
    ],
    BRUTE2: [
        {parts:[Game.MOVE,Game.MOVE,Game.ATTACK, Game.ATTACK, Game.ATTACK]}
    ],
    ARCHER: [
        {parts:[Game.TOUGH,Game.MOVE, Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK]}
    ],
    BUILDER: [
        {parts:[Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY]},
    ],
    BUILDER2: [
        {parts:[Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY, Game.CARRY]},
    ],
    BUILDERWORKER:[
        {parts:[Game.MOVE, Game.WORK, Game.CARRY, Game.CARRY, Game.CARRY]},
    ],
    MINER: [
        {parts:[Game.MOVE, Game.WORK, Game.WORK, Game.WORK, Game.CARRY]}
    ],
    MEDIC: [
        {parts:[Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL]}
    ],
    PACKER: [
        {parts:[Game.MOVE, Game.MOVE, Game.WORK, Game.CARRY, Game.CARRY]}
    ]
};