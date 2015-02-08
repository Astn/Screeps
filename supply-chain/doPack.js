var roster = require('roster');
var job = require('job');
var creepLog = require('creepLog');

var doSpawn = require('doSpawn');
var doHarvest = require('doHarvest');

var helper = require('helper');

module.exports = {

	assist: function(creep, spawn) {

		creepLog.energy(creep);

		if (creep.energy === 0) {

			var harvester = roster.closest(creep, job.harvester);

			if (harvester && !helper.hungry(harvester)) {

				creep.moveTo(harvester);

				helper.energyToFrom(creep, harvester);
			}
		} else {

			var target = creep.pos.findClosest(Game.DROPPED_ENERGY);
			if (target) {

				creep.moveTo(target);
				creep.pickup(target);
				
				helper.energyFromTo(creep, spawn);
			} else
				helper.energyFromTo(creep, spawn);
		}
	}
}