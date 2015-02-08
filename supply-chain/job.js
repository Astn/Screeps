var roster = require('roster');

module.exports = {
	medic: {
		body: [Game.HEAL, Game.HEAL, Game.HEAL, Game.MOVE, Game.MOVE],
		role: 'medic',
		weight: 10
	},
	harvester: {
		body: [Game.WORK, Game.CARRY, Game.CARRY, Game.MOVE],
		role: 'harvester',
		weight: 0
	},
	brute: {
		body: [Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.MOVE, Game.MOVE],
		role: 'brute',
		weight: 30
	},
	builder: {
		body: [Game.WORK, Game.WORK, Game.CARRY, Game.MOVE],
		role: 'builder',
		weight: 0
	},
	packer: {
		body: [Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY],
		role: 'packer',
		weight: 20
	},
	archer: {
		body: [Game.RANGED_ATTACK, Game.MOVE, Game.MOVE],
		role: 'archer',
		weight: 30
	}
}