var _ = require('lodash');
var roster = require('roster');
var job = require('job');
var helper = require('helper');
var opposition = require('opposition');

module.exports = {
	nextUp: function(spawn) {

		if (!spawn) return;
		if (spawn.spawning) return;

		var asshole = (spawn.hits < spawn.memory.hits);
		if (asshole) {
			if (spawnUp(spawn, job.brute))
				spawn.memory.hits = spawn.hits;
		}

		var harvesters = roster.of(job.harvester);
		console.log('harvesters: ' + harvesters);

		if (!harvesters || !harvesters.length)
			spawnUp(spawn, job.harvester);
		else {
			var medics = roster.of(job.medic);

			if (!medics || !medics.length)
				spawnUp(spawn, job.medic);
			else {

				var brutes = roster.of(job.brute);

				if (!brutes || !brutes.length)
					spawnUp(spawn, job.brute);
				else {

					var jerb = random.get_fast();
					console.log(fruits[jerb]);
					spawnUp(spawn, job[fruits[jerb]]);
				}
			}
		}
	}
}

var spawnUp = function(spawn, job) {

	if (!job) return;

	console.log('want a ' + job.role);

	if (createCreep(spawn, job)) {

		console.log(job.role + ' coming right up');

		return true;
	} else
		return false;
};

var createCreep = function(spawn, job) {

	if (!spawn) return;
	if (spawn.spawning) return;

	var dudes = roster.of(job),
		index = (dudes ? dudes.length : 0) + 1,
		creepid = job.role,
		result;

	do {
		creepid += '' + index;

		result = spawn.createCreep(
			job.body,
			creepid, {
				role: job.role
			}
		);
	} while (result === -3);

	if (_.isString(result)) {
		console.log('Spawned: ' + result);

		return result;
	}

	if (result === -6) {
		console.log('no can do');
	} else if (result === -3) {
		console.log(creepid + ' invalid');
	} else
		console.log('Spawn error: ' + result);

	return null;
};
/*
var random = function() {
		var fruits = Array();
		var fruitweight = Array() //weight of each element above

		for (var jerb in job) {
			fruits.push(job[jerb].role);
			fruitweight.push(job[jerb].weight);
		}

		var fruitweight_norm = new Array() //normalized weights
		var currentfruit = 0

		var sum = 0;
		for (i = 0; i < fruits.length; i++) {
			sum += fruitweight[i];
			fruitweight_norm[i] = sum;
		}

		for (i = 0; i < fruits.length; i++) {
			fruitweight_norm[i] = fruitweight_norm[i] / sum;
		}

		var get_fast = function() {
			needle = Math.random();
			high = fruitweight_norm.length - 1;
			low = 0;

			while (low < high) {
				probe = Math.ceil((high + low) / 2);

				if (fruitweight_norm[probe] < needle) {
					low = probe + 1;
				} else if (fruitweight_norm[probe] > needle) {
					high = probe - 1;
				} else {
					return probe;
				}
			}

			if (low != high) {
				return (fruitweight_norm[low] >= needle) ? low : probe;
			} else {
				return (fruitweight_norm[low] >= needle) ? low : low + 1;
			}

			return {
				fruits: fruits,
				fruitweight: fruitweight,
				get_fast: get_fast
			}
		};
		*/