import TripEventsPresenter from './presenter/board-presenter.js';

const tripEventsContainer = document.querySelector('.trip-events');
const tripEventsPresenter = new TripEventsPresenter({tripEventsContainer: tripEventsContainer});

tripEventsPresenter.init();
