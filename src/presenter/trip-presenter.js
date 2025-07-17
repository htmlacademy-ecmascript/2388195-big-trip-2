import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import {RenderPosition, render, remove} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';
import {generateFilter} from '../util/filter.js';
import {updateItem, sortPriceDown, sortDurationDown, sortDaysUp} from '../util/util.js';
import PointPresenter from './point-presenter.js';
import {SortType, SORTS} from '../const.js';

export default class TripPresenter {
  #container = null;
  #pointModel = null;
  #listPointsView = new ListPointsView();
  #tripInfoView = new TripInfoView();
  #noPointView = new NoPointView();
  #sortingView = null;

  #points = [];
  #destinations = [];
  #offers = [];

  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    this.#points = [...this.#pointModel.points].sort(sortDaysUp);
    this.#destinations = [...this.#pointModel.destinations];
    this.#offers = [...this.#pointModel.offers];

    this.#renderBoard();
  }

  #renderTripInfoView() {
    const tripMainContainer = document.querySelector('.trip-main');
    render(this.#tripInfoView, tripMainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderFiltersView() {
    const filtersContainer = document.querySelector('.trip-controls__filters');
    const filters = generateFilter(this.#points);
    render(new FiltersView({filters}), filtersContainer);
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#points.sort(sortPriceDown);
        break;
      case SortType.TIME:
        this.#points.sort(sortDurationDown);
        break;
      default:
        this.#points.sort(sortDaysUp);
    }

    this.#currentSortType = sortType;
  }

  #onSortingTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    remove(this.#sortingView);
    this.#renderSort();
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort() {
    this.#sortingView = new SortingView({
      sorts: SORTS,
      currentSortType: this.#currentSortType,
      onSortingTypeChange: this.#onSortingTypeChange
    });
    render(this.#sortingView, this.#container);
  }

  #renderPointView(point) {
    const pointPresenter = new PointPresenter({
      destinations: this.#destinations,
      offers: this.#offers,
      listPointsViewContainer: this.#listPointsView.element,
      onPointChange: this.#onPointChange,
      onModeChange: this.#onModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #onPointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #onModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderNoPointView() {
    render(this.#noPointView, this.#container);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPointList() {
    render(this.#listPointsView, this.#container);
    this.#points.forEach((point) => this.#renderPointView(point));
  }

  #renderBoard() {
    if (this.#points.length === 0) {
      this.#renderNoPointView();
      return;
    }

    this.#renderTripInfoView();
    this.#renderFiltersView();
    this.#renderSort();
    this.#renderPointList();
  }
}
