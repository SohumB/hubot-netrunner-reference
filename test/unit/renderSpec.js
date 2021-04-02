const nrdb = require("../../src/netrunnerdb/nrdb.js");
const render = require("../../src/netrunnerdb/render.js");

describe("Card Rendering", () => {
  var cards, card;

  before(async function() {
    const { cards: { data, map } } = await nrdb("./nrdb.blob.json");
    cards = data;
    card = map;
  });

  it("should render multiline flavourtext correctly", () => {
    render(card["01111"]).should.equal(`**Enigma**
Ice: Code Gate
Rez: 3 • Strength: 2 • Influence: 0
> :subroutine: The Runner loses :click:.
> :subroutine: End the run.
_"Hey, hey! Wake up, man. You were under a long time. What'd you see?"_
_"I…don't remember."_
Neutral • Liiga Smilshkalne • Core Set #111`);
  });

  it("should render operations with X costs correctly", () => {
    render(card["01085"]).should.equal(`**Psychographics**
Operation
Cost: X • Influence: 3
> X must be equal to or less than the number of tags the Runner has.
> Place X advancement counters on 1 installed card you can advance.
_Access to the largest consumer database in the galaxy has its advantages._
NBN • Matt Zeilinger • Core Set #85`);
  });

  it("should render programs with X strengths correctly", () => {
    render(card["02102"]).should.equal(`**Darwin**
Program: Icebreaker - AI - Virus
Install 3 • Memory: 1 • Strength: X • Influence: 3
> 2:credit:: Break ice subroutine.
> X is the number of virus counters on Darwin.
> When your turn begins, you may pay 1:credit: to place 1 virus counter on Darwin.

Anarch • Liiga Smilshkalne • Future Proof #102`);
  });

  it("should render programs without strengths correctly", () => {
    render(card["26026"]).should.equal(`**Rezeki**
Program
Install 2 • Memory: 1 • Influence: 1
> When your turn begins, gain 1:credit:.
_"It takes such simple things to sustain us, the most important of which is to be thankful." -Lat_
Shaper • Jakuza • Downfall #26`);
  });

  it("should render agendas without influence", () => {
    render(card["01106"]).should.equal(`**Priority Requisition**
Agenda: Security
Adv: 5 • Score: 3
> When you score Priority Requisition, you may rez a piece of ice ignoring all costs.
_"If it isn't in my terminal by six p.m., heads are going to roll!"_
Neutral • Gong Studios • Core Set #106`);
  });

  it("should render agendas with influence", () => {
    render(card["Global Food Initiative"]).should.equal(`**Global Food Initiative**
Agenda: Initiative
Adv: 5 • Score: 3 • Influence: 1
> Global Food Initiative is worth 1 fewer agenda point while in the Runner's score area.
_"Corporations are made up of people. It's ridiculous to think they'd be either all good or all bad." -Sunny Lebeau_
Neutral • Meg Owenson • Data and Destiny #26`);
  });

  it("should render normal ice normally", () => {
    render(card["01113"]).should.equal(`**Wall of Static**
Ice: Barrier
Rez: 3 • Strength: 3 • Influence: 0
> :subroutine: End the run.
_"There's nothing worse than seeing that beautiful blue ball of data just out of reach as your connection derezzes. I think they do it just to taunt us." -Ele "Smoke" Scovak_
Neutral • Adam S. Doyle • Core Set #113`);
  });

  it("should render ice with trash costs", () => {
    render(card["Chrysalis"]).should.equal(`**Chrysalis**
Ice: Sentry - AP
Rez: 3 • Strength: 2 • Trash: 1 • Influence: 2
> If Chrysalis is accessed from R&D, the Runner must reveal it.
> When the Runner accesses Chrysalis, he or she encounters it. Ignore this ability if the Runner accesses Chrysalis from Archives.
> :subroutine: Do 2 net damage.

Jinteki • Donald Crank • 23 Seconds #13`);
  });

  it("should render operations correctly", () => {
    render(card["01110"]).should.equal(`**Hedge Fund**
Operation: Transaction
Cost: 5 • Influence: 0
> Gain 9:credit:.
_Hedge Fund. Noun. An ingenious device by which the rich get richer even while every other poor SOB is losing his shirt. -The Anarch's Dictionary, Volume Who's Counting?_
Neutral • Gong Studios • Core Set #110`);
  });

  it("should render events correctly", () => {
    render(card["04109"]).should.equal(`**Lucky Find**
Event: Double
Cost: 3 • Influence: 2
> As an additional cost to play this event, spend :click:.
> Gain 9:credit:.
_Data hunters always pay top dollar for old drives. The more useless the data, the higher the payout._
Neutral • Gong Studios • Double Time #109`);
  });

  it("should render operations with trash costs", () => {
    render(card["BOOM!"]).should.equal(`**BOOM!**
Operation: Double - Black Ops
Cost: 4 • Trash: 1 • Influence: 3
> Play only if the Runner has at least 2 tags.
> As an additional cost to play this operation, spend :click:.
> Do 7 meat damage.
_Game over._
Weyland Consortium • JuanManuel Tumburus • Escalation #58`);
  });

  it("should render runner identities correctly", () => {
    render(card["01017"]).should.equal(`**Gabriel Santiago: Consummate Professional**
Identity: Cyborg
Link: 0 • Deck: 45 • Influence: 15
> The first time you make a successful run on HQ each turn, gain 2:credit:.
_"Of course I steal from the rich. They're the ones with all the money."_
Criminal • Ralph Beisner • Core Set #17`);
  });

  it("should render corp identities correctly", () => {
    render(card["09002"]).should.equal(`**New Angeles Sol: Your News**
Identity: Division
Deck: 45 • Influence: 15
> Whenever an agenda is scored or stolen, you may play 1 **current** from HQ or Archives (paying its play cost).
_Nothing but the Truth._
NBN • Maciej Rebisz • Data and Destiny #2`);
  });

  it("should render resources correctly", () => {
    render(card["03050"]).should.equal(`**Borrowed Satellite**
Resource: Link
Install: 3 • Influence: 2
> +1:link:
> Your maximum hand size is increased by 1.
_Some people have their own satellite receiver. Others have their own satellite._
Shaper • Trudi Castle • Creation and Control #50`);
  });

  it("should render assets correctly", () => {
    render(card["02075"]).should.equal(`**Net Police**
Asset
Rez: 1 • Trash: 1 • Influence: 2
> X:recurringcredit:
> Use these credits during traces. X is the number of links the Runner has.
_This is the net. We work here. We're cops._
NBN • Amelie Hutt • A Study in Static #75`);
  });

   it("should render hardware correctly", () => {
    render(card["30014"]).should.equal(`**◆ Pennyshaver**
Hardware: Console
Install: 3 • Influence: 3
> +1:mu:
> Whenever you make a successful run, place 1:credit: on this hardware.
> :click:: Place 1:credit: on this hardware, then take all credits from it.
> Limit 1 **console** per player.
_"Braggarts chase big heists. Patience enriches skimming fractions of a credit at a time." —Zahya_
Criminal • Martin de Diego Sādaba • System Gateway #14`);
  });

  
});
