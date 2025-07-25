import {remove, render, RenderPosition} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType, Mode, DEFAULT_POINT} from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #onPointChange = null;
  #onDestroy = null;

  #editPointViewComponent = null;

  constructor({pointListContainer, onPointChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#onPointChange = onPointChange;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#editPointViewComponent !== null) {
      return;
    }

    this.#editPointViewComponent = new EditPointView({
      mode: Mode.CREATE,
      point: DEFAULT_POINT,
      destinations: null,
      offers: null,
      onFormSubmit: this.#onFormSubmit,
      onDeleteClick: this.#onDeleteClick
    });

    render(this.#editPointViewComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editPointViewComponent === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#editPointViewComponent);
    this.#editPointViewComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #onFormSubmit = (point) => {
    this.#onPointChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
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
