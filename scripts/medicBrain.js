/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('bruteBrain'); // -> 'a thing'
 */
var STATE = require('state');
var utility = require('utility');
var _ = require('lodash');
module.exports = {
    think: function (creep) {

        var injured;
        switch (creep.memory.state) {
            case STATE.NONE:
                {
                    injured = creep.pos.findClosest(Game.MY_CREEPS, { filter: utility.creepIsDamaged });

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
                        // make sure that we dont go beyond our limit
                        var pathToSpawn = creep.room.findPath(creep.pos, closestSpawn.pos, {
                            ignoreCreeps: true
                        });
                        if (pathToSpawn.length > 15) {
                            creep.move(pathToSpawn[0].direction);
                        }
                    }


                    break;
                }
            case STATE.HEALING:
                {
                    var spawn = utility.chooseSpawn(creep);

                    if (!injured) {
                        var injuredCreeps = creep.room.find(Game.MY_CREEPS);
                        injuredCreeps = _.filter(injuredCreeps, utility.creepIsDamaged);
                        var shortestPath = 1000;
                        var mostInjured = {};
                        if (injuredCreeps.length) {
                            _.sortBy(injuredCreeps, utility.creepHitsRatio);
                            mostInjured = injuredCreeps[0];
                            injured = mostInjured;
                        }
                    }
                    if (injured) {
                        if (!creep.memory.target) {
                            creep.memory.target = injured.id;
                        }

                        if (!injured.pos)
                            break;

                        var inRange = creep.pos.inRangeTo(injured.pos, 3);
                        var inClose = creep.pos.inRangeTo(injured.pos, 1);
                        if (!injured.memory) {
                            injured.memory = { pain: 0 };
                        }
                        if (inClose) {
                            creep.heal(injured);
                            injured.memory.pain += 2;
                        } else if (inRange) {
                            var pathToInjured = creep.room.findPath(creep.pos, injured.pos, {
                                ignoreCreeps: true
                            });
                            creep.rangedHeal(injured);
                            injured.memory.pain += 2;
                            if (pathToInjured.length > 0) {
                                creep.move(pathToInjured[0].direction);
                            }
                        } else {
                            var pathToInjured = creep.room.findPath(creep.pos, injured.pos, {
                                ignoreCreeps: true
                            });
                            if (pathToInjured.length > 0)
                            {
                                creep.move(pathToInjured[0].direction);
                            }

                        }

                    } else {
                        // Move to the position that is the average of
                        // the front attacking creeps
                        var frontLineCreeps = creep.room.find(Game.MY_CREEPS, { filter: utility.creepCanAttack });

                        if (frontLineCreeps && frontLineCreeps.length > 0) {
                            //if (!hostile) {
                            //    frontLineCreeps.push(spawn);
                            //}

                            var sumX = _.reduce(frontLineCreeps, utility.sumPosX, 0);
                            var sumY = _.reduce(frontLineCreeps, utility.sumPosY, 0);
                            var avgX = Math.round(sumX / frontLineCreeps.length);
                            var avgY = Math.round(sumY / frontLineCreeps.length);

                            var spotPos = creep.room.getPositionAt(avgX, avgY);
                            var spotInfo = creep.room.lookAt(spotPos);

                            spotInfo = _.filter(spotInfo, function (n) { return n.type === 'terrain' && n.terrain === 'plain' || n.terrain === 'swamp' });
                            if (spotInfo.length > 0) {
                                var asPath = creep.room.findPath(creep.pos, spotPos, {
                                    ignoreCreeps: false
                                });
                                if (asPath && asPath.length > 0) {
                                    creep.move(asPath[0].direction);
                                }
                            }
                        }
                        // make sure that we dont go beyond our limit
                        //var closestSpawn = creep.pos.findClosest(Game.MY_SPAWNS);
                        //if (closestSpawn) {
                        //    var pathToSpawn = creep.room.findPath(creep.pos, closestSpawn.pos, {
                        //        ignoreCreeps: true
                        //    });
                        //    if (pathToSpawn.length > 15) {
                        //        creep.move(pathToSpawn[0].direction);
                        //    }
                        //}
                        creep.memory.target = null;
                    }

                    break;
                }
            case STATE.MOVE_TO_TRANSFER:
                {
                    var spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (spawn) {
                        creep.moveTo(spawn);
                        if (creep.pos.inRangeTo(spawn.pos, 3)) {
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
