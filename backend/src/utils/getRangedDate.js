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
  // default: kemarin
  if (endDate === null) {
    endDate = getYesterday();
  } else {
    endDate = new Date(endDate);
  }

  // clone date
  const startDate = new Date(endDate);

  // kurangi hari
  startDate.setDate(startDate.getDate() - days);

  // formatter aman timezone lokal
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

export default getRangedDate;
