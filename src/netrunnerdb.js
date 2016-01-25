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

import Fuse from "fuse.js";

export default (robot) => {
  // Load NDB on startup
  robot.http("http://netrunnerdb.com/api/cards/").get()((err, res, body) => {
    robot.brain.set("cards", JSON.parse(body));
  });

  function search(query) {
    const cards = robot.brain.get("cards");
    const options = {
      caseSensitive: false,
      includeScore: false,
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
    var cards = search(query);
    if (cards.length > 0) {
      res.send(transform(cards[0]));
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

  function clean(text) {
    const unicodes = {
      0: '⁰',
      1: '¹',
      2: '²',
      3: '³',
      4: '⁴',
      5: '⁵',
      6: '⁶',
      7: '⁷',
      8: '⁸',
      9: '⁹',
      x: 'ˣ',
      X: 'ˣ'
    };

    const replacements = [
      [/\[Click\]/g, ':click:'],
      [/\[Credits\]/gm, ':credit:'],
      [/\[Trash\]/gm, ':trash:'],
      [/\[Link\]/gm, ':links:'],
      [/\[Memory Unit\]/gm, ':mu:'],
      [/\[Recurring Credits\]/gm, ':recurringcredit:'],
      [/\[Subroutine\]/gm, ':subroutine:'],
      [/<\/?strong>/gm, '*'],
      [/<sup>[0-9Xx]<\/sup>/gm, match => unicodes[match.replace(/<\/?sup>/g, '')]]
    ];

    return replacements.reduce((acc, [needle, haystack]) => acc.replace(needle, haystack), text || "");
  }

  function multiline(fn) {
    return lines => lines.split("\n").map(fn).join("\n");
  }

  function render(card) {
    const formats = {
      agenda: `Adv: ${card.advancementcost} • Score: ${card.agendapoints}`,
      identity: card.side_code === "corp" ?
        `Deck: ${card.minimumdecksize} • Influence: ${card.influencelimit || '—'}` :
        `Link: ${card.baselink} • Deck: ${card.minimumdecksize} • Influence: ${card.influencelimit || '—'}`,
      operation: `Cost: ${card.cost} • Influence: ${card.factioncost}`,
      resource: `Install: ${card.cost} • Influence ${card.factioncost}`,
      program: `Install ${card.cost} • Memory: ${card.memoryunits}${typeof card.strength === "number" ? ` • Strength: ${card.strength}` : ""} • Influence: ${card.factioncost}`,
      asset: `Rez: ${card.cost} • Trash: ${card.trash} • Influence: ${card.factioncost}`,
      ice: `Rez: ${card.cost} • Strength: ${card.strength} • Influence: ${card.factioncost}`
    };
    formats.event = formats.operation;
    formats.hardware = formats.resource;
    formats.upgrade = formats.asset;

    return `*${card.uniqueness ? '◆ ' : ''}${card.title}*
${card.type}${card.subtype ? `: ${card.subtype}` : ''}
${formats[card.type_code]}
${multiline(line => `> ${line}`)(clean(card.text))}
${card.flavor ? multiline(line => `_${line}_`)(clean(card.flavor)) : ''}
${card.faction} • ${card.illustrator} • ${card.setname} #${card.number}`;
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
