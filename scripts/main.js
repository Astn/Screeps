var _ = require('lodash');
var spawner = require('spawner');
var machine = require('machine');
var utility = require('utility');
var BODY = require('body');
var ROLE = require('role');
var STATE = require('state');
var PROFILE = require('profile');
spawner.profile(PROFILE);


utility.setStartTimeAndInitializeMemory();



var spawnResult = spawner.spawn();



for (var roomName in Game.rooms) {
    utility.initializeRoomMemory(roomName);
    Memory[roomName].formation = [];

    var room = Game.getRoom(roomName);
    if (!room)
        continue;

    var myCreeps = room.find(Game.MY_CREEPS);


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
    machine.chewAll(myCreeps);

    // override moves based on memory set
    utility.moveCreepsWithStoredMove(myCreeps);
}

var overCpu = false;
for (var roomName in Game.rooms) {
  // use extra cycles to update map
  utility.updateMap(roomName);

  Game.getUsedCpu(function(cpu) {
      if(cpu > Game.cpuLimit *.95) {
          overCpu = true;
          console.log("Over CPU, aborting");
      }
  });
  
  if(overCpu){
    break;
  }
}
