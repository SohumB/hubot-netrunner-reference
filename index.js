const fs = require('fs');
const path = require('path');

module.exports = function (robot, scripts) {
  if (scripts && scripts.includes("*")) { scripts = null; }
  const scriptsPath = path.resolve(__dirname, 'src');
  for (var script of fs.readdirSync(scriptsPath).sort()) {
    if (!scripts || (scripts && scripts.includes(script))) {
      robot.loadFile(scriptsPath, script)
    }
  }
}
