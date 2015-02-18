var _ = require('lodash');
var spawner = require('spawner');
var machine = require('machine');
var utility = require('utility');
var creepCt = 0;
for (var c in Game.creeps) {
    creepCt++;
}
for (var s in Game.spawns) {
    var spawn = Game.spawns[s];
    if (
        creepCt === 0
        && spawn.energy === 1000
        ) {
        Memory.startTime = Game.time;
        console.log('starting...');
    }
}
if (Game.time <= 0) {
    Memory.creeps = {};
    Memory.mine = {};
    Memory.map = {};
}
if (!Memory.map)
    Memory.map = {};

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
    if (!Memory[roomName]) {
        Memory[roomName] = {};
    }
    Memory[roomName].formation = [];
    var room = Game.getRoom(roomName);
    if (!room)
        continue;
    
    var myCreeps = room.find(Game.MY_CREEPS);
    var foundHostile = null;

    // add spots for ranged creeps in the formation
    if (Math.random() * 100 > 95) {
        var attackCreeps = _.filter(myCreeps, function (n) { return _.some(n.body, function (part) { return part.type === Game.ATTACK; }); });
        for (var i = 0; i < attackCreeps.length; i++) {
            var attackBrute = attackCreeps[i];
            // see if the spotbehind him is open
            var posBehindBuddy = utility.posBehindCreep(attackBrute);
            //console.log('pushing position x:' + parseInt(posBehindBuddy.x) +' y:' + parseInt(posBehindBuddy.y));
            var atThatSpot = attackBrute.room.lookAt(posBehindBuddy.x, posBehindBuddy.y);
            var isACreepThere = _.some(atThatSpot, function (n) { return n.type === 'creep' });
            if (!isACreepThere) {
                // send a ranged guy there.
               
                Memory[roomName].formation.push({
                    x: posBehindBuddy.x,
                    y: posBehindBuddy.y,
                    role: ROLE.ARCHER
                });
            }
        }
    }

    for (var i = 0; i < myCreeps.length; i++) {
        foundHostile = machine.chew(myCreeps[i], foundHostile);
    }

    // override moves based on memory set
    var creepsWithMemoryMoves = _.filter(myCreeps, function (n) { return n.memory.move });
    for (var i = 0; i < creepsWithMemoryMoves.length; i++) {
        //creepsWithMemoryMoves[i].say('swapping..');
        creepsWithMemoryMoves[i].move(creepsWithMemoryMoves[i].memory.move);
        creepsWithMemoryMoves[i].memory.move = null;
    }
}