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
//   SohumB, thalweg
//

import "babel-polyfill";
import render from "./netrunnerdb/render";
import nrdb from "./netrunnerdb/nrdb";
import searcher from "./netrunnerdb/search";

export default (robot) => {
  var search = function(str) {
    throw new Error("NetrunnerDB data not loaded yet!");
    return null;
  };

  // Load NDB on startup
  nrdb().then(({ cards, types }) => {
    search = searcher(cards, new Set(types), () => robot.brain.get("hubot-alias-table"));
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

  registerRegex(/(nrdb|netrunner(db)?) (.*)/i, 3, card => card.imagesrc);
  registerRegex(/(nrtx|netrunner(db)?text) (.*)/i, 3, render);
  robot.hear(/\[\[[^\]]+\]\]/g, res => {
    res.match.forEach(match => {
      const query = match.slice(2, match.length - 2);
      interact(query, res, render);
    });
  });

}
