import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {Mode, POINT_TYPES, DESTINATIONS_NAMES, DEFAULT_POINT, DateFormat} from '../const.js';
import {humanizeDate} from '../util/util.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const upFirstLetter = (word) => `${word[0].toUpperCase()}${word.slice(1)}`;
const formatOfferTitle = (title) => title.split(' ').join('-').toLowerCase();


function createPointEdit(mode, point, destinations, offers) {
  const {basePrice, dateFrom, dateTo, type} = point;
  const offersInOffers = offers.find((offer) => offer.type === point.type).offers;
  const pointOffersInOffers = offersInOffers.filter((offerInOffers) => point.offers.includes(offerInOffers.id));
  const pointDestination = destinations.find((destination) => destination.id === point.destination);
  const {name, description, pictures} = pointDestination || {};
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
          <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination"
          value="${he.encode(name ? name : '')}" list="destination-list-${pointId}" required>
          <datalist id="destination-list-${pointId}">
            ${DESTINATIONS_NAMES.map((destinationName) => `<option value="${destinationName}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${humanizeDate(dateFrom, DateFormat.DATE_TIME)}" required>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${humanizeDate(dateTo, DateFormat.DATE_TIME)}" required>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${pointId}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${pointId}" type="number" name="event-price" value="${basePrice}" min="1" required>
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
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerInOffers.id}" type="checkbox"
        name="event-offer-${formatOfferTitle(offerInOffers.title)}" ${pointOffersInOffers.map((offer) => offer.id).includes(offerInOffers.id) ? 'checked' : '' } data-offer-id="${offerInOffers.id}">

        <label class="event__offer-label" for="event-offer-${offerInOffers.id}">
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

export default class EditPointView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #onFormSubmit = null;
  #rollupButtonClickHandler = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #onDeleteClick = null;

  constructor({mode = Mode.EDIT, point = DEFAULT_POINT, destinations = [], offers = [], onFormSubmit, onRollupButtonClick, onDeleteClick}) {
    super();
    this.mode = mode;
    this._setState(EditPointView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#rollupButtonClickHandler = onRollupButtonClick;
    this.#onDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEdit(this.mode, this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    if (this.#rollupButtonClickHandler) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupButtonClickHandler);
    }

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    if (this.#destinationChangeHandler) {
      this.element.querySelector('.event__input--destination')
        .addEventListener('change', this.#destinationChangeHandler);
    }

    this.element.querySelector('.event__input--price')
      .addEventListener('focus', this.#priceFocusHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offersChangeHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.#setDatepicker();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({...this._state, type: evt.target.value, offers: []});
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    const idDestination = selectedDestination ? selectedDestination.id : null;
    this.updateElement({...this._state, destination: idDestination});
  };

  #priceFocusHandler = (evt) => {
    evt.target.value = '';
  };

  #priceChangeHandler = (evt) => {
    const noNullPrice = evt.target.value.replace(/^0+/, '');
    this._setState({...this._state, basePrice: noNullPrice});
  };

  #offersChangeHandler = (evt) => {
    const checkedOffers = new Set([...this._state.offers]);
    if (evt.target.checked) {
      checkedOffers.add(evt.target.dataset.offerId);
    } else {
      checkedOffers.delete(evt.target.dataset.offerId);
    }
    this._setState({...this._state, offers: [...checkedOffers]});
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({...this._state, dateFrom: userDate});
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({...this._state, dateTo: userDate});
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #setDatepicker() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const commonConfig = {
      dateFormat: 'd/m/Y H:i',
      'time_24hr': true,
      locale: {
        firstDayOfWeek: 1
      },
      enableTime: true,
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate:  this._state.dateTo,
      },
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.dateFrom,
      },
    );
  }

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    const point = {...state};
    return point;
  }
}
