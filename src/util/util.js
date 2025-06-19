import dayjs from 'dayjs';

function humanizeDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}

function getDuration(dateFrom, dateTo) {
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

export {humanizeDate, getDuration};
