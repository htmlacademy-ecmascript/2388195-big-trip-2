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
import {SortType, SORTS, UpdateType, UserAction, FilterType, TimeLimit} from '../const.js';
import LoadingView from '../view/loading-view.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #tripMainContainer = null;
  #pointModel = null;
  #filterModel = null;
  #tripInfoComponent = null;
  #errorComponent = null;
  #noPointComponent = null;
  #sortingComponent = null;
  #loadingComponent = new LoadingView();
  #listPointsComponent = new ListPointsView();
  #newPointPresenter = null;
  #pointPresenters = new Map();
  #isLoading = true;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({tripEventsContainer, tripMainContainer, pointModel, filterModel, onNewPointFormClose}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripMainContainer = tripMainContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      listPointsContainer: this.#listPointsComponent.element,
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

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
      render(this.#listPointsComponent, this.#tripEventsContainer);
    }

    this.#newPointPresenter.init({destinations: this.destinations, offers: this.offers});
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderError() {
    this.#errorComponent = new ErrorView();
    render(this.#errorComponent , this.#tripEventsContainer);
  }

  #renderNoPoint() {
    this.#noPointComponent = new NoPointView({filterType: this.#filterType});
    render(this.#noPointComponent, this.#tripEventsContainer);
  }

  #renderTripInfo() {
    if (this.points.length === 0) {
      return;
    }
    this.#tripInfoComponent = new TripInfoView({
      points: [...this.points].sort(sortDaysUp),
      destinations: this.destinations,
      offers: this.offers
    });
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView({
      sorts: SORTS,
      currentSortType: this.#currentSortType,
      onSortingTypeChange: this.#onSortingTypeChange
    });
    render(this.#sortingComponent, this.#tripEventsContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      destinations: this.destinations,
      offers: this.offers,
      listPointsContainer: this.#listPointsComponent.element,
      onPointChange: this.#onPointChange,
      onModeChange: this.#onModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPoint();
      return;
    }

    this.#renderSorting();

    render(this.#listPointsComponent, this.#tripEventsContainer);
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortingComponent);
    remove(this.#loadingComponent);
    remove(this.#noPointComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if(this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
  }

  #onSortingTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

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
      case UpdateType.FILTER:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        remove(this.#errorComponent);
        remove(this.#tripInfoComponent);
        this.#renderTripInfo();
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#errorComponent);
        remove(this.#tripInfoComponent);
        this.#renderTripInfo();
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderError();
        break;
    }
  };
}
