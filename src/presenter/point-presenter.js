import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {Mode} from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointPresenter{
  #listPointsViewContainer = null;
  #pointView = null;
  #editPointView = null;
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

    const prevPointView = this.#pointView;
    const prevEditPointView = this.#editPointView;

    this.#pointView = new PointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteClick,
    });

    this.#editPointView = new EditPointView({
      mode: Mode.EDIT,
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#onFormSubmit,
      onRollupButtonClick: this.#onRollupButtonClick,
      onDeleteClick: this.#onDeleteClick,
    });

    if (prevPointView === null || prevEditPointView === null) {
      render(this.#pointView, this.#listPointsViewContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointView, prevPointView);
    }

    if (this.#mode === Mode.EDIT) {
      replace(this.#editPointView, prevEditPointView);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEditPointView);
    remove(prevEditPointView);
  }

  destroy() {
    remove(this.#pointView);
    remove(this.#editPointView);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointView.reset(this.#point);
      this.#replaceFormToCard();
    }
  }


  setSaving() {
    if (this.#mode === Mode.EDIT) {
      this.#editPointView.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDIT) {
      this.#editPointView.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointView.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointView.shake(resetFormState);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editPointView.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #replaceCardToForm() {
    replace(this.#editPointView, this.#pointView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDIT;
  }

  #replaceFormToCard() {
    replace(this.#pointView, this.#editPointView);
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
      UpdateType.MAJOR,
      point);
  };

  #onRollupButtonClick = () => {
    this.#editPointView.reset(this.#point);
    this.#replaceFormToCard();
  };

  #onDeleteClick = (point) => {
    this.#onPointChange(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point);
  };
}
