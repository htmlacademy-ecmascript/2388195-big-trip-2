import AbstractView from '../framework/view/abstract-view.js';
import {Mode, POINT_TYPES, DEFAULT_POINT, DateFormat} from '../const.js';
import {humanizeDate} from '../util/util.js';

const upFirstLetter = (word) => `${word[0].toUpperCase()}${word.slice(1)}`;
const formatOfferTitle = (title) => title.split(' ').join('-').toLowerCase();


function createPointEdit(mode, point, destinations, offers) {
  const {basePrice, dateFrom, dateTo, type} = point;
  const offersInOffers = offers.find((offer) => offer.type === point.type).offers;
  const pointOffersInOffers = offersInOffers.filter((offerInOffers) => point.offers.includes(offerInOffers.id));
  const pointDestination = destinations.find((destination) => destination.id === point.destination);
  const {name, description, pictures} = pointDestination || {}; //пустой объект для того чтобы получить данные по деструктуризации
  const pointId = point.id;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${POINT_TYPES.map((pointType) => (
    `<div class="event__type-item">
        <input id="event-type-${pointType}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : ''} >
        <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${pointId}">${upFirstLetter(pointType)}</label>
      </div>`
  )).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${pointId}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${pointDestination ? name : ''}" list="destination-list-${pointId}">
          <datalist id="destination-list-${pointId}">
            ${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${humanizeDate(dateFrom, DateFormat.DATE_TIME)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${humanizeDate(dateTo, DateFormat.DATE_TIME)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${pointId}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${mode === Mode.EDIT ? 'Delete' : 'Cancel'}</button>
        ${mode === Mode.EDIT ? `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>` : ''}
      </header>
      <section class="event__details">

    ${offersInOffers.length ?
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

    ${offersInOffers.map((offerInOffers) => (
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${formatOfferTitle(offerInOffers.title)}-${pointId}" type="checkbox"
        name="event-offer-${formatOfferTitle(offerInOffers.title)}" ${pointOffersInOffers.map((offer) => offer.id).includes(offerInOffers.id) ? 'checked' : ''}>

        <label class="event__offer-label" for="event-offer-${formatOfferTitle(offerInOffers.title)}-${pointId}">
          <span class="event__offer-title">${offerInOffers.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offerInOffers.price}</span>
        </label>
      </div>`
  )).join('')}
          </div>
        </section>`
    : ''}

    ${pointDestination ? (
    `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
          ${pictures.length ? (
      `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)}
            </div>
          </div>`
    ) : ''}
        </section>`
  ) : ''}
      </section>
    </form>
  </li>`;
}

export default class EditPointView extends AbstractView {

  constructor(mode = Mode.EDIT, point = DEFAULT_POINT, destinations, offers) {
    super();
    this.mode = mode;
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  get template() {
    return createPointEdit(this.mode, this.point, this.destinations, this.offers);
  }

}
