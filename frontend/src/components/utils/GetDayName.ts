const getDayName = (str: string, weekdayFormat?: 'long' | 'short' | 'narrow'): string => {
  const [dayStr, monthStr, yearStr] = str.split('-');

  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return 'invalid date';
  }

  const dateObject = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('id-ID', { weekday: weekdayFormat })
    .format(dateObject)
    .toLowerCase();
};

export default getDayName;
