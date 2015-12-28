# Description:
#   Simple NetrunnerDB.com card image / text fetcher
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
#   hubot nrtx <card name> - Displays the Netrunner card <card name>, as text
#   hubot netrunnertext <card name> - Displays the Netrunner card <card name>, as text
#   hubot netrunnerdbtext <card name> - Displays the Netrunner card <card name>, as text
#
# Author:
#   thalweg, SohumB
#

Fuse = require 'fuse.js'

module.exports = (robot) ->
  robot.http("http://netrunnerdb.com/api/cards/")
    .get() (err, res, body) ->
      robot.brain.set 'cards', JSON.parse body

  search = (query) ->
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
    fuse.search(query)

  respondToUser = (query, res, fn) ->
    results = search query

    if results.length > 0
      res.send fn(results[0])
    else
      res.send "Couldn't find a Netrunner card name matching \"#{query}\""

  searchOn = (rgx, index, success) ->
    robot.respond rgx, (msg) ->
      query = msg.match[index]
      respondToUser query, msg, success

  searchOn /(nrdb|netrunner(db)?) (.*)/i, 3, (card) -> "http://netrunnerdb.com#{card.imagesrc}"

  clean = (text) ->
    replacements = [
      [/\[Click\]/g, ':click:'],
      [/\[Credits\]/gm, ':credit:'],
      [/\[Trash\]/gm, ':trash:'],
      [/\[Link\]/gm, ':links:'],
      [/\[Memory Unit\]/gm, ':mu:'],
      [/\[Recurring Credits\]/gm, ':recurringcredit:'],
      [/\[Subroutine\]/gm, ':subroutine:'],
      [/<\/?strong>/gm, '*'],
      [/<sup>[0-9Xx]<\/sup>/gm, (match) ->
        unicodes = {
          0: '⁰'
          1: '¹'
          2: '²'
          3: '³'
          4: '⁴'
          5: '⁵'
          6: '⁶'
          7: '⁷'
          8: '⁸'
          9: '⁹'
          x: 'ˣ'
          X: 'ˣ'
        }
        unicodes[match.replace(/<\/?sup>/g, '')]
      ],
    ]
    replacements.reduce ((acc, [needle, haystack]) -> acc.replace(needle, haystack)), (text || "")

  multiline = (fn) -> (lines) ->
    lines.split("\n").map(fn).join("\n")

  cardText = (card) ->
    props = switch
      when card.type_code == 'agenda' then "Adv: #{card.advancementcost} • Score: #{card.agendapoints}"
      when card.type_code == 'identity' && card.side_code == 'corp' then "Deck: #{card.minimumdecksize} • Influence: #{ card.influencelimit || '—' }"
      when card.type_code == 'identity' && card.side_code == 'runner' then "Link: #{card.baselink} • Deck: #{card.minimumdecksize} • Influence: #{ card.influencelimit || '—' }"
      when card.type_code == 'operation' || card.type_code == 'event' then "Cost: #{card.cost} • Influence: #{card.factioncost}"
      when card.type_code == 'resource' || card.type_code == 'hardware' then "Install: #{card.cost} • Influence #{card.factioncost}"
      when card.type_code == 'program' then "Install #{card.cost} • Memory: #{card.memoryunits}" + (if card.strength then " • Strength: #{card.strength}" else '') + " • Influence: #{card.factioncost}"
      when card.type_code == 'asset' || card.type_code == 'upgrade' then "Rez: #{card.cost} • Trash: #{card.trash} • Influence: #{card.factioncost}"
      when card.type_code == 'ice' then "Rez: #{card.cost} • Strength: #{card.strength} • Influence: #{card.factioncost}"
    """
    *#{ if card.uniqueness then '◆ ' else '' }#{card.title}*
    #{card.type}#{ if card.subtype then ": #{card.subtype}" else ''}
    #{props}
    #{multiline((line) -> "> #{line}")(clean card.text)}
    #{ if card.flavor then "#{multiline((line) -> "_#{line}_")(clean card.flavor)}" else ''}
    #{card.faction} • #{card.illustrator} • #{card.setname} ##{card.number}
    """

  searchOn /(nrtx|netrunner(db)?text) (.*)/i, 3, cardText
  robot.hear /\[\[[^\]]+\]\]/g, (res) ->
    res.match.forEach (match) ->
      query = match.slice(2, match.length - 2)
      respondToUser query, res, cardText
