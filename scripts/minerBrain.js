/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('minerBrain'); // -> 'a thing'
 */
var STATE = require('state');
var utility = require('utility');
module.exports = {
    think: function (creep) {
        var source;
        if(creep.memory.head === undefined){
            utility.wag(creep.memory.tail);
        }

        switch (creep.memory.state) {
            case STATE.NONE:
                {
                    creep.memory.state = STATE.MOVE_TO_HARVEST;
                    creep.memory.target = null;
                    break;
                }
            case STATE.MOVE_TO_HARVEST:
                {
                    var activeSources = creep.room.find(Game.SOURCES_ACTIVE);
                    var shortestPath = 1000;
                    var nearest = null;
                    for (var as in activeSources) {
                        var asPath = creep.room.findPath(creep.pos, activeSources[as].pos, {
                            ignoreCreeps: false
                        });
                        if (asPath.length < shortestPath) {
                            shortestPath = asPath.length;
                            nearest = activeSources[as];
                        }
                    }

                    if (!nearest) {
                        creep.suicide();
                        break;
                    }
                    creep.memory.target = nearest.id;
                    source = nearest;

                    if (source) {

                        if (creep.pos.inRangeTo(source.pos, 1)) {
                            creep.memory.state = STATE.HARVESTING;
                            this.think(creep);
                        } else {

                            var moveResult = creep.moveTo(source);
                            if (moveResult === Game.ERR_NO_PATH) {
                                creep.memory.state = STATE.NONE;
                            }
                        }
                    }
                    else{
                      creep.memory.state = STATE.NONE;
                    }
                    break;
                }
            case STATE.HARVESTING:
                {
                    source = Game.getObjectById(creep.memory.target);
                    if (source) {
                        var code = creep.harvest(source);
                        if (code === Game.OK) {
                            creep.memory.digIn = true;
                            creep.memory.target = source.id;
                        }
                        else
                        {
                          creep.say(code);
                        }
                        if (creep.energy > 0 && creep.energy === creep.energyCapacity) {
                            creep.dropEnergy();
                        }
                    }else{
                      creep.say('no source');
                      creep.memory.state = STATE.NONE;
                    }
                    break;
                }
            default:
                console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
        }
    }
};
