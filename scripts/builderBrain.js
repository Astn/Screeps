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
                    
                    var source = creep.pos.findClosest(Game.DROPPED_ENERGY);
                    if(source){
                        creep.moveTo(source);
                        if(creep.pos.inRangeTo(source.pos,1)){
                            creep.memory.state = STATE.HARVESTING;
                        }
                    }
                    break;
                }
                case STATE.HARVESTING: {
                    var source = creep.pos.findClosest(Game.DROPPED_ENERGY);
                    if(source){
                        creep.pickup(source);
                        //if(creep.energy == creep.energyCapacity){
                            creep.memory.state = STATE.MOVE_TO_TRANSFER;
                        //}
                        //else{
                        //    creep.memory.state = STATE.MOVE_TO_HARVEST;
                        //}
                    }
                    break; 
                };
                case STATE.MOVE_TO_TRANSFER: {
                    var spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if(spawn){
                        creep.moveTo(spawn);
                        if(creep.pos.inRangeTo(spawn.pos,1)){
                            creep.memory.state = STATE.TRANSFERING;
                        }
                    }
                    break;
                }
                case STATE.TRANSFERING: {
                    var spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if(spawn){
                        creep.transferEnergy(spawn,creep.energy);
                        creep.memory.state = STATE.NONE;
                    }
                    break;
                }
                default: console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
        }
    }
}
 