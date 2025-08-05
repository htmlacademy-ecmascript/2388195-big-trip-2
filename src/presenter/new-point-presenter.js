import {remove, render, RenderPosition} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType, Mode} from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #onPointChange = null;
  #onNewPointFormClose = null;

  #editPointViewComponent = null;

  constructor({pointListContainer, onPointChange, onNewPointFormClose}) {
    this.#pointListContainer = pointListContainer;
    this.#onPointChange = onPointChange;
    this.#onNewPointFormClose = onNewPointFormClose;

    // this.#pointModel.addObserver(this.#onModelChange);
    // this.#filterModel.addObserver(this.#onModelChange);
  }

  init({destinations, offers}) {
    if (this.#editPointViewComponent !== null) {
      return;
    }

    this.#editPointViewComponent = new EditPointView({
      mode: Mode.CREATE,
      destinations,
      offers,
      onFormSubmit: this.#onFormSubmit,
      onDeleteClick: this.#onDeleteClick
    });
    render(this.#editPointViewComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    // if (this.#editPointViewComponent === null) {
    //   return;
    // }

    this.#onNewPointFormClose();
    remove(this.#editPointViewComponent);
    this.#editPointViewComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#editPointViewComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editPointViewComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointViewComponent.shake(resetFormState);
  }

  #onFormSubmit = (point) => {
    this.#onPointChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
  };

  #onDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
