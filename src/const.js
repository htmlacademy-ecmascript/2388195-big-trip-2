export const Mode = {
  DEFAULT: 'default',
  EDIT: 'edit',
  CREATE: 'create'
};

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
  INIT: 'INIT',
};

export function generatePassword(){
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    result += charset.charAt(Math.floor(Math.random() * n));
  }
  return result;
}
