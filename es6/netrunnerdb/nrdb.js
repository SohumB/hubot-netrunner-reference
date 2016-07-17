import request from "request-promise";
import "babel-polyfill";

export default function nrdb() {
  return request("http://netrunnerdb.com/api/cards/")
    .then(json => {
      const cards = JSON.parse(json);

      const types = cards.reduce((acc, card) => {
        acc.add(card.type_code);
        card.subtype_code.split(' - ').forEach(subtype => acc.add(subtype));
        return acc;
      }, new Set());

      return { cards, types };
    });
}
