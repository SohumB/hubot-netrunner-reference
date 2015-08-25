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
#
# Author:
#   thalweg
#

module.exports = (robot) ->
  robot.http("http://netrunnerdb.com/api/cards/")
    .get() (err, res, body) ->
      robot.brain.set 'cards', JSON.parse body

  robot.respond /nrdb (.*)/i, (msg) ->
    cardName = msg.match[1]
    cards = robot.brain.get('cards')

    console.log "Looking for Netrunner card \"#{cardName}\" in #{cards.length} cards"
    results = []
    for card in cards
      if card.title.match(///#{cardName}///i)
        results.push("http://netrunnerdb.com#{card.imagesrc}")
        console.log "\"#{card.title}\" matched \"#{cardName}\""
    if results.length != 0
      msg.send results[0]
    else
      msg.send "Couldn't find a Netrunner card name matching \"#{cardName}\""

