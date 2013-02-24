module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            main: {
                options: { jshintrc: "src/.jshintrc" },
                src: "src/*.js",
            },
            test: {
                options: { jshintrc: "test/.jshintrc" },
                src: "test/*.js",
            },
        },

        concat: {
            options: {
                process: true
            },
            main: {
                src: [ "src/head.txt", "src/*.js", "src/foot.txt" ],
                dest: "dist/jquery.jWizard.js"
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> Built: <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            main: {
                src:  "dist/jquery.jWizard.js",
                dest: "dist/jquery.jWizard.min.js"
            }
        },

        less: {
            options: {
                compress: true
            },
            main: {
                src:  "src/*.less",
                dest: "dist/jquery.jWizard.css"
            }
        }
    });

    grunt.registerTask("mocha-phantomjs", "Run mocha-phantomjs tests", function () {
        var done = this.async(),
            proc = grunt.util.spawn({
                cmd:      "./node_modules/.bin/mocha-phantomjs",
                args:     [ "test/test.html" ],
                fallback: "Unit Tests Failed to Run"
            }, function (err, result, code) {
                if (err) {
                    return done(err);
                } else if (code !== 0) {
                    return done(new Error("Unit Tests Failed to Run"));
                }

                done();
            });

        proc.stdout.pipe(process.stdout);
    });

    grunt.registerTask("default", [ "jshint", "concat", "uglify", "less" ]);
    grunt.registerTask("test", [ "mocha-phantomjs" ]);
};
