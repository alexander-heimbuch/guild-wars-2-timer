/*jslint node: true */

module.exports = function (grunt) {

    grunt.initConfig({
        clean: ['dist', 'css'],
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['bower_components/**'],
                    dest: 'dist/'
                }, {
                    expand: true,
                    src: ['img/**'],
                    dest: 'dist/'
                }, {
                    expand: true,
                    src: ['css/**'],
                    dest: 'dist/'
                }, {
                    expand: true,
                    src: ['index.html'],
                    dest: 'dist/'
                }, {
                    expand: true,
                    src: ['crossdomain.xml'],
                    dest: 'dist/'
                }, {
                    expand: true,
                    src: ['manifest.webapp'],
                    dest: 'dist/'
                }, {
                    expand: true,
                    src: ['robots.txt'],
                    dest: 'dist/'
                }],
            }
        },
        less: {
            production: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "css/app.css": "less/app.less"
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js',
                    name: 'app',
                    out: 'dist/js/app.js',
                    include: ['app', 'core', 'desktop', 'touch', 'Queue', 'Stage', 'Timer', 'cookieHandler'],
                    optimize: 'uglify',
                    wrap: true,
                    paths: {
                        jquery: '../bower_components/jquery/dist/jquery.min',
                        cookie: '../bower_components/jquery-cookie/jquery.cookie',
                        kinetic: '../bower_components/kineticjs/kinetic.min',
                        swipe: '../bower_components/jquery-touchswipe/jquery.touchSwipe.min',
                        Queue: 'lib/queue',
                        Stage: 'lib/stage',
                        Timer: 'lib/timer',
                        cookieHandler: 'lib/cookie-handler',
                        core: 'core',
                        desktop: 'desktop',
                        touch: 'touch'
                    }
                }
            }
        },
        bower: {
            install: {}
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('dist', ['clean', 'bower', 'less', 'copy', 'requirejs']);
    grunt.registerTask('default', ['bower', 'less']);
};
