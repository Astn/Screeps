var roster = require('roster');
var job = require('job');
var creepLog = require('creepLog');

var doSpawn = require('doSpawn');
var doHarvest = require('doHarvest');

var helper = require('helper');

var enlisting = function() {

	var packers = roster.of(job.packer);

	return packers && (packers.length < job.packer.quota);
};

module.exports = {
	enlist: function(spawn) {

		if (!doHarvest.enlisting() && enlisting())
			return doSpawn.a(spawn, job.packer);
	},
	enlisting: enlisting,

	assist: function(creep, spawn) {

		creepLog.energy(creep);

		if (creep.energy === 0) {

			var harvester = roster.closest(creep, job.harvester);

			if (harvester && !helper.hungry(harvester)) {

				creep.moveTo(harvester);

				helper.energyToFrom(creep, harvester);
			}
		} else {

			helper.energyFromTo(creep, spawn);
		}
	}
}