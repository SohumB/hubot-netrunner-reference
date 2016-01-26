'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-release');
  grunt.initConfig({
    release: {
      options: {
        tagName: 'v<%= version %>',
        commitMessage: 'Prepared to release <%= version %>.'
      }
    },
    babel: {
      options: {
        sourceMap: false,
        presets: ['es2015'],
        plugins: ['add-module-exports']
      },
      dist: {
        files: {
          'src/netrunnerdb.js': 'es6/netrunnerdb.js'
        }
      }
    }
  });
  grunt.registerTask('default', ['babel']);
};
