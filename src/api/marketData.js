// Fetches OHLC data from Yahoo Finance's public chart endpoint.
// No API key required. Works for BIST tickers via the ".IS" suffix.
//
// Example: fetchCandles('THYAO.IS', '6mo', '1d')
const BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

export async function fetchCandles(symbol, range = '6mo', interval = '1d') {
  const url = `${BASE_URL}/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  const json = await res.json();
  const result = json?.chart?.result?.[0];
  const error = json?.chart?.error;
  if (error) throw new Error(error.description || 'Yahoo Finance error');
  if (!result) throw new Error('Empty response');

  const timestamps = result.timestamp || [];
  const quote = result.indicators?.quote?.[0] || {};
  const { open = [], high = [], low = [], close = [], volume = [] } = quote;
  const meta = result.meta || {};

  const candles = [];
  for (let i = 0; i < timestamps.length; i++) {
    const o = open[i], h = high[i], l = low[i], c = close[i];
    if (o == null || h == null || l == null || c == null) continue;
    candles.push({
      t: timestamps[i] * 1000,
      open: o,
      high: h,
      low: l,
      close: c,
      volume: volume[i] ?? 0,
    });
  }

  return {
    symbol: meta.symbol || symbol,
    currency: meta.currency || 'TRY',
    candles,
  };
}
