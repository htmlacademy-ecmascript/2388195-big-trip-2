import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoPointTextType = {
  [FilterType.EVERYTHING]: 'click New Event to create your first point',
  [FilterType.FUTURE]: 'there are no future events now',
  [FilterType.PRESENT]: 'there are no present events now',
  [FilterType.PAST]: 'there are no past events now',
  [FilterType.ERROR]: 'failed to load latest route information',
};

function createNoPointTemplate(filterType, isError) {
  if (isError) {
    filterType = FilterType.ERROR;
  }
  const noPointTextValue = NoPointTextType[filterType].toUpperCase();
  return (
    `<p class="trip-events__msg">
      ${noPointTextValue}
    </p>`
  );
}

export default class NoPointView extends AbstractView {
  #filterType = null;
  #isError = null;

  constructor({filterType, isError}) {
    super();
    this.#filterType = filterType;
    this.#isError = isError;

  }

  get template() {
    return createNoPointTemplate(this.#filterType, this.#isError);
  }
}
