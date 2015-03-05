var ROLE = require('role');
var _ = require('lodash');
module.exports = {
    crepsWithMoves : function(creeps){
      return _.filter(creeps, function (n) { return n.memory.move; });
    },
    moveCreepsWithStoredMove : function(creeps){
      var creepsWithMoves = this.crepsWithMoves(creeps);
      _.forEach(creepsWithMoves, function (creep){
        creep.move(creep.memory.move);
        creep.memory.move = null;
      });
    },
    initializeRoomMemory : function(roomName){
      if(!Memory.myRooms){
        Memory.myRooms = {};
      }
      if(!Memory.myRooms[roomName]){
        Memory.myRooms[roomName] = {};
      }
      if(!Memory.myRooms[roomName].map){
        var pos = new Array(50);
        for (var y = 0; x <50; x++){
          pos[y] = new Array(50);
          for (var y = 0; y <50; y++){
            pos[y][x] = {};
          }
        }
        Memory.myRooms[roomName].map = {nextPos: {x:0,y:0}, done:false, pos:pos};
      }
    },
    updateMap : function(roomName){
      var map = Memory.myRooms[roomName].map;
      if (map.nextPos.x === 50
        && map.nextPos.y === 50){
        return;
      }
      var currentPos = Game.rooms[roomName].getPositionAt(map.nextPos.x,map.nextPos.y);
      var posInfo = {
        spawns: {},
        sources: {}
      };


      // get distance to each spawn
      for (var spawnName in Game.spawns){
          var spawn = Game.spawns[spawnName];
          if(spawn.room.name !== roomName)
            continue;
        var pathTo = Game.rooms[roomName].findPath(currentPos,
                spawn.pos,
          {
            ignoreCreeps: true,
            ignoreDestructibleStructures: true,
            heuristicWeight: 1 });
        posInfo.spawns[spawn.name] = pathTo.length;
      }
      // get distance to each source
      var sources = Game.rooms[roomName].find(Game.SOURCES);
      for (var sourceIdx in sources){
        var pathTo = Game.rooms[roomName].findPath(currentPos, sources[sourceIdx].pos,
          {
            ignoreCreeps: true,
            ignoreDestructibleStructures: true,
            heuristicWeight: 1 });
        posInfo.sources[sources[sourceIdx].id] = pathTo.length;
      }

      map.pos[map.nextPos.y][map.nextPos.x] = posInfo

      // increment posiition
      if (map.nextPos.x === 49){
        map.nextPos.x = 0;
        map.nextPos.y ++;
      }
      if (map.nextPos.x === 50
        && map.nextPos.y === 50){
        map.done = true;;
      }
      map.nextPos.x ++;
    },
    setStartTimeAndInitializeMemory : function(){
      var creepCt = _.transform(Game.creeps, function(acc,prop){
        return acc + 1;
      }, 0);
      for (var spawnName in Game.spawns){
        var spawn = Game.spawns[spawnName];
        if (creepCt === 0 && spawn.energy === 1000) {
            Memory.startTime = Game.time;
            Memory.creeps = {};
            Memory.mine = {};

            console.log('starting...');
        }
        this.initializeRoomMemory(spawn.room.name);
      }
    },

    linearDistance : function (pos1, pos2) {
        var x = pos1.x - pos2.x;
        var y = pos1.y - pos2.y;
        return Math.sqrt(x * x + y * y);
    },

    creepCanAttack: function (n) {
        var count = _.filter(n.body, function (part) {
            return part.type === Game.ATTACK || part.type === Game.RANGED_ATTACK;
        }).length;
        return count > 0;
    },
    creepIsRanged: function (n) { return _.filter(n.body, function (part) { return part.type === Game.RANGED_ATTACK; }).length > 0; },
    creepIsCloseRanged: function (n) { return _.filter(n.body, function (part) { return part.type === Game.ATTACK; }).length > 0; },
    creepIsMiner: function (n) { return n.memory.role === ROLE.MINER; },
    creepIsPacker: function (n) { return n.memory.role === ROLE.PACKER; },
    firstPosAlongPathTo: function (n, creep) {
        if (n) {
            var path = creep.pos.findPathTo(n);
            if (path.length > 0) {
                return path[0];
            }
        }
        return null;
    },
    exitsArray: [Game.EXIT_TOP, Game.EXIT_LEFT, Game.EXIT_RIGHT, Game.EXIT_BOTTOM],
    posBehindCreep: function(creep){
        // find paths to each of the exits
        var fullPaths = _.map(this.exitsArray, function (n) { return creep.pos.findClosest(n); });
        var firstPaths = _.map(fullPaths, function (n) {
            if (n) {
                var path = creep.pos.findPathTo(n);
                if (path.length > 0) {
                    return path[0];
                }
            }
            return null;
        });
        // remove nulls
        firstPaths = _.filter(firstPaths, function (f) { return f !== null; });
        // make an average position if the len is > 1;
        var inFrontOfCreep = {
            x: 0,
            y: 0
        };
        if (firstPaths.length > 1) {
            var summed = _.reduce(firstPaths, function (agg, f) {
                return { x: (agg.x + f.x), y: (agg.y + f.y) };
            }, inFrontOfCreep);
            var avged = { x: Math.round(summed.x / firstPaths.length), y: Math.round(summed.y / firstPaths.length) };
            return {
                x: creep.pos.x + (avged.x - creep.pos.x),
                y: creep.pos.y + (avged.y - creep.pos.y)
            };
        }
        else if (firstPaths.length === 1) {
            inFrontOfCreep = {
                x: firstPaths[0].x,
                y: firstPaths[0].y
            };
        }
        var behindCreep = {
            x: creep.pos.x + (creep.pos.x - inFrontOfCreep.x),
            y: creep.pos.y + (creep.pos.y - inFrontOfCreep.y)
        };

        return behindCreep;
    },
    sumPosX: function (sum, n) { return sum + n.pos.x; },
    sumPosY: function (sum, n) { return sum + n.pos.y; },
    creepHitsRatio: function (n) { return -n.hits / n.hitsMax; },
    creepIsDamaged: function (n) { return (n.hits < n.hitsMax);},
    chooseSpawn: function (creep) {
        var spawn = {};
        for (var sp in Game.spawns) {
            if (Game.spawns[sp].room === creep.room) {
                spawn = Game.spawns[sp];
                break;
            }
        }
        return spawn;
    },
    chooseHostile: function (creep) {
        var hostile = null;
        var hostileCreeps = creep.pos.findInRange(Game.HOSTILE_CREEPS, 1);
        if (hostileCreeps.length) {
            hostile = hostileCreeps[0];
        }
        else {
            hostileCreeps = creep.pos.findInRange(Game.HOSTILE_CREEPS, 3);
            if (hostileCreeps.length) {
                hostile = hostileCreeps[0];
            } else {
                hostileCreeps = creep.pos.findInRange(Game.HOSTILE_CREEPS, 30);
                if (hostileCreeps.length) {
                    hostile = hostileCreeps[0];
                }
            }
        }
        return hostile;
    },
    tradePlaces: function (creep, pathStep) {
        if (Math.random() * 5 > 2)
            return;
        // swap is good, cause it prevents enemy from just hammering on one enemy.
        // check if we should swap places with the creep next to us if we are trying to go that way.
        var atThatSpot = creep.room.lookAt(pathStep.x, pathStep.y);
        var isACreepThere = _.some(atThatSpot, function (n) { return n.type === 'creep' });
        if (isACreepThere) {
            var justCreeps = _.filter(atThatSpot, function (n) { return n.type === 'creep' });

            var otherCreep = _.first(justCreeps).creep;
            if (otherCreep.my) {
                var isCloseAttacker = _.some(otherCreep.body, function (part) { return part.type === Game.ATTACK; });
                var amICoseAttacker = _.some(creep.body, function (part) { return part.type === Game.ATTACK; });
                var directionToMySpotFromTheirSpot = 0;
                if (pathStep.direction >= 4)
                    directionToMySpotFromTheirSpot = pathStep.direction - 4;
                else
                    directionToMySpotFromTheirSpot = pathStep.direction + 4;
                if (!otherCreep.memory) {
                    otherCreep.memory = {};
                }
                if (amICoseAttacker || !isCloseAttacker)
                    otherCreep.memory.move = directionToMySpotFromTheirSpot;
            }
        }
    }
}
