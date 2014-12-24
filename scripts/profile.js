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
            ROLE: ROLE.CAPTIAN,
            STATE: STATE.SPAWNING,
            BODY: BODY.CAPTIAN,
            WANT: 0,
            HAVE: 0
        },
        {
            ROLE: ROLE.BRUTE,
            STATE: STATE.SPAWNING,
            BODY: BODY.BRUTE,
            WANT: 1,
            HAVE: 0
        },
        {
            ROLE: ROLE.ARCHER,
            STATE: STATE.SPAWNING,
            BODY: BODY.ARCHER,
            WANT: 1,
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
            ROLE: ROLE.BUILDER,
            STATE: STATE.SPAWNING,
            BODY: BODY.BUILDER,
            WANT: 3,
            HAVE: 0,
        },
        {
            ROLE: ROLE.MEDIC,
            STATE: STATE.SPAWNING,
            BODY: BODY.MEDIC,
            WANT: 1,
            HAVE: 0
        }
    ];