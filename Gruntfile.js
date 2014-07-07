module.exports = function (grunt) {
    'use strict';
    // Project configuration

    var reloadPort = 35729;

    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - \n' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            '*/\n',
            bowerPath : "bower_components",
            modulesPath : "modules",
            jsDevPath : "js/dev",
        // Task configuration
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                        '<%= bowerPath %>/requirejs/require.js',
                        '<%= bowerPath %>/jquery/dist/jquery.min.js',
                        '<%= bowerPath %>/handlebars/handlebars.js',
                        '<%= bowerPath %>/bootstrap-sass/vendor/assets/javascripts/bootstrap/modal.js',
                        '<%= bowerPath %>/bootstrap-sass/vendor/assets/javascripts/bootstrap/tooltip.js',
                        '<%= bowerPath %>/bootstrap-sass/vendor/assets/javascripts/bootstrap/popover.js',
                        'js/dist/app.js'
                    ],
                dest: 'js/dist/<%= pkg.name %>.js'
            },
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'js/dist/<%= pkg.name %>.min.js'
            }
        },

        requirejs: {
            baseUrl: '<%= jsDevPath %>/modules',
            paths : {
                "swiper": "../../../<%= bowerPath %>/swiper/dist/idangerous.swiper.min"
            },
            include : [
                "swiper",
                "utils",
                "main"
            ],
            out : 'js/dist/app',

            dev: {
                options: {
                    optimize : "none",
                    baseUrl : "<%= requirejs.baseUrl %>",
                    paths : "<%= requirejs.paths %>",
                    include : "<%= requirejs.include %>",
                    out     : "<%= requirejs.out %>.js",
                    wrap: {
                        start: "(function(){",
                        end: "require(['main']); })();"
                    }
                }
            },

            dist: {
               options: {
                    baseUrl : "<%= requirejs.baseUrl %>",
                    paths : "<%= requirejs.paths %>",
                    include : "<%= requirejs.include %>",
                    out     : "<%= requirejs.out %>.min.js",
                    wrap: {
                        start: "(function(){",
                        end: "require(['main']); })();"
                    }
                }
            },

        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'css/<%=pkg.name%>.min.css': 'sass/main.scss'
                }
            },
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'css/<%=pkg.name%>.css': 'sass/main.scss'
                }
            }
        },
        watch : {
            options: {
                nospawn: true,
                livereload: reloadPort
            },
            css: {
                files: 'sass/**/*.scss',
                tasks: ['sass:dev'],
                options: {
                   livereload: reloadPort
                }
            },
            js: {
                files: ['<%= jsDevPath %>/**/*.js'],
                tasks : ['requirejs:dev', 'concat', 'uglify'],
                options: {
                   livereload: reloadPort
                }
            },
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'js/dev',
                    outdir: 'docs'
                }
            }
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task
    grunt.registerTask('serve', ['sass:dev', 'requirejs:dev', 'concat', 'watch']);
    grunt.registerTask('build', ['sass:dist', 'requirejs:dist',  'concat:dist', 'uglify', 'yuidoc']);
    grunt.registerTask('default', ['sass:dev', 'requirejs:dev', 'concat']);
};

