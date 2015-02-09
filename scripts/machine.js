/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('machine'); // -> 'a thing'
 */
var ROLE = require('role');
var STATE = require('state');
var minerBrain = require('minerBrain');
var bruteBrain = require('bruteBrain');
var medicBrain = require('medicBrain');
var builderBrain = require('builderBrain');

module.exports = {
    chew: function(creep) {

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

        switch (creep.memory.role) {
            case ROLE.MINER:
                {
                    minerBrain.think(creep);
                    break;
                }
            case ROLE.BRUTE:
                {
                    bruteBrain.think(creep);
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
    }
};