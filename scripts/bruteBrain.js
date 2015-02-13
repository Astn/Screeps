/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('bruteBrain'); // -> 'a thing'
 */
var STATE = require('state');
var _ = require('lodash');
var util = require('utility');
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
                        if (pathToSpawn.length > 16) {
                            creep.move(pathToSpawn[0].direction);
                        }
                    }
                    
                    //var closestBuddy = creep.pos.findClosest(Game.MY_CREEPS, {
                    //    filter: function (otherCreep) {
                    //        return (close && otherCreep.getActiveBodyparts(Game.ATTACK)) || (ranged && otherCreep.getActiveBodyparts(Game.RANGED_ATTACK));
                    //    }
                    //});
                    //if (closestBuddy && creep.pos.inRangeTo(closestBuddy.pos, 3) === false) {
                    //    creep.moveTo(closestBuddy);
                    //}
                    


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
                    var hostile = util.chooseHostile(creep);
                    if (!hostile) {
                        creep.memory.target = null;
                        creep.memory.state = STATE.NONE;
                        break;
                    }

                    var pathToSpawn = creep.room.findPath(creep.pos, spawn.pos, {
                        ignoreCreeps: true
                    });
                    var maxRoamingDistance = 17;
                    if (close)
                        maxRoamingDistance++;
                    var moveBack = pathToSpawn.length > maxRoamingDistance;
                    
                    var ranged = creep.getActiveBodyparts(Game.RANGED_ATTACK);
                    var close = creep.getActiveBodyparts(Game.ATTACK);

                    if (!creep.memory.target) {
                        creep.memory.target = hostile.id;
                    }
                    var nearestCreepPath = creep.pos.findPathTo(hostile);
                    if (ranged) {
                            
                        creep.rangedAttack(hostile);
                        if (creep.pos.inRangeTo(hostile.pos, 2)) {
                            runAway = hostile.pos.getDirectionTo(creep);
                            if(!moveBack)
                                creep.move(runAway);
                        }
                        else {
                            if (!moveBack)
                            creep.move(nearestCreepPath[0].direction);
                        }
                    }
                    util.tradePlaces(creep, nearestCreepPath[0]);
                    if (!moveBack)
                        creep.move(nearestCreepPath[0].direction);
                    if (creep.pos.inRangeTo(hostile.pos, 1)) {
                        creep.attack(hostile);
                    }
                    if (moveBack) {
                        creep.move(pathToSpawn[0].direction);
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