const bent = require("bent");
const fs = require("fs").promises;

async function getBlob(localFile) {
  if (localFile) {
    try {
      const data = await fs.readFile(localFile);
      return JSON.parse(data);
    } catch {
      // noop, we need to fetch this data anyway
    }
  }
  const getStream = bent('https://netrunnerdb.com/');
  const cardsData = await getStream('api/2.0/public/cards?_locale=en');
  const cards = await cardsData.json();
  const packsData = await getStream('api/2.0/public/packs?_locale=en');
  const packs = await packsData.json();
  const cyclesData = await getStream('api/2.0/public/cycles?_locale=en');
  const cycles = await cyclesData.json();
  const factionsData = await getStream('api/2.0/public/factions?_locale=en');
  const factions = await factionsData.json();
  
  const blob = { cards, packs, cycles, factions };
  if (localFile) {
    await fs.writeFile(localFile, JSON.stringify(blob));
  }
  return blob;
}

module.exports = async function nrdb(localFile) {
  const { cards, packs, cycles, factions } = await getBlob(localFile);

  factions.map = {};
  for (const faction of factions.data) {
    factions.map[faction.code] = faction;
  }

  packs.map = {};
  for (const pack of packs.data) {
    packs.map[pack.code] = pack;
  }

  cycles.map = {};
  for (const cycle of cycles.data) {
    cycles.map[cycle.code] = cycle;
  }

  cards.map = {};
  cards.types = new Set();
  for (var card of cards.data) {
    cards.map[card.code] = card; 
    cards.map[card.title] = card;

    cards.types.add(card.type_code);
    const subtypes = card.keywords ? card.keywords.split(' - ') : [];
    for (const subtype of subtypes) {
      cards.types.add(subtype.toLowerCase());
    } 

    card.faction = factions.map[card.faction_code].name;
    card.type = card.type_code[0].toUpperCase() + card.type_code.slice(1);
    card.pack = packs.map[card.pack_code].name;
    card.image_url = cards.imageUrlTemplate.replace('{code}', card.code);
    
  }
  return { cards, packs, cycles, factions };
}
