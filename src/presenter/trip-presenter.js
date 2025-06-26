import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {RenderPosition, render} from '../render.js';
import {Mode, DEFAULT_POINT} from '../const.js';

export default class TripPresenter {
  listPointsView = new ListPointsView();

  constructor({container, pointModel}) {
    this.container = container;
    this.pointModel = pointModel;
  }

  init() {
    const tripMainContainer = document.querySelector('.trip-main');
    const filtersContainer = tripMainContainer.querySelector('.trip-controls__filters');

    const points = [...this.pointModel.getPoints()];
    const destinations = [...this.pointModel.getDestinations()];
    const offers = [...this.pointModel.getOffers()];

    render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
    render(new FiltersView(), filtersContainer);
    render(new SortingView(), this.container);
    render(this.listPointsView, this.container);
    render(new EditPointView(Mode.EDIT, DEFAULT_POINT, destinations, offers), this.listPointsView.getElement());
    render(new EditPointView(Mode.CREATE, points[0], destinations, offers), this.listPointsView.getElement());

    for (const point of points) {
      render(new PointView(point, destinations, offers), this.listPointsView.getElement());
    }
  }
}
