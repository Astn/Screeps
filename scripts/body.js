/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('body'); // -> 'a thing'
 */
module.exports = {
    CAPTIAN: [
        //{parts:[Game.TOUGH,Game.MOVE, Game.MOVE, Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK]},
        {parts:[Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK]}
    ],
    BRUTE: [
       // {parts:[Game.TOUGH,Game.TOUGH,Game.TOUGH, Game.TOUGH, Game.TOUGH, Game.MOVE, Game.MOVE, Game.MOVE, Game.ATTACK, Game.ATTACK, Game.ATTACK]},
       // {parts:[Game.TOUGH,Game.TOUGH,Game.TOUGH, Game.TOUGH, Game.MOVE, Game.MOVE, Game.ATTACK, Game.ATTACK, Game.ATTACK]},
       // {parts:[Game.TOUGH,Game.TOUGH,Game.MOVE, Game.MOVE, Game.MOVE, Game.ATTACK, Game.ATTACK]},
        {parts:[Game.TOUGH,Game.MOVE,Game.MOVE, Game.ATTACK, Game.ATTACK]}
    ],
    ARCHER: [
       // {parts:[Game.TOUGH,Game.MOVE, Game.MOVE, Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK]},
        //{parts:[Game.TOUGH,Game.MOVE, Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK]},
        {parts:[Game.TOUGH,Game.MOVE, Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK]}
    ],
    BUILDER: [
        {parts:[Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY]},
        //{parts:[Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY]},
        //{parts:[Game.MOVE, Game.CARRY]}
    ],
    MINER: [
        //{parts:[Game.MOVE, Game.WORK, Game.WORK, Game.WORK, Game.CARRY, Game.CARRY]},
       // {parts:[Game.MOVE, Game.MOVE, Game.WORK, Game.WORK, Game.CARRY]},
        {parts:[Game.MOVE, Game.WORK, Game.WORK,Game.WORK, Game.CARRY]}
    ],
    MEDIC: [
        {parts:[Game.TOUGH, Game.TOUGH, Game.MOVE, Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL, Game.HEAL]},
        {parts:[Game.TOUGH, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL]},
        {parts:[Game.MOVE, Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL]},
        {parts:[Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL]}
    ]
};