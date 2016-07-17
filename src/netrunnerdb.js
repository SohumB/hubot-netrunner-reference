"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-polyfill");

var _render = require("./netrunnerdb/render");

var _render2 = _interopRequireDefault(_render);

var _nrdb = require("./netrunnerdb/nrdb");

var _nrdb2 = _interopRequireDefault(_nrdb);

var _search = require("./netrunnerdb/search");

var _search2 = _interopRequireDefault(_search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

exports.default = function (robot) {
  var search = function search(str) {
    throw new Error("NetrunnerDB data not loaded yet!");
    return null;
  };

  // Load NDB on startup
  (0, _nrdb2.default)().then(function (_ref) {
    var cards = _ref.cards;
    var types = _ref.types;

    search = (0, _search2.default)(cards, new Set(types), function () {
      return robot.brain.get("hubot-alias-table");
    });
  });

  function interact(query, res, transform) {
    var card = search(query);
    if (card) {
      res.send(transform(card));
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

  registerRegex(/(nrdb|netrunner(db)?) (.*)/i, 3, function (card) {
    return card.imagesrc;
  });
  registerRegex(/(nrtx|netrunner(db)?text) (.*)/i, 3, _render2.default);
  robot.hear(/\[\[[^\]]+\]\]/g, function (res) {
    res.match.forEach(function (match) {
      var query = match.slice(2, match.length - 2);
      interact(query, res, _render2.default);
    });
  });
};

module.exports = exports['default'];
