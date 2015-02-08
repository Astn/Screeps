var job = require('job');
var roster = require('roster');

var doHarvest = require('doHarvest');
var doPack = require('doPack');
var doBuild = require('doBuild');
var doKill = require('doKill');

var spawn1 = Game.spawns.Spawn1; 

doHarvest.enlist(spawn1);

doKill.enlist(spawn1);

doPack.enlist(spawn1);

doBuild.enlist(spawn1);

/*
Did you notice how slow your creeps moved when transferring energy? Let's make their work easier and build a road to the energy source. A creep tires 2 times slower when moves by the road.

We have already outlined the plan of your future road. What is left for you is just distinguish the roles of your creeps by the property memory.role and make the builder creep use the method build() on all squares of the road. You can find them with the help of the method Room.find(Game.CONSTRUCTION_SITES).
*/

for (var id in Game.creeps) {

	var creep = Game.creeps[id];

	if (creep.memory.state) console.log(creep.memory.state);

	if (creep.memory.role == job.harvester.role) {

		doHarvest.transferEnergy(creep, spawn1);
	}

	if (creep.memory.role == job.packer.role) {

		doPack.assist(creep, spawn1);
	}

	if (creep.memory.role == job.archer.role) {

		doKill.attack(creep);
	}

	if (creep.memory.role == job.brute.role) {

		doKill.attack(creep);
	}

	if (creep.memory.role == job.builder.role) {

		doBuild.do(creep, spawn1);
	}
}