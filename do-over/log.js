module.exports = {
	energy: function(creep) {

		console.log(creep + ' energy: ' +
			creep.energy + ' capacity: ' +
			creep.energyCapacity);
	},
	rollCall: function(creep) {

		if (creep)
			console.log(creep + ' in the house');
		else
			console.log('creep is yams?!');
	}
}