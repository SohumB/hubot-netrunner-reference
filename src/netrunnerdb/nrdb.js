"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nrdb;

var _corrections = require("./corrections");

var _corrections2 = _interopRequireDefault(_corrections);

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

require("babel-polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function nrdb() {
  return (0, _requestPromise2.default)("http://netrunnerdb.com/api/cards/").then(function (json) {
    var cards = JSON.parse(json).map(function (card) {
      return _corrections2.default.reduce(function (acc, correction) {
        if (correction.test(acc)) {
          correction.fix(acc);
        }
        return acc;
      }, card);
    });

    var types = cards.reduce(function (acc, card) {
      acc.add(card.type_code);
      card.subtype_code.split(' - ').forEach(function (subtype) {
        return acc.add(subtype);
      });
      return acc;
    }, new Set());

    return { cards: cards, types: types };
  });
}
module.exports = exports['default'];
