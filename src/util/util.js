import dayjs from 'dayjs';
import {Minutes, Duration, Position} from '../const';

export function humanizeDate(date, dateFormat) {
  return date ? dayjs(date).format(dateFormat) : '';
}

function convertDurationFormat(duration) {
  if (duration < Duration.TEN && duration >= Duration.ZERO) {
    duration = `0${duration}`;
    return duration;
  }
  return duration;
}

export function getDuration(dateFrom, dateTo) {
  const durationEvent = dayjs(dateTo).diff(dateFrom, 'm');

  if (durationEvent < Minutes.IN_HOUR) {
    const result = convertDurationFormat(durationEvent);
    return `${result}M`;

  } else if (durationEvent >= Minutes.IN_HOUR && durationEvent < Minutes.IN_DAY) {
    const hours = dayjs(dateTo).diff(dateFrom, 'h');
    const resultHours = convertDurationFormat(hours);

    const minutes = durationEvent - hours * Minutes.IN_HOUR;
    const resultMinutes = convertDurationFormat(minutes);

    return `${resultHours}H ${resultMinutes}M`;

  } else if (durationEvent >= Minutes.IN_DAY) {
    const days = dayjs(dateTo).diff(dateFrom, 'd');
    const resultDays = convertDurationFormat(days);

    const daysDurationInMinutes = days * Minutes.IN_DAY;
    const leftHoursInMinutes = durationEvent - daysDurationInMinutes;
    const hours = Math.floor(leftHoursInMinutes / Minutes.IN_HOUR);
    const resultHours = convertDurationFormat(hours);

    const hoursDurationInMinutes = hours * Minutes.IN_HOUR;
    const minutes = leftHoursInMinutes - hoursDurationInMinutes;
    const resultMinutes = convertDurationFormat(minutes);

    return `${resultDays}D ${resultHours}H ${resultMinutes}M`;
  }
}

export function selectPointPast(dateTo) {
  return dayjs(dateTo).isBefore(dayjs());
}

export function selectPointPresent(dateFrom, dateTo) {
  return (dayjs(dateFrom).isSame(dayjs()) || dayjs(dateFrom).isBefore(dayjs())) && (dayjs(dateTo).isSame(dayjs()) || dayjs(dateTo).isAfter(dayjs()));
}

export function selectPointFuture(dateFrom) {
  return dayjs(dateFrom).isAfter(dayjs());
}

export function sortPriceDown(firstPoint, nextPoint) {
  if (Number(firstPoint.basePrice) > Number(nextPoint.basePrice)) {
    return Position.START;
  }
  if (Number(firstPoint.basePrice) === Number(nextPoint.basePrice)) {
    return Position.EQUAL;
  }
  if (Number(firstPoint.basePrice) < Number(nextPoint.basePrice)) {
    return Position.END;
  }
}

export function getSortDuration(dateFrom, dateTo) {
  return dayjs(dateTo).diff(dateFrom, 'm');
}

export function sortDurationDown(firstPoint, nextPoint) {
  if (getSortDuration(firstPoint.dateFrom, firstPoint.dateTo) > getSortDuration(nextPoint.dateFrom, nextPoint.dateTo)) {
    return Position.START;
  }
  if (getSortDuration(firstPoint.dateFrom, firstPoint.dateTo) === getSortDuration(nextPoint.dateFrom, nextPoint.dateTo)) {
    return Position.EQUAL;
  }
  if (getSortDuration(firstPoint.dateFrom, firstPoint.dateTo) < getSortDuration(nextPoint.dateFrom, nextPoint.dateTo)) {
    return Position.END;
  }
}

export function sortDaysUp(firstPoint, nextPoint) {
  if (firstPoint.dateFrom > nextPoint.dateFrom) {
    return Position.END;
  }
  if (firstPoint.dateFrom === nextPoint.dateFrom) {
    return Position.EQUAL;
  }
  if (firstPoint.dateFrom < nextPoint.dateFrom) {
    return Position.START;
  }
}
