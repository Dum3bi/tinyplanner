module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatenating files goes here.
            dist: {
                src: [
                    'resources/js/underscore.js',
                    'resources/js/backbone.js',
                    'resources/js/backbone.localStorage.js',

                    'resources/js/models/*',
                    'resources/js/views/*',

                    'resources/js/router.js',
                ],
                dest: 'resources/build/js/production.js',
            }
        },

        uglify: {
            build: {
                src:    'resources/build/js/production.js',
                dest:   'resources/build/js/production.min.js'
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'resources/build/css/global.css': 'resources/css/global.scss'
                }
            } 
        },

        watch: {
            options: {
                livereload: true,
            },
            css: {
                files: ['resources/css/*.scss'],
                tasks: ['css']
            },
            js: {
                files: ['resources/js/**/*.js'],
                tasks: ['js'],
                options: {
                    spawn: false,
                },
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
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-sass');;
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('js', ['concat', 'uglify']);

    grunt.registerTask('default', ['css', 'js']);

};