export const formatCurrency = (num: number) => {
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(num));
  return `Rp ${formatted}`;
};
