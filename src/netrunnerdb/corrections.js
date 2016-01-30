"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [{
  test: function test(card) {
    return ["Ad Blitz", "Angel Arena", "Bribery", "Psychographics"].includes(card.title);
  },
  fix: function fix(card) {
    return card.cost = "X";
  }
}, {
  test: function test(card) {
    return ["Darwin"].includes(card.title);
  },
  fix: function fix(card) {
    return card.strength = "X";
  }
}];
module.exports = exports['default'];
