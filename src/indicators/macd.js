import { ema } from './ema';

// Standard MACD: 12/26/9.
// Returns { macd, signal, histogram } — each array aligned with the input.
export function macd(closes, fast = 12, slow = 26, signalPeriod = 9) {
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);

  const macdLine = closes.map((_, i) => {
    if (emaFast[i] == null || emaSlow[i] == null) return null;
    return emaFast[i] - emaSlow[i];
  });

  // Signal = EMA of macd line, but only over the defined portion.
  const firstIdx = macdLine.findIndex(v => v != null);
  const signal = new Array(closes.length).fill(null);
  if (firstIdx >= 0) {
    const trimmed = macdLine.slice(firstIdx).map(v => v ?? 0);
    const sig = ema(trimmed, signalPeriod);
    for (let i = 0; i < sig.length; i++) signal[firstIdx + i] = sig[i];
  }

  const histogram = macdLine.map((v, i) =>
    v == null || signal[i] == null ? null : v - signal[i]
  );

  return { macd: macdLine, signal, histogram };
}
