var doSpawn = require('doSpawn');
var roster = require('roster');
var job = require('job');
var creepLog = require('creepLog');
var helper = require('helper');
var opposition = require('opposition');

var enlisting = function(roster, quota) {

	return roster && (roster.length < quota);
};
var enlistingArchers = function() {

	return enlisting(roster.of(job.archer), job.archer.quota);
};
var enlistingBrutes = function() {

	return enlisting(roster.of(job.brute), job.brute.quota);
};

module.exports = {
	enlist: function(spawn) {

		if (enlistingArchers()) {

			return doSpawn.a(spawn, job.archer);
		}
		if (enlistingBrutes()) {

			return doSpawn.a(spawn, job.brute);
		}
	},
	enlisting: enlisting,

	attack: function(creep) {

		var asshole = opposition.closestThreat(creep);
		if (asshole) {

			creep.moveTo(asshole);

			if (creep.getActiveBodyparts(Game.ATTACK)) {

				creep.attack(asshole);
			}

			if (creep.getActiveBodyparts(Game.RANGED_ATTACK)) {

				creep.rangedAttack(asshole);
			}

			console.log(creep + ' killing ' + asshole);
		} else {

			var harvester = roster.closest(creep, job.harvester);
			if (harvester)
				creep.moveTo(harvester);
		}
	}
}