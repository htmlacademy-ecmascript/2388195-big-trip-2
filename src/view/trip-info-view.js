import AbstractView from '../framework/view/abstract-view.js';
import {humanizeDate} from '../util/util.js';
import {DateFormat} from '../const.js';

function createDestinations(points, destinations) {
  const firstDestination = destinations.find((destination) => destination.id === points[0]?.destination)?.name;
  const secondDestination = destinations.find((destination) => destination.id === points[1]?.destination)?.name;
  const lastDestination = destinations.find((destination) => destination.id === points[points.length - 1]?.destination)?.name;

  const oneDestination = firstDestination;
  const twoDestinations = `${firstDestination} - ${lastDestination}`;
  const threeDestinations = `${firstDestination} - ${secondDestination} - ${lastDestination}`;
  const moreDestinations = `${firstDestination} - ... - ${lastDestination}`;

  switch (points.length) {
    case 1:
      return oneDestination;
    case 2:
      return twoDestinations;
    case 3:
      return threeDestinations;
    default:
      return moreDestinations;
  }
}

function createStartDate(points) {
  return humanizeDate(points[0].dateFrom, DateFormat.DAY_MONTH);
}

function createEndDate(points) {
  return humanizeDate(points[points.length - 1].dateTo, DateFormat.DAY_MONTH);
}

function createTotalCost(points, offers) {
  const costsBasePrice = points.map((point) => point.basePrice).reduce((currentTotal, currentValue) => currentTotal + currentValue);
  const arrayPointsOffers = points.map((point) => point.offers).flat();
  const arrayOffersInOffers = offers.map((offer) => offer.offers).flat();
  const countId = arrayPointsOffers.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const costsOffersPrice = arrayOffersInOffers.reduce((sum, item) => {
    if (countId[item.id]) {
      sum += item.price * countId[item.id];
    }
    return sum;
  }, 0);

  return costsBasePrice + costsOffersPrice;
}

function createTripInfo(points, destinations, offers) {
  if (points.length <= 0) {
    return;
  }

  const destinationsTitle = createDestinations(points, destinations);
  const startDate = createStartDate(points);
  const endDate = createEndDate(points);
  const totalCost = createTotalCost(points, offers);


  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title"> ${destinationsTitle}</h1>
      <p class="trip-info__dates">${startDate} - ${endDate}</p>
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
