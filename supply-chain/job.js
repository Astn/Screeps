module.exports = {
	harvester: {
		body: [Game.WORK, Game.CARRY, Game.MOVE],
		role: 'harvester',
		quota:4
	},
	packer: {
		body: [Game.MOVE, Game.MOVE, Game.CARRY, Game.CARRY],
		role: 'packer',
		quota:2
	},
	builder: {
		body: [Game.WORK, Game.WORK, Game.WORK, Game.CARRY, Game.MOVE],
		role: 'builder',
		quota:0
	},
	brute: {
		body: [Game.ATTACK, Game.ATTACK, Game.ATTACK, Game.MOVE, Game.MOVE],
		role: 'brute',
		quota:4
	}
}