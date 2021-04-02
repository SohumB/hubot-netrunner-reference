const nrdb = require("../../src/netrunnerdb/nrdb.js");
const searcher = require("../../src/netrunnerdb/search.js");

describe("Card Searching", () => {
  var cards, card, search, cleanSearch, nullSearch;

  before(async function () {
    const { cards: { data, map, types } } = await nrdb("./nrdb.blob.json");
    cards = data;
    card = map;
    cleanSearch = searcher(cards, types);
    nullSearch = searcher(cards, types, () => null);
    search = searcher(cards, types,
      () => ({ fisk: 'id/fisk', abtg: 'accelerated beta test' })
    );
  });

  it("should return undefined on names not found", () => {
    expect(search("xxyyzzzzyy")).to.equal(undefined);
    expect(cleanSearch("xxyyzzzzyy")).to.equal(undefined);
    expect(nullSearch("xxyyzzzzyy")).to.equal(undefined);
  });

  it("should search fuzzily", () => {
    search("grid overload").should.equal(card["Power Grid Overload"]);
    cleanSearch("grid overload").should.equal(card["Power Grid Overload"]);
    nullSearch("grid overload").should.equal(card["Power Grid Overload"]);
  });

  it("should prioritise shorter matches over longer matches", () => {
    search("hive").should.equal(card["Hive"]);
    search("hiv").should.equal(card["Hive"]);
  });

  it("should support flags", () => {
    search("hive").should.equal(card["Hive"]);
    search("program/hive").should.equal(card["Hivemind"]);
    search("virus/hive").should.equal(card["Hivemind"]);
  });

  it("should support aliases", () => {
    search("abtg").should.equal(card["Accelerated Beta Test"]);
  });

  it("should support flags in aliases", () => {
    cleanSearch("fisk").should.equal(card["Fisk Investment Seminar"]);
    nullSearch("fisk").should.equal(card["Fisk Investment Seminar"]);
    search("fisk").should.equal(card["Laramy Fisk: Savvy Investor"]);
  });

  it("should prefer newer reprints of cards", () => {
    cleanSearch("crowdfunding").should.equal(card["28002"]);
    nullSearch("crowdfunding").should.equal(card["28002"]);
    search("crowdfunding").should.equal(card["28002"]);
  });
});
