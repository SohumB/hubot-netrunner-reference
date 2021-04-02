const Helper = require('hubot-test-helper');
const helper = new Helper('../src/netrunnerdb.js');

describe("interactive functionality", () => {
  var room;

  beforeEach(() => { 
    global.hubot_netrunner_reference_localFile = './nrdb.blob.json';
    room = helper.createRoom(); 
    return global.hubot_netrunner_reference_data_pending; 
  });
  afterEach(() => room.destroy());

  it("responds to nrdb", async function() {
    await room.user.say('alice', '@hubot nrdb jackson howard');
    room.messages.should.eql([
      ['alice', '@hubot nrdb jackson howard'],
      ['hubot', 'https://netrunnerdb.com/card_image/large/04015.jpg']
    ]);
  });

  it("responds to nrtx", async function() {
    await room.user.say('alice', '@hubot nrtx noise');
    room.messages.should.eql([
      ['alice', '@hubot nrtx noise'],
      ['hubot', `**Noise: Hacker Extraordinaire**
Identity: G-mod
Link: 0 • Deck: 45 • Influence: 15
> Whenever you install a **virus** program, the Corp trashes the top card of R&D.
_"Watch this. It'll be funny."_
Anarch • Ralph Beisner • Core Set #1`]
    ]);
  });

  it('responds to [[]]', async function() {
    await room.user.say('bobul', 'Noise really loves installing [[cache]] and selling it off to [[aesop]]');
    room.messages.should.eql([
      ['bobul', 'Noise really loves installing [[cache]] and selling it off to [[aesop]]'],
      ['hubot', `**Cache**
Program: Virus
Install 1 • Memory: 1 • Influence: 1
> Place 3 virus counters on Cache when it is installed.
> **Hosted virus counter:** Gain 1:credit:.
_"People keep saying that 'Cash is king' in the business, like it's untraceable in the days of DNA sniffers and microtracers. Digital credits can be just as anonymous, and they're just as easy to counterfeit." -Silhouette_
Criminal • Ed Mattinian • Salvaged Memories #4`],
['hubot', `**◆ Aesop's Pawnshop**
Resource: Connection - Location
Install: 1 • Influence: 2
> When your turn begins, you may trash 1 of your other installed cards. If you do, gain 3:credit:.
_If you have something to sell, Aesop is interested in buying. The only detail he won't ask is where you got it._
Shaper • Krembler & Alexis Spicer • System Update 2021 #35`]
    ]);
  });

});
