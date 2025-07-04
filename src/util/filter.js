import {FilterType} from '../const';
import {isPointExpired, isPointExpiringToday} from './util';

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => !isPointExpired(point.dateFrom) && !isPointExpiringToday(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointExpiringToday(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointExpired(point.dateFrom)),
};

export {filter};
