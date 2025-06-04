import {createElement} from '../render.js';

function createListPoints() {
  return '<ul class="trip-events__list">';
}

export default class ListPointsView {
  getTemplate() {
    return createListPoints();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
