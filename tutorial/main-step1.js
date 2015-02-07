
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
To set the behavior of both creeps we could just duplicate the entire script for the second one, but it's much better to use the for cycle across all the screeps in Game.creeps.
*/
for (var id in Game.creeps) {

    var creep = Game.creeps[id];

    var sources = creep.room.find(Game.SOURCES);

    harvester.transferEnergy(creep, sources[0], spawn1);
}