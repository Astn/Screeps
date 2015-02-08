var _ = require('lodash');

module.exports = {
	of: function(job) {

		var creeps = Array();
		for (var creep in Game.creeps) {

			console.log('this creep: ' + creep + ' job role: ' + job.role);

			if (creep.memory) {
				console.log('this creep: ' + creep + ' mem role: ' + creep.memory.role);

				if (creep.memory.role == job.role)
					creeps.push(creep);
			}
			/*var creeps = _.filter(Game.MY_CREEPS, function(obj) {
				return memory.role == job.role;
			});*/
			return creeps;
		}
	},
	ofName: function(job, name) {
		var creeps = _.filter(Game.MY_CREEPS, {
			memory: {
				role: job.role
			},
			name: name
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