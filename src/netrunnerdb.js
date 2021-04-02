// Description:
//   Simple NetrunnerDB.com card image / text fetcher
//
// Dependencies:
//   none
//
// Configuration:
//   none
//
// Commands:
//   hubot nrdb <card name> - Displays the Netrunner card <card name>
//   hubot netrunner <card name> - Displays the Netrunner card <card name>
//   hubot netrunnerdb <card name> - Displays the Netrunner card <card name>
//   hubot nrtx <card name> - Displays the Netrunner card <card name>, as text
//   hubot netrunnertext <card name> - Displays the Netrunner card <card name>, as text
//   hubot netrunnerdbtext <card name> - Displays the Netrunner card <card name>, as text
//
// Author:
//   SohumB
//

const render = require("./netrunnerdb/render.js");
const nrdb = require("./netrunnerdb/nrdb.js");
const searcher = require("./netrunnerdb/search");

module.exports = (robot) => {
  var search = function(str) {
    throw new Error("NetrunnerDB data not loaded yet!");
    return null;
  };

  // Load NRDB on startup
  // I hate this as much as you do, but I can't figure out a better way to communicate this
  // across hubot-test-helper's insistence on loading modules and initialising everything for you
  const data = global.hubot_netrunner_reference_localFile ? 
                 nrdb(global.hubot_netrunner_reference_localFile) :
                 nrdb();
  global.hubot_netrunner_reference_data_pending = data.then(({ cards: { data, types } }) => {
    search = searcher(data, new Set(types), () => robot.brain.get("hubot-alias-table"));
  });

  function interact(query, res, transform) {
    const card = search(query);
    if (card) {
      res.send(transform(card));
    } else {
      res.send(`Couldn't find a Netrunner card name matching "${query}"`);
    }
  }

  function registerRegex(rgx, index, transform) {
    robot.respond(rgx, res => {
      const query = res.match[index];
      interact(query, res, transform);
    });
  }

  registerRegex(/(nrdb|netrunner(db)?) (.*)/i, 3, card => card.image_url);
  registerRegex(/(nrtx|netrunner(db)?text) (.*)/i, 3, render);
  robot.hear(/\{\{[^\}]+\}\}/g, res => {
    res.match.forEach(match => {
      const query = match.slice(2, match.length - 2);
      interact(query, res, card => card.image_url);
    });
  });
  robot.hear(/\[\[[^\]]+\]\]/g, res => {
    res.match.forEach(match => {
      const query = match.slice(2, match.length - 2);
      interact(query, res, render);
    });
  });

}
