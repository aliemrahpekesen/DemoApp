import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { formatPrice, formatPercent } from '../utils/format';

export default function PriceHeader({ symbol, candles, currency }) {
  if (!candles?.length) return null;
  const latest = candles[candles.length - 1];
  const first = candles[0];
  const change = latest.close - first.close;
  const changePct = (change / first.close) * 100;
  const up = change >= 0;

  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.symbol}>{symbol.replace('.IS', '')}</Text>
        <Text style={styles.subtle}>BIST · {currency}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>{formatPrice(latest.close, currency)}</Text>
        <Text style={[styles.change, { color: up ? colors.up : colors.down }]}>
          {formatPrice(change, currency)} ({formatPercent(changePct)})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  symbol: { color: colors.text, fontSize: 22, fontWeight: '700' },
  subtle: { color: colors.textDim, fontSize: 11, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  price: { color: colors.text, fontSize: 20, fontWeight: '600' },
  change: { fontSize: 12, marginTop: 2, fontWeight: '600' },
});
