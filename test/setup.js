const chai = require('chai');
global.expect = chai.expect;
chai.should();

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason)
  process.exit(1)
});
