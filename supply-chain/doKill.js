var doSpawn = require('doSpawn');
var roster = require('roster');
var job = require('job');
var creepLog = require('creepLog');
var helper = require('helper');
var opposition = require('opposition');

module.exports = {

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