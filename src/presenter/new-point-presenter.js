import {remove, render, RenderPosition} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType, Mode} from '../const.js';

export default class NewPointPresenter {
  #destinations = null;
  #offers = null;
  #pointListContainer = null;
  #onPointChange = null;
  #onNewPointFormClose = null;

  #editPointViewComponent = null;

  constructor({destinations, offers, pointListContainer, onPointChange, onNewPointFormClose}) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#pointListContainer = pointListContainer;
    this.#onPointChange = onPointChange;
    this.#onNewPointFormClose = onNewPointFormClose;
  }

  init() {
    if (this.#editPointViewComponent !== null) {
      return;
    }

    this.#editPointViewComponent = new EditPointView({
      mode: Mode.CREATE,
      destinations: this.#destinations,
      offers: this.#offers,
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

    this.#onNewPointFormClose();
    remove(this.#editPointViewComponent);
    this.#editPointViewComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #onFormSubmit = (point) => {
    this.#onPointChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      {...point, id: nanoid()},
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
