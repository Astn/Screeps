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
    compRatio: function (a, b) {
        if ((a.TARGET - a.RATIO) < (b.TARGET - b.RATIO))
            return 1;
        if ((a.TARGET - a.RATIO) > (b.WANT - b.RATIO))
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
            if (spawn.spawning === null) {
                
                // TODO: before the sort will work we need to collect the number of creeps we have in each state
                // so check creep.memory.role and accumulate it to update how many we have.
                var se = this._settings;
                this._settings.forEach(function(x){
                    x.HAVE = spawn.room.find(Game.MY_CREEPS, {filter:function(f){
                       // console.log('mem role: '+ f.memory.role +' other role: ' + x.ROLE)
                        return f.memory.role == x.ROLE;
                    }}).length;
                    x.TOTAL = spawn.room.find(Game.MY_CREEPS).length;
                    x.RATIO = x.HAVE / x.TOTAL;
                    x.TARGET = x.WANT / (se.reduce(function(a, b) {return a + b.WANT;},0));
                });
                // alternativly we could store state in our spawns and collect that.
            
                // if we have as many as our profile wants, then we move to a percentage strategy based off of wants.
                
            
                var current = this._settings.sort(this.comp)[0];
                if(current.WANT <= current.HAVE){
                    current = this._settings.sort(this.compRatio)[0];
                }
                
                for (var i = 0; i < current.BODY.length; i++) {
                   var parts = current.BODY[i].parts;
                   var id = 1;
                   var buildCode = spawn.createCreep(parts, current.ROLE + ' ' + parseInt(spawn.room.find(Game.CREEPS).length), { state: current.STATE, role: current.ROLE });
                   var tries = 5;
                   while(buildCode == -3 && --tries > 0){
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