import TripInfoView from '../view/trip-info-view.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import {RenderPosition, render, remove} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';
import {filter} from '../util/filter.js';
import {sortPriceDown, sortDurationDown, sortDaysUp} from '../util/util.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import {SortType, SORTS, UpdateType, UserAction, FilterType} from '../const.js';

export default class TripPresenter {
  #container = null;
  #pointModel = null;
  #filterModel = null;

  #listPointsView = new ListPointsView();
  #tripInfoView = new TripInfoView();
  #noPointView = null;
  #sortingView = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  constructor({container, pointModel, filterModel, onNewPointFormClose}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      destinations: this.#pointModel.destinations,
      offers: this.#pointModel.offers,
      pointListContainer: this.#listPointsView.element,
      onPointChange: this.#onPointChange,
      onNewPointFormClose: onNewPointFormClose
    });

    this.#pointModel.addObserver(this.#onModelChange);
    this.#filterModel.addObserver(this.#onModelChange);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPriceDown);
      case SortType.TIME:
        return filteredPoints.sort(sortDurationDown);
      default:
        return filteredPoints.sort(sortDaysUp);
    }
  }

  get destinations() {
    return this.#pointModel.destinations;
  }

  get offers() {
    return this.#pointModel.offers;
  }

  init() {
    this.#renderTripInfoView();

    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderTripInfoView() {
    const tripMainContainer = document.querySelector('.trip-main');
    render(this.#tripInfoView, tripMainContainer, RenderPosition.AFTERBEGIN);
  }

  #onSortingTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
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
      destinations: this.destinations,
      offers: this.offers,
      listPointsViewContainer: this.#listPointsView.element,
      onPointChange: this.#onPointChange,
      onModeChange: this.#onModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #onModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #onPointChange = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #onModelChange = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #renderNoPointView() {
    this.#noPointView = new NoPointView({filterType: this.#filterType});
    render(this.#noPointView, this.#container);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortingView);
    remove(this.#noPointView);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if(this.#noPointView) {
      remove(this.#noPointView);
    }
  }

  #renderBoard() {
    if (this.points.length === 0) {
      this.#renderNoPointView();
      return;
    }

    this.#renderSort();

    render(this.#listPointsView, this.#container);
    this.points.forEach((point) => this.#renderPointView(point));
  }
}
