export const AUTHORIZATION = 'Basic eo0w590ik29589a';
export const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export const ApiMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const Mode = {
  DEFAULT: 'default',
  EDIT: 'edit',
  CREATE: 'create'
};

export const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight',
};

export const DateFormat = {
  DATE_TIME: 'DD/MM/YY HH:mm',
  MONTH_DAY: 'MMM DD',
  DAY_MONTH: 'DD MMM',
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
  FILTER: 'FILTER',
  ERROR: 'ERROR'
};

export const Minutes = {
  IN_HOUR: 60,
  IN_DAY: 1440,
};

export const Duration = {
  TEN: 10,
  ZERO: 0,
};

export const Position = {
  START: -1,
  EQUAL: 0,
  END: 1
};
export const PointsLength = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
};
