var closestThreat = function(creep) {
	//console.log(creep + ' pos ' + creep.pos);
	var closest = creep.pos.findClosest(Game.HOSTILE_CREEPS);
	return closest;
};

module.exports = {

	closestThreat:closestThreat
}