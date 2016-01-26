"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // Description:
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

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-polyfill");

var _fuse = require("fuse.js");

var _fuse2 = _interopRequireDefault(_fuse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (robot) {
  // Load NDB on startup
  robot.http("http://netrunnerdb.com/api/cards/").get()(function (err, res, body) {
    var cards = JSON.parse(body);
    var types = cards.reduce(function (acc, card) {
      acc.add(card.type_code);
      card.subtype_code.split(' - ').forEach(function (subtype) {
        return acc.add(subtype);
      });
      return acc;
    }, new Set());

    robot.brain.set("cards", cards);
    robot.brain.set("card_types", Array.from(types));
  });

  function search(orig) {
    var allCards = robot.brain.get("cards");
    var types = new Set(robot.brain.get("card_types"));
    types.add("id");

    var aliases = robot.brain.get("hubot-alias-table") || {};
    var text = aliases[orig] || orig;

    var match = text.match(/([^/]+)\/(.+)/);
    var usingFlag = match && types.has(match[1]);

    var cards = usingFlag ? allCards.filter(function (card) {
      var flag = match[1];
      var typ = flag === "id" ? "identity" : flag;
      return card.type_code === typ || card.subtype_code.indexOf(flag) > -1;
    }) : allCards;

    var query = usingFlag ? match[2] : text;

    var options = {
      caseSensitive: false,
      include: ['score'],
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      keys: ['title']
    };
    return new _fuse2.default(cards, options).search(query);
  }

  function interact(query, res, transform) {
    var cards = search(query);
    if (cards.length > 0) {
      var card = cards.filter(function (c) {
        return c.score === cards[0].score;
      }).sort(function (c1, c2) {
        return c1.item.title.length - c2.item.title.length;
      })[0];
      res.send(transform(card.item));
    } else {
      res.send("Couldn't find a Netrunner card name matching \"" + query + "\"");
    }
  }

  function registerRegex(rgx, index, transform) {
    robot.respond(rgx, function (res) {
      var query = res.match[index];
      interact(query, res, transform);
    });
  }

  function clean(text) {
    var unicodes = {
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

    var replacements = [[/\[Click\]/g, ':click:'], [/\[Credits\]/gm, ':credit:'], [/\[Trash\]/gm, ':trash:'], [/\[Link\]/gm, ':links:'], [/\[Memory Unit\]/gm, ':mu:'], [/\[Recurring Credits\]/gm, ':recurringcredit:'], [/\[Subroutine\]/gm, ':subroutine:'], [/<\/?strong>/gm, '*'], [/<sup>[0-9Xx]<\/sup>/gm, function (match) {
      return unicodes[match.replace(/<\/?sup>/g, '')];
    }]];

    return replacements.reduce(function (acc, _ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var needle = _ref2[0];
      var haystack = _ref2[1];
      return acc.replace(needle, haystack);
    }, text || "");
  }

  function multiline(fn) {
    return function (lines) {
      return lines.split("\n").map(fn).join("\n");
    };
  }

  function render(card) {
    var formats = {
      agenda: "Adv: " + card.advancementcost + " • Score: " + card.agendapoints,
      identity: card.side_code === "corp" ? "Deck: " + card.minimumdecksize + " • Influence: " + (card.influencelimit || '—') : "Link: " + card.baselink + " • Deck: " + card.minimumdecksize + " • Influence: " + (card.influencelimit || '—'),
      operation: "Cost: " + card.cost + " • Influence: " + card.factioncost,
      resource: "Install: " + card.cost + " • Influence " + card.factioncost,
      program: "Install " + card.cost + " • Memory: " + card.memoryunits + (typeof card.strength === "number" ? " • Strength: " + card.strength : "") + " • Influence: " + card.factioncost,
      asset: "Rez: " + card.cost + " • Trash: " + card.trash + " • Influence: " + card.factioncost,
      ice: "Rez: " + card.cost + " • Strength: " + card.strength + " • Influence: " + card.factioncost
    };
    formats.event = formats.operation;
    formats.hardware = formats.resource;
    formats.upgrade = formats.asset;

    return "*" + (card.uniqueness ? '◆ ' : '') + card.title + "*\n" + card.type + (card.subtype ? ": " + card.subtype : '') + "\n" + formats[card.type_code] + "\n" + multiline(function (line) {
      return "> " + line;
    })(clean(card.text)) + "\n" + (card.flavor ? multiline(function (line) {
      return "_" + line + "_";
    })(clean(card.flavor)) : '') + "\n" + card.faction + " • " + card.illustrator + " • " + card.setname + " #" + card.number;
  }

  registerRegex(/(nrdb|netrunner(db)?) (.*)/i, 3, function (card) {
    return "http://netrunnerdb.com" + card.imagesrc;
  });
  registerRegex(/(nrtx|netrunner(db)?text) (.*)/i, 3, render);
  robot.hear(/\[\[[^\]]+\]\]/g, function (res) {
    res.match.forEach(function (match) {
      var query = match.slice(2, match.length - 2);
      interact(query, res, render);
    });
  });
};

module.exports = exports['default'];
