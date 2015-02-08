var doSpawn = require('doSpawn');
var roster = require('roster');
var job = require('job');
var creepLog = require('creepLog');
var helper = require('helper');
var opposition = require('opposition');

var enlisting = function() {

	var brutes = roster.of(job.brute);

	return brutes && (brutes.length < job.brute.quota);
};

module.exports = {
	enlist: function(spawn) {

		if (enlisting())
			return doSpawn.a(spawn, job.brute);
	},
	enlisting: enlisting,

	attack: function(creep) {

		var asshole = opposition.closestThreat(creep);
		if (asshole) {

			creep.moveTo(asshole);

			creep.attack(asshole);

			console.log(creep + ' killing ' + asshole);
		} else {

			var harvester = roster.closest(creep, job.harvester);
			if (harvester)
				creep.moveTo(harvester);
		}
	}
}