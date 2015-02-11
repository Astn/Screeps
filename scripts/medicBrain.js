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
    think: function(creep) {

        var injured;
        switch (creep.memory.state) {
            case STATE.NONE:
                {
                    //console.log('Valid state:' + creep.name + ':' + creep.memory.state);
                    injured = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function(otherCreep) {
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
                    var spawn = {};
                    for (var sp in Game.spawns) {
                        if (Game.spawns[sp].room == creep.room) {
                            spawn = Game.spawns[sp];
                            break;
                        }
                    }

                    var hostile = creep.pos.findClosest(Game.HOSTILE_CREEPS);
                    var healerHelpWhenAt = 1;
                    if (hostile) {
                        healerHelpWhenAt = .60;
                    }

                    injured = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function(otherCreep) {
                            return otherCreep.getActiveBodyparts(Game.HEAL) && otherCreep.hits < (otherCreep.hitsMax * healerHelpWhenAt);
                        }
                    });



                    if (!injured) {
                        var injuredCreeps = creep.room.find(Game.MY_CREEPS);
                        injuredCreeps = _.filter(injuredCreeps, function(n){
                            return (n.getActiveBodyparts(Game.ATTACK) > 0 || n.getActiveBodyparts(Game.RANGED_ATTACK) > 0) && n.hits < n.hitsMax;
                        });
                        injuredCreeps = _.filter(injuredCreeps, function(n){
                            return (n.hits < n.hitsMax);
                        });
                        var shortestPath = 1000;
                        var nearestInjured = {};
                        nearestInjured = null;
                        for (var idx in injuredCreeps) {
                            var injuredCreep = injuredCreeps[idx];
                            var asPath = creep.room.findPath(creep.pos, injuredCreep.pos, {
                                ignoreCreeps: true
                            });
                            if (asPath.length < shortestPath) {
                                shortestPath = asPath.length;
                                nearestInjured = injuredCreep;
                            }
                        }
                        //_.sortBy(closeInjured, function (n) { return n.hits / n.hitsMax });
                        injured = nearestInjured;
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
                            creep.moveTo(spawn);
                        } else if (inRange) {
                            creep.rangedHeal(injured);
                            creep.moveTo(injured);
                        } else {
                            creep.moveTo(injured);
                        }

                    } else {
                        var frontLineCreeps = creep.room.find(Game.MY_CREEPS);
                        frontLineCreeps = _.filter(frontLineCreeps, function (n) {
                            return (n.getActiveBodyparts(Game.ATTACK) > 0 || n.getActiveBodyparts(Game.RANGED_ATTACK) > 0);
                        });
                        if (frontLineCreeps && frontLineCreeps.length > 0) {
                            
                            var currentLen = frontLineCreeps.length;
                            for (var i = 0; i < currentLen / 6; i++){
                                frontLineCreeps.push(spawn);
                            }
                            var sumX = _.reduce(frontLineCreeps,  function (sum, n) { return sum+ n.pos.x; }, 0);
                            var sumY = _.reduce(frontLineCreeps,  function (sum, n) { return sum+ n.pos.y; }, 0);
                            var avgX = Math.round( sumX / frontLineCreeps.length );
                            var avgY = Math.round( sumY / frontLineCreeps.length );

                            var spotPos = creep.room.getPositionAt(avgX, avgY);
                            var spotInfo = creep.room.lookAt(spotPos);

                            spotInfo = _.filter(spotInfo, function (n) { return n.type == 'terrain' && n.terrain == 'plain' || n.terrain == 'swamp' });
                            if (spotInfo.length > 0) {
                                var asPath = creep.room.findPath(creep.pos, spotPos, {
                                    ignoreCreeps: false
                                });
                                if (asPath && asPath.length > 0) {
                                    creep.move(asPath[0].direction);
                                }
                            }
                        }
                        creep.memory.target = null;
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