'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clean = clean;
exports.multiline = multiline;
exports.default = render;
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
    agenda: 'Adv: ' + card.advancementcost + ' • Score: ' + card.agendapoints,
    identity: card.side_code === "corp" ? 'Deck: ' + card.minimumdecksize + ' • Influence: ' + (card.influencelimit || '—') : 'Link: ' + card.baselink + ' • Deck: ' + card.minimumdecksize + ' • Influence: ' + (card.influencelimit || '—'),
    operation: 'Cost: ' + card.cost + ' • Influence: ' + card.factioncost,
    resource: 'Install: ' + card.cost + ' • Influence ' + card.factioncost,
    program: 'Install ' + card.cost + ' • Memory: ' + card.memoryunits + (typeof card.strength === "number" ? ' • Strength: ' + card.strength : "") + ' • Influence: ' + card.factioncost,
    asset: 'Rez: ' + card.cost + ' • Trash: ' + card.trash + ' • Influence: ' + card.factioncost,
    ice: 'Rez: ' + card.cost + ' • Strength: ' + card.strength + ' • Influence: ' + card.factioncost
  };
  formats.event = formats.operation;
  formats.hardware = formats.resource;
  formats.upgrade = formats.asset;

  return '*' + (card.uniqueness ? '◆ ' : '') + card.title + '*\n' + card.type + (card.subtype ? ': ' + card.subtype : '') + '\n' + formats[card.type_code] + '\n' + multiline(function (line) {
    return '> ' + line;
  })(clean(card.text)) + '\n' + (card.flavor ? multiline(function (line) {
    return '_' + line + '_';
  })(clean(card.flavor)) : '') + '\n' + card.faction + ' • ' + card.illustrator + ' • ' + card.setname + ' #' + card.number;
}
