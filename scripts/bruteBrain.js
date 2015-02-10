/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('bruteBrain'); // -> 'a thing'
 */
var STATE = require('state');

module.exports = {
    think: function(creep) {
        var runAway;
        var hostile;
        switch (creep.memory.state) {
            case STATE.NONE:
                {

                    hostile = creep.pos.findClosest(Game.HOSTILE_CREEPS);
                    
                    if (hostile) {
                        creep.memory.state = STATE.ATTACKING;
                        creep.moveTo(hostile);
                        creep.memory.target = null;
                        break;
                    }
                    
                    var closestSpawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (closestSpawn) {
                        var tooCloseToSpawn = creep.pos.inRangeTo(closestSpawn, 2);
                        if (tooCloseToSpawn) {
                            runAway = closestSpawn.pos.getDirectionTo(creep);
                            var door = creep.pos.findClosest(Game.EXIT_TOP);
                            creep.move(runAway);
                        }
                        var pathToSpawn = creep.room.findPath(creep.pos, closestSpawn.pos, {
                            ignoreCreeps: true
                        });
                        if (pathToSpawn.length > 12) {
                            creep.moveTo(closestSpawn);
                        }
                    }
                    
                    var closestBuddy = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function (otherCreep) {
                            return (close && otherCreep.getActiveBodyparts(Game.ATTACK)) || (ranged && otherCreep.getActiveBodyparts(Game.RANGED_ATTACK));
                        }
                    });
                    if (closestBuddy && creep.pos.inRangeTo(closestBuddy.pos, 3) === false) {
                        creep.moveTo(closestBuddy);
                    }
                    


                    break;
                }

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
                    var hosilteCreeps = creep.room.find(Game.HOSTILE_CREEPS);
                    var shortestPath = 1000;
                    var nearest = {};
                    nearest = null;
                    for (var as in hosilteCreeps) {
                        var asPath = creep.room.findPath(creep.pos, hosilteCreeps[as].pos, {
                            ignoreCreeps: true
                        });
                        if (asPath.length < shortestPath) {
                            shortestPath = asPath.length;
                            nearest = hosilteCreeps[as];
                        }
                    }


                    hostile = nearest;
                    
                   var ranged = creep.getActiveBodyparts(Game.RANGED_ATTACK);
                   var close = creep.getActiveBodyparts(Game.ATTACK);
                    if (hostile) {
                        
                        if (!creep.memory.target) {
                            creep.memory.target = hostile.id;
                        }
                        
                        
                        
                        if (ranged) {
                            creep.moveTo(hostile);
                            creep.rangedAttack(hostile);
                            if (creep.pos.inRangeTo(hostile.pos, 2)) {
                                runAway = hostile.pos.getDirectionTo(creep);
                                creep.move(runAway);
                            }
                        } else {
                            creep.moveTo(hostile);
                            creep.attack(hostile);
                        }
                                               

                    } else {
                        creep.memory.target = null;
                        creep.memory.state = STATE.NONE;
                    }
                    var pathToSpawn = creep.room.findPath(creep.pos, spawn.pos, {
                        ignoreCreeps: true
                    });
                    var maxRoamingDistance = 20;
                    if (close)
                        maxRoamingDistance++;

                    if (pathToSpawn.length > 20) {
                        creep.moveTo(spawn);
                    }

                    
                    break;
                }
            case STATE.MOVE_TO_TRANSFER:
                {
                    var spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (spawn) {
                        
                        creep.moveTo(spawn);
                        if (creep.pos.inRangeTo(spawn.pos, 2) || creep.pos.inRangeTo(spawn.pos, 3)) {
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