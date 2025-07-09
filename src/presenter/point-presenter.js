import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {Mode} from '../const.js';
import {render, replace} from '../framework/render.js';

export default class PointPresenter{
  #listPointsViewContainer = null;
  #pointViewComponent = null;
  #editPointViewComponent = null;

  #point = null;
  #destinations = null;
  #offers = null;

  constructor({listPointsViewContainer}) {
    this.#listPointsViewContainer = listPointsViewContainer;
  }

  init(point, destinations, offers) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#pointViewComponent = new PointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
    });

    this.#editPointViewComponent = new EditPointView({
      mode: Mode.Edit,
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
    });

    render(this.#pointViewComponent, this.#listPointsViewContainer);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replaceCardToForm() {
    replace(this.#editPointViewComponent, this.#pointViewComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#pointViewComponent, this.#editPointViewComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };
}
