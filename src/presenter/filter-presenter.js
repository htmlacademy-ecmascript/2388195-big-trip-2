import {render, replace, remove} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import {filter} from '../util/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointModel = null;
  #filtersView = null;

  constructor({filterContainer, filterModel, pointModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](points).length,
      isChecked : type === this.#filterModel.filter
    }));
  }

  init() {
    const filters = this.filters;
    const prevFiltersView = this.#filtersView;

    this.#filtersView = new FiltersView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#onFilterTypeChange
    });

    if (prevFiltersView === null) {
      render(this.#filtersView, this.#filterContainer);
      return;
    }

    replace(this.#filtersView, prevFiltersView);
    remove(prevFiltersView);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.FILTER, filterType);
  };
}
