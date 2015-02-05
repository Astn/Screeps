if (Game.time <= 0) {
	Memory.creeps = {};
	Memory.mine = {};
	Memory.map = {};
}
if (!Memory.map)
	Memory.map = {};

//console.log(parseInt(Game.time));
var _ = require('lodash');
var spawner = require('spawner');
var machine = require('machine');

Memory.reset = false;

if (!Memory.mine)
	Memory.mine = {};

var BODY = require('body');
var ROLE = require('role');
var STATE = require('state');
var PROFILE = require('profile');

spawner.profile(PROFILE);

var spawnResult = spawner.spawn();

if (Game.time % 100) {
	Memory.drops = [];
}

var roomNames = [];

for (var sp in Game.spawns) {

	console.log(Game.spawns[sp].room.name);
	roomNames.push(Game.spawns[sp].room.name);
}

for (var roomName in _.uniq(roomNames)) {

	console.log('roomName:' + roomNames[roomName]);

	var room = Game.getRoom(roomNames[roomName]);
	if (!room)
		continue;

	var myCreeps = room.find(Game.MY_CREEPS);

	for (var i = 0; i < myCreeps.length; i++) {

		var creep = myCreeps[i];

		machine.chew(myCreeps[i]);

		if (creep.memory.lastPos) {

			// only count a space if they moved from it
			var posName = parseInt(creep.memory.lastPos.x) + '-' + parseInt(creep.memory.lastPos.y);
			var newPosName = parseInt(creep.pos.x) + '-' + parseInt(creep.pos.y);
			// console.log(posName + '...' + newPosName);
			if (!creep.pos.equalsTo(creep.memory.lastPos.x, creep.memory.lastPos.y)) {

				if (!Memory.map[creep.room.name]) {
					Memory.map[creep.room.name] = [];
				}

				var memoryMap = Memory.map[creep.room.name];
				var memoryPos = _.find(memoryMap, function (item) { return item.name == posName; });
				if (!memoryPos) {

					memoryMap.push({ 'name': posName, 'x': creep.memory.lastPos.x, 'y': creep.memory.lastPos.y, 'wear': 1 });
				}
				else {

					memoryPos.wear++;
				}

			}
		}
		creep.memory.lastPos = { 'x': creep.pos.x, 'y': creep.pos.y };
	}
	// find hottest pos with above average wear

	if (Memory.map[room.name] && Memory.map[room.name].length > 1) {

		var memoryMap = Memory.map[room.name];
		var avg = _.reduce(memoryMap, function (agg, item) { return agg + item.wear; }, 0) / memoryMap.length;
		avg++;

		var avg2 = _.chain(memoryMap)
			.filter(function (item) { return item.wear > avg; })
			.reduce(memoryMap, function (agg, item) { return agg + item.wear; }, 0)
			.value() / memoryMap.length;
		avg2++;

		var hotSpot = _.chain(memoryMap)
			.filter(function (item) { return !item.construction && item.wear > avg2 && item.wear > 15; })
			.reduce(function (agg, item) {
				if (!agg)
					return item;
				if (item.wear > agg.wear)
					return item;
				return agg;
			}, { 'wear': -1 })
			.value();

		// if # construction sites is less then 2, then make another.
		// For the moment, we are waisting too many resources on construction. Need a better way to manage this.
		/*
		var sites = room.find(Game.CONSTRUCTION_SITES);
		if(hotSpot.wear>0 && sites.length < 2){
			console.log('hottest wear for '+room.name+' is ' + hotSpot.wear + ' at: ' + hotSpot.name);
			hotSpot.construction = Game.STRUCTURE_ROAD;
			room.createConstructionSite(hotSpot.x,hotSpot.y,hotSpot.construction);
		}
		*/
	}
}