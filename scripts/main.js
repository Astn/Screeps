function remember(creep, state, role) {
    if (!creep.memory) {
        creep.memory = {
            state: state,
            role: role
        };
    }
    else {
        creep.memory.state = state;
    }
}


var spawner = require('spawner');
var machine = require('machine');
var STATE = require('state');
var ROLE = require('role');
var BODY = require('body');

spawner.profile(
    [
        {
            ROLE: ROLE.CAPTIAN,
            STATE: STATE.SPAWNING,
            BODY: BODY.CAPTIAN,
            WANT: 1,
            HAVE: 0
        },
        {
            ROLE: ROLE.BRUTE,
            STATE: STATE.SPAWNING,
            BODY: BODY.BRUTE,
            WANT: 3,
            HAVE: 0
        },
        {
            ROLE: ROLE.ARCHER,
            STATE: STATE.SPAWNING,
            BODY: BODY.ARCHER,
            WANT: 2,
            HAVE: 0
        },
        {
            ROLE: ROLE.MINER,
            STATE: STATE.SPAWNING,
            BODY: BODY.MINER,
            WANT: 5,
            HAVE: 0
        },
        {
            ROLE: ROLE.BUILDER,
            STATE: STATE.SPAWNING,
            BODY: BODY.BUILDER,
            WANT: 1,
            HAVE: 0,
        },
        {
            ROLE: ROLE.MEDIC,
            STATE: STATE.SPAWNING,
            BODY: BODY.MEDIC,
            WANT: 1,
            HAVE: 0
        }
    ]);

var spawnResult = spawner.spawn();

var myCreeps = Game.spawns.Spawn1.room.find(Game.MY_CREEPS);
for (var i = 0; i < myCreeps.length; i++) {
    machine.chew(myCreeps[i]);
}

