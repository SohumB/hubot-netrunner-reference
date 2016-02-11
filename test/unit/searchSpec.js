import nrdb from "../../es6/netrunnerdb/nrdb";
import searcher from "../../es6/netrunnerdb/search";

describe("Card Searching", () => {
  var cards, search, cleanSearch, nullSearch;

  before(() => {
    return nrdb()
      .then(nrdb => {
        cards = nrdb.cards;
        cleanSearch = searcher(nrdb.cards, new Set(nrdb.types));
        nullSearch = searcher(nrdb.cards, new Set(nrdb.types), () => null);
        search = searcher(
          nrdb.cards,
          new Set(nrdb.types),
          () => ({ fisk: 'id/fisk', doomblade: 'parasite' })
        );
      });
  });

  function card(name) {
    return cards.filter(card => card.title === name)[0];
  }

  it("should return undefined on names not found", () => {
    expect(search("xyzzy")).to.equal(undefined);
    expect(cleanSearch("xyzzy")).to.equal(undefined);
    expect(nullSearch("xyzzy")).to.equal(undefined);
  });

  it("should search fuzzily", () => {
    search("overload").should.equal(card("Power Grid Overload"));
    cleanSearch("overload").should.equal(card("Power Grid Overload"));
    nullSearch("overload").should.equal(card("Power Grid Overload"));
  });

  it("should prioritise shorter matches over longer matches", () => {
    search("hive").should.equal(card("Hive"));
    search("hiv").should.equal(card("Hive"));
  });

  it("should support flags", () => {
    search("hive").should.equal(card("Hive"));
    search("program/hive").should.equal(card("Hivemind"));
    search("virus/hive").should.equal(card("Hivemind"));
  });

  it("should support aliases", () => {
    search("doomblade").should.equal(card("Parasite"));
  });

  it("should support flags in aliases", () => {
    cleanSearch("fisk").should.equal(card("Fisk Investment Seminar"));
    nullSearch("fisk").should.equal(card("Fisk Investment Seminar"));
    search("fisk").should.equal(card("Laramy Fisk: Savvy Investor"));
  });
});
