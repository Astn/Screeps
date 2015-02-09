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
                    //console.log('Valid state:' + creep.name + ':' + creep.memory.state);
                    hostile = creep.pos.findClosest(Game.HOSTILE_CREEPS);
                    if (hostile) {
                        creep.memory.state = STATE.ATTACKING;
                        creep.memory.target = null;
                    }

                    var closestSpawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (closestSpawn) {
                        var tooCloseToSpawn = creep.pos.inRangeTo(closestSpawn, 3);
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
                    var closestBuddy = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function (otherCreep) {
                            return (close && otherCreep.getActiveBodyparts(Game.ATTACK)) || (ranged && otherCreep.getActiveBodyparts(Game.RANGED_ATTACK));
                        }
                    });
                    if (closestBuddy && creep.pos.inRangeTo(closestBuddy.pos, 2) === false) {
                        creep.moveTo(closestBuddy);
                        break;
                    }
                    var closestHealer = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function (otherCreep) {
                            return otherCreep.getActiveBodyparts(Game.HEAL);
                        }
                    });
                    if (closestHealer && creep.pos.inRangeTo(closestHealer.pos, 3) === false) {
                        creep.moveTo(closestHealer);
                        break;
                    }
                    else if (closestHealer === null) {                        
                        if (creep.pos.inRangeTo(spawn.pos, 1) === false) {
                            creep.moveTo(spawn);
                            break;
                        }
                    }
                    
                    hostile = spawn.pos.findClosest(Game.HOSTILE_CREEPS);
                    if (hostile) {
                        var myBiggestThreat = creep.pos.findClosest(Game.HOSTILE_CREEPS);
                        if (myBiggestThreat && creep.pos.inRangeTo(myBiggestThreat.pos, 2)) {
                            hostile = myBiggestThreat;
                        }
                        if (!creep.memory.target) {
                            creep.memory.target = hostile.id;
                        }
                        

                        runAway = hostile.pos.getDirectionTo(creep);
                        var ranged = creep.getActiveBodyparts(Game.RANGED_ATTACK);
                        var close = creep.getActiveBodyparts(Game.ATTACK);
                        
                        

                        var inRanged = creep.pos.inRangeTo(hostile.pos, 3);
                        if (ranged && inRanged) {
                            creep.rangedAttack(hostile);
                            if (creep.pos.inRangeTo(hostile.pos, 2))
                                creep.move(runAway);
                            break;
                        } else if (ranged) {
                            creep.moveTo(hostile);
                            creep.attack(hostile);
                        }


                        var inClose = creep.pos.inRangeTo(hostile.pos, 1);
                        if (close && inClose) {
                            creep.attack(hostile);
                        } else if (close) {
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
                        if (creep.pos.inRangeTo(spawn.pos, 5) || creep.pos.inRangeTo(spawn.pos, 6) && creep.room.find(Game.MY_CREEPS).some(function (c) { return creep.pos.isNearTo(c) && creep.pos.getDirectionTo(c) == creep.pos.getDirectionTo(spawn); })) {
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
            default:
                console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
        }
    }
};