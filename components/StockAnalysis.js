import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StockAnalysis({ analysis }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Elemzés eredménye</Text>
      {Object.entries(analysis).map(([label, result]) => (
        <Text key={label} style={styles.item}>
          {label}: {result.value} {result.passed ? '✅' : '❌'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20, padding: 10, backgroundColor: '#f2f2f2', borderRadius: 10 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  item: { fontSize: 16, marginBottom: 6 },
});
