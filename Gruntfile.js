module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-jade");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            main: {
                options: { jshintrc: "src/.jshintrc" },
                src: "src/*.js"
            },
            test: {
                options: { jshintrc: "test/.jshintrc" },
                src: "test/*.js"
            }
        },

        concat: {
            options: {
                process: true
            },
            main: {
                src: [ "src/head.txt", "src/*.js", "src/foot.txt" ],
                dest: "dist/jquery.jWizard.js"
            },
            docs: {
                src: [
                    "docs/css/bootstrap.css",
                    "docs/css/fontawesome.css",
                    "docs/css/jquery-ui.css",
                    "docs/css/jquery.tocify.css",
                    "dist/jquery.jWizard.min.css",
                    "docs/css/style.css"
                ],
                dest: "docs/build/app.css"
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> Built: <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            main: {
                src:  "dist/jquery.jWizard.js",
                dest: "dist/jquery.jWizard.min.js"
            },
            docs: {
                src: [
                    "docs/js/jquery.js",
                    "docs/js/jquery-ui.js",
                    "docs/js/bootstrap.js",
                    "docs/js/jquery.tocify.min.js",
                    "dist/jquery.jWizard.min.js",
                    "docs/js/app.js"
                ],
                dest: "docs/build/app.js"
            }
        },

        less: {
            main: {
                src:  "src/*.less",
                dest: "dist/jquery.jWizard.css"
            },
            min: {
                options: { compress: true },
                src: "dist/jquery.jWizard.css",
                dest: "dist/jquery.jWizard.min.css"
            },
            docs: {
                options: { compress: true },
                src: "docs/build/app.css",
                dest: "docs/build/app.css"
            }
        },

        jade: {
            docs: {
                files: {
                    "docs/build/index.html": "docs/index.jade"
                }
            }
        }
    });

    grunt.registerTask("mocha-phantomjs", "Run mocha-phantomjs tests", function () {
        var done = this.async(),
            proc = grunt.util.spawn({
                cmd:      "./node_modules/.bin/mocha-phantomjs",
                args:     [ "-R", "dot", "test/test.html" ],
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
        var src = "test/dependencies.js";
        var loader = grunt.file.read(src);
        var deps = {
            jquery:   jquery,
            jqueryui: jqueryui
        };
        var result = loader.replace(/([a-z]+): "[\d\.]+"/g, function (full, dep) {
            return dep + ': "' + deps[dep] + '"';
        });

        grunt.file.write(src, result);

        grunt.log.writeln("jQuery:    " + jquery.green);
        grunt.log.writeln("jQuery UI: " + jqueryui.green);
    });

    grunt.registerTask("testversions", "Run tests against specific versions of jQuery/UI", function (jquery, jqueryui) {
        var deps = [ "depversions", jquery, jqueryui ].join(":");

        grunt.log.write("Running unit tests via mocha-phantomjs...");

        grunt.task.run([ deps, "mocha-phantomjs" ]);
    });

    grunt.registerTask("default", [
        "jshint",
        "concat:main",
        "uglify:main",
        "less:main",
        "docs"
    ]);

    grunt.registerTask("docs", [
        "concat:docs",
        "uglify:docs",
        "less:docs",
        "jade"
    ]);

    grunt.registerTask("test", [ "test-latest" ]);
    grunt.registerTask("test-latest", [ "testversions:1.9.1:1.10.1" ]);
    grunt.registerTask("test-oldest", [ "testversions:1.7.0:1.8.7" ]);
};
