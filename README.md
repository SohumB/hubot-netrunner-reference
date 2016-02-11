# hubot-netrunner-reference

A hubot script that retrieves Netrunner card images and text from netrunnerdb.com

## Installation

In hubot project repo, run:

`npm install hubot-netrunner-reference --save`

Then add **hubot-netrunner-reference** to your `external-scripts.json`:

```json
["hubot-netrunner-reference"]
```

We use Slack output syntax; pull requests welcome to support other
platforms. We also output emoji as `:click:`, `:credit:`, `:mu:`,
`:links:`, `:trash:`, `:recurringcredit:`, and `:subroutine:`. Grab
them from https://github.com/MWDelaney/Netrunner-Icon-Font and upload
them to your Slack.

## Syntax

```
> hubot netrunner|netrunnerdb|nrdb <card name>
> hubot netrunnertext|netrunnerdbtext|nrtx <card name>
> mention a [[card name]] in double square brackets
```

Whenever a card name is expected, we support prepending it with a card
type or subtype, so `program/hive` finds Hivemind, not the ICE. (`id`
and `breaker` are supported as shorthand for `identity` and
`icebreaker`.)

If you have `hubot-alias` installed, we tap into its list of aliases as well.

## Sample Interaction

```
user1>> hubot nrdb jackson howard
hubot>> http://netrunnerdb.com/bundles/netrunnerdbcards/images/cards/en/04015.png
user2>> hubot nrtx noise
hubot>> *Noise: Hacker Extraordinaire*
Identity: G-Mod
Link: 0 • Deck: 45 • Influence: 15
> Whenever you install a *virus* program, the Corp trashes the top card of R&D.
_"Watch this. It'll be funny."_
Anarch • Ralph Beisner • Core Set #1
user3>> Noise really loves installing [[cache]] and selling it off to [[aesop]]
hubot>> *Cache*
Program: Virus
Install 1 • Memory: 1 • Influence: 1
> Place 3 virus counters on Cache when it is installed.
> *Hosted virus counter*: Gain 1:credit:.
_"People keep saying that 'Cash is king' in the business, like it's untraceable in the days of DNA sniffers and microtracers. Digital credits can be just as anonymous, and they're just as easy to counterfeit." —Silhouette_
Criminal • Ed Mattinian • The Spaces Between #37
*◆ Aesop's Pawnshop*
Resource: Location - Connection
Install: 1 • Influence 2
> When your turn begins, you may trash another of your installed cards to gain 3:credit:.
_You didn't mention Aesop's arm unless you wanted an earful. Sometimes he talked about it in such a way that you wondered why he didn't laser his other arm off as well._
Shaper • Adam Schumpert • Core Set #47
user4>> hubot alias doomblade=parasite
user4>> He also loves [[doomblade]]
hubot>> *Parasite*
Program: Virus
Install 2 • Memory: 1 • Influence: 2
> Install Parasite only on a rezzed piece of ice.
> Host ice has −1 strength for each virus counter on Parasite and is trashed if its strength is 0 or less.
> When your turn begins, place 1 virus counter on Parasite.

Anarch • Bruno Balixa • Core Set #12
```

## Development

Code is in the `es6` folder, and it gets built to the `src` folder by
`grunt` to be picked up by hubot. Tests are in `test`, and they're run
as es6 directly by `mocha` and `babel-register`; just run `npm test`.
