export const formatCurrency = (angka: any): string => {
  if (!angka) return 'Rp. 0';
  return `Rp. ${angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};
