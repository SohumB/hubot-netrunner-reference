export function clean(text) {
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

export function multiline(fn) {
  return lines => lines.split(/\r?\n/).map(fn).join("\n");
}

export default function render(card) {
  const formats = {
    agenda: `Adv: ${card.advancementcost} • Score: ${card.agendapoints}${card.factioncost > 0 ? ` • Influence: ${card.factioncost}` : ""}`,
    identity: card.side_code === "corp" ?
      `Deck: ${card.minimumdecksize} • Influence: ${card.influencelimit || '—'}` :
      `Link: ${card.baselink} • Deck: ${card.minimumdecksize} • Influence: ${card.influencelimit || '—'}`,
    operation: `Cost: ${card.cost} • Influence: ${card.factioncost}`,
    resource: `Install: ${card.cost} • Influence ${card.factioncost}`,
    program: `Install ${card.cost} • Memory: ${card.memoryunits}${typeof card.strength === "number" || card.strength === "X" ? ` • Strength: ${card.strength}` : ""} • Influence: ${card.factioncost}`,
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
