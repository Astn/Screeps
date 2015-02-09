/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('bruteBrain'); // -> 'a thing'
 */
var STATE = require('state');
var _ = require('lodash');
module.exports = {
    think: function (creep) {

        var injured;
        switch (creep.memory.state) {
            case STATE.NONE:
                {
                    //console.log('Valid state:' + creep.name + ':' + creep.memory.state);
                    injured = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function (otherCreep) {
                            return otherCreep.hits < otherCreep.hitsMax;
                        }
                    });

                    if (injured || creep.pos.findClosest(Game.HOSTILE_CREEPS)) {
                        creep.memory.state = STATE.HEALING;
                        creep.memory.target = null;
                    }

                    var closestSpawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (closestSpawn) {

                        var tooCloseToSpawn = creep.pos.inRangeTo(closestSpawn, 3);
                        if (tooCloseToSpawn) {
                            var door = creep.pos.findClosest(Game.EXIT_TOP);
                            creep.moveTo(door);
                        }
                    }
                    
                    break;
                }
            case STATE.HEALING:
                {
                    var hostile = creep.pos.findClosest(Game.HOSTILE_CREEPS);
                    var healerHelpWhenAt = 1;
                    if (hostile) {
                        healerHelpWhenAt = .60;
                    }

                    injured = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function (otherCreep) {
                            return otherCreep.getActiveBodyparts(Game.HEAL) && otherCreep.hits < (otherCreep.hitsMax * healerHelpWhenAt);
                        }
                    });

                    if (!injured) {
                        var closeInjured = creep.pos.findInRange(Game.MY_CREEPS, 10, {
                            filter: function (otherCreep) {
                                return (otherCreep.getActiveBodyparts(Game.ATTACK) || otherCreep.getActiveBodyparts(Game.RANGED_ATTACK)) && otherCreep.hits < otherCreep.hitsMax;
                            }
                        });
                        _.sortBy(closeInjured, function (n) { return n.hits / n.hitsMax });
                        injured = closeInjured[0];
                    }
                    if (!injured) {
                        var closeInjured = creep.pos.findInRange(Game.MY_CREEPS, 10, {
                            filter: function (otherCreep) {
                                return otherCreep.hits < otherCreep.hitsMax;
                            }
                        });
                        _.sortBy(closeInjured, function (n) { return n.hits / n.hitsMax });
                        injured = closeInjured[0];
                    }
                   

                    if (injured) {
                        if (!creep.memory.target) {
                            creep.memory.target = injured.id;
                        }

                        if (!injured.pos)
                            break;

                        var inRange = creep.pos.inRangeTo(injured.pos, 3);
                        var inClose = creep.pos.inRangeTo(injured.pos, 1);
                        if (inClose) {
                            creep.heal(injured);
                        }
                        else if (inRange) {
                            creep.moveTo(injured);
                            creep.rangedHeal(injured);
                        }
                        else {
                            creep.moveTo(injured);
                        }

                    } else {
                        var hostile = creep.pos.findClosest(Game.HOSTILE_CREEPS);
                        if (hostile) {
                            var runAway = hostile.pos.getDirectionTo(creep);
                            if (creep.pos.inRangeTo(hostile.pos, 5)) {
                                creep.move(runAway);
                            }
                            else {
                                // we want to be close to the enemy because that is
                                // were the action is so we can help our friends.
                                creep.moveTo(hostile);
                            }
                        }
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
                        if (creep.pos.inRangeTo(spawn.pos, 3) ) {
                            creep.memory.state = STATE.NONE;
                        }
                    }
                    break;
                }
            default:
                {
                    creep.memory.state = STATE.NONE;
                    console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
                }
        }
    }
};