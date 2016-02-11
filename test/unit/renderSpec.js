import nrdb from "../../es6/netrunnerdb/nrdb";
import render from "../../es6/netrunnerdb/render";

describe("Card Rendering", () => {
  var cards;

  before(() => {
    return nrdb()
      .then(nrdb => cards = nrdb.cards);
  });

  function card(name) {
    return cards.filter(card => card.title === name)[0];
  }

  it("should render multiline flavourtext correctly", () => {
    render(card("Enigma")).should.equal(`*Enigma*
ICE: Code Gate
Rez: 3 • Strength: 2 • Influence: 0
> :subroutine: The Runner loses :click:, if able.
> :subroutine: End the run.
_"Hey, hey! Wake up man. You were under a long time. What'd you see?"_
_"I…don't remember."_
Neutral • Liiga Smilshkalne • Core Set #111`);
  });

  it("should render X costs correctly", () => {
    render(card("Psychographics")).should.equal(`*Psychographics*
Operation
Cost: X • Influence: 3
> X is equal to or less than the number of tags the Runner has.
> Place X advancement tokens on a card that can be advanced.
_Access to the largest consumer database in the galaxy has its advantages._
NBN • Matt Zeilinger • Core Set #85`);
  });

  it("should render X strengths correctly", () => {
    render(card("Darwin")).should.equal(`*Darwin*
Program: Icebreaker - AI - Virus
Install 3 • Memory: 1 • Strength: X • Influence: 3
> 2:credit:: Break ice subroutine.
> X is the number of virus counters on Darwin.
> When your turn begins, you may pay 1:credit: to place 1 virus counter on Darwin.

Anarch • Liiga Smilshkalne • Future Proof #102`);
  });

});
