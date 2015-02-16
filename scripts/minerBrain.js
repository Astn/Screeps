/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('minerBrain'); // -> 'a thing'
 */
var STATE = require('state');

module.exports = {
    think: function (creep) {
        var source;
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
                    var nearest = {};
                    nearest = null;
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
                    if (!source || creep.pos.inRangeTo(source.pos, 1)) {

                        creep.memory.target = null;
                    }

                    if (source) {

                        if (creep.pos.inRangeTo(source.pos, 1)) {

                            creep.memory.state = STATE.HARVESTING;
                        } else {

                            var moveResult = creep.moveTo(source);
                            if (moveResult === Game.ERR_NO_PATH) {

                                creep.memory.state = STATE.NONE;
                            }
                        }
                    }
                    break;
                }
            case STATE.HARVESTING:
                {
                    var activeSources = creep.room.find(Game.SOURCES_ACTIVE);
                    var shortestPath = 1000;
                    var nearest = {};
                    nearest = null;
                    for (var as in activeSources) {
                        var asPath = creep.room.findPath(creep.pos, activeSources[as].pos, {
                            ignoreCreeps: false
                        });
                        if (asPath.length < shortestPath) {
                            shortestPath = asPath.length;
                            nearest = activeSources[as];
                        }
                    }
                    source = nearest;
                    if (source) {
                        var prevEnergy = creep.energy;
                        var code = creep.harvest(source);
                        var afterEnergy = creep.energy;
                        if (code === Game.OK) {
                            creep.memory.digIn = true;
                        }
                        if (creep.energy > 0 && creep.energy === creep.energyCapacity) {
                            creep.dropEnergy();
                        } else if (code !== Game.OK && creep.memory.digIn !=== true) {

                            creep.memory.state = STATE.NONE;
                        }
                    }
                    break;
                }
            case STATE.MOVE_TO_TRANSFER:
                {
                    creep.memory.state = STATE.HARVESTING;
                    break;
                }
            case STATE.TRANSFERING:
                {
                    var spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (spawn) {
                        creep.transferEnergy(spawn, creep.energy);
                        creep.memory.state = STATE.NONE;
                    }
                    break;
                }
            case STATE.MOVE_TO_BUILD:
                {
                    creep.memory.state = STATE.MOVE_TO_HARVEST;
                    break;
                }
            default:
                console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
        }
    }
};