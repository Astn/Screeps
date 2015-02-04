/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('bruteBrain'); // -> 'a thing'
 */
 var STATE = require('state');
 
 module.exports = {
    think: function(creep){
            switch (creep.memory.state) {
                case STATE.NONE: {
                    //console.log('Valid state:' + creep.name + ':' + creep.memory.state);
                    
                    var injured = creep.pos.findNearest(Game.MY_CREEPS,{
                        filter: function(otherCreep){
                            return otherCreep.hits < otherCreep.hitsMax;
                        }
                    });
                    if(injured || creep.pos.findNearest(Game.HOSTILE_CREEPS)){
                        creep.memory.state =  STATE.HEALING;
                        creep.memory.target = null;
                    }
                    
                    
                    var closestSpawn = creep.pos.findNearest(Game.MY_SPAWNS);
                    if(closestSpawn){
                      var tooCloseToSpawn = creep.pos.inRangeTo(closestSpawn,3);
                      if(tooCloseToSpawn){
                          var door = creep.pos.findNearest(Game.EXIT_TOP);
                          creep.moveTo(door);
                      }
                    }
                    
                    break;
                }
                case STATE.HEALING: {
                    var injured = creep.pos.findNearest(Game.MY_CREEPS,{
                        filter: function(otherCreep){
                            return otherCreep.getActiveBodyparts(Game.HEAL) && otherCreep.hits < otherCreep.hitsMax;
                        }
                    });
                    if(!injured)
                    injured = creep.pos.findNearest(Game.MY_CREEPS,{
                        filter: function(otherCreep){
                            return otherCreep.getActiveBodyparts(Game.ATTACK) && otherCreep.hits < otherCreep.hitsMax;
                        }
                    });
                    if(!injured)
                    injured = creep.pos.findNearest(Game.MY_CREEPS,{
                        filter: function(otherCreep){
                            return otherCreep.hits < otherCreep.hitsMax;
                        }
                    });
                    if(injured){
                        if(!creep.memory.target){
                            creep.memory.target = injured.id;
                        }

                        if(!injured.pos)
                            break;
                        
                        var inRange = creep.pos.inRangeTo(injured.pos,3); 
                        var inClose = creep.pos.inRangeTo(injured.pos,1); 
                        if(inClose){
                            creep.heal(injured);
                        } else if (inRange) {
                            creep.moveTo(injured);
                            creep.rangedHeal(injured);
                        } else {
                            creep.moveTo(injured);
                        }
                        
                    }
                    else{
                        creep.memory.target = null;
                        creep.memory.state = STATE.NONE;
                    }
                    
                    break;
                };
                /*case STATE.MOVE_TO_TRANSFER: {
                    var spawn = creep.pos.findNearest(Game.MY_SPAWNS);
                    if(spawn){
                        creep.moveTo(spawn);
                        if(creep.pos.inRangeTo(spawn.pos,1)){
                            creep.memory.state = STATE.TRANSFERING;
                        }
                    }
                    break;
                }
                case STATE.TRANSFERING: {
                    var spawn = creep.pos.findNearest(Game.MY_SPAWNS);
                    if(spawn){
                        creep.transferEnergy(spawn,creep.energy);
                        creep.memory.state = STATE.NONE;
                    }
                    break;
                }*/
                default: {
                    creep.memory.state = STATE.NONE;
                    console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
                }
        }
    }
}
 