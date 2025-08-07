import {remove, render, RenderPosition} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType, Mode} from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #onPointChange = null;
  #onNewPointFormClose = null;
  #onModelChange = null;
  #editPointView = null;

  constructor({pointListContainer, onPointChange, onNewPointFormClose, onModelChange}) {
    this.#pointListContainer = pointListContainer;
    this.#onPointChange = onPointChange;
    this.#onNewPointFormClose = onNewPointFormClose;
    this.#onModelChange = onModelChange;
  }

  init({destinations, offers}) {
    if (this.#editPointView !== null) {
      return;
    }

    this.#editPointView = new EditPointView({
      mode: Mode.CREATE,
      destinations,
      offers,
      onFormSubmit: this.#onFormSubmit,
      onDeleteClick: this.#onDeleteClick
    });
    render(this.#editPointView, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editPointView === null) {
      return;
    }

    this.#onNewPointFormClose();
    remove(this.#editPointView);
    this.#editPointView = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#editPointView.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editPointView.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#editPointView.shake(resetFormState);
  }

  #onFormSubmit = (point) => {
    this.#onPointChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
  };

  #onDeleteClick = () => {
    this.#onModelChange(UpdateType.MINOR);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#onModelChange(UpdateType.MINOR);
    }
  };
}
