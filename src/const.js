import {offers} from '../src/mock/offers';
import {destinations} from '../src/mock/destinations';

export const Mode = {
  DEFAULT: 'default',
  EDIT: 'edit',
  CREATE: 'create'
};

export const POINT_TYPES = offers.map((offer) => offer.type);
export const DESTINATIONS_NAMES = destinations.map((destination) => destination.name);

export const DEFAULT_POINT = {
  id: 0,
  basePrice: 0,
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight',
};

export const DateFormat = {
  DATE_TIME: 'DD/MM/YY HH:mm',
  MONTH_DAY: 'MMM DD',
  YEAR_MONTH_DAY: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  STANDART: 'YYYY-MM-DDTHH:mm',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const SORTS = ['day', 'event', 'time', 'price', 'offers'];

export const SortType = {
  DEFAULT: 'day',
  PRICE: 'price',
  TIME: 'time',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
