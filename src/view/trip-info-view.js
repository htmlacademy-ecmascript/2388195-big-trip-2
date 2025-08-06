import AbstractView from '../framework/view/abstract-view.js';
import {humanizeDate} from '../util/util.js';
import {DateFormat} from '../const.js';


function createTripInfo(points = [], destinations = [], offers = []) {
  if (points.length === 0) {
    return '';
  }
  const firstDestination = destinations.find((destination) => destination.id === points[0].destination).name;
  const secondDestination = destinations.find((destination) => destination.id === points[1].destination).name;
  const lastDestination = destinations.find((destination) => destination.id === points[points.length - 1].destination).name;
  const threeDestinations = `${firstDestination} - ${secondDestination} - ${lastDestination}`;
  const moreDestinations = `${firstDestination} - ... - ${lastDestination}`;

  const startDate = humanizeDate(points[0].dateFrom, DateFormat.DAY_MONTH) || '';
  const endDate = `- ${humanizeDate(points[points.length - 1].dateTo, DateFormat.DAY_MONTH)}` || '';

  const costsBasePrice = points.map((point) => point.basePrice).reduce((currentTotal, currentValue) => currentTotal + currentValue);
  const arrayPointsOffers = points.map((point) => point.offers).flat();
  const arrayOffersInOffers = offers.map((offer) => offer.offers).flat();
  const matchingItems = arrayOffersInOffers.filter((item) => arrayPointsOffers.includes(item.id));
  const costsOffersPrice = matchingItems.map((item) => item.price).reduce((currentTotal, currentValue) => currentTotal + currentValue);
  const totalCost = costsBasePrice + costsOffersPrice;
  let isThreeDestinations = false;
  if (points.length <= 3) {
    isThreeDestinations = true;
  }

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title"> ${isThreeDestinations ? threeDestinations : moreDestinations}</h1>
      <p class="trip-info__dates">${startDate} ${endDate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
  </section>`;
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfo(this.#points, this.#destinations, this.#offers);
  }
}
