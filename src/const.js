export const AUTHORIZATION = 'Basic eo0w590ik29456a';
export const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

export const Mode = {
  DEFAULT: 'default',
  EDIT: 'edit',
  CREATE: 'create'
};

export const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: new Date().toISOString(),
  dateTo: new Date(new Date().getTime() + 1000 * 60).toISOString(),
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
  INIT: 'INIT',
};
