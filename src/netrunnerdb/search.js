const Fuse = require("fuse.js");

module.exports = function search(cards, types, aliases) {
  const typeAliases = { id: "identity", breaker: "icebreaker" };
  Object.keys(typeAliases).forEach(key => types.add(key));
  aliases = aliases || (() => ({}));

  const options = {
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    threshold: 0.6,
    keys: ['title']
  };

  return function(string) {
    const text = (aliases() || {})[string] || string;

    const match = text.match(/([^/]+)\/(.+)/);
    const flag = match && (typeAliases[match[1]] || (types.has(match[1]) && match[1]));

    const selectedCards = flag ? cards.filter(card => {
      return (card.type_code === flag) || (card.keywords || "").toLowerCase().indexOf(flag) > -1;
    }) : cards;

    const query = flag ? match[2] : text;

    const found = (new Fuse(selectedCards, options)).search(query);
    const scoreEq = c => c.score - found[0].score < 0.01;
    const sortFn = function(c1, c2) {
      // prefer shorter names
      let primary = c1.item.title.length - c2.item.title.length;
      // then, prefer newer reprints of cards
      let secondary = parseInt(c2.item.code, 10) - parseInt(c1.item.code, 10);
      return primary + secondary/1000000.0;
    }

    const card = found.filter(scoreEq).sort(sortFn)[0];

    return card && card.item;
  };
}
