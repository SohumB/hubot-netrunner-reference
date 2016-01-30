var chai = require('chai');
chai.should();
console.inspect = function() {
  var args = [].slice.apply(arguments);
  return console.log.apply(console, _.map(args, function(arg) {
    return util.inspect(arg, {depth: null});
  }));
};
