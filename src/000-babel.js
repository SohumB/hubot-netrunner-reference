// Description
//   hello

require('babel-register')({
  presets: ['es2015'],
  plugins: ['add-module-exports']
});
module.exports = function(robot) {};
