var _ = require('lodash');
var roster = require('roster');
var helper = require('helper');

module.exports = {
	a: function(spawn, job) {

		if (!spawn) return;

		var dudes = roster.of(job),
			index = (dudes ? dudes.length : 0) + 1;

		var result = spawn.createCreep(
			job.body,
			job.role + index, {
				role: job.role
			}
		);

		if (_.isString(result)) {
			console.log('Spawned: ' + result);

			return result;
		}

		if (result === -6) {

			console.log('shiiiiiit');
		} else
			console.log('Spawn error: ' + result);

		return null;
	}
}