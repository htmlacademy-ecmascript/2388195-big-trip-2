import AbstractView from '../framework/view/abstract-view.js';

function createSortItem(sort, currentSortType) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sort}">
      <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}" data-sort="${sort}"
      ${sort === currentSortType ? 'checked' : ''}
      ${sort === 'event' || sort === 'offers' ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
    </div>`);
}

function createSorting(sorts, currentSortType) {
  const sortingTemplate = sorts.map((sort) => createSortItem(sort, currentSortType)).join('');
  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortingTemplate}
  </form>`;
}
export default class SortingView extends AbstractView {
  #onSortingTypeChange = null;
  #sorts = [];
  #currentSortType = null;

  constructor({sorts, currentSortType, onSortingTypeChange}) {
    super();
    this.#sorts = sorts;
    this.#currentSortType = currentSortType;
    this.#onSortingTypeChange = onSortingTypeChange;

    this.element.addEventListener('change', this.#sortingTypeChangeHandler);
  }

  get template() {
    return createSorting(this.#sorts, this.#currentSortType);
  }

  #sortingTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onSortingTypeChange(evt.target.dataset.sort);
  };
}
