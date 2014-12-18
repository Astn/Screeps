/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('minerBrain'); // -> 'a thing'
 */
var STATE = require('state');
 
 module.exports = {
    think: function(creep){
            switch (creep.memory.state) {
                case STATE.NONE: {
                    console.log('Valid state:' + creep.name + ':' + creep.memory.state);
                    break;
                }
                case STATE.SPAWNING: {
                    var found = false;
                    for (var s in Game.spawns) {
                        if(Game.spawns[s].spawning === creep){
                            found = true;
                        }
                    }
                    if(!found){
                        creep.memory.state = STATE.NONE;
                    }
                    break;
                }
                case STATE.none: break;
                case STATE.none: break;
                case STATE.none: break;
                default: console.log('creep is in an unhandled state ' + creep.name + ':' + creep.memory.state);
        }
    }
}
 