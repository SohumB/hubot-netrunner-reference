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

  it("should render agendas without influence", () => {
    render(card("Priority Requisition")).should.equal(`*Priority Requisition*
Agenda: Security
Adv: 5 • Score: 3
> When you score Priority Requisition, you may rez a piece of ice ignoring all costs.
_"If it isn't in my terminal by six p.m., heads are going to roll!"_
Neutral • Gong Studios • Core Set #106`);
  });

  it("should render agendas with influence", () => {
    render(card("Global Food Initiative")).should.equal(`*Global Food Initiative*
Agenda: Initiative
Adv: 5 • Score: 3 • Influence: 1
> Global Food Initiative is worth 1 fewer agenda point while in the Runner's score area.
_"Corporations are made up of people. It's ridiculous to think they'd be either all good or all bad." -Sunny Lebeau_
Neutral • Meg Owenson • Data and Destiny #26`);
  });

  it("should render normal ice normally", () => {
    render(card("Wall of Static")).should.equal(`*Wall of Static*
ICE: Barrier
Rez: 3 • Strength: 3 • Influence: 0
> :subroutine: End the run.
_"There's nothing worse than seeing that beautiful blue ball of data just out of reach as your connection derezzes. I think they do it just to taunt us." -Ele "Smoke" Scovak_
Neutral • Adam S. Doyle • Core Set #113`);
  });

  it("should render ice with trash costs", () => {
    render(card("Chrysalis")).should.equal(`*Chrysalis*
ICE: Sentry - AP
Rez: 3 • Strength: 2 • Trash: 1 • Influence: 2
> If Chrysalis is accessed from R&D, the Runner must reveal it.
> When the Runner accesses Chrysalis, he or she encounters it. Ignore this ability if the Runner accesses Chrysalis from Archives.
> :subroutine: Do 2 net damage.

Jinteki • Donald Crank • 23 Seconds #13`);
  });

  it("should render normal operations normally", () => {
    render(card("Hedge Fund")).should.equal(`*Hedge Fund*
Operation: Transaction
Cost: 5 • Influence: 0
> Gain 9:credit:.
_Hedge Fund. Noun. An ingenious device by which the rich get richer even while every other poor SOB is losing his shirt. -The Anarch's Dictionary, Volume Who's Counting?_
Neutral • Gong Studios • Core Set #110`);
  });

  it("should render operations with trash costs", () => {
    render(card("BOOM!")).should.equal(`*BOOM!*
Operation: Double - Black Ops
Cost: 4 • Trash: 1 • Influence: 3
> Play only if the Runner has at least 2 tags.
> As an additional cost to play this operation, spend :click:.
> Do 7 meat damage.
_Game over._
Weyland Consortium • JuanManuel Tumburus • Escalation #58`);
  });

});
