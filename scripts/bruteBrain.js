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
                    
                    break;
                }

            case STATE.ATTACKING:
                {
                    var spawn = util.chooseSpawn(creep);
                    var hostile = util.chooseHostile(creep);
                    if (!hostile) {
                        creep.say('none');
                        creep.memory.state = STATE.NONE;
                        break;
                    }

                    
                    var ranged = creep.getActiveBodyparts(Game.RANGED_ATTACK);
                    var close = creep.getActiveBodyparts(Game.ATTACK);
                    
                    
                    var nearestCreepPath = creep.pos.findPathTo(hostile);
                    if (ranged && creep.pos.inRangeTo(hostile.pos, 4)) {
                        creep.rangedAttack(hostile);
                    }
                    else {
                        if (creep.pos.inRangeTo(hostile.pos, 1)) {
                            creep.attack(hostile);
                        }
                    }
                    util.tradePlaces(creep, nearestCreepPath[0]);
                    var maxRoamingDistance = 17;
                    if (close) {
                        maxRoamingDistance = 18;
                    }
                    var pathToSpawn = creep.room.findPath(creep.pos, spawn.pos, {
                        ignoreCreeps: true
                    });
                    creep.say(parseInt(pathToSpawn.length));
                    var moveBack = pathToSpawn.length > maxRoamingDistance;
                    if (moveBack || (ranged && creep.pos.inRangeTo(hostile.pos, 2))) {
                        
                        creep.move(pathToSpawn[0].direction);
                    }
                    else {
                        creep.say('only ' + parseInt(pathToSpawn.length));
                        creep.move(nearestCreepPath[0].direction);
                    }

                    break;
                }
            default: {
                console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
                creep.memory.state = STATE.NONE;
            }
        }
    }
};