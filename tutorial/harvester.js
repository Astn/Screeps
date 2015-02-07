
var moveToHarvest = function (creep, source) {

	creep.moveTo(source);
	creep.harvest(source);

	console.log(creep + ' harvesting ' + source);
}

module.exports = { 

	/*
	To make the creep transfer energy back to the spawn, you need to use the method Creep.transferEnergy(). However, remember that it should be done when the creep is next to the spawn, so it should walk back.

	If you modify the code by adding the check energy < energyCapacity to the creep, it will be able to go back and forth on its own, giving energy and returning to the source.

	Augment the creep program so that it could transfer harvested energy to the spawn and return back to work.
	*/
	transferEnergy: function (creep, source, spawn) {

	    console.log(creep + ' energy: ' + creep.energy + ' capacity: ' + creep.energyCapacity);

		if (creep.energy < creep.energyCapacity) {

			moveToHarvest(creep, source);
		}
		else {

			creep.moveTo(spawn);

			creep.transferEnergy(spawn);

			console.log(creep + ' transferring energy to ' + spawn);
		}
	},

	/*
	To send a creep to harvest energy, you need to use methods Creep.room.find(), Creep.moveTo(), and Creep.harvest(). Commands will be passed each game tick. The method harvest() requires that the energy is adjacent to the creep.

	You give orders to a creep by its name this way: Game.creeps.Worker1.
	*/
	moveToHarvest: moveToHarvest
}