import {FilterType} from '../const';
import {selectPointPast, selectPointPresent, selectPointFuture} from './util';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => selectPointFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => selectPointPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => selectPointPast(point.dateTo)),
};
