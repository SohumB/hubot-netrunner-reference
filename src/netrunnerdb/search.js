"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = search;

var _fuse = require("fuse.js");

var _fuse2 = _interopRequireDefault(_fuse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function search(cards, types, aliases) {
  var typeAliases = { id: "identity", breaker: "icebreaker" };
  Object.keys(typeAliases).forEach(function (key) {
    return types.add(key);
  });
  aliases = aliases || function () {
    return {};
  };

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

  return function (string) {
    var text = (aliases() || {})[string] || string;

    var match = text.match(/([^/]+)\/(.+)/);
    var flag = match && (typeAliases[match[1]] || types.has(match[1]) && match[1]);

    var selectedCards = flag ? cards.filter(function (card) {
      return card.type_code === flag || card.subtype_code.indexOf(flag) > -1;
    }) : cards;

    var query = flag ? match[2] : text;

    var found = new _fuse2.default(selectedCards, options).search(query);

    var card = found.filter(function (c) {
      return c.score === found[0].score;
    }).sort(function (c1, c2) {
      return c1.item.title.length - c2.item.title.length;
    })[0];

    return card && card.item;
  };
}
module.exports = exports['default'];
