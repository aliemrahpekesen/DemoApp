export function formatPrice(value, currency = 'TRY') {
  if (value == null || Number.isNaN(value)) return '—';
  const symbol = currency === 'TRY' ? '₺' : '';
  return `${symbol}${value.toFixed(2)}`;
}

export function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
