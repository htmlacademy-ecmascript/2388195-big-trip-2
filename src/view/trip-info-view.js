import AbstractView from '../framework/view/abstract-view.js';
import {humanizeDate} from '../util/util.js';
import {DateFormat, PointsLength} from '../const.js';

function createDestinations(points, destinations) {
  const firstDestination = destinations.find((destination) => destination.id === points[0]?.destination)?.name;
  const secondDestination = destinations.find((destination) => destination.id === points[1]?.destination)?.name;
  const lastDestination = destinations.find((destination) => destination.id === points[points.length - 1]?.destination)?.name;

  const oneDestinationTitle = firstDestination;
  const twoDestinationsTitle = `${firstDestination} - ${lastDestination}`;
  const threeDestinationsTitle = `${firstDestination} - ${secondDestination} - ${lastDestination}`;
  const moreDestinationsTitle = `${firstDestination} - ... - ${lastDestination}`;

  switch (points.length) {
    case PointsLength.ONE:
      return oneDestinationTitle;
    case PointsLength.TWO:
      return twoDestinationsTitle;
    case PointsLength.THREE:
      return threeDestinationsTitle;
    default:
      return moreDestinationsTitle;
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
  const pointsOffers = points.map((point) => point.offers).flat();
  const offersInOffers = offers.map((offer) => offer.offers).flat();
  const countId = pointsOffers.reduce((count, id) => {
    count[id] = (count[id] || 0) + 1;
    return count;
  }, {});

  const costsOffersPrice = offersInOffers.reduce((currentTotal, offer) => {
    if (countId[offer.id]) {
      currentTotal += offer.price * countId[offer.id];
    }
    return currentTotal;
  }, 0);

  return costsBasePrice + costsOffersPrice;
}

function createTripInfo(points, destinations, offers) {
  if (points.length === 0) {
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
