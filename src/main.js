import PointModel from './model/points-model.js';
import TripPresenter from './presenter/trip-presenter.js';

const tripEventsContainer = document.querySelector('.trip-events');

const pointModel = new PointModel();
pointModel.init();

const tripPresenter = new TripPresenter({container: tripEventsContainer, pointModel: pointModel});
tripPresenter.init();
