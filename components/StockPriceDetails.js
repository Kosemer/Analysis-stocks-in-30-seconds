// components/StockPriceDetails.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ... a labels és a formatValue függvény változatlan ...
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

const formatValue = (key, value) => {
    // ... ez a függvény változatlan ...
    if (value === null || value === undefined) return 'n.a.';
    if (typeof value !== 'number') return value;
    switch (key) {
        case 'changesPercentage': return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
        case 'change': return `${value > 0 ? '+' : ''}${value.toFixed(2)}$`;
        case 'volume': case 'avgVolume': return `${value.toLocaleString('hu-HU')} db`;
        case 'timestamp': return new Date(value * 1000).toLocaleString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        case 'currentPrice': case 'dayLow': case 'dayHigh': case 'priceAvg50': case 'priceAvg200': return `$${value.toFixed(2)}`;
        default: return value.toFixed(2);
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

  // <<< MÓDOSÍTÁS: a currentPrice-t kivettük a listából, hogy külön kezeljük >>>
  const displayKeys = [
    // 'currentPrice', // Ezt most külön kezeljük
    //'timestamp',
    'changesPercentage',
    'change',
    'dayLow',
    'dayHigh',
    'volume',
    'avgVolume',
    'priceAvg50',
    'priceAvg200',
  ];

  const coloredKeys = ['changesPercentage', 'change'];

  // <<< MÓDOSÍTÁS: a currentPrice adatainak előkészítése >>>
  const currentPriceData = analysis.currentPrice;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Árfolyam Részletek</Text>

      {/* <<< ÚJ KIEMELT RÉSZ AZ AKTUÁLIS ÁRFOLYAMNAK >>> */}
      {currentPriceData && (
        <View style={styles.heroTile}>
          <Text style={styles.heroLabel}>{labels.currentPrice}</Text>
          <Text style={styles.heroValue}>
            {formatValue('currentPrice', currentPriceData.value)}
          </Text>
        </View>
      )}
      {/* <<< ÚJ KIEMELT RÉSZ VÉGE >>> */}

      <View style={styles.gridContainer}>
        {displayKeys
          .filter((key) => analysis[key] !== undefined)
          .map((key) => {
            const item = analysis[key];
            
            let valueStyle = {};

            if (coloredKeys.includes(key)) {
              valueStyle = { color: item.passed ? styles.pass.color : styles.fail.color };
            } else if (key === 'dayHigh') {
              valueStyle = styles.pass;
            } else if (key === 'dayLow') {
              valueStyle = styles.fail;
            }
            
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

// <<< MÓDOSÍTOTT STÍLUSOK >>>
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B132B',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F5F5F5',
    marginBottom: 20,
  },
  // <<< ÚJ STÍLUSOK A KIEMELT CSEMPÉHEZ >>>
  heroTile: {
    width: '100%',
    backgroundColor: '#3A506B', // Eltérő, de a palettába illő háttérszín
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20, // Térköz a rács előtt
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    fontSize: 16, // Kicsit nagyobb címke
    color: '#A9B4C2',
    marginBottom: 8,
    fontWeight: '500',
  },
  heroValue: {
    fontSize: 36, // JELENTŐSEN NAGYOBB betűméret
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // <<< A RÁCS STÍLUSAI VÁLTOZATLANOK >>>
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48.5%',
    backgroundColor: '#1C2541',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A506B',
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tileLabel: {
    fontSize: 14,
    color: '#A9B4C2',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  tileValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  pass: {
    color: '#2ECC71',
  },
  fail: {
    color: '#E74C3C',
  },
});

export default StockPriceDetails;