/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('minerBrain'); // -> 'a thing'
 */
var STATE = require('state');
var ROLE = require('role');
var utility = require('utility');
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
            // find nearest carrier who is less then full, and is closer to spawner
            var buddyCloserToASiteOrSpawn = creep.pos.findClosest(Game.MY_CREEPS, {
                filter: function (c) {
                    return c.getActiveBodyparts(Game.CARRY) > 0 && (c.memory.role === creep.memory.role || c.memory.role === ROLE.WORKER);
                }
            });
            if (buddyCloserToASiteOrSpawn) {
                var hisBestSiteOrSpawn = buddyCloserToASiteOrSpawn.pos.findPathTo(bestAsICanTell);
                if (hisBestSiteOrSpawn.length >= this.lengthLimit) {
                }
                // if we are close enough to pass energy

                if (creep.pos.isNearTo(buddyCloserToASiteOrSpawn)) {
                    creep.transferEnergy(buddyCloserToASiteOrSpawn);
                    if (buddyCloserToASiteOrSpawn.memory) {
                        buddyCloserToASiteOrSpawn.memory.state = STATE.HARVESTING;
                    }
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
        if (creep.pos.findInRange(Game.HOSTILE_CREEPS, 4).length > 0) {
            var closestSpawn = creep.pos.findClosest(Game.MY_SPAWNS);
            if (closestSpawn) {
                creep.moveTo(closestSpawn);
                creep.memory.state = STATE.NONE;
                return
            }
        }
        switch (creep.memory.state) {
            case STATE.NONE: {

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
                    // make a random move.
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
                    if (moveResult === Game.ERR_NO_PATH) {
                        creep.memory.state = STATE.NONE;
                    }
                    if (creep.pos.inRangeTo(source.pos, 1)) {
                        creep.memory.state = STATE.HARVESTING;
                    }


                }
                else {
                    creep.memory.state = STATE.NONE;
                }
                break;
            }
            case STATE.HARVESTING: {
                source = creep.pos.findClosest(Game.DROPPED_ENERGY, { filter: function (n) { return n.energy > creep.energy; } });
                if (!source) {
                    source = creep.pos.findClosest(Game.DROPPED_ENERGY, { filter: function (n) { return n.energy > creep.energy *.5; } });
                }
                if (!source) {
                    source = creep.pos.findClosest(Game.DROPPED_ENERGY, { filter: function (n) { return n.energy > creep.energy * .25; } });
                }
                if (!source) {
                    source = creep.pos.findClosest(Game.DROPPED_ENERGY);
                }
                if (source) {

                    creep.pickup(source);
                    // unreserve energy

                    // check if there is more close energy and grab it
                    var drop = creep.pos.findClosest(Game.DROPPED_ENERGY);
                    if (creep.pos.inRangeTo(drop, 1) && creep.energy < creep.energyCapacity) {
                        creep.memory.target = drop.id;
                        creep.pickup(drop);
                        creep.move(Math.round(Math.random() * 8));
                    }
                    else if (creep.pos.inRangeTo(drop, 3) && creep.energy < creep.energyCapacity) {
                        creep.memory.target = drop.id;
                        creep.moveTo(drop);
                    }
                    else {
                        //this.bucketBrigade(creep);

                        creep.memory.state = STATE.MOVE_TO_TRANSFER;
                    }
                }
                break;
            }
            case STATE.MOVE_TO_TRANSFER: {



                //if (this.bucketBrigade(creep)) {
                //    if (creep.energy === 0) {
                //        creep.memory.state = STATE.NONE;
                //        this.think(creep);
                //        break;
                //    }
                //}


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
                    var ext = creep.pos.findClosest(Game.MY_STRUCTURES, {
                        filter: function (n) {
                            return n.structureType === Game.STRUCTURE_EXTENSION && n.energy < n.energyCapacity;
                        }
                    });
                    if (ext) {
                        creep.moveTo(ext);
                        if (creep.pos.inRangeTo(ext.pos, 1)) {
                            creep.memory.state = STATE.TRANSFERING;
                            this.think(creep);
                            break;
                        }
                    }
                    else {
                        //creep.say('nope');
                        spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                        if (spawn) {
                            var direction = utility.directionToNearestSpawn(creep);
                            if(direction){
                              creep.say(direction);
                              creep.move(direction);
                            }
                            else{
                              creep.moveTo(spawn);
                            }

                            if (creep.pos.inRangeTo(spawn.pos, 1)) {
                                creep.memory.state = STATE.TRANSFERING;
                                this.think(creep);
                                break;
                            }
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
                //var repair = creep.pos.findClosest(Game.MY_STRUCTURES, {
                //    filter: function (item) {
                //        return item.hits < item.hitsMax;
                //    }
                //});

                if (creep.getActiveBodyparts(Game.WORK) > 0 && (site )) {//(site || repair)) {
                    if (site) {
                        var result = creep.build(site);
                        if (result === Game.ERR_NOT_IN_RANGE) {
                            creep.moveTo(site);
                        }
                        if (result === Game.ERR_INVALID_TARGET) {
                            spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                            creep.moveTo(spawn);
                        }
                    }
                    //else {
                    //    creep.moveTo(repair);
                    //    creep.repair(repair);
                    //}

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
                    var ext = creep.pos.findClosest(Game.MY_STRUCTURES, { filter: function (n) { return n.structureType === Game.STRUCTURE_EXTENSION && n.energy < n.energyCapacity; } });
                    if (ext) {
                        creep.transferEnergy(ext);
                        if (creep.energy === 0) {
                            creep.memory.state = STATE.NONE;
                            this.think(creep);

                        }
                        break;
                    }
                    spawn = creep.pos.findClosest(Game.MY_SPAWNS);
                    if (spawn) {
                        creep.transferEnergy(spawn, creep.energy);
                        creep.memory.state = STATE.NONE;
                        this.think(creep);
                        break;
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
