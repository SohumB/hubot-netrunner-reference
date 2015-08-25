# hubot-netrunnerdb

A hubot script that retrieves Netrunner card images from NetrunnerDB.com

See [`src/netrunnerdb.coffee`](src/netrunnerdb.coffee) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-netrunnerdb --save`

Then add **hubot-netrunnerdb** to your `external-scripts.json`:

```json
["hubot-netrunnerdb"]
```

## Sample Interaction

```
user1>> hubot nrdb jackson howard
hubot>> http://netrunnerdb.com/bundles/netrunnerdbcards/images/cards/en/04015.png
```
