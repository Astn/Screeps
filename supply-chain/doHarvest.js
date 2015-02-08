var doSpawn = require('doSpawn');
var roster = require('roster');
var job = require('job');
var creepLog = require('creepLog');
var helper = require('helper');

var moveToHarvest = function(creep, source) {

	if (!source) {

		if (!creep.memory.source) {
			source = creep.pos.findClosest(Game.SOURCES_ACTIVE, {
				filter: function(obj) {
					return obj.energy > obj.energyCapacity * .75;
				}
			});
		}

		if (!source)
			source = creep.pos.findClosest(Game.SOURCES_ACTIVE);

		creep.memory.source = source;
	}

	if (!source) return;

	creep.moveTo(source);
	creep.harvest(source);

	console.log(creep + ' harvesting');
};

module.exports = {

	moveToHarvest: moveToHarvest,

	transferEnergy: function(creep, spawn) {

		if (!creep) return;

		creepLog.energy(creep);

		if (helper.hungry(creep)) {

			moveToHarvest(creep);
		} else {

			var packer = roster.closest(creep, job.packer);
			if (packer) {

				creep.moveTo(packer);

				helper.energyFromTo(creep, packer);
			} else {

				helper.energyFromTo(creep, spawn);

				creep.memory.source = null;
			}
		}
	}
}