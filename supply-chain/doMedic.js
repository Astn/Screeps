var doSpawn = require('doSpawn');
var roster = require('roster');
var job = require('job');
var creepLog = require('creepLog');
var helper = require('helper');

var closestGimp = function(creep) {

	if (!creep) return;
	var closest = creep.pos.findClosest(Game.MY_CREEPS, {
		filter: function(obj) {

			return obj.hits < obj.hitsMax;
		}
	});
	return closest;
};

module.exports = {

	healGimpiest: function(creep) {

		//var nogood;
		//while (!Game.OK){ closestGimp(!in nogood)}
		var gimp = closestGimp(creep);
		if (gimp) {

			creep.moveTo(gimp);
			creep.heal(gimp);
		}
	}
}