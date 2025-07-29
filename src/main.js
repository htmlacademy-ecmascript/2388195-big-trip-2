import PointModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import {render, RenderPosition} from './framework/render.js';


const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const siteHeaderElement = document.querySelector('.trip-main');

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
  pointModel,
  filterModel,
  onNewPointFormClose: onNewPointFormClose
});

const newPointButtonView = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function onNewPointFormClose() {
  newPointButtonView.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newPointButtonView.element.disabled = true;
}

render(newPointButtonView, siteHeaderElement, RenderPosition.BEFOREEND);

filterPresenter.init();
tripPresenter.init();
