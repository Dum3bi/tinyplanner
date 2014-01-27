module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
            dist: {
                src: [
                    '_assets/js/class.js',
                    '_assets/js/helpers.js',

                    '_assets/js/models/Model.js',
                    '_assets/js/models/Plan.js',
                    '_assets/js/models/Step.js',

                    '_assets/js/controllers/BaseController.js',
                    '_assets/js/controllers/PlanController.js',
                    '_assets/js/controllers/StepController.js',

                    '_assets/js/tinyrouter.js'
                ],
                dest: '_assets/build/js/production.js',
            }
        },

        uglify: {
            build: {
                src:    '_assets/build/js/production.js',
                dest:   '_assets/build/js/production.min.js'
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            grunt: {
                files: ['gruntfile.js'],
                tasks: ['default']
            } 
        }
    });

    // Tell us when files are modified (for testing)
    // grunt.event.on('watch', function(action, filepath, target) {
    //     grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    // });

    // 3. Where we tell Grunt we plan to use the plug-ins.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify']);

};