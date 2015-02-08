var roster = require('roster');
var job = require('job');
var helper = require('helper');

var doSpawn = require('doSpawn');
var doPack = require('doPack');

module.exports = {

	pave: function(creep, spawn) {

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
			} else {
				console.log('do something');
				creep.moveTo(spawn);
				creep.build(Game.STRUCTURE_ROAD);
			}
		}
	}
}