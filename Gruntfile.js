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
        },
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

    grunt.registerTask("depversions", "Change the jQuery version used for the test suite", function (jquery, jqueryui) {
        var src = "test/loader.js";
        var loader = grunt.file.read(src);
        var deps = {
            jquery:   jquery,
            jqueryui: jqueryui
        };
        var result = loader.replace(/([a-z]+): "[\d\.]+"/g, function (full, dep) {
            return dep + ': "' + deps[dep] + '"';
        });

        grunt.file.write(src, result);
    });

    grunt.registerTask("testversions", "Run tests against specific versions of jQuery/UI", function (jquery, jqueryui) {
        var deps = [ "depversions", jquery, jqueryui ].join(":");

        grunt.task.run([ deps, "mocha-phantomjs" ]);
    });

    grunt.registerTask("default", [ "jshint", "concat", "uglify", "less" ]);

    grunt.registerTask("test", [ "test-latest" ])
    grunt.registerTask("test-all", [ "test-latest", "test-oldest" ])
    grunt.registerTask("test-latest", [ "testversions:1.9.1:1.10.1" ]);
    grunt.registerTask("test-oldest", [ "testversions:1.7.2:1.8.24" ]);
};
