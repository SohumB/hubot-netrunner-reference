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
  [/\[click\]/gm, ':click:'],
  [/\[credit\]/gm, ':credit:'],
  [/\[trash\]/gm, ':trash:'],
  [/\[link\]/gm, ':link:'],
  [/\[mu\]/gm, ':mu:'],
  [/\[recurring-credit\]/gm, ':recurringcredit:'],
  [/\[subroutine\]/gm, ':subroutine:'],
  [/<\/?strong>/gm, '**'],
  [/<sup>[0-9Xx]<\/sup>/gm, match => unicodes[match.replace(/<\/?sup>/g, '')]]
];

function clean(text) {
  return replacements.reduce((acc, [needle, haystack]) => acc.replace(needle, haystack), text || "");
}

function multiline(fn) {
  return lines => lines.split(/\r?\n/).map(fn).join("\n");
}

module.exports = function render(card) {
  const titleCase = w => w.replace(w[0], w[0].toUpperCase());

  const formats = {
    agenda: `Adv: ${card.advancement_cost} • Score: ${card.agenda_points}${card.faction_cost > 0 ? ` • Influence: ${card.faction_cost}` : ""}`,
    identity: card.side_code === "corp" ?
      `Deck: ${card.minimum_deck_size} • Influence: ${card.influence_limit || '—'}` :
      `Link: ${card.base_link} • Deck: ${card.minimum_deck_size} • Influence: ${card.influence_limit || '—'}`,
    operation: `Cost: ${card.cost ? card.cost : "X"} • ${typeof card.trash_cost === "number" ? `Trash: ${card.trash_cost} • ` : ""}Influence: ${card.faction_cost}`,
    resource: `Install: ${card.cost} • Influence: ${card.faction_cost}`,
    program: `Install ${card.cost} • Memory: ${card.memory_cost}${typeof card.strength === "number" || card.strength === null ? ` • Strength: ${card.strength ? card.strength : "X"}` : ""} • Influence: ${card.faction_cost}`,
    asset: `Rez: ${card.cost} • Trash: ${card.trash_cost} • Influence: ${card.faction_cost}`,
    ice: `Rez: ${card.cost} • Strength: ${card.strength} • ${typeof card.trash_cost === "number" ? `Trash: ${card.trash_cost} • ` : ""}Influence: ${card.faction_cost}`
  };
  formats.event = formats.operation;
  formats.hardware = formats.resource;
  formats.upgrade = formats.asset;
  
  return `**${card.uniqueness ? '◆ ' : ''}${card.title}**
${card.type}${card.keywords ? `: ${card.keywords}` : ''}
${formats[card.type_code]}
${multiline(line => `> ${line}`)(clean(card.text))}
${card.flavor ? multiline(line => `_${line}_`)(clean(card.flavor)) : ''}
${card.faction} • ${card.illustrator} • ${card.pack} #${card.position}`;
}
