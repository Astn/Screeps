
var spawner =  require('spawner');
var machine = require('machine');

Memory.reset = false;

if(!Memory.mine)
    Memory.mine = {};

var BODY = require('body');
var ROLE = require('role');
var STATE = require('state');
var PROFILE = require('profile');


spawner.profile(PROFILE);

var spawnResult = spawner.spawn();

var myCreeps = Game.spawns.Spawn1.room.find(Game.MY_CREEPS);
for (var i = 0; i < myCreeps.length; i++) {
    machine.chew(myCreeps[i]);
}

