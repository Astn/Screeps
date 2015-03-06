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

    var room = Game.getRoom(roomName);
    if (!room)
        continue;

    var myCreeps = room.find(Game.MY_CREEPS);


    machine.chewAll(myCreeps);

    // override moves based on memory set
    utility.moveCreepsWithStoredMove(myCreeps);
}

var overCpu = false;

for (var roomName in Game.rooms) {
  var updateMapCtr = 0;
  while (overCpu === false && updateMapCtr < 50){

      // use extra cycles to update map
      updateMapCtr++;
      Game.getUsedCpu(function(cpu) {
          if(cpu > Game.cpuLimit *.80) {
              overCpu = true;
              console.log("Over CPU, aborting");
          }
      });


      if (utility.updateMap(roomName) === false){
        break;
      }
  }
}
