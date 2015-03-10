/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('bruteBrain'); // -> 'a thing'
 */
var STATE = require('state');
var _ = require('lodash');
var utility = require('utility');
module.exports = {
    think: function(creep, otherHostile) {
        var runAway;
        var hostile;
        var ranged = utility.creepIsRanged(creep);
        var close = utility.creepIsCloseRanged(creep);
        var useOtherHostile = false;
        if (otherHostile && ranged) {
            //useOtherHostile = creep.pos.inRangeTo(otherHostile, 4);
            //i/f(useOtherHostile)
                hostile = otherHostile;
        } else if (otherHostile && close) {
            //useOtherHostile = creep.pos.inRangeTo(otherHostile, 2);
            //if (useOtherHostile)
                hostile = otherHostile;
        }
        var maxRoamingDistance = 5;
        if (close) {
            maxRoamingDistance = 6;
        }
        switch (creep.memory.state) {
            case STATE.NONE:
                {

                        hostile = creep.pos.findClosest(Game.HOSTILE_CREEPS, {filter: function(c){return c.owner.username != 'Source Keeper';}});

                    if (hostile) {
                        creep.say(hostile.owner.username);
                        console.log(hostile.owner.username);
                        creep.memory.state = STATE.ATTACKING;
                        return this.think(creep, hostile);
                    }
                    else{
                      creep.say('duh..');
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
                        if (pathToSpawn.length > maxRoamingDistance) {
                            creep.move(pathToSpawn[0].direction);
                            break;
                        }

                    }

                    break;
                }

            case STATE.ATTACKING:
                {
                    var spawn = utility.chooseSpawn(creep);
                    hostile = utility.chooseHostile(creep);
                    if (!hostile || !hostile.pos) {
                        creep.say('none');
                        creep.memory.state = STATE.NONE;
                        break;
                    }

                    var attackResult;
                    if (ranged && creep.pos.inRangeTo(hostile.pos, 4)) {
                        attackResult = creep.rangedAttack(hostile);
                    }
                    else if (creep.pos.inRangeTo(hostile.pos, 1)) {
                        attackResult = creep.attack(hostile);
                    }
                    if(attackResult===Game.ERR_NOT_IN_RANGE){
                      creep.moveTo(hostile);
                      return;
                    }
                    else if(attackResult){
                      creep.say(attackResult);
                    }

                    var ignoreCreeps = Math.random() * 100 < 80;
                    var nearestCreepPath = creep.pos.findPathTo(hostile, {
                        ignoreCreeps: ignoreCreeps,
                        ignoreDestructibleStructures: true
                    });
                    if(nearestCreepPath.length > 0){
                        utility.tradePlaces(creep, nearestCreepPath[0]);
                        var distFromSpawn = utility.positionDistanceToNearestSpawn(creep.room, nearestCreepPath[0]);
                        if(distFromSpawn <= maxRoamingDistance)
                          creep.move(nearestCreepPath[0].direction);
                    }
                    var pathToSpawn = creep.room.findPath(creep.pos, spawn.pos, {
                        ignoreCreeps: true
                    });

                    if (ranged && creep.pos.inRangeTo(hostile.pos, 1)) {
                        var toSpawn = utility.directionToNearestSpawn(creep);
                        creep.move(toSpawn);
                    }

                    return hostile;
                    break;
                }
            default: {
                console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
                creep.memory.state = STATE.NONE;
            }
        }
    }
};
