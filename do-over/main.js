var _ = require('lodash');
var log = require('log');
var jobs = require('jobs');

var spawn1 = Game.spawns.Spawn1;

Game.getUsedCpu(function(cpu) {
	if (cpu > Game.cpuLimit / 2) {
		console.log("Used half of CPU already!");
	} else {
		console.log('cpu: ' + cpu + ' limit: ' + Game.cpuLimit);
	}
});

/* ---------SPAWN ----------------*/

var need = {
	miner: 2,
	brute: 2,
	medic: 1,
	jedi: 1
};

var spawnUp = function(job, name) {

	if (spawn1 && !spawn1.spawning) {

		var result = spawn1.createCreep(
			job.body,
			name);
		if (_.isString(result)) {

			console.log(name + ' coming right up!');
		} else {

			console.log('Spawn error: ' + result);
		}
	}
}

var hasMiner = false;

for (var i in Game.creeps) {
	if (Game.creeps[i].name === 'miner1') {
		hasMiner = true;
		break;
	}
}

if (!hasMiner) {

	spawnUp(jobs.miner, 'miner1');
} else {

	for (var jerb in jobs) {

		var job = jobs[jerb];

		for (var i = 0; i < need[jerb]; i++) {

			var name = jerb + i,
				creep = Game.creeps[name];

			if (creep) {

				log.rollCall(creep);

				console.log(job);

				job.primaryDirective(creep, spawn1);
			} else {

				console.log('need a: ' + name);

				spawnUp(job, name);
			}
		}
	}
}