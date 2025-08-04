import dayjs from 'dayjs';

export function humanizeDate(date, dateFormat) {
  return date ? dayjs(date).format(dateFormat) : '';
}

export function getDuration(dateFrom, dateTo) {
  const durationEvent = dayjs(dateTo).diff(dateFrom, 'm');

  if (durationEvent < 60) {
    return `${durationEvent}M`;
  } else if (durationEvent >= 60 && durationEvent < 1440) {
    const hours = dayjs(dateTo).diff(dateFrom, 'h');
    const minutes = durationEvent - hours * 60;
    return `${hours}H ${minutes}M`;
  } else if (durationEvent > 1440) {
    const days = dayjs(dateTo).diff(dateFrom, 'd');
    const hours = Math.round((durationEvent - (days * 1440)) / 60);
    const minutes = durationEvent - days * 1440 - hours * 60;
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
    return 0;
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
    return 0;
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
    return 0;
  }
  if (a.dateFrom < b.dateFrom) {
    return -1;
  }
}
