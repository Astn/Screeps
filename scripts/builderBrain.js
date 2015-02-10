/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('minerBrain'); // -> 'a thing'
 */
var STATE = require('state');
var ROLE = require('role');
module.exports = {
    bestSiteOrSpawn: function (someCreep) {
        var place = someCreep.pos.findClosest(Game.CONSTRUCTION_SITES, { filter: function (item) { return item.progress > 0 } });
        if (!place)
            place = someCreep.pos.findClosest(Game.CONSTRUCTION_SITES);
        if (!place)
            place = someCreep.pos.findClosest(Game.MY_SPAWNS);
        return place;
    },
    bucketBrigade: function (creep) {
        var place = creep.pos.findClosest(Game.CONSTRUCTION_SITES, { filter: function (item) { return item.progress > 0 } });
        if (!place)
            place = creep.pos.findClosest(Game.CONSTRUCTION_SITES);
        if (!place)
            place = creep.pos.findClosest(Game.MY_SPAWNS);
        var bestAsICanTell = place;
        if (bestAsICanTell) {
            var myPath = creep.pos.findPathTo(bestAsICanTell);
            myPathLength = myPath.length;
            // find nearest carrier who is less then full, and is closer to spawner
            var buddyCloserToASiteOrSpawn = creep.pos.findClosest(Game.MY_CREEPS, {
                filter: function (c) {
                    return c.getActiveBodyparts(Game.CARRY) > 0 && (c.memory.role == creep.memory.role || c.memory.role == ROLE.WORKER);
                }
            });
            if (buddyCloserToASiteOrSpawn) {
                var hisBestSiteOrSpawn = buddyCloserToASiteOrSpawn.pos.findPathTo(bestAsICanTell);
                if (hisBestSiteOrSpawn.length >= this.lengthLimit) {
                }
                // if we are close enough to pass energy

                if (creep.pos.isNearTo(buddyCloserToASiteOrSpawn)) {
                    creep.transferEnergy(buddyCloserToASiteOrSpawn);
                    buddyCloserToASiteOrSpawn.memory.state = STATE.HARVESTING;
                }
                else {
                    // move closer
                    creep.moveTo(buddyCloserToASiteOrSpawn);
                }
                return true;
            }
        }
        return false;
    },
    think: function (creep) {
        var site;
        var spawn;
        var source;
        switch (creep.memory.state) {
            case STATE.NONE: {
                console.log('Valid state:' + creep.name + ':' + creep.memory.state);

                creep.memory.target = null;
                if (!Memory.drops)
                    Memory.drops = [];

                // refresh energy numbers
                var best = creep.pos.findClosest(Game.DROPPED_ENERGY, {
                    filter: function (drop) {
                        return drop.energy >= creep.energyCapacity;
                    }
                });

                if (!best) {
                    best = creep.pos.findClosest(Game.DROPPED_ENERGY);
                }

                if (best) {

                    console.log("best " + best.id + " energy: " + parseInt(best.energy));
                    // reserve some energy and set target
                    creep.memory.target = best.id;
                    creep.memory.state = STATE.MOVE_TO_HARVEST;

                }
                else {
                    // bucket
                    var passTheBucket = creep.pos.findClosest(Game.MY_CREEPS, {
                        filter: function (f) {
                            return f.energy > 0;
                        }
                    });
                    if (passTheBucket) {
                        creep.memory.target = passTheBucket.id;
                        creep.memory.state = STATE.MOVE_TO_HARVEST;
                    }
                }
                break;
            }
            case STATE.MOVE_TO_HARVEST: {

                if (!creep.memory.target) {
                    creep.memory.state = STATE.NONE;
                    break;
                }
                source = Game.getObjectById(creep.memory.target);
                if (source) {

                    var moveResult = creep.moveTo(source);
                    if (moveResult == Game.ERR_NO_PATH) {
                        creep.memory.state = STATE.NONE;
                    }
                    if (creep.pos.inRangeTo(source.pos, 1)) {
                        creep.memory.state = STATE.HARVESTING;
                    }

                    var hostile = creep.pos.findClosest(Game.HOSTILE_CREEPS);
                    if (hostile && creep.pos.inRangeTo(hostile.pos, 4)) {
                        var closestSpawn = creep.pos.findClosest(Game.MY_SPAWNS);
                        if (closestSpawn) {
                            creep.moveTo(closestSpawn);
                        }
                    }
                }
                else {
                    creep.memory.state = STATE.NONE;
                }
                break;
            }
            case STATE.HARVESTING: {
                source = creep.pos.findClosest(Game.DROPPED_ENERGY);
                if (source) {

                    creep.pickup(source);
                    // unreserve energy

                    // check if there is more close energy and grab it
                    var drop = creep.pos.findClosest(Game.DROPPED_ENERGY);
                    if (creep.pos.inRangeTo(drop, 1) && creep.energy < creep.energyCapacity) {
                        creep.memory.target = drop.id;
                        creep.pickup(drop);
                    }
                    else if (creep.pos.inRangeTo(drop, 3) && creep.energy < creep.energyCapacity) {
                        creep.memory.target = drop.id;
                        creep.moveTo(drop);
                    }
                    else {
                        this.bucketBrigade(creep);

                        creep.memory.state = STATE.MOVE_TO_TRANSFER;
                    }
                }
                break;
            }
            case STATE.MOVE_TO_TRANSFER: {



                if (this.bucketBrigade(creep)) {
                    if (creep.energy === 0) {
                        creep.memory.state = STATE.NONE;
                        this.think(creep);
                        break;
                    }
                }


                site = creep.pos.findClosest(Game.CONSTRUCTION_SITES, { filter: function (item) { return item.progress > 0 } });
                if (!site)
                    site = creep.pos.findClosest(Game.CONSTRUCTION_SITES);
                if (creep.getActiveBodyparts(Game.WORK) && site) {
                    creep.moveTo(site);
                    if (creep.pos.inRangeTo(site.pos, 1)) {
                        creep.memory.state = STATE.TRANSFERING;
                        this.think(creep);
                        break;
                    }
                }
                else {
                    spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (spawn) {
                        creep.moveTo(spawn);
                        if (creep.pos.inRangeTo(spawn.pos, 1)) {
                            creep.memory.state = STATE.TRANSFERING;
                            this.think(creep);
                            break;
                        }
                    }
                }
                break;
            }
            case STATE.TRANSFERING: {
                site = creep.pos.findClosest(Game.CONSTRUCTION_SITES, { filter: function (item) { return item.progress > 0 } });
                if (!site) {
                    site = creep.pos.findClosest(Game.CONSTRUCTION_SITES);
                }
                var repair = creep.pos.findClosest(Game.MY_STRUCTURES, {
                    filter: function (item) {
                        return item.hits < item.hitsMax;
                    }
                });

                if (creep.getActiveBodyparts(Game.WORK) > 0 && (site || repair)) {
                    if (site) {
                        console.log("building");
                        var result = creep.build(site);
                        if (result == Game.ERR_NOT_IN_RANGE) {
                            creep.moveTo(site);
                        }
                        if (result == Game.ERR_INVALID_TARGET) {
                            spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                            creep.moveTo(spawn);
                        }
                    }
                    else {
                        console.log("repairing");
                        creep.moveTo(repair);
                        creep.repair(repair);
                    }

                    if (creep.energy === 0) {
                        creep.memory.state = STATE.NONE;
                        this.think(creep);
                        break;
                    }
                    else {
                        break;
                    }
                }
                else {
                    spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (spawn) {
                        creep.transferEnergy(spawn, creep.energy);
                        {
                            creep.memory.state = STATE.NONE;
                            this.think(creep);
                            break;
                        }
                    }
                }
                break;
            }
            default: {
                console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
                creep.memory.state = STATE.NONE;
            }
        }
    }
}
