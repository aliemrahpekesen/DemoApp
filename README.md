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

## Run locally

```bash
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR
code with the Expo Go app on your phone.

## Open the live web demo

The **Deploy Web** workflow (`.github/workflows/web.yml`) runs on every push
to `master` or a `claude/**` branch. It exports the Expo web bundle and
publishes it to GitHub Pages.

Live URL (after first successful deploy):
**https://aliemrahpekesen.github.io/DemoApp/**

One-time setup (repo owner only): open the repo on GitHub → **Settings →
Pages** → set **Source** to **GitHub Actions**. After that, every push
re-deploys automatically.

Open the URL from any mobile browser — the layout is responsive.

### CORS note

Yahoo Finance does not send CORS headers, so the web build routes requests
through the public `corsproxy.io` proxy. This is fine for a demo but you
should host your own proxy (or a licensed data source) for anything beyond
that. Native builds hit Yahoo directly without a proxy.

## Optional: install on Android

The **Android APK** workflow (`.github/workflows/android.yml`) is set to
**manual trigger only** (Actions → Android APK → *Run workflow*). It runs
`expo prebuild`, builds a debug-signed APK with Gradle, and uploads it as
the `bist-demo-apk` artifact. Download, extract, transfer to your phone,
allow installs from unknown sources, and tap to install.

> iOS is not built in CI — signed IPAs need an Apple Developer account and
> provisioning. For iOS testing, use `npx expo start` with Expo Go.

## Notes

- The Yahoo Finance endpoint is unofficial and may rate-limit or change
  shape; for a production app, use a licensed BIST data provider.
- Indicators are computed in plain JS from close prices — see `src/indicators/`.
