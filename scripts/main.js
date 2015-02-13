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


var hostileInterceptionPoint = function (pos, room) {
        var exits = room.find(Game.EXIT_TOP)
    }



var spawnResult = spawner.spawn();

for (var roomName in Game.rooms) {
    
    var room = Game.getRoom(roomName);
    if (!room)
        continue;
    
    var myCreeps = room.find(Game.MY_CREEPS);
  
    for (var i = 0; i < myCreeps.length; i++) {
        machine.chew(myCreeps[i]);
    }

    // override moves based on memory set
    var creepsWithMemoryMoves = _.filter(myCreeps, function (n) { return n.memory.move });
    for (var i = 0; i < creepsWithMemoryMoves.length; i++) {
        creepsWithMemoryMoves[i].move(creepsWithMemoryMoves[i].memory.move);
        creepsWithMemoryMoves[i].memory.move = null;
       // creepsWithMemoryMoves[i].say('swapping..');
    }
}