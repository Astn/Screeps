/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('bruteBrain'); // -> 'a thing'
 */
var STATE = require('state');

module.exports = {
    think: function (creep) {
        var runAway;
        var hostile;
        switch (creep.memory.state) {
            case STATE.NONE:
                {

                    hostile = creep.pos.findClosest(Game.HOSTILE_CREEPS);
                    
                    if (hostile) {
                        creep.memory.state = STATE.ATTACKING;
                        creep.memory.target = null;
                        this.think(creep);                   
                    }
                    
                    var closestSpawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (closestSpawn) {
                        var tooCloseToSpawn = creep.pos.inRangeTo(closestSpawn, 1);
                        if (tooCloseToSpawn) {
                            runAway = closestSpawn.pos.getDirectionTo(creep);
                            var door = creep.pos.findClosest(Game.EXIT_TOP);
                            creep.move(runAway);
                        }
                    }
                    
                    var closestBuddy = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function (otherCreep) {
                            return (close && otherCreep.getActiveBodyparts(Game.ATTACK)) || (ranged && otherCreep.getActiveBodyparts(Game.RANGED_ATTACK));
                        }
                    });
                    if (closestBuddy && creep.pos.inRangeTo(closestBuddy.pos, 2) === false) {
                        creep.moveTo(closestBuddy);
                    }
                    

                    break;
                }
                /*case STATE.MOVE_TO_ATTACK: {
                            
                            var hostile = creep.pos.findClosest(Game.HOSTILE_CREEPS);
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
            case STATE.ATTACKING:
                {
                    var spawn = {};
                    for (var sp in Game.spawns) {
                        if (Game.spawns[sp].room == creep.room) {
                            spawn = Game.spawns[sp];
                            break;
                        }
                    }
                    
                    // find closest hostile, then find the closest friend to that hostile, then find that friends
                    // closest enemy. make him the target.
                    hostile = creep.pos.findClosest(Game.HOSTILE_CREEPS);
                    
                   
                    if (hostile) {
                        
                        if (!creep.memory.target) {
                            creep.memory.target = hostile.id;
                        }
                        
                        
                        runAway = hostile.pos.getDirectionTo(creep);
                        var ranged = creep.getActiveBodyparts(Game.RANGED_ATTACK);
                        var close = creep.getActiveBodyparts(Game.ATTACK);
                        
                        var inRanged = creep.pos.inRangeTo(hostile.pos, 3);
                        if (ranged && inRanged) {
                            creep.moveTo(hostile);
                            creep.rangedAttack(hostile);
                            if (creep.pos.inRangeTo(hostile.pos, 2))
                                creep.move(runAway);
                            break;
                        } else {
                            creep.moveTo(hostile);
                            creep.attack(hostile);
                        }
                                               

                    } else {
                        creep.memory.target = null;
                        creep.memory.state = STATE.MOVE_TO_TRANSFER;
                    }
                    
                    break;
                }
            case STATE.MOVE_TO_TRANSFER:
                {
                    var spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (spawn) {
                        
                        creep.moveTo(spawn);
                            if (creep.pos.inRangeTo(spawn.pos, 2) || creep.pos.inRangeTo(spawn.pos, 3) && creep.room.find(Game.MY_CREEPS).some(function (c) { return creep.pos.isNearTo(c) && creep.pos.getDirectionTo(c) == creep.pos.getDirectionTo(spawn); })) {
                                creep.memory.state = STATE.NONE;
                            }
                        
                    }
                    break;
                }
                /*case STATE.TRANSFERING: {
                            var spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                            if(spawn){
                                creep.transferEnergy(spawn,creep.energy);
                                creep.memory.state = STATE.NONE;
                            }
                            break;
                        }*/
            default: {
                console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
                creep.memory.state = STATE.NONE;
            }
        }
    }
};