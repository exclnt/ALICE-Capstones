const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});

export const CurrencyFormatter = (value: string) => {
  return formatter.format(Number(value));
};
