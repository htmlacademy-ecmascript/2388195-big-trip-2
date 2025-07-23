import PointModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';


const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

const pointModel = new PointModel();
pointModel.init();

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  pointModel
});

const tripPresenter = new TripPresenter({
  container: tripEventsContainer,
  pointModel: pointModel,
  filterModel,
});

filterPresenter.init();
tripPresenter.init();
