// components/StockPriceDetails.js

import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

// A segédfüggvények változatlanok maradhatnak, mivel nem tartalmaznak stílusokat
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
    if (value === null || value === undefined) return 'n.a.';
    if (key === 'timestamp') return new Date(value * 1000).toLocaleString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (typeof value !== 'number') return value;
    switch (key) {
        case 'changesPercentage': return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
        case 'change': return `${value > 0 ? '+' : ''}${value.toFixed(2)}$`;
        case 'volume': case 'avgVolume': return `${value.toLocaleString('hu-HU')} db`;
        case 'currentPrice': case 'dayLow': case 'dayHigh': case 'priceAvg50': case 'priceAvg200': return `$${value.toFixed(2)}`;
        default: return value.toFixed(2);
    }
};

const StockPriceDetails = ({ analysis }) => {
  // 1. Az eszköz aktuális színsémájának lekérdezése
  const colorScheme = useColorScheme();
  // 2. A stílusok generálása a színséma alapján
  const styles = getStyles(colorScheme);

  // A DataTile komponenst ide helyezzük, hogy hozzáférjen a 'styles' változóhoz
  const DataTile = ({ label, value, valueStyle }) => (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={[styles.tileValue, valueStyle]}>{value}</Text>
    </View>
  );

  if (!analysis) {
    return null;
  }

  const displayKeys = [
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
  const currentPriceData = analysis.currentPrice;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Árfolyam Részletek</Text>

      {currentPriceData && (
        <View style={styles.heroTile}>
          <Text style={styles.heroLabel}>{labels.currentPrice}</Text>
          <Text style={styles.heroValue}>
            {formatValue('currentPrice', currentPriceData.value)}
          </Text>
        </View>
      )}

      <View style={styles.gridContainer}>
        {displayKeys
          .filter((key) => analysis[key] !== undefined)
          .map((key) => {
            const item = analysis[key];
            
            let valueStyle = {};
            if (coloredKeys.includes(key)) {
              valueStyle = item.passed ? styles.pass : styles.fail;
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

// 3. A stílusokat egy függvénybe helyeztük, ami a színséma alapján hozza őket létre
const getStyles = (colorScheme) => {
  const isDarkMode = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#0B132B' : '#F8F9FA',
      borderRadius: 16,
      padding: 16,
      marginVertical: 10,
      // Árnyék hozzáadása világos módban, hogy kiemelkedjen
      shadowColor: "#F8F9FA",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDarkMode ? 0 : 0.1,
      shadowRadius: 3.84,
      elevation: isDarkMode ? 0 : 5,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#F5F5F5' : '#1A1A1A',
      marginBottom: 20,
    },
    heroTile: {
      width: '100%',
      backgroundColor: isDarkMode ? '#3A506B' : '#F0F2F5', // Világos, semleges háttér
      borderRadius: 12,
      paddingVertical: 20,
      paddingHorizontal: 15,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroLabel: {
      fontSize: 16,
      color: isDarkMode ? '#A9B4C2' : '#555555',
      marginBottom: 8,
      fontWeight: '500',
    },
    heroValue: {
      fontSize: 36,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    tile: {
      width: '48.5%',
      backgroundColor: isDarkMode ? '#1C2541' : '#FFFFFF',
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#3A506B' : '#E0E0E0',
      minHeight: 100,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    tileLabel: {
      fontSize: 14,
      color: isDarkMode ? '#A9B4C2' : '#666666',
      marginBottom: 8,
      textAlign: 'center',
      fontWeight: '500',
    },
    tileValue: {
      fontSize: 17,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#1A1A1A',
      textAlign: 'center',
    },
    // A piros és zöld színek mindkét témán jól mutatnak, nem szükséges módosítani
    pass: {
      color: '#2ECC71',
    },
    fail: {
      color: '#E74C3C',
    },
  });
};

export default StockPriceDetails;