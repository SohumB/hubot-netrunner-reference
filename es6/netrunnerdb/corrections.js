export default [{
  test: card => ["Ad Blitz", "Angel Arena", "Bribery", "Psychographics"].includes(card.title),
  fix: card => card.cost = "X"
}, {
  test: card => ["Darwin"].includes(card.title),
  fix: card => card.strength = "X"
}];
