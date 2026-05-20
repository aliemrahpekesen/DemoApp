# BIST Market Demo

A minimal cross-platform mobile demo (Expo / React Native) that visualizes
Borsa Istanbul (BIST) stocks with candlestick, MACD, and RSI charts.

> **Demo only.** This app presents market data. It does **not** provide
> predictions, signals, or investment recommendations.

## Features

- Pick from a curated list of BIST tickers (`.IS` suffix on Yahoo Finance).
- Switch time ranges: 1M, 3M, 6M, 1Y, 2Y.
- Candlestick chart with auto-scaled price axis.
- MACD (12, 26, 9) with histogram + signal line.
- RSI (14) with 30/70 bands.
- Pull-to-refresh.

## Stack

- Expo SDK 52 / React Native 0.76
- `react-native-svg` for all charts (no heavy charting deps)
- `@react-native-picker/picker` for the stock picker
- Data: Yahoo Finance v8 chart endpoint (no API key)

## Project layout

```
App.js
index.js
src/
  api/marketData.js        # Yahoo Finance fetcher
  constants/stocks.js      # BIST tickers + range presets
  indicators/
    ema.js                 # exponential moving average
    macd.js                # MACD (12,26,9)
    rsi.js                 # Wilder's RSI (14)
  utils/
    scale.js               # tiny linear scale helper
    format.js              # price/percent formatting
  components/
    StockPicker.js
    RangeSelector.js
    PriceHeader.js
    CandlestickChart.js
    MACDChart.js
    RSIChart.js
    Loader.js
    ErrorView.js
  screens/
    HomeScreen.js
  theme.js
```

## Run

```bash
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR
code with the Expo Go app on your phone.

## Notes

- The Yahoo Finance endpoint is unofficial and may rate-limit or change
  shape; for a production app, use a licensed BIST data provider.
- Indicators are computed in plain JS from close prices — see `src/indicators/`.
