import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function StockSelector({ stocks, selectedSymbol, onChange }) {
  return (
    <View>
      <Text>Válassz egy részvényt:</Text>
      <Picker selectedValue={selectedSymbol} onValueChange={onChange}>
        {stocks.map((symbol) => (
          <Picker.Item key={symbol} label={symbol} value={symbol} />
        ))}
      </Picker>
    </View>
  );
}