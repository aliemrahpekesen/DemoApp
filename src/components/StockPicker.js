import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../theme';

export default function StockPicker({ stocks, value, onChange }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Stock</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          dropdownIconColor={colors.textDim}
          style={styles.picker}
          itemStyle={styles.item}
          mode="dropdown"
        >
          {stocks.map((s) => (
            <Picker.Item
              key={s.symbol}
              label={`${s.symbol.replace('.IS', '')} — ${s.name}`}
              value={s.symbol}
              color={Platform.OS === 'ios' ? colors.text : '#000'}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { color: colors.textDim, fontSize: 11, letterSpacing: 0.5 },
  pickerBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: { color: colors.text },
  item: { color: colors.text },
});
