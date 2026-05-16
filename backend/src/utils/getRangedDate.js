/**
 * Get a date range with custom number of days before endDate
 * @param {number} days - Number of days for the range (default: 30)
 * @param {Date} endDate - End date for the range (default: yesterday)
 * @returns {Object} Object containing startDate and endDate in YYYY-MM-DD format
 */
function getYesterday(date = new Date()) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d;
}

function getRangedDate(days = 30, endDate = null) {
  // Jika endDate tidak diberikan, gunakan kemarin
  if (endDate === null) {
    endDate = getYesterday();
  } else {
    endDate = new Date(endDate);
  }

  // startDate = days hari sebelum endDate
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  const formatDate = (date) => date.toISOString().split('T')[0];

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

export default getRangedDate;
