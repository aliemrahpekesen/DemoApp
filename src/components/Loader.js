import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Loader({ label = 'Loading…' }) {
  return (
    <View style={styles.box}>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 24, alignItems: 'center', gap: 8 },
  text: { color: colors.textDim, fontSize: 12 },
});
