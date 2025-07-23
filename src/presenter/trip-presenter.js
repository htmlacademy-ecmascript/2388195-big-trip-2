import TripInfoView from '../view/trip-info-view.js';
// import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import {RenderPosition, render, remove} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';
import {filter} from '../util/filter.js';
import {sortPriceDown, sortDurationDown, sortDaysUp} from '../util/util.js';
import PointPresenter from './point-presenter.js';
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
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;


  constructor({container, pointModel, filterModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPriceDown);
        // break;
      case SortType.TIME:
        return filteredPoints.sort(sortDurationDown);
        // break;
      // default:
      //   return this.#pointModel.points.sort(sortDaysUp);
    }
    return filteredPoints.sort(sortDaysUp);
  }

  get destinations() {
    return this.#pointModel.destinations;
  }

  get offers() {
    return this.#pointModel.offers;
  }

  init() {
    // this.#points = [...this.#pointModel.points].sort(sortDaysUp);
    // this.#destinations = [...this.#pointModel.destinations];
    // this.#offers = [...this.#pointModel.offers];

    this.#renderTripInfoView();
    // this.#renderFiltersView();

    this.#renderBoard();
  }

  #renderTripInfoView() {
    const tripMainContainer = document.querySelector('.trip-main');
    render(this.#tripInfoView, tripMainContainer, RenderPosition.AFTERBEGIN);
  }

  // #renderFiltersView() {
  //   const filtersContainer = document.querySelector('.trip-controls__filters');
  //   const filters = [
  //     {
  //       type: FilterType.EVERYTHING,
  //       count: 0,
  //     },
  //   ];
  //   render(new FiltersView({
  //     filters,
  //     currentFilterType: FilterType.EVERYTHING,
  //     onFilterTypeChange: () => {}
  //   }), filtersContainer);
  // }

  // #sortPoints(sortType) {
  //   switch (sortType) {
  //     case SortType.PRICE:
  //       this.#points.sort(sortPriceDown);
  //       break;
  //     case SortType.TIME:
  //       this.#points.sort(sortDurationDown);
  //       break;
  //     default:
  //       this.#points.sort(sortDaysUp);
  //   }

  //   this.#currentSortType = sortType;
  // }

  #onSortingTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    // this.#sortPoints(sortType);
    // remove(this.#sortingView);
    this.#currentSortType = sortType;
    // this.#renderSort();
    // this.#clearBoard({resetSortType: true});
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
      onPointChange: this.#handleViewAction,
      onModeChange: this.#onModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  // #onPointChange = (updatedPoint) => {
  //   this.points = updateItem(this.points, updatedPoint);
  //   this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  // };

  #onModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => { //вызывается когда мы хотим выполнить какое-то действие, которое приводит к обновлению модели
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

  #handleModelEvent = (updateType, data) => { //обработчик, который вызывается при изменнении модели
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

  // #renderPointList() {
  //   render(this.#listPointsView, this.#container);
  //   this.points.forEach((point) => this.#renderPointView(point));
  // }

  #clearBoard({resetSortType = false} = {}) {
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

    // this.#renderTripInfoView();
    // this.#renderFiltersView();
    this.#renderSort();
    // this.#renderPointList();
    render(this.#listPointsView, this.#container);
    this.points.forEach((point) => this.#renderPointView(point));
  }
}
