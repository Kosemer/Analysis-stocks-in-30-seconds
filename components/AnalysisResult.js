import React from 'react';
import { View, Text } from 'react-native';

export default function AnalysisResult({ results }) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Elemzési eredmények:</Text>
      {Object.entries(results).map(([key, value]) => (
        <Text key={key}>
          {key}: {value ? '✅ Igen' : '❌ Nem'}
        </Text>
      ))}
    </View>
  );
}