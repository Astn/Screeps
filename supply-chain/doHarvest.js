var doSpawn = require('doSpawn');
var roster = require('roster');
var job = require('job');
var creepLog = require('creepLog');
var helper = require('helper');

var enlisting = function() {

	var harvesters = roster.of(job.harvester);

	return harvesters && (harvesters.length < job.harvester.quota);
};

var moveToHarvest = function(creep, source) {

	creep.moveTo(source);
	creep.harvest(source);

	console.log(creep + ' harvesting');
};

var transferEnergyFrom = function(creep, spawn, source) {

	if (!creep) return;

	creepLog.energy(creep);

	if (helper.hungry(creep)) {

		moveToHarvest(creep, source);
	} else {

		var packer = roster.closest(creep, job.packer);
		if (packer) {

			creep.moveTo(packer);

			helper.energyFromTo(creep, packer);
		} else {

			helper.energyFromTo(creep, spawn);
		}
	}
};

module.exports = {

	enlist: function(spawn) {

		if (enlisting())
			return doSpawn.a(spawn, job.harvester);
	},
	enlisting: enlisting,

	moveToHarvest: moveToHarvest,

	transferEnergy: function(creep, spawn) {

		var sources = creep.room.find(Game.SOURCES),
			source = sources[0];

		var sn = creep.name.substr(job.harvester.role.length) * 1;

		if (sn * 1 % 3)
			source = sources[2];
		else if (sn % 2)
			source = sources[1];

		transferEnergyFrom(creep, spawn, source);
	},
	transferEnergyFrom: transferEnergyFrom
}