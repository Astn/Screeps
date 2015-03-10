/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner'); // -> 'a thing'
 */
var ROLE = require('role');
var utility = require('utility');
var _ = require('lodash');
module.exports =
{
    remember: function (creep, state, role) {
        if (!creep.memory) {
            creep.memory = {
                state: state,
                role: role
            };
        } else {
            creep.memory.state = state;
        }
    },
    _settings: [],
    profile: function (settings) {
        this._settings = settings;
    },
    spawn: function () {
        var result = [];

        var duration = 0;
        if (Memory.startTime) {
            duration = Game.time - Memory.startTime;
        }
        for (var s in Game.spawns) {

            var spawn = Game.spawns[s];
            if (spawn.spawning === null && spawn.energy > 200) {

                // find the settings that are for a population more then, but closest to what we have.
                var weHave = spawn.room.find(Game.MY_CREEPS).length;
                var weHaveMiners = spawn.room.find(Game.MY_CREEPS, { filter: utility.creepIsMiner }).length > 0;
                var weHavePackers = spawn.room.find(Game.MY_CREEPS, { filter: utility.creepIsPacker }).length > 0;
                if (weHavePackers && weHaveMiners && spawn.energy < 50) {
                    continue;
                }

                // specify our first profile to have a miner and
                // enough packers to get to the spawner
                var source = spawn.pos.findClosest(Game.SOURCES);
                if (!source)
                    return;
                var pathToNearest = spawn.room.findPath(spawn.pos, source.pos, { ignoreCreeps: true });
                var basic = createBasicProfile(pathToNearest.length);


                var closestDiff = 0;
                var closestSettingsPop = null;
                var toughScale = 0;
                var closestSettings = null;
                var settingTime = 0;
                var pickOne = function (setting) {
                    if (!closestSettingsPop || closestSettingsPop && closestSettingsPop.population <= weHave) {

                        closestSettingsPop = setting;
                        closestSettings = setting.profile;
                        toughScale = setting.toughness;
                        settingTime = setting.time;
                        closestDiff = closestSettingsPop.population - weHave;
                    }
                };
                if (weHave < basic.population) {
                    pickOne(basic);
                }
                else {
                    this._settings.forEach(pickOne);
                }

                if (duration > 0 && settingTime > 0) {
                    if (settingTime > duration) {
                        console.log("too soon.. " + parseInt(settingTime) + " > " + parseInt(duration));
                        return; // its too early to use these.
                    }
                }
                // TODO: before the sort will work we need to collect the number of creeps we have in each state
                // so check creep.memory.role and accumulate it to update how many we have.

                if (closestSettings) {

                    closestSettings.forEach(function (x) {

                        x.HAVE = spawn.room.find(Game.MY_CREEPS, {
                            filter: function (f) {
                                return f.memory.role === x.ROLE;
                            }
                        }).length;

                        x.TOTAL = spawn.room.find(Game.MY_CREEPS).length;
                        x.RATIO = x.HAVE / x.TOTAL;
                        x.TARGET = x.WANT / (closestSettings.reduce(function (a, b) {
                            return a + b.WANT;
                        }, 0));
                    });
                }
                // alternativly we could store state in our spawns and collect that.

                var onesWeWant = _.filter(closestSettings, function (n) { return n.WANT - n.HAVE > 0; });
                var orderByRatio = _.sortBy(onesWeWant, function (n) { return n.HAVE / n.WANT; });
                var thenByPriority = _.sortBy(orderByRatio, function (n) { return n.PRIORITY; });

                var current = thenByPriority[0];

                console.log(onesWeWant);


                if (current && current.BODY) {
                    for (var i = 0; i < current.BODY.length; i++) {
                        var extAvail = _.filter(Game.structures, function (n) { return n.structureType === Game.STRUCTURE_EXTENSION && n.energy === n.energyCapacity; }).length;


                        var parts = current.BODY[i].parts.slice(0);
                        var toughScaleMod = 1;
                        if (_.some(parts, function (f) { return f === Game.RANGED_ATTACK; })) {
                            toughScaleMod = 4;
                        }
                        if (_.some(parts, function (f) { return f === Game.ATTACK || f === Game.RANGED_ATTACK; })) {
                            var toughness = [];
                            for (var j = 0; j < toughScale / toughScaleMod; j++) {
                                toughness.push(Game.TOUGH);
                            }
                            for (var k = 0; k < extAvail; k++) {
                                parts.push(Game.ATTACK);
                            }
                            parts = toughness.concat(parts);
                        }

                        var id = 1;
                        var name = current.ROLE + ' ' + parseInt(spawn.room.find(Game.CREEPS).length);
                        var buildCode = spawn.createCreep(parts, name, { state: current.STATE, role: current.ROLE });
                        var tries = 2;
                        while (buildCode === -3 && --tries > 0) {

                            spawn.createCreep(parts, current.ROLE + ' ' + parseInt(++id), { state: current.STATE, role: current.ROLE });
                        }

                        if (buildCode >= 0) {
                            result.push({
                                body: current.BODY,
                                code: buildCode,
                                have: current.HAVE,
                                role: current.ROLE
                            });
                            break;
                        }
                    }
                }
            }
        }
        return result;
    }
};
