import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Rect, G, Path, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';
import { makeLinearScale } from '../utils/scale';

const PADDING = { top: 12, right: 44, bottom: 14, left: 8 };

export default function MACDChart({ macdData, width, height }) {
  const { macd, signal, histogram } = macdData;
  if (!macd?.length) return null;

  const innerW = width - PADDING.left - PADDING.right;
  const innerH = height - PADDING.top - PADDING.bottom;

  const all = [...macd, ...signal, ...histogram].filter(v => v != null);
  if (!all.length) return null;
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = Math.max(Math.abs(lo), Math.abs(hi)) * 0.1 || 1;
  const yScale = makeLinearScale(lo - pad, hi + pad, PADDING.top + innerH, PADDING.top);
  const y0 = yScale(0);

  const slot = innerW / macd.length;
  const barW = Math.max(1, slot * 0.6);

  const linePath = (series) => {
    let d = '';
    let started = false;
    for (let i = 0; i < series.length; i++) {
      const v = series[i];
      if (v == null) continue;
      const x = PADDING.left + i * slot + slot / 2;
      const y = yScale(v);
      d += started ? ` L${x.toFixed(2)} ${y.toFixed(2)}` : `M${x.toFixed(2)} ${y.toFixed(2)}`;
      started = true;
    }
    return d;
  };

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={height}>
        <Line
          x1={PADDING.left}
          x2={width - PADDING.right}
          y1={y0}
          y2={y0}
          stroke={colors.grid}
          strokeWidth={0.5}
        />

        {histogram.map((v, i) => {
          if (v == null) return null;
          const x = PADDING.left + i * slot + slot / 2;
          const y = yScale(v);
          const top = Math.min(y, y0);
          const h = Math.max(1, Math.abs(y - y0));
          return (
            <Rect
              key={i}
              x={x - barW / 2}
              y={top}
              width={barW}
              height={h}
              fill={v >= 0 ? colors.up : colors.down}
              opacity={0.55}
            />
          );
        })}

        <Path d={linePath(macd)} stroke={colors.macdLine} strokeWidth={1.5} fill="none" />
        <Path d={linePath(signal)} stroke={colors.macdSignal} strokeWidth={1.5} fill="none" />

        <SvgText x={width - PADDING.right + 4} y={PADDING.top + 8} fontSize="9" fill={colors.textDim}>
          {(hi + pad).toFixed(2)}
        </SvgText>
        <SvgText x={width - PADDING.right + 4} y={PADDING.top + innerH} fontSize="9" fill={colors.textDim}>
          {(lo - pad).toFixed(2)}
        </SvgText>
      </Svg>

      <View style={styles.legend}>
        <Legend color={colors.macdLine} label="MACD (12,26)" />
        <Legend color={colors.macdSignal} label="Signal (9)" />
      </View>
    </View>
  );
}

function Legend({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  legend: {
    position: 'absolute',
    top: 4,
    left: 12,
    flexDirection: 'row',
    gap: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 2 },
  legendText: { color: colors.textDim, fontSize: 10 },
});
