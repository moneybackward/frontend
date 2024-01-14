const locale = 'id-ID';
const formatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'IDR',
});

export function formatCurrency(val: number) {
  const formatted = formatter.format(val);
  return 'Rp' + formatted.replace('Rp', '').trim();
}
