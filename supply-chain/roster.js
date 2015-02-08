var _ = require('lodash');

module.exports = {
	of: function(job) {
		var creeps = _.filter(Game.creeps, {
			memory: {
				role: job.role
			}
		});
		return creeps;
	},
	closest: function(creep, job) {
		//console.log(creep + ' pos ' + creep.pos);
		var closest = creep.pos.findClosest(Game.MY_CREEPS, {
			filter: function(obj) {
				return obj.memory && obj.memory.role === job.role;
			}
		});
		return closest;
	}
}