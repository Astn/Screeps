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
                    console.log('Valid state:' + creep.name + ':' + creep.memory.state);
                    
                    var hostile = creep.pos.findNearest(Game.HOSTILE_CREEPS);
                    if(hostile){
                        creep.memory.state =  STATE.ATTACKING;
                        creep.memory.target = null;
                    }
                    
                    var closestSpawn = creep.pos.findNearest(Game.MY_SPAWNS);
                    if(closestSpawn){
                      var tooCloseToSpawn = creep.pos.inRangeTo(closestSpawn,3);
                      if(tooCloseToSpawn){
                          var runAway = closestSpawn.pos.getDirectionTo(creep);
                          var door = creep.pos.findNearest(Game.EXIT_TOP);
                          creep.move(runAway);
                      }
                    }
                    
                    break;
                }
                /*case STATE.MOVE_TO_ATTACK: {
                    
                    var hostile = creep.pos.findNearest(Game.HOSTILE_CREEPS);
                    if(hostile){
                        if(!creep.memory.target){
                            creep.memory.target = hostile.id;
                        }
                        creep.moveTo(hostile);
                        if(creep.pos.inRangeTo(hostile.pos,1)){
                            creep.memory.state = STATE.ATTACKING;
                            this.think(creep);
                        }
                    }
                    else{
                        creep.memory.target = null;
                    }
                    
                    break;
                }*/
                case STATE.ATTACKING: {
                    var hostile = creep.pos.findNearest(Game.HOSTILE_CREEPS);
                    if(hostile){
                        if(!creep.memory.target){
                            creep.memory.target = hostile.id;
                        }
                        var runAway = hostile.pos.getDirectionTo(creep);
                        var ranged = creep.getActiveBodyparts(Game.RANGED_ATTACK);
                        var close = creep.getActiveBodyparts(Game.ATTACK);
                        var inRanged = creep.pos.inRangeTo(hostile.pos,3);
                        if(ranged && inRanged){
                            creep.rangedAttack(hostile);
                            if(creep.pos.inRangeTo(hostile.pos,2))
                                creep.move(runAway);
                            break;
                        } else if (ranged){
                            creep.moveTo(hostile);
                            creep.attack(hostile);
                        }
                        
                        
                        var inClose = creep.pos.inRangeTo(hostile.pos,1); 
                        if(close && inClose){
                            creep.attack(hostile);
                        } else if (close) {
                            creep.moveTo(hostile);
                            creep.attack(hostile);
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
                default: console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
        }
    }
}
 