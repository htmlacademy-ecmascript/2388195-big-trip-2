import {render, replace, remove} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import {filter} from '../util/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointModel = null;
  #filtersComponent = null;

  constructor({filterContainer, filterModel, pointModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#onModelChange);
    this.#filterModel.addObserver(this.#onModelChange);
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
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView({
      filters: this.filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#onFilterTypeChange
    });

    if (prevFiltersComponent === null) {
      render(this.#filtersComponent, this.#filterContainer);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  #onModelChange = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.FILTER, filterType);
  };
}
