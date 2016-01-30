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
import Fuse from "fuse.js";
import render from "./netrunnerdb/render";
import nrdb from "./netrunnerdb/nrdb";

export default (robot) => {
  // Load NDB on startup
  nrdb().then(({ cards, types }) => {
    robot.brain.set("cards", cards);
    robot.brain.set("card_types", Array.from(types));
  });

  function search(orig) {
    const allCards = robot.brain.get("cards");
    const types = new Set(robot.brain.get("card_types"));
    types.add("id");

    const aliases = robot.brain.get("hubot-alias-table") || {};
    const text = aliases[orig] || orig;

    const match = text.match(/([^/]+)\/(.+)/);
    const usingFlag = match && types.has(match[1]);

    const cards = usingFlag ? allCards.filter(card => {
      const flag = match[1];
      const typ = flag === "id" ? "identity" : flag;
      return (card.type_code === typ) || card.subtype_code.indexOf(flag) > -1;
    }) : allCards;

    const query = usingFlag ? match[2] : text;

    const options = {
      caseSensitive: false,
      include: ['score'],
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      keys: ['title']
    };
    return (new Fuse(cards, options)).search(query);
  }

  function interact(query, res, transform) {
    const cards = search(query);
    if (cards.length > 0) {
      const card = cards
              .filter(c => c.score === cards[0].score)
              .sort((c1, c2) => c1.item.title.length - c2.item.title.length)[0];
      res.send(transform(card.item));
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

  registerRegex(/(nrdb|netrunner(db)?) (.*)/i, 3, card => `http://netrunnerdb.com${card.imagesrc}`);
  registerRegex(/(nrtx|netrunner(db)?text) (.*)/i, 3, render);
  robot.hear(/\[\[[^\]]+\]\]/g, res => {
    res.match.forEach(match => {
      const query = match.slice(2, match.length - 2);
      interact(query, res, render);
    });
  });

}
