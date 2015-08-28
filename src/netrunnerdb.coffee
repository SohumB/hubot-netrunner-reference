# Description:
#   Simple NetrunnerDB.com card image fetcher
#
# Dependencies:
#   none
#
# Configuration:
#   none
#
# Commands:
#   hubot nrdb <card name> - Displays the Netrunner card <card name>
#   hubot netrunner <card name> - Displays the Netrunner card <card name>
#   hubot netrunnerdb <card name> - Displays the Netrunner card <card name>
#
# Author:
#   thalweg
#

Fuse = require 'fuse.js'

module.exports = (robot) ->
  robot.http("http://netrunnerdb.com/api/cards/")
    .get() (err, res, body) ->
      robot.brain.set 'cards', JSON.parse body

  robot.respond /(nrdb|netrunner(db)?) (.*)/i, (msg) ->
    query = msg.match[3]
    cards = robot.brain.get('cards')

    options =
      caseSensitive: false
      includeScore: false
      shouldSort: true
      threshold: 0.6
      location: 0
      distance: 100
      maxPatternLength: 32
      keys: ['title']
    fuse = new Fuse cards, options
    results = fuse.search(query)

    if results.length > 0
      msg.send "http://netrunnerdb.com#{results[0].imagesrc}"
    else
      msg.send "Couldn't find a Netrunner card name matching \"#{query}\""

