import dayjs from 'dayjs';
import {Minutes} from '../const';

export function humanizeDate(date, dateFormat) {
  return date ? dayjs(date).format(dateFormat) : '';
}

export function getDuration(dateFrom, dateTo) {
  const durationEvent = dayjs(dateTo).diff(dateFrom, 'm');

  if (durationEvent < Minutes.IN_HOUR) {
    return `${durationEvent}M`;
  } else if (durationEvent >= Minutes.IN_HOUR && durationEvent < Minutes.IN_DAY) {
    let hours = dayjs(dateTo).diff(dateFrom, 'h');
    if (hours < Minutes.IN_TEN && hours >= Minutes.IN_ZERO) {
      hours = Minutes.IN_ZERO + String(hours);
    }
    let minutes = durationEvent - hours * Minutes.IN_HOUR;
    if (minutes < Minutes.IN_TEN && minutes >= Minutes.IN_ZERO) {
      minutes = Minutes.IN_ZERO + String(minutes);
    }
    return `${hours}H ${minutes}M`;
  } else if (durationEvent > Minutes.IN_DAY) {
    let days = dayjs(dateTo).diff(dateFrom, 'd');
    if (days < Minutes.IN_TEN && days >= Minutes.IN_ZERO) {
      days = Minutes.IN_ZERO + String(days);
    }
    let hours = Math.floor((durationEvent - (days * Minutes.IN_DAY)) / Minutes.IN_HOUR);
    if (hours < Minutes.IN_TEN && hours >= Minutes.IN_ZERO) {
      hours = Minutes.IN_ZERO + String(hours);
    }
    let minutes = durationEvent - days * Minutes.IN_DAY - hours * Minutes.IN_HOUR;
    if (minutes < Minutes.IN_TEN && minutes >= Minutes.IN_ZERO) {
      minutes = Minutes.IN_ZERO + String(minutes);
    }
    return `${days}D ${hours}H ${minutes}M`;
  }
}

export function isPointPast(dateTo) {
  return dayjs(dateTo).isBefore(dayjs());
}

export function isPointPresent(dateFrom, dateTo) {
  return (dayjs(dateFrom).isSame(dayjs()) || dayjs(dateFrom).isBefore(dayjs())) && (dayjs(dateTo).isSame(dayjs()) || dayjs(dateTo).isAfter(dayjs()));
}

export function isPointFuture(dateFrom) {
  return dayjs(dateFrom).isAfter(dayjs());
}

export function sortPriceDown(a, b) {
  if (Number(a.basePrice) > Number(b.basePrice)) {
    return -1;
  }
  if (Number(a.basePrice) === Number(b.basePrice)) {
    return Minutes.IN_ZERO;
  }
  if (Number(a.basePrice) < Number(b.basePrice)) {
    return 1;
  }
}

export function getSortDuration(dateFrom, dateTo) {
  return dayjs(dateTo).diff(dateFrom, 'm');
}

export function sortDurationDown(a, b) {
  if (getSortDuration(a.dateFrom, a.dateTo) > getSortDuration(b.dateFrom, b.dateTo)) {
    return -1;
  }
  if (getSortDuration(a.dateFrom, a.dateTo) === getSortDuration(b.dateFrom, b.dateTo)) {
    return Minutes.IN_ZERO;
  }
  if (getSortDuration(a.dateFrom, a.dateTo) < getSortDuration(b.dateFrom, b.dateTo)) {
    return 1;
  }
}

export function sortDaysUp(a, b) {
  if (a.dateFrom > b.dateFrom) {
    return 1;
  }
  if (a.dateFrom === b.dateFrom) {
    return Minutes.IN_ZERO;
  }
  if (a.dateFrom < b.dateFrom) {
    return -1;
  }
}
