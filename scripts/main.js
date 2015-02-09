if (Game.time <= 0) {
	Memory.creeps = {};
	Memory.mine = {};
	Memory.map = {};
}
if (!Memory.time) {
    Memory.startTime = Game.time;
}
if (!Memory.map)
	Memory.map = {};

//console.log(parseInt(Game.time));
var _ = require('lodash');
var spawner = require('spawner');
var machine = require('machine');

Memory.reset = false;

if (!Memory.mine)
	Memory.mine = {};

var BODY = require('body');
var ROLE = require('role');
var STATE = require('state');
var PROFILE = require('profile');

spawner.profile(PROFILE);

var spawnResult = spawner.spawn();

var roomNames = [];

for (var sp in Game.spawns) {

	console.log(Game.spawns[sp].room.name);
	roomNames.push(Game.spawns[sp].room.name);
}

for (var roomName in _.uniq(roomNames)) {

	var room = Game.getRoom(roomNames[roomName]);
	if (!room)
		continue;

	var myCreeps = room.find(Game.MY_CREEPS);

	for (var i = 0; i < myCreeps.length; i++) {
		var creep = myCreeps[i];
		machine.chew(myCreeps[i]);
	}
	// find hottest pos with above average wear

	
}