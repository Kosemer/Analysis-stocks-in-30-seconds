import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, useColorScheme } from "react-native";

// Meglévő komponensek importálása
import StockPriceDetails from "./StockPriceDetails";
import ResultCard from "./ResultCard"; // Bár nincs használva a kódban, meghagytam az importot

// Új, szétbontott kártya komponensek importálása
import RevenueGrowthCard from "./analysis/RevenueGrowthCard";
import QuickRatioCard from "./analysis/QuickRatioCard";
import QuickRatioTTMCard from "./analysis/QuickRatioTTMCard";
import CurrentRatioCard from "./analysis/CurrentRatioCard";
import RoeCard from "./analysis/RoeCard";
import PegRatioCard from "./analysis/PegRatioCard";
import PeRatioCard from "./analysis/PeRatioCard";
import PeRatioTTMCard from "./analysis/PeRatioTTMCard";

export default function StockAnalysis({ analysis }) {
  const [expandedCards, setExpandedCards] = useState({});
  
  // 1. Az eszköz aktuális színsémájának lekérdezése
  const colorScheme = useColorScheme();
  
  // 2. A stílusok generálása a színséma alapján
  const styles = getStyles(colorScheme);

  const toggleCard = (key) => {
    setExpandedCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const priceDetailsData = {
    currentPrice: analysis.currentPrice,
    changesPercentage: analysis.changesPercentage,
    change: analysis.change,
    dayLow: analysis.dayLow,
    dayHigh: analysis.dayHigh,
    priceAvg50: analysis.priceAvg50,
    priceAvg200: analysis.priceAvg200,
    volume: analysis.volume,
    avgVolume: analysis.avgVolume,
    timestamp: analysis.timestamp,
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* A StockPriceDetails komponenst is át kell majd alakítani, hogy fogadja a témát,
          de a jelenlegi feladat csak a StockAnalysis-ra vonatkozik. */}
      <View style={styles.container}>
        <StockPriceDetails analysis={priceDetailsData} /> 
        <Text style={styles.title}>📋 Elemzés eredménye</Text>

        {analysis.revenueGrowthByYear && (
          <RevenueGrowthCard
            data={{ byYear: analysis.revenueGrowthByYear, fiveYear: analysis.revenueGrowth5Y }}
            isExpanded={expandedCards["revenueGrowthByYear"]}
            onToggle={() => toggleCard("revenueGrowthByYear")}
            styles={styles}
          />
        )}

        {(analysis.quickRatio ||
          analysis.roe5Y ||
          analysis.pegRatioFromRatios ||
          analysis.peRatioFromRatios) && (
          <View style={styles.metricsContainer}>
            {analysis.quickRatio !== undefined && (
              <QuickRatioCard
                data={analysis.quickRatio}
                isExpanded={expandedCards["quickRatio"]}
                onToggle={() => toggleCard("quickRatio")}
                styles={styles}
              />
            )}
            {analysis.quickRatioTTM !== undefined && (
              <QuickRatioTTMCard
                data={analysis.quickRatioTTM}
                isExpanded={expandedCards["quickRatioTTM"]}
                onToggle={() => toggleCard("quickRatioTTM")}
                styles={styles}
              />
            )}
            {analysis.currentRatio !== undefined && (
              <CurrentRatioCard
                data={analysis.currentRatio}
                isExpanded={expandedCards["currentRatio"]}
                onToggle={() => toggleCard("currentRatio")}
                styles={styles}
              />
            )}
            {analysis.roeList && Array.isArray(analysis.roeList) && (
              <RoeCard
                data={{ list: analysis.roeList, fiveYear: analysis.roe5Y }}
                isExpanded={expandedCards["roeList"]}
                onToggle={() => toggleCard("roeList")}
                styles={styles}
              />
            )}
            {analysis.pegRatioFromRatios !== undefined && (
              <PegRatioCard
                data={analysis.pegRatioFromRatios}
                isExpanded={expandedCards["pegRatioFromRatios"]}
                onToggle={() => toggleCard("pegRatioFromRatios")}
                styles={styles}
              />
            )}
            {analysis.peRatioFromRatios !== undefined && (
              <PeRatioCard
                data={analysis.peRatioFromRatios}
                isExpanded={expandedCards["peRatioFromRatios"]}
                onToggle={() => toggleCard("peRatioFromRatios")}
                styles={styles}
              />
            )}
            {analysis.peRatioTTM && (
               <PeRatioTTMCard
                data={analysis.peRatioTTM}
                isExpanded={expandedCards["peRatioTTM"]}
                onToggle={() => toggleCard("peRatioTTM")}
                styles={styles}
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// 3. A stílusokat egy függvénybe helyeztük, ami a színséma alapján hozza őket létre
const getStyles = (colorScheme) => {
  const isDarkMode = colorScheme === 'dark';

  return StyleSheet.create({
    scrollContainer: {
      paddingBottom: 20,
    },
    container: {
      marginTop: 20,
      padding: 0,
      // Az app.js-sel konzisztens háttérszínek
      backgroundColor: isDarkMode ? '#0B132B' : '#F5F5F5', 
      borderRadius: 10,
    },
    title: {
      fontWeight: "bold",
      fontSize: 18,
      marginBottom: 10,
      textAlign: "center",
      color: isDarkMode ? '#fff' : '#000',
    },
    subtitle: {
      fontWeight: "bold",
      marginTop: 10,
      fontSize: 16,
      textAlign: "center",
      color: isDarkMode ? '#fff' : '#000',
    },
    listKeyText: {
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    item: {
      fontSize: 16,
      marginBottom: 6,
      textAlign: "center",
      color: isDarkMode ? '#fff' : '#000',
    },
    growthContainer: {
      marginTop: 10,
    },
    metricsContainer: {
      marginTop: 10,
    },
    card: {
      backgroundColor: isDarkMode ? "#1C2541" : "#FFFFFF",
      borderWidth: 1,
      borderColor: isDarkMode ? '#3A506B' : '#E0E0E0',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      marginLeft: 15,
      marginRight: 15,
      // Árnyék a világos módhoz
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: isDarkMode ? 0 : 0.20,
      shadowRadius: 1.41,
      elevation: isDarkMode ? 1 : 2,
    },
    expandedText: {
      marginTop: 10,
      fontSize: 15,
      color: isDarkMode ? '#fff' : '#333',
      textAlign: "center",
    },
    // A színkiemelő szövegek (zöld, piros) általában mindkét témán jól működnek
    greenText: {
      color: "#3CB371",
      fontWeight: "bold",
    },
    redText: {
      color: "red",
      fontWeight: "bold",
    },
    orangeText: {
      color: 'orange',
      fontWeight: 'bold'
    },
    warningText: {
        color: '#FFD700',
        fontWeight: 'bold'
    },
    defaultText: {
      color: isDarkMode ? '#fff' : '#000',
      fontWeight: 'normal'
    },
    valueRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    },
    itemValue: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
      textAlign: 'center'
    },
    itemIcon: {
      fontSize: 16,
      marginLeft: 8
    },
    commentText: {
      fontSize: 14,
      color: isDarkMode ? '#B0C4DE' : '#666',
      textAlign: 'center',
      marginTop: 4,
      fontStyle: 'italic',
      paddingHorizontal: 10
    },
    expandedHeader: {
      fontWeight: "bold",
      fontSize: 16,
      color: isDarkMode ? '#6FFFB0' : '#005B41',
      marginTop: 12,
      marginBottom: 6,
      textAlign: 'center',
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#3A506B' : '#E0E0E0',
      paddingTop: 10,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    detailLabel: {
      color: isDarkMode ? '#B0C4DE' : '#555',
      fontSize: 14,
    },
    detailValue: {
      color: isDarkMode ? '#fff' : '#000',
      fontSize: 14,
      fontWeight: 'bold',
    },
    // Táblázat stílusai
    table: {
      borderWidth: 1,
      borderColor: isDarkMode ? "#4a6572" : '#ccc',
      borderRadius: 8,
      marginTop: 5,
      overflow: "hidden",
    },
    tableRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : '#eee',
    },
    tableHeaderRow: {
      backgroundColor: isDarkMode ? "#2c3e50" : '#2c3e50',
      borderBottomWidth: 1,
      borderColor: isDarkMode ? "#4a6572" : '#ccc',
    },
    tableHeader: {
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : '#fff',
    },
    // Ezeket a színeket módosítani kellett, hogy világos módban is értelmesek legyenek
    tableRowOdd: {
      backgroundColor: isDarkMode ? "#75EDA9" : "#75EDA9",
    },
    tableRowEven: {
      backgroundColor: isDarkMode ? "#fff" : "#fff",
    },
    tableCell: {
      flex: 1,
      fontSize: 14,
      color: isDarkMode ? "#555" : '#555', // A sötét módhoz sötét szöveg kell a világos háttér miatt
    },
    tableCellLight: {
      color: "#1A2E33", // Ez a sötétzöld mindkét háttéren jól mutat
      fontWeight: "bold",
    },
    explanationTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#1A1A1A',
      marginTop: 15,
      marginBottom: 10,
      textAlign: 'center'
    },
    explanationTable: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#3A506B' : '#E0E0E0',
      borderRadius: 8,
      overflow: 'hidden', // Fontos, hogy a sorok sarka is kerekített legyen
      marginTop: 5,
    },
    explanationRow: {
      flexDirection: 'row',
      backgroundColor: 'transparent', // Az alap háttér átlátszó
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#3A506B' : '#E0E0E0',
    },
    explanationCell: {
      paddingVertical: 12,
      paddingHorizontal: 8,
      fontSize: 14,
      color: isDarkMode ? '#E0E0E0' : '#333333',
      textAlignVertical: 'center',
    },
    rangeCell: {
      flex: 2.5, // Szélességi arány
      fontWeight: 'bold',
      justifyContent: 'center',
    },
    statusCell: {
      flex: 3, // Szélességi arány
      fontWeight: 'bold',
      alignItems: 'center',
      justifyContent: 'center',
    },
    descriptionCell: {
      flex: 6.5, // Szélességi arány
      color: isDarkMode ? '#B0C4DE' : '#555555',
      justifyContent: 'center',
    },
  });
};