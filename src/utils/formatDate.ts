export const formatDate = (
  date: Date | string,
  separator = '/',
  fullDigit = false
): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const year = String(date.getFullYear());
  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());

  if (fullDigit) {
    if (month.length === 1) {
      month = '0' + month;
    }

    if (day.length === 1) {
      day = '0' + day;
    }
  }

  return `${year}${separator}${month}${separator}${day}`;
};

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Parse the yearMonth to get the start and end date of the month
 * @param yearMonth YYYY-MM
 * @returns {startDate: Date, endDate: Date}
 */
export function getStartEndDate(yearMonth: string) {
  const [year, month] = yearMonth.split('-');
  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 0);
  return { startDate, endDate };
}
