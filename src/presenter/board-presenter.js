import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import EditingFormView from '../view/editing-form-view.js';
import PointView from '../view/point-view.js';
import {RenderPosition, render} from '../render.js';
import {Mode} from '../constants.js';

export default class TripEventsPresenter {
  ListPointsView = new ListPointsView();

  constructor({tripEventsContainer}) {
    this.tripEventsContainer = tripEventsContainer;
  }

  init() {
    const tripMainContainer = document.querySelector('.trip-main');
    const filtersContainer = tripMainContainer.querySelector('.trip-controls__filters');

    render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
    render(new FiltersView(), filtersContainer);
    render(new SortingView(), this.tripEventsContainer);
    render(this.ListPointsView, this.tripEventsContainer);
    render(new EditingFormView(Mode.EDIT), this.ListPointsView.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.ListPointsView.getElement());
    }
  }
}
