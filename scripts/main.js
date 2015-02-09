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
var linearDistance = function (pos1, pos2) {
    var x = pos1.x - pos2.x;
    var y = pos1.y - pos2.y;
    return Math.sqrt(x * x + y * y);
};
var spawnResult = spawner.spawn();

for (var sp in Game.spawns) {
    var spawn = Game.spawns[sp];
    Memory[spawn.room.name] = {};
    Memory[spawn.room.name].closestHostile = null;
    
    var somewhatClose = spawn.pos.findInRange(Game.HOSTILE_CREEPS, 40);
    if (somewhatClose && somewhatClose.length > 0) {
        var distances = _.map(somewhatClose, function (n) {
            var dist = linearDistance(n.pos, spawn.pos);
            var myResult = { hostile: n.id, distance: dist };
            return myResult;
        });
        var min = _.sortBy(distances, function (n) { n.distance });
        if (min && min.length > 0) {
            Memory[spawn.room.name].closestHostile = min[0].hostile;
        }
    }
}

for (var roomName in Game.rooms) {
    
    var room = Game.getRoom(roomName);
    if (!room)
        continue;
    
    var myCreeps = room.find(Game.MY_CREEPS);
    
    for (var i = 0; i < myCreeps.length; i++) {
        var creep = myCreeps[i];
        machine.chew(myCreeps[i]);
    }
	// find hottest pos with above average wear

	
}