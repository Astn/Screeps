
var harvester = require('harvester'); 

var spawn1 = Game.spawns.Spawn1;

spawn1.createCreep(
	[Game.WORK, Game.CARRY, Game.MOVE],
	'Worker1'
); 

/*
Spawn a second creep with the body WORK,CARRY,MOVE and name Worker2.
*/
Game.spawns.Spawn1.createCreep(
	[Game.WORK, Game.CARRY, Game.MOVE],
	'Worker2'
);

/*
Spawn a creep with the body WORK,WORK,WORK,CARRY,MOVE and a name Builder1.
*/
Game.spawns.Spawn1.createCreep(
	[Game.WORK, Game.WORK, Game.WORK, Game.CARRY, Game.MOVE],
	'Builder1'
);

/*
Spawn another to help his buddy
*/
Game.spawns.Spawn1.createCreep(
	[Game.WORK, Game.WORK, Game.WORK, Game.CARRY, Game.MOVE],
	'Builder2'
); 

/*
Creep Builder1 went to harvest energy too, but we don't want it to. We need to differentiate creep roles.

To do that, we need to utilize the memory property of each creep that allows writing custom information into the creep's "memory". Let's do this to assign different roles to our creeps.

All your stored memory is accessible via global Memory object. You can use it any way you like.

Write a property role='harvester' into the memory of worker creeps and role='builder' — to the builder creep with the help of the console.
*/
Memory.creeps.Worker1.role = 'harvester';
Memory.creeps.Worker2.role = 'harvester';
Memory.creeps.Builder1.role = 'builder';
Memory.creeps.Builder2.role = 'builder';

/*
Did you notice how slow your creeps moved when transferring energy? Let's make their work easier and build a road to the energy source. A creep tires 2 times slower when moves by the road.

We have already outlined the plan of your future road. What is left for you is just distinguish the roles of your creeps by the property memory.role and make the builder creep use the method build() on all squares of the road. You can find them with the help of the method Room.find(Game.CONSTRUCTION_SITES).
*/

for (var id in Game.creeps) {

	var creep = Game.creeps[id];

	if (id === 'killme') {
		creep.suicide();
	}
	
	if (creep.memory.role == 'harvester') {

		var sources = creep.room.find(Game.SOURCES);

		harvester.transferEnergy(creep, sources[0], spawn1);
	}

	if (creep.memory.role == 'builder') {

		if (creep.energy === 0) {

			creep.moveTo(spawn1);

			spawn1.transferEnergy(creep);

			console.log(creep + ' transferring energy from ' + spawn1);
		}
		else {

			var targets = creep.room.find(Game.CONSTRUCTION_SITES);
			if (targets.length) {

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