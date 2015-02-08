var _ = require('lodash');

var hungry = function(creep) {

	if (!creep) return;
	return creep.energy < creep.energyCapacity;
};

module.exports = {
	energyFromTo: function(creep, target) {

		if (!creep) return;

		creep.moveTo(target);

		creep.transferEnergy(target);

		console.log(creep + ' transferring energy to ' + target);
	},
	energyToFrom: function(creep, target) {

		if (!creep) return;
		if (!target) return;

		creep.moveTo(target);

		target.transferEnergy(creep);

		console.log(target + ' transferring energy to ' + creep);
	},
	hungry: hungry,

	getCreepId: function(creep) {

		return creep.name.substr(creep.memory.role.length) * 1;
	}
}