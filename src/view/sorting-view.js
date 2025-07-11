import AbstractView from '../framework/view/abstract-view.js';

function createSortItem(sort, currentSortType) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sort}">
      <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}"
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
  #handleSortingTypeChange = null;
  #sorts = [];
  #currentSortType = null;

  constructor({sorts, currentSortType, onSortingTypeChange}) {
    super();
    this.#sorts = sorts;
    this.#currentSortType = currentSortType; // Можно писать вот так (одинаковое имя в приватном классе и параметре)
    this.#handleSortingTypeChange = onSortingTypeChange; // или надо как здесь?

    this.element.addEventListener('click', this.#sortingTypeChangeHandler);
  }

  get template() {
    return createSorting(this.#sorts, this.#currentSortType);
  }

  #sortingTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#handleSortingTypeChange(evt.target.value.slice(5));
  };
}
