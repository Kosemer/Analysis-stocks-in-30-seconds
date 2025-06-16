import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

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

// A stílusok itt maradnak, és propként kapják meg a gyerek komponensek.
// Így nem kell minden fájlban duplikálni őket.
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    marginTop: 20,
    padding: 0,
    backgroundColor: "#0B132B",
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    color: '#fff',
  },
  subtitle: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: '#fff',
  },
  item: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
    color: '#fff',
  },
  growthContainer: {
    marginTop: 10,
  },
  metricsContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: "#1C2541",
    borderWidth: 1,
    borderColor: '#3A506B',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  expandedText: {
    marginTop: 10,
    fontSize: 15,
    color: '#fff',
    textAlign: "center",
  },
  greenText: {
    color: "#3CB371",
    fontWeight: "bold",
  },
  redText: {
    color: "red",
    fontWeight: "bold",
  },
  // --- Az újabb stílusok (a teljesség kedvéért) ---
  orangeText: {
    color: 'orange',
    fontWeight: 'bold'
  },
  warningText: {
      color: '#FFD700', // Sárga/arany figyelmeztető szín
      fontWeight: 'bold'
  },
  defaultText: {
    color: '#fff', // Visszaállítás a normál fehér színre
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
    color: '#fff',
    textAlign: 'center'
  },
  itemIcon: {
    fontSize: 16,
    marginLeft: 8
  },
  commentText: {
    fontSize: 14,
    color: '#B0C4DE', // Világosabb, szürkéskék a kommentekhez
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
    paddingHorizontal: 10
  },
  expandedHeader: {
    fontWeight: "bold",
    fontSize: 16,
    color: '#6FFFB0', // Kiemelő zöld
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#3A506B',
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  detailLabel: {
    color: '#B0C4DE',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Táblázat stílusai
  table: {
    borderWidth: 1,
    borderColor: "#4a6572",
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
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  tableHeaderRow: {
    backgroundColor: "#2c3e50",
    borderBottomWidth: 1,
    borderColor: "#4a6572",
  },
  tableHeader: {
    fontWeight: "bold",
    color: "#fff",
  },
  tableRowOdd: {
    backgroundColor: "#75EDA9",
  },
  tableRowEven: {
    backgroundColor: "#fff",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#555",
  },
  tableCellLight: {
    color: "#1A2E33",
    fontWeight: "bold",
  },
});