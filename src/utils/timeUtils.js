const { intervalToDuration, differenceInMilliseconds } = require('date-fns');

const calculateDuration = (startDate, endDate) => {
  const durationMs = differenceInMilliseconds(endDate, startDate);
  if (durationMs < 0) return '0ms';

  const duration = intervalToDuration({ start: startDate, end: endDate });

  const readable = [
    duration.days > 0 ? `${duration.days}d` : '',
    duration.hours > 0 ? `${duration.hours}h` : '',
    duration.minutes > 0 ? `${duration.minutes}m` : '',
    duration.seconds > 0 ? `${duration.seconds}s` : '',
    durationMs % 1000 > 0 ? `${durationMs % 1000}ms` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return readable || '0ms';
};

module.exports = {
  calculateDuration,
};
