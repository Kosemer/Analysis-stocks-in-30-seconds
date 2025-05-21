import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ResultCard({ currentPrice, fairValue }) {
  const status = currentPrice < fairValue ? "✅ Alulértékelt" : "⚠️ Korrekt vagy túlértékelt";
  return (
    <View style={styles.box}>
      <Text>Jelenlegi ár: ${currentPrice.toFixed(2)}</Text>
      <Text>Reális érték: ${fairValue.toFixed(2)}</Text>
      <Text>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#eef",
    borderRadius: 10,
    alignItems: "center",
  }
});