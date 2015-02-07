module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        screeps: {
            options: {
                email: '<your_email>',
                password: '<you_password>'
            },
            dist: {
                src: ['dist/*.js']
            }
        },
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['screeps'],
                options: {
                    spawn: false,
                    interrupt: true
                },
            },
        }
    });
}