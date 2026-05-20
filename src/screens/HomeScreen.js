import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import { STOCKS, RANGES } from '../constants/stocks';
import { fetchCandles } from '../api/marketData';
import { macd as calcMACD } from '../indicators/macd';
import { rsi as calcRSI } from '../indicators/rsi';
import { colors } from '../theme';
import StockPicker from '../components/StockPicker';
import RangeSelector from '../components/RangeSelector';
import PriceHeader from '../components/PriceHeader';
import CandlestickChart from '../components/CandlestickChart';
import MACDChart from '../components/MACDChart';
import RSIChart from '../components/RSIChart';
import Loader from '../components/Loader';
import ErrorView from '../components/ErrorView';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const chartWidth = width - 24;

  const [symbol, setSymbol] = useState(STOCKS[0].symbol);
  const [rangeKey, setRangeKey] = useState('6mo');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const range = useMemo(() => RANGES.find(r => r.key === rangeKey), [rangeKey]);

  const load = useCallback(
    async (mode = 'load') => {
      if (mode === 'load') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      setError(null);
      try {
        const res = await fetchCandles(symbol, range.key, range.interval);
        setData(res);
      } catch (e) {
        setError(e.message || 'Network error');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [symbol, range]
  );

  useEffect(() => {
    load('load');
  }, [load]);

  const closes = useMemo(
    () => (data?.candles || []).map(c => c.close),
    [data]
  );
  const macdData = useMemo(() => calcMACD(closes), [closes]);
  const rsiData = useMemo(() => calcRSI(closes), [closes]);

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => load('refresh')}
          tintColor={colors.accent}
        />
      }
    >
      <Text style={styles.title}>BIST Market Demo</Text>
      <Text style={styles.subtitle}>
        Live data from Yahoo Finance · For visualization only — no recommendations.
      </Text>

      <View style={styles.controls}>
        <StockPicker stocks={STOCKS} value={symbol} onChange={setSymbol} />
        <RangeSelector ranges={RANGES} value={rangeKey} onChange={setRangeKey} />
      </View>

      {loading && !data && <Loader label="Fetching market data…" />}
      {error && <ErrorView message={error} onRetry={() => load('load')} />}

      {data && (
        <>
          <PriceHeader
            symbol={data.symbol}
            candles={data.candles}
            currency={data.currency}
          />

          <View style={styles.card}>
            <CandlestickChart
              candles={data.candles}
              width={chartWidth}
              height={240}
            />
          </View>

          <View style={styles.card}>
            <MACDChart
              macdData={macdData}
              width={chartWidth}
              height={140}
            />
          </View>

          <View style={styles.card}>
            <RSIChart rsi={rsiData} width={chartWidth} height={120} />
          </View>

          <Text style={styles.footer}>
            Candles, MACD (12, 26, 9), and RSI (14) computed on close prices.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 12,
    gap: 12,
    paddingBottom: 32,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.textDim, fontSize: 11 },
  controls: { gap: 10 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 4,
  },
  footer: {
    color: colors.textDim,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});
