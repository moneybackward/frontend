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
