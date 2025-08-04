import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoPointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'there are no future events now',
  [FilterType.PRESENT]: 'there are no present events now',
  [FilterType.PAST]: 'there are no past events now',
};

function createNoPointTemplate(filterType) {
  const noPointTextValue = NoPointTextType[filterType].toUpperCase();

  return (
    `<p class="trip-events__msg">
      ${noPointTextValue}
    </p>`
  );
}

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
