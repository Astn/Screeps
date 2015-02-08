var _ = require('lodash');
var log = require('log');

module.exports = {
	miner: {
		body: [Game.WORK, Game.CARRY, Game.CARRY, Game.MOVE],
		primaryDirective: function(creep, spawn) {
			transferEnergy(creep, spawn);
		}
	},
	medic: {
		body: [Game.HEAL, Game.HEAL, Game.MOVE, Game.MOVE],
		primaryDirective: function(creep) {
			healGimpiest(creep);
		}
	},
	brute: {
		body: [Game.ATTACK, Game.ATTACK, Game.MOVE, Game.MOVE],
		primaryDirective: function(creep) {
			attack(creep);
		}
	},
	jedi: {
		body: [Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE],
		primaryDirective: function(creep) {
			attack(creep);
		}
	}
}

/*----------MINER-------------*/

var transferEnergy = function(creep, spawn) {

	if (!creep) return;

	log.energy(creep);

	if (hungry(creep)) {

		moveToHarvest(creep);
	} else {

		energyFromTo(creep, spawn);

		creep.memory.source = null;
	}
};

var hungry = function(creep) {

	if (!creep) return;

	if (!creep.energyCapacity)
		creep.suicide();

	return creep.energy < creep.energyCapacity;
};

var moveToHarvest = function(creep, source) {

	if (!source) {
		source = creep.pos.findClosest(Game.SOURCES_ACTIVE);

		creep.memory.source = source;
	}

	if (!source) return;

	creep.moveTo(source);
	creep.harvest(source);

	creep.say('harvesting');
};

var energyFromTo = function(creep, target) {

	if (!creep) return;

	creep.moveTo(target);

	creep.transferEnergy(target);

	creep.say('transferring');
};

/*----------MEDIC-------------*/

var closestGimp = function(creep) {

	if (!creep) return;

	var closest = creep.pos.findClosest(Game.MY_CREEPS, {
		filter: function(obj) {

			return obj.hits < obj.hitsMax;
		}
	});
	return closest;
};

var healGimpiest = function(creep) {

	var gimp = closestGimp(creep);
	if (gimp) {

		creep.moveTo(gimp);
		creep.heal(gimp);

		creep.say('healing');
	}
}

/*----------BRUTE-------------*/

var closestThreat = function(creep) {

	if (!creep) return;

	var closest = creep.pos.findClosest(Game.HOSTILE_CREEPS);
	return closest;
};

var attack = function(creep) {

	var asshole = closestThreat(creep);
	if (asshole) {

		creep.moveTo(asshole);

		if (creep.getActiveBodyparts(Game.RANGED_ATTACK)) {

			creep.rangedAttack(asshole);
		}

		if (creep.getActiveBodyparts(Game.ATTACK)) {

			creep.attack(asshole);
		}

		creep.say('killing');
	}
}