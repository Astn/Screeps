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
                     "population":3,
                     "profile":[
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
                            ROLE: ROLE.MINER,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MINER,
                            WANT: 2,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.BUILDER,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.BUILDER,
                            WANT: 2,
                            HAVE: 0,
                        },
                        {
                            ROLE: ROLE.MEDIC,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MEDIC,
                            WANT: 0,
                            HAVE: 0
                        }
                    ]},
                    {
                     "population":4,
                     "profile":[
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
                            WANT: 0,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.MINER,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MINER,
                            WANT: 2,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.BUILDER,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.BUILDER,
                            WANT: 2,
                            HAVE: 0,
                        },
                        {
                            ROLE: ROLE.MEDIC,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MEDIC,
                            WANT: 0,
                            HAVE: 0
                        }
                    ]},
                    {
                     "population":10,
                     "profile":[
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
                            WANT: 0,
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
                            BODY: BODY.BUILDER2,
                            WANT: 5,
                            HAVE: 0,
                        },
                        {
                            ROLE: ROLE.MEDIC,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MEDIC,
                            WANT: 0,
                            HAVE: 0
                        }
                    ]},
                    {
                     "population":12,
                     "profile":[
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
                            WANT: 0,
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
                            BODY: BODY.BUILDERWORKER,
                            WANT: 7,
                            HAVE: 0,
                        },
                        {
                            ROLE: ROLE.MEDIC,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MEDIC,
                            WANT: 0,
                            HAVE: 0
                        }
                    ]},
                    {
                     "population":20,
                     "profile":[
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
                            WANT: 7,
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
                            BODY: BODY.BUILDER2,
                            WANT: 5,
                            HAVE: 0,
                        },
                        {
                            ROLE: ROLE.MEDIC,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MEDIC,
                            WANT: 2,
                            HAVE: 0
                        }
                    ]},
                    {
                     "population":30,
                     "profile":[
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
                            WANT: 7,
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
                            WANT: 7,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.BUILDER,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.BUILDER2,
                            WANT: 12,
                            HAVE: 0,
                        },
                        {
                            ROLE: ROLE.MEDIC,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MEDIC,
                            WANT: 3,
                            HAVE: 0
                        }
                    ]},
                    {
                     "population":33,
                     "profile":[
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
                            WANT: 7,
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
                            WANT: 7,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.BUILDER,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.BUILDERWORKER,
                            WANT: 15,
                            HAVE: 0,
                        },
                        {
                            ROLE: ROLE.MEDIC,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MEDIC,
                            WANT: 3,
                            HAVE: 0
                        }
                    ]},
                    {
                     "population":40,
                     "profile":[
                        {
                            ROLE: ROLE.CAPTIAN,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.CAPTIAN,
                            WANT: 10,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.BRUTE,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.BRUTE2,
                            WANT: 7,
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
                            WANT: 7,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.BUILDER,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.BUILDER2,
                            WANT: 15,
                            HAVE: 0,
                        },
                        {
                            ROLE: ROLE.MEDIC,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MEDIC,
                            WANT: 3,
                            HAVE: 0
                        }
                    ]},
                    {
                     "population":43,
                     "profile":[
                        {
                            ROLE: ROLE.CAPTIAN,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.CAPTIAN,
                            WANT: 10,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.BRUTE,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.BRUTE2,
                            WANT: 7,
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
                            WANT: 7,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.BUILDER,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.BUILDERWORKER,
                            WANT: 18,
                            HAVE: 0,
                        },
                        {
                            ROLE: ROLE.MEDIC,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MEDIC,
                            WANT: 3,
                            HAVE: 0
                        }
                    ]},
                    {
                     "population":50,
                     "profile":[
                        {
                            ROLE: ROLE.CAPTIAN,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.CAPTIAN,
                            WANT: 10,
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
                            WANT: 4,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.MINER,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MINER,
                            WANT: 7,
                            HAVE: 0
                        },
                        {
                            ROLE: ROLE.BUILDER,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.BUILDER2,
                            WANT: 15,
                            HAVE: 0,
                        },
                        {
                            ROLE: ROLE.MEDIC,
                            STATE: STATE.SPAWNING,
                            BODY: BODY.MEDIC,
                            WANT: 6,
                            HAVE: 0
                        }
                    ]},
    ];