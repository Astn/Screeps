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
            return -1;
        if ((a.WANT - a.HAVE) > (b.WANT - b.HAVE))
            return 1;
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
            var current = this._settings.sort(this.comp);
            if (spawn.spawning === null && spawn.energy > 200) {
                console.log('current');
                for (var i = 0; i < current.BODY.length; i++) {
                    var body = current.BODY[i];
                    var buildCode = spawn.createCreep(body, current.ROLE + ' ' + parseInt(i), { state: current.STATE, role: current.ROLE });
                    if (buildCode >= 0) {
                        current.HAVE++;
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
