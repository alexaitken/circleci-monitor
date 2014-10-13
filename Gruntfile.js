/*global module:true*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',

    lint: {
      files: ['Gruntfile.js', '*.js']
    },

    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'stylesheets',
          src: ['*.scss'],
          dest: 'stylesheets',
          ext: '.css'
        }]
      }
    },
    copy: {
      files: {
        cwd: './',
        src: ['vendor/*', 'images/*', 'manifest.json', '*.js', 'stylesheets/*.css', '*.html'],           // copy all files and subfolders
        dest: 'dist/',
        expand: true
      }
    },
    clean: ["dist", "stylesheets/*.css"]
  });

  // Default task.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['lint', 'sass']);

  grunt.registerTask('dist', ['clean', 'sass', 'copy']);

  };
