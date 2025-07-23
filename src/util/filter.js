import {FilterType} from '../const';
import {isPointExpired, isPointExpiringToday} from './util';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => !isPointExpired(point.dateFrom) && !isPointExpiringToday(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointExpiringToday(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointExpired(point.dateFrom)),
};

// function generateFilter(points) {
//   return Object.entries(filter).map(
//     ([filterType, filterPoints]) => ({
//       type: filterType,
//       count: filterPoints(points).length,
//     }),
//   );
// }

// export {generateFilter};
