// Exponential Moving Average. Returns an array of the same length as input;
// values are null until enough data points exist.
export function ema(values, period) {
  if (period <= 0) throw new Error('period must be > 0');
  const k = 2 / (period + 1);
  const out = new Array(values.length).fill(null);
  if (values.length < period) return out;

  // Seed with SMA of the first `period` values.
  let sum = 0;
  for (let i = 0; i < period; i++) sum += values[i];
  let prev = sum / period;
  out[period - 1] = prev;

  for (let i = period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}
