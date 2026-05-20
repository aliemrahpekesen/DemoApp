import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';
import { makeLinearScale } from '../utils/scale';

const PADDING = { top: 12, right: 44, bottom: 14, left: 8 };
const OVERSOLD = 30;
const OVERBOUGHT = 70;

export default function RSIChart({ rsi, width, height }) {
  if (!rsi?.length) return null;

  const innerW = width - PADDING.left - PADDING.right;
  const innerH = height - PADDING.top - PADDING.bottom;
  const yScale = makeLinearScale(0, 100, PADDING.top + innerH, PADDING.top);

  const slot = innerW / rsi.length;

  let d = '';
  let started = false;
  for (let i = 0; i < rsi.length; i++) {
    const v = rsi[i];
    if (v == null) continue;
    const x = PADDING.left + i * slot + slot / 2;
    const y = yScale(v);
    d += started ? ` L${x.toFixed(2)} ${y.toFixed(2)}` : `M${x.toFixed(2)} ${y.toFixed(2)}`;
    started = true;
  }

  const yOver = yScale(OVERBOUGHT);
  const ySold = yScale(OVERSOLD);

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={height}>
        <Rect
          x={PADDING.left}
          y={yOver}
          width={innerW}
          height={ySold - yOver}
          fill={colors.rsiBand}
          opacity={0.18}
        />

        {[20, 50, 80].map((t) => (
          <Line
            key={t}
            x1={PADDING.left}
            x2={width - PADDING.right}
            y1={yScale(t)}
            y2={yScale(t)}
            stroke={colors.grid}
            strokeWidth={0.5}
          />
        ))}

        <Line
          x1={PADDING.left}
          x2={width - PADDING.right}
          y1={yOver}
          y2={yOver}
          stroke={colors.down}
          strokeOpacity={0.5}
          strokeDasharray="3,3"
          strokeWidth={0.6}
        />
        <Line
          x1={PADDING.left}
          x2={width - PADDING.right}
          y1={ySold}
          y2={ySold}
          stroke={colors.up}
          strokeOpacity={0.5}
          strokeDasharray="3,3"
          strokeWidth={0.6}
        />

        <Path d={d} stroke={colors.rsi} strokeWidth={1.5} fill="none" />

        <SvgText x={width - PADDING.right + 4} y={yOver + 3} fontSize="9" fill={colors.textDim}>
          70
        </SvgText>
        <SvgText x={width - PADDING.right + 4} y={ySold + 3} fontSize="9" fill={colors.textDim}>
          30
        </SvgText>
      </Svg>
      <Text style={styles.label}>RSI (14)</Text>
    </View>
  );
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
