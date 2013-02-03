module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            //options: grunt.file.readJSON(".jshintrc"),
            main: [ "jquery.jWizard.js" ]
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> Built: <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            main: {
                src:  "jquery.jWizard.js",
                dest: "jquery.jWizard.min.js"
            }
        },
        less: {
            options: {
                compress: true
            },
            main: {
                src:  "jquery.jWizard.less",
                dest: "jquery.jWizard.css"
            }
        }
    });

    grunt.registerTask("default", [ "jshint", "uglify", "less" ]);
};
