import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Couldn't load data</Text>
      <Text style={styles.msg}>{message}</Text>
      {onRetry && (
        <Pressable style={styles.btn} onPress={onRetry}>
          <Text style={styles.btnText}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 24, alignItems: 'center', gap: 10 },
  title: { color: colors.text, fontSize: 14, fontWeight: '600' },
  msg: { color: colors.textDim, fontSize: 12, textAlign: 'center' },
  btn: {
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: colors.accent,
    borderRadius: 6,
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
});
