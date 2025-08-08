import {remove, render, RenderPosition} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType, Mode} from '../const.js';

export default class NewPointPresenter {
  #listPointsContainer = null;
  #onPointChange = null;
  #onNewPointFormClose = null;
  #onModelChange = null;
  #editPointComponent = null;

  constructor({listPointsContainer, onPointChange, onNewPointFormClose, onModelChange}) {
    this.#listPointsContainer = listPointsContainer;
    this.#onPointChange = onPointChange;
    this.#onNewPointFormClose = onNewPointFormClose;
    this.#onModelChange = onModelChange;
  }

  init({destinations, offers}) {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView({
      mode: Mode.CREATE,
      destinations,
      offers,
      onFormSubmit: this.#onFormSubmit,
      onDeleteClick: this.#onDeleteClick
    });
    render(this.#editPointComponent, this.#listPointsContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  destroy() {
    if (this.#editPointComponent === null) {
      return;
    }

    this.#onNewPointFormClose();
    remove(this.#editPointComponent);
    this.#editPointComponent = null;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  setSaving() {
    this.#editPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
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

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#onModelChange(UpdateType.MINOR);
    }
  };
}
