/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('minerBrain'); // -> 'a thing'
 */
var STATE = require('state');
 
 module.exports = {
    think: function(creep){
            switch (creep.memory.state) {
                case STATE.NONE: {
                    console.log('Valid state:' + creep.name + ':' + creep.memory.state);
                    creep.memory.state =  STATE.MOVE_TO_HARVEST;
                    creep.memory.target = null;
                    break;
                }
                case STATE.MOVE_TO_HARVEST: {
                    
                    
                    if(!creep.memory.target || !Game.getObjectById(creep.memory.target))
                    {
                        creep.memory.target = creep.pos.findNearest(Game.SOURCES_ACTIVE).id;
                    }
                       
                    var source = Game.getObjectById(creep.memory.target);
                    if(!source || creep.pos.inRangeTo(source.pos, 1))
                        creep.memory.target = null;
                    
                    if(source){
                        if(creep.pos.inRangeTo(source.pos,1)){
                            creep.memory.state = STATE.HARVESTING;
                        }
                        else
                        {
                          
                           creep.moveTo(source); 
                           
                        }
                    }
                    break;
                }
                case STATE.HARVESTING: {
                    var source = creep.pos.findNearest(Game.SOURCES_ACTIVE);
                    
                    if(source){
                        var prevEnergy = creep.energy;
                        creep.harvest(source);
                        var afterEnergy = creep.energy;
                        if(creep.energy == creep.energyCapacity){
                            creep.memory.state = STATE.MOVE_TO_TRANSFER;
                        }
                    }
                    break;
                };
                case STATE.MOVE_TO_TRANSFER: {
                    creep.dropEnergy();
                    creep.memory.state = STATE.MOVE_TO_HARVEST; 
                    break;
                }
                case STATE.TRANSFERING: {
                    var spawn = creep.pos.findNearest(Game.MY_SPAWNS);
                    if(spawn){
                        creep.transferEnergy(spawn,creep.energy);
                        creep.memory.state = STATE.NONE;
                    }
                    break;
                }
                case STATE.MOVE_TO_BUILD:{
                    creep.memory.state =STATE.MOVE_TO_HARVEST;
                    break;
                }
                default: console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
        }
    }
}
 