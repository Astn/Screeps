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
        "population": 2,
        "profile": [
            {
                PRIORITY: 3,
                ROLE: ROLE.CAPTIAN,
                STATE: STATE.SPAWNING,
                BODY: BODY.CAPTIAN,
                WANT: 1,
                HAVE: 0
            },
            {
                PRIORITY: 3,
                ROLE: ROLE.BRUTE,
                STATE: STATE.SPAWNING,
                BODY: BODY.BRUTE,
                WANT: 0,
                HAVE: 0
            },
            {
                ROLE: ROLE.ARCHER,
                STATE: STATE.SPAWNING,
                BODY: BODY.ARCHER,
                WANT: 0,
                HAVE: 0
            },
            {
                PRIORITY: 1,
                ROLE: ROLE.MINER,
                STATE: STATE.SPAWNING,
                BODY: BODY.MINER,
                WANT: 1,
                HAVE: 0
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.PACKER,
                STATE: STATE.SPAWNING,
                BODY: BODY.PACKER,
                WANT: 1,
                HAVE: 0,
            },
            {
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 0,
                HAVE: 0
            }
        ]
    },
    {
        "population": 5,
        "profile": [
            {
                ROLE: ROLE.CAPTIAN,
                STATE: STATE.SPAWNING,
                BODY: BODY.CAPTIAN,
                WANT: 0,
                HAVE: 0
            },
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
                WANT: 0,
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
                ROLE: ROLE.PACKER,
                STATE: STATE.SPAWNING,
                BODY: BODY.PACKER,
                WANT: 1,
                HAVE: 0,
            },
            {
                PRIORITY: 4,
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 1,
                HAVE: 0
            }
        ]
    },
    {
        "population": 10,
        "profile": [
            {
                ROLE: ROLE.CAPTIAN,
                STATE: STATE.SPAWNING,
                BODY: BODY.CAPTIAN,
                WANT: 0,
                HAVE: 0
            },
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
                WANT: 0,
                HAVE: 0
            },
            {
                PRIORITY: 1,
                ROLE: ROLE.MINER,
                STATE: STATE.SPAWNING,
                BODY: BODY.MINER,
                WANT: 3,
                HAVE: 0
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.PACKER,
                STATE: STATE.SPAWNING,
                BODY: BODY.PACKER,
                WANT: 2,
                HAVE: 0,
            },
            {
                PRIORITY: 2,
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 4,
                HAVE: 0
            }
        ]
    },
    {
        "population": 15,
        "profile": [
            {
                ROLE: ROLE.CAPTIAN,
                STATE: STATE.SPAWNING,
                BODY: BODY.CAPTIAN,
                WANT: 0,
                HAVE: 0
            },
            {
                ROLE: ROLE.BRUTE,
                STATE: STATE.SPAWNING,
                BODY: BODY.BRUTE2,
                WANT: 4,
                HAVE: 0
            },
            {
                ROLE: ROLE.ARCHER,
                STATE: STATE.SPAWNING,
                BODY: BODY.ARCHER,
                WANT: 4,
                HAVE: 0
            },
            {
                ROLE: ROLE.MINER,
                STATE: STATE.SPAWNING,
                BODY: BODY.MINER,
                WANT: 3,
                HAVE: 0
            },
            {
                ROLE: ROLE.PACKER,
                STATE: STATE.SPAWNING,
                BODY: BODY.PACKER,
                WANT: 2,
                HAVE: 0,
            },
            {
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 3,
                HAVE: 0
            }
        ]
    },
    {
        "population": 21,
        "profile": [
            {
                ROLE: ROLE.CAPTIAN,
                STATE: STATE.SPAWNING,
                BODY: BODY.CAPTIAN,
                WANT: 0,
                HAVE: 0
            },
            {
                ROLE: ROLE.BRUTE,
                STATE: STATE.SPAWNING,
                BODY: BODY.BRUTE2,
                WANT: 6,
                HAVE: 0
            },
            {
                ROLE: ROLE.ARCHER,
                STATE: STATE.SPAWNING,
                BODY: BODY.ARCHER,
                WANT: 8,
                HAVE: 0
            },
            {
                ROLE: ROLE.MINER,
                STATE: STATE.SPAWNING,
                BODY: BODY.MINER,
                WANT: 3,
                HAVE: 0
            },
            {
                ROLE: ROLE.PACKER,
                STATE: STATE.SPAWNING,
                BODY: BODY.PACKER,
                WANT: 2,
                HAVE: 0,
            },
            {
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 3,
                HAVE: 0
            }
        ]
    },
    {
        "population": 33,
        "profile": [
            {
                ROLE: ROLE.CAPTIAN,
                STATE: STATE.SPAWNING,
                BODY: BODY.CAPTIAN,
                WANT: 0,
                HAVE: 0
            },
            {
                ROLE: ROLE.BRUTE,
                STATE: STATE.SPAWNING,
                BODY: BODY.BRUTE2,
                WANT: 10,
                HAVE: 0
            },
            {
                ROLE: ROLE.ARCHER,
                STATE: STATE.SPAWNING,
                BODY: BODY.ARCHER,
                WANT: 13,
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
                ROLE: ROLE.PACKER,
                STATE: STATE.SPAWNING,
                BODY: BODY.PACKER,
                WANT: 4,
                HAVE: 0,
            },
            {
                ROLE: ROLE.MEDIC,
                STATE: STATE.SPAWNING,
                BODY: BODY.MEDIC,
                WANT: 6,
                HAVE: 0
            }
        ]
    },
];