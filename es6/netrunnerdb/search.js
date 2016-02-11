import Fuse from "fuse.js";

export default function search(cards, types, aliases) {
  const typeAliases = { id: "identity", breaker: "icebreaker" };
  Object.keys(typeAliases).forEach(key => types.add(key));
  aliases = aliases || (() => ({}));

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

  return function(string) {
    const text = (aliases() || {})[string] || string;

    const match = text.match(/([^/]+)\/(.+)/);
    const flag = match && (typeAliases[match[1]] || (types.has(match[1]) && match[1]));

    const selectedCards = flag ? cards.filter(card => {
      return (card.type_code === flag) || card.subtype_code.indexOf(flag) > -1;
    }) : cards;

    const query = flag ? match[2] : text;

    const found = (new Fuse(selectedCards, options)).search(query);

    const card = found
            .filter(c => c.score === found[0].score)
            .sort((c1, c2) => c1.item.title.length - c2.item.title.length)[0];

    return card && card.item;
  };
}
