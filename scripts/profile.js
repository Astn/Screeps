/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('profile'); // -> 'a thing'
 */

var BODY = require('body');
var ROLE = require('role');
var STATE = require('state');

module.exports = [

    {
        "time": 40,
        "toughness": 2,
        "population": 2,
        "profile": [
            {
                PRIORITY: 3,
                ROLE: ROLE.BRUTE,
                STATE: STATE.SPAWNING,
                BODY: BODY.BRUTE,
                WANT: 0,
                HAVE: 0
            },
            {
                PRIORITY: 1,
                ROLE: ROLE.ARCHER,
                STATE: STATE.SPAWNING,
                BODY: BODY.ARCHER,
                WANT: 0,
                HAVE: 0
            },
            {
                PRIORITY: 3,
                ROLE: ROLE.MINER,
                STATE: STATE.SPAWNING,
                BODY: BODY.MINER,
                WANT: 2,
                HAVE: 0,
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 0,
                HAVE: 0
            }
        ]
    },
    {
        "time": 120,
        "toughness": 2,
        "population": 6,
        "profile": [
            {
                PRIORITY: 3,
                ROLE: ROLE.BRUTE,
                STATE: STATE.SPAWNING,
                BODY: BODY.BRUTE,
                WANT: 1,
                HAVE: 0
            },
            {
                PRIORITY: 1,
                ROLE: ROLE.ARCHER,
                STATE: STATE.SPAWNING,
                BODY: BODY.ARCHER,
                WANT: 1,
                HAVE: 0
            },
            {
                PRIORITY: 3,
                ROLE: ROLE.MINER,
                STATE: STATE.SPAWNING,
                BODY: BODY.MINER,
                WANT: 2,
                HAVE: 0,
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 2,
                HAVE: 0
            }
        ]
    },
    {
        "time": 250,
        "toughness": 4,
        "population": 8,
        "profile": [
            {
                PRIORITY: 3,
                ROLE: ROLE.BRUTE,
                STATE: STATE.SPAWNING,
                BODY: BODY.BRUTE,
                WANT: 2,
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
                PRIORITY: 1,
                ROLE: ROLE.MINER,
                STATE: STATE.SPAWNING,
                BODY: BODY.MINER,
                WANT: 2,
                HAVE: 0
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 2,
                HAVE: 0
            }
        ]
    },
    {
        "time": 700,
        "toughness": 22,
        "population": 15,
        "profile": [
            {
                PRIORITY: 3,
                ROLE: ROLE.BRUTE,
                STATE: STATE.SPAWNING,
                BODY: BODY.BRUTE2,
                WANT: 2,
                HAVE: 0
            },
            {
                PRIORITY: 3,
                ROLE: ROLE.ARCHER,
                STATE: STATE.SPAWNING,
                BODY: BODY.ARCHER,
                WANT: 6,
                HAVE: 0
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.MINER,
                STATE: STATE.SPAWNING,
                BODY: BODY.MINER,
                WANT: 2,
                HAVE: 0
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 5,
                HAVE: 0
            }
        ]
    },
    {
        "time": 1800,
        "toughness": 22,
        "population": 33,
        "profile": [
            {
                PRIORITY: 2,
                ROLE: ROLE.BRUTE,
                STATE: STATE.SPAWNING,
                BODY: BODY.BRUTE2,
                WANT: 5,
                HAVE: 0
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.ARCHER,
                STATE: STATE.SPAWNING,
                BODY: BODY.ARCHER,
                WANT: 9,
                HAVE: 0
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.MINER,
                STATE: STATE.SPAWNING,
                BODY: BODY.MINER,
                WANT: 2,
                HAVE: 0
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.WORKER,
                STATE: STATE.SPAWNING,
                BODY: BODY.BUILDERWORKER,
                WANT: 2,
                HAVE: 0,
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 5,
                HAVE: 0
            }
        ]
    },
];
