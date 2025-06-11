// components/StockPriceDetails.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ... a labels és a fő komponens logikája változatlan ...

const labels = {
  currentPrice: 'Aktuális árfolyam',
  timestamp: 'Frissítés Dátuma',
  changesPercentage: 'Napi Változás (%)',
  change: 'Napi Változás ($)',
  dayLow: 'Napi Minimum',
  dayHigh: 'Napi Maximum',
  priceAvg50: '50 Napos Mozgóátlag',
  priceAvg200: '200 Napos Mozgóátlag',
  volume: 'Napi Forgalom',
  avgVolume: 'Átlagos Forgalom',
};

// Javítottam egy apró hibát a 'change' formázásában (dupla dollárjel)
const formatValue = (key, value) => {
  if (value === null || value === undefined) {
    return 'n.a.';
  }
  if (typeof value !== 'number') {
    return value;
  }

  switch (key) {
    case 'changesPercentage':
      return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
    case 'change': // Javítva: a dollárjel a pénznemekhez tartozik
      return `${value > 0 ? '+' : ''}${value.toFixed(2)}$`;
    case 'volume':
    case 'avgVolume':
      return `${value.toLocaleString('hu-HU')} db`;
    case 'timestamp':
      return new Date(value * 1000).toLocaleString('hu-HU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'currentPrice':
    case 'dayLow':
    case 'dayHigh':
    case 'priceAvg50':
    case 'priceAvg200':
      return `$${value.toFixed(2)}`;
    default:
      return value.toFixed(2);
  }
};

const DataTile = ({ label, value, valueStyle }) => (
  <View style={styles.tile}>
    <Text style={styles.tileLabel}>{label}</Text>
    <Text style={[styles.tileValue, valueStyle]}>{value}</Text>
  </View>
);

const StockPriceDetails = ({ analysis }) => {
  if (!analysis) {
    return null;
  }
  
  const displayKeys = [
    'currentPrice',
    'changesPercentage',
    'change',
    'dayLow',
    'dayHigh',
    'volume',
    'avgVolume',
    'priceAvg50',
    'priceAvg200',
    'timestamp',
  ];
  
  const coloredKeys = ['changesPercentage', 'change'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Árfolyam Részletek</Text>
      <View style={styles.gridContainer}>
        {displayKeys
          .filter((key) => analysis[key] !== undefined)
          .map((key) => {
            const item = analysis[key];
            const valueStyle = coloredKeys.includes(key)
              ? { color: item.passed ? styles.pass.color : styles.fail.color }
              : {};

            return (
              <DataTile
                key={key}
                label={labels[key] || key}
                value={formatValue(key, item.value)}
                valueStyle={valueStyle}
              />
            );
          })}
      </View>
    </View>
  );
};

// <<< ÚJ, MODERN, SÖTÉT TÉMÁJÚ STÍLUSOK >>>
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B132B', // Mély, sötétkék háttér
    borderRadius: 16, // Nagyobb, modernebb rádiusz
    padding: 16,
    marginVertical: 10,
  },
  title: {
    fontSize: 22, // Kicsit nagyobb cím
    fontWeight: 'bold',
    color: '#F5F5F5', // Enyhén törtfehér, kellemesebb a szemnek
    marginBottom: 20, // Nagyobb térköz
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48.5%',
    backgroundColor: '#1C2541', // A háttérnél világosabb sötétkék
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A506B', // Finom, világosabb szegély a mélységért
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5, // Biztonsági padding
  },
  tileLabel: {
    fontSize: 14,
    color: '#A9B4C2', // Halvány, szürkéskék a címkéknek
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  tileValue: {
    fontSize: 17, // Nagyobb betűméret az értékeknek
    fontWeight: 'bold', // Félkövér
    color: '#FFFFFF', // Tiszta fehér a maximális kontrasztért
    textAlign: 'center',
  },
  pass: {
    color: '#2ECC71', // Élénkebb, modern zöld
  },
  fail: {
    color: '#E74C3C', // Élénkebb, modern piros
  },
});

export default StockPriceDetails;