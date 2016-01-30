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
      dist: {
        files: [{
          expand: true,
          cwd: 'es6/',
          src: ['**/*.js'],
          dest: 'src/'
        }]
      }
    }
  });
  grunt.registerTask('default', ['babel']);
};
