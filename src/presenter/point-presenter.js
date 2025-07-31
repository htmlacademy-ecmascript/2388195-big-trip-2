import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {Mode} from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointPresenter{
  #listPointsViewContainer = null;
  #pointViewComponent = null;
  #editPointViewComponent = null;
  #onPointChange = null;
  #onModeChange = null;

  #point = null;
  #destinations = null;
  #offers = null;

  #mode = Mode.DEFAULT;

  constructor({destinations, offers, listPointsViewContainer, onPointChange, onModeChange}) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#listPointsViewContainer = listPointsViewContainer;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointViewComponent = this.#pointViewComponent;
    const prevEditPointViewComponent = this.#editPointViewComponent;

    this.#pointViewComponent = new PointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteClick,
    });

    this.#editPointViewComponent = new EditPointView({
      mode: Mode.EDIT,
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#onFormSubmit,
      onRollupButtonClick: this.#onRollupButtonClick,
      onDeleteClick: this.#onDeleteClick,
    });

    if (prevPointViewComponent === null || prevEditPointViewComponent === null) {
      render(this.#pointViewComponent, this.#listPointsViewContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointViewComponent, prevPointViewComponent);
    }

    if (this.#mode === Mode.EDIT) {
      replace(this.#editPointViewComponent, prevEditPointViewComponent);
      this.#mode = Mode.DEFAULT;
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
      this.#editPointViewComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }


  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointViewComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointViewComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointViewComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointViewComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointViewComponent.shake(resetFormState);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editPointViewComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #replaceCardToForm() {
    replace(this.#editPointViewComponent, this.#pointViewComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDIT;
  }

  #replaceFormToCard() {
    replace(this.#pointViewComponent, this.#editPointViewComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #onEditClick = () => {
    this.#replaceCardToForm();
  };

  #onFavoriteClick = () => {
    this.#onPointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #onFormSubmit = (point) => {
    this.#onPointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point);
  };

  #onRollupButtonClick = () => {
    this.#editPointViewComponent.reset(this.#point);
    this.#replaceFormToCard();
  };

  #onDeleteClick = (point) => {
    this.#onPointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point);
  };
}
