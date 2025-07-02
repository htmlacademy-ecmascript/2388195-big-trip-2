import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {RenderPosition, render} from '../framework/render.js';
import {Mode, DEFAULT_POINT} from '../const.js';

export default class TripPresenter {
  #container = null;
  #pointModel = null;
  #listPointsView = new ListPointsView();

  #points = [];
  #destinations = [];
  #offers = [];

  constructor({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    const tripMainContainer = document.querySelector('.trip-main');
    const filtersContainer = tripMainContainer.querySelector('.trip-controls__filters');

    this.#points = [...this.#pointModel.points];
    this.#destinations = [...this.#pointModel.destinations];
    this.#offers = [...this.#pointModel.offers];

    render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
    render(new FiltersView(), filtersContainer);
    render(new SortingView(), this.#container);
    render(this.#listPointsView, this.#container);
    render(new EditPointView(Mode.EDIT, DEFAULT_POINT, this.#destinations, this.#offers), this.#listPointsView.element);
    render(new EditPointView(Mode.CREATE, this.#points[0], this.#destinations, this.#offers), this.#listPointsView.element);

    // for (const point of points) {
    //   render(new PointView(point, destinations, offers), this.#listPointsView.element);
    // }
    // for (let i = 0; i < this.#points.length; i++) {
    //   render(new PointView(this.#points[i], this.#destinations, this.#offers), this.#listPointsView.element);
    // }

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPointView(this.#points[i], this.#destinations, this.#offers);
    }

  }

  #renderPointView(point, destinations, offers) {
    const pointView = new PointView(point, destinations, offers);
    render(pointView, this.#listPointsView.element);
  }
}
