/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner'); // -> 'a thing'
 */
module.exports =
{
    remember: function (creep, state, role) {
        if (!creep.memory) {
            creep.memory = {
                state: state,
                role: role
            };
        }
        else {
            creep.memory.state = state;
        }
    },
    comp: function (a, b) {
        if ((a.WANT - a.HAVE) < (b.WANT - b.HAVE))
            return 1;
        if ((a.WANT - a.HAVE) > (b.WANT - b.HAVE))
            return -1;
        return 0;
    },
    _settings: [],
    profile: function (settings) {
        this._settings = settings;
    },
    spawn: function () {
        var result = [];
        for (var s in Game.spawns) {
            var spawn = Game.spawns[s];
            
            // TODO: before the sort will work we need to collect the number of creeps we have in each state
            // so check creep.memory.role and accumulate it to update how many we have.
            
            // alternativly we could store state in our spawns and collect that.
            
            var current = this._settings.sort(this.comp)[0];
            console.log('current have:' + parseInt(current.HAVE));
            if (spawn.spawning === null) {
                for (var i = 0; i < current.BODY.length; i++) {
                   var parts = current.BODY[i].parts;
                   var id = 1;
                   var buildCode = spawn.createCreep(parts, current.ROLE + ' ' + parseInt(spawn.room.find(Game.CREEPS).length), { state: current.STATE, role: current.ROLE });
                   while(buildCode == -3){
                       spawn.createCreep(parts, current.ROLE + ' ' + parseInt(++id), { state: current.STATE, role: current.ROLE });
                   }
                   
                   if (buildCode >= 0) {
                        result.push({
                            body: body,
                            code: buildCode,
                            have: current.HAVE,
                            role: current.ROLE
                        });
                        break;
                    }
                }
            }
        }
        return result;
    }
}