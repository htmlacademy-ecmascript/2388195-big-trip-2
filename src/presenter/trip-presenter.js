import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripInfoView from '../view/trip-info-view.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import {RenderPosition, render, remove} from '../framework/render.js';
import ErrorView from '../view/error-view.js';
import NoPointView from '../view/no-point-view.js';
import {filter} from '../util/filter.js';
import {sortPriceDown, sortDurationDown, sortDaysUp} from '../util/util.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import {SortType, SORTS, UpdateType, UserAction, FilterType} from '../const.js';
import LoadingView from '../view/loading-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #container = null;
  #pointModel = null;
  #filterModel = null;

  #listPointsView = new ListPointsView();
  #tripInfoView = null;
  #errorView = null;
  #noPointView = null;
  #sortingView = null;
  #loadingView = new LoadingView();
  #isLoading = true;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({container, pointModel, filterModel, onNewPointFormClose}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#listPointsView.element,
      onPointChange: this.#onPointChange,
      onNewPointFormClose: onNewPointFormClose,
      onModelChange: this.#onModelChange
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
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#noPointView) {
      remove(this.#noPointView);
      render(this.#listPointsView, this.#container);
    }

    this.#newPointPresenter.init({destinations: this.destinations, offers: this.offers});
  }

  #renderLoading() {
    render(this.#loadingView, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderTripInfoView() {
    const tripMainContainer = document.querySelector('.trip-main');
    this.#tripInfoView = new TripInfoView({
      points: this.points,
      destinations: this.destinations,
      offers: this.offers
    });
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

  #onPointChange = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #onModelChange = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(point.id).init(point);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        remove(this.#errorView);
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        // remove(this.#tripInfoView);
        // this.#renderTripInfoView();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingView);
        remove(this.#errorView);
        // remove(this.#tripInfoView);
        // this.#renderTripInfoView();
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingView);
        this.#renderErrorView();
        break;
    }
  };

  #renderErrorView() {
    this.#errorView = new ErrorView();
    render(this.#errorView , this.#container);
  }

  #renderNoPointView() {
    this.#noPointView = new NoPointView({filterType: this.#filterType});
    render(this.#noPointView, this.#container);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortingView);
    remove(this.#loadingView);
    remove(this.#noPointView);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if(this.#noPointView) {
      remove(this.#noPointView);
    }
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPointView();
      return;
    }

    this.#renderSort();

    render(this.#listPointsView, this.#container);
    this.points.forEach((point) => this.#renderPointView(point));
  }
}
