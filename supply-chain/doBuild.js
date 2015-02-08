var roster = require('roster');
var job = require('job');

var doSpawn = require('doSpawn');
var doPack = require('doPack');

var enlisting = function() {

	var builders = roster.of(job.builder);

	return builders && (builders.length < job.builder.quota);
};

module.exports = {
	enlist: function(spawn) {

		if (!doPack.enlisting()) {

			if (enlisting()) {
				
				return doSpawn.a(spawn, job.builder);
			}
		}
	},
	enlisting: enlisting,

	do: function(creep, spawn) {

		if (creep.energy === 0) {

			helper.energyToFrom(creep, spawn);
		} else {

			var targets = creep.room.find(Game.CONSTRUCTION_SITES);
			if (targets && targets.length) {

				var target = targets[0];

				creep.moveTo(target);
				creep.build(target);

				var toString = target.toString(),
					indexOf = toString.indexOf('#'),
					siteName = toString.substr(0, indexOf).trim() + ']';

				console.log(creep + ' building ' + siteName);
			}
		}
	}
}