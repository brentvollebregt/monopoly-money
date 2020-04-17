export const formatCurrency = (value: number) =>
  "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
