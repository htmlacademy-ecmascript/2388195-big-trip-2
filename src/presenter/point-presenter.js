import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {Mode} from '../const.js';
import {render, replace, remove} from '../framework/render.js';

export default class PointPresenter{
  #listPointsViewContainer = null;
  #pointViewComponent = null;
  #editPointViewComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #point = null;
  #destinations = null;
  #offers = null;

  #mode = Mode.DEFAULT;

  constructor({destinations, offers, listPointsViewContainer, onDataChange, onModeChange}) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#listPointsViewContainer = listPointsViewContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointViewComponent = this.#pointViewComponent;
    const prevEditPointViewComponent = this.#editPointViewComponent;

    this.#pointViewComponent = new PointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editPointViewComponent = new EditPointView({
      mode: Mode.Edit,
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
    });

    if (prevPointViewComponent === null || prevEditPointViewComponent === null) {
      render(this.#pointViewComponent, this.#listPointsViewContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointViewComponent, prevPointViewComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointViewComponent, prevEditPointViewComponent);
    }

    remove(prevEditPointViewComponent);
    remove(prevEditPointViewComponent);
  }

  destroy() {
    remove(this.#pointViewComponent);
    remove(this.#editPointViewComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
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
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointViewComponent, this.#editPointViewComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToCard();
  };
}
