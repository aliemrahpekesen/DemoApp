import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Rect, G, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';
import { makeLinearScale, extent } from '../utils/scale';

const PADDING = { top: 12, right: 44, bottom: 18, left: 8 };

export default function CandlestickChart({ candles, width, height }) {
  if (!candles?.length) return null;

  const innerW = width - PADDING.left - PADDING.right;
  const innerH = height - PADDING.top - PADDING.bottom;

  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const [lo, hi] = [Math.min(...lows), Math.max(...highs)];
  const pad = (hi - lo) * 0.05 || 1;
  const yScale = makeLinearScale(lo - pad, hi + pad, PADDING.top + innerH, PADDING.top);

  const slot = innerW / candles.length;
  const bodyW = Math.max(1, slot * 0.6);

  const ticks = makeTicks(lo - pad, hi + pad, 4);

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={height}>
        {/* horizontal grid */}
        {ticks.map((t, i) => (
          <G key={`g-${i}`}>
            <Line
              x1={PADDING.left}
              x2={width - PADDING.right}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke={colors.grid}
              strokeWidth={0.5}
            />
            <SvgText
              x={width - PADDING.right + 4}
              y={yScale(t) + 3}
              fontSize="9"
              fill={colors.textDim}
            >
              {t.toFixed(2)}
            </SvgText>
          </G>
        ))}

        {candles.map((c, i) => {
          const x = PADDING.left + i * slot + slot / 2;
          const up = c.close >= c.open;
          const color = up ? colors.up : colors.down;
          const yHigh = yScale(c.high);
          const yLow = yScale(c.low);
          const yOpen = yScale(c.open);
          const yClose = yScale(c.close);
          const top = Math.min(yOpen, yClose);
          const bodyH = Math.max(1, Math.abs(yClose - yOpen));
          return (
            <G key={c.t}>
              <Line x1={x} x2={x} y1={yHigh} y2={yLow} stroke={color} strokeWidth={1} />
              <Rect
                x={x - bodyW / 2}
                y={top}
                width={bodyW}
                height={bodyH}
                fill={color}
              />
            </G>
          );
        })}
      </Svg>
      <Text style={styles.label}>Price</Text>
    </View>
  );
}

function makeTicks(min, max, count) {
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  label: {
    position: 'absolute',
    top: 4,
    left: 12,
    color: colors.textDim,
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
