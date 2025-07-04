import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import NoPointView from '../view/no-point-view.js';
import {RenderPosition, render, replace} from '../framework/render.js';
import {Mode} from '../const.js';
import {generateFilter} from '../util/filter.js';

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
    this.#points = [...this.#pointModel.points];
    this.#destinations = [...this.#pointModel.destinations];
    this.#offers = [...this.#pointModel.offers];

    this.#renderBoard();
  }

  #renderPointView(point, destinations, offers) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointViewComponent = new PointView({
      point,
      destinations,
      offers,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editPointViewComponent = new EditPointView({
      mode: Mode.Edit,
      point,
      destinations,
      offers,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(editPointViewComponent, pointViewComponent);
    }

    function replaceFormToCard() {
      replace(pointViewComponent, editPointViewComponent);
    }

    render(pointViewComponent, this.#listPointsView.element);
  }

  #renderBoard() {
    const tripMainContainer = document.querySelector('.trip-main');
    const filtersContainer = tripMainContainer.querySelector('.trip-controls__filters');
    const filters = generateFilter(this.#points);
    render(new FiltersView({filters}), filtersContainer);

    if (this.#points.length === 0) {
      render(new NoPointView(), this.#container);
      return;
    }

    render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
    render(new SortingView(), this.#container);
    render(this.#listPointsView, this.#container);

    //Эти комментарии удалю попозже:
    // render(new EditPointView(Mode.EDIT, DEFAULT_POINT, this.#destinations, this.#offers), this.#listPointsView.element);
    // render(new EditPointView(Mode.CREATE, this.#points[0], this.#destinations, this.#offers), this.#listPointsView.element);

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
}
