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

                    creep.memory.target = null;
                    if(!Memory.drops)
                        Memory.drops = [];
                    
                    // refresh energy numbers
                    var best = creep.pos.findClosest(Game.DROPPED_ENERGY, { filter: function(drop) {
                        return drop.energy >= creep.energyCapacity;
                    }});
                    if(best)
                    {
                        
                            console.log("best "+ best.id + " energy: " + parseInt(best.energy));
                            // reserve some energy and set target
                            creep.memory.target = best.id;
                            creep.memory.state =  STATE.MOVE_TO_HARVEST;
               
                    }
                    
                    break;
                }
                case STATE.MOVE_TO_HARVEST: {

                    if(!creep.memory.target)
                    {
                        creep.memory.state = STATE.NONE;
                        break;
                    }
                    var source = Game.getObjectById(creep.memory.target);
                    if(source){
                        var moveResult = creep.moveTo(source);
                        if(moveResult == Game.ERR_NO_PATH){
                            creep.memory.state = STATE.NONE;
                        }
                        if(creep.pos.inRangeTo(source.pos,1)){
                            creep.memory.state = STATE.HARVESTING;
                        }
                    }
                    else
                    {
                        creep.memory.state = STATE.NONE;
                    }
                    break;
                }
                case STATE.HARVESTING: {
                    var source = creep.pos.findClosest(Game.DROPPED_ENERGY);
                    if(source){
                        
                        creep.pickup(source);
                        // unreserve energy
                         var matchDrop = null;
                        Memory.drops.forEach(function (md){
                           if(md.id == creep.memory.target){
                               matchDrop = md;
                           } 
                        });
                        if(matchDrop)
                        {
                            matchDrop.reserved -= creep.energyCapacity;
                            
                             if(matchDrop.reserved === 0 && matchDrop.energy < 50){
                                var idx = Memory.drops.indexOf(matchDrop);
                             
                                console.log("removing "+ matchDrop.id + " energy: " + parseInt(matchDrop.energy) + " reserved: " + parseInt(matchDrop.reserved));
                                Memory.drops.splice(idx,1);
                                break;
                             }
                            
                        }
                            
                        // check if there is more close energy and grab it
                        var drop = creep.pos.findClosest(Game.DROPPED_ENERGY);
                        if(creep.pos.inRangeTo(drop, 5)  && creep.energy < creep.energyCapacity){
                            creep.memory.target = drop.id;
                            creep.memory.state = STATE.MOVE_TO_HARVEST;    
                        }   
                        
                        creep.memory.state = STATE.MOVE_TO_TRANSFER;
                    }
                    break; 
                };
                case STATE.MOVE_TO_TRANSFER: {
                    var site = creep.pos.findClosest(Game.CONSTRUCTION_SITES, {filter:function(item){return item.progress > 0}});
                    if(!site)
                        site = creep.pos.findClosest(Game.CONSTRUCTION_SITES);
                    if(creep.getActiveBodyparts(Game.WORK)  && site)
                    {
                        creep.moveTo(site);
                        if(creep.pos.inRangeTo(site.pos,1)){
                            creep.memory.state = STATE.TRANSFERING;
                        }
                    }
                    else
                    {
                        var spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                        if(spawn){
                            creep.moveTo(spawn);
                            if(creep.pos.inRangeTo(spawn.pos,1)){
                                creep.memory.state = STATE.TRANSFERING;
                            }
                        }
                    }
                    break;
                }
                case STATE.TRANSFERING: {
                    var site = creep.pos.findClosest(Game.CONSTRUCTION_SITES, {filter:function(item){return item.progress > 0}});
                    if(!site)
                        site = creep.pos.findClosest(Game.CONSTRUCTION_SITES);
                    if(creep.getActiveBodyparts(Game.WORK) && site)
                    {
                        creep.moveTo(site);
                        creep.build(site);
                        if(creep.energy === 0)
                            creep.memory.state = STATE.NONE;
                    }
                    else
                    {
                        var spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                        if(spawn){
                            creep.transferEnergy(spawn,creep.energy);
                            creep.memory.state = STATE.NONE;
                        }
                    }
                    break;
                }
                default: console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
        }
    }
}
 