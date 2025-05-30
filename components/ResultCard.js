import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ResultCard({ currentPrice, fairValue }) {
  const status =
    currentPrice < fairValue
      ? "✅ Alulértékelt"
      : "⚠️ Korrekt vagy túlértékelt";

  return (
    <View style={styles.card}>
      <Text style={styles.item}>Jelenlegi ár: ${currentPrice.toFixed(2)}</Text>
      <Text style={styles.item}>Reális érték: ${fairValue.toFixed(2)}</Text>
      <Text style={styles.item}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
    alignItems: "center",
    marginTop: 20,
  },
  item: {
    fontSize: 16,
    marginBottom: 6,
  },
});
