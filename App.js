import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import StockInput from "./components/StockInput";
import ResultCard from "./components/ResultCard";
import { fetchStockData } from "./services/api";
import { calculateDCF } from "./services/dcf";
import StockAnalysis from "./components/StockAnalysis";
import { analyzeStock } from './services/analyzer';

export default function App() {
  const [ticker, setTicker] = useState("AAPL");
  const [fairValue, setFairValue] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleCalc = async () => {
    try {
      const data = await fetchStockData(ticker.toUpperCase());
      const totalValue = calculateDCF(data.freeCashFlow, data.growthRate, data.discountRate, data.terminalGrowth);
      const valuePerShare = totalValue / data.sharesOutstanding;
      setFairValue(valuePerShare);
      setCurrentPrice(data.currentPrice);

      const evaluation = analyzeStock(data);
      evaluation.revenueGrowthByYear = data.revenueGrowthByYear;
      setAnalysis(evaluation);

      // Itt a mentési és értesítési logika...

    } catch (err) {
      console.error("Adatlekérési vagy számítási hiba:", err);
      Alert.alert("Hiba", "Nem sikerült lekérni vagy feldolgozni az adatokat.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 DCF Részvény Érték Kalkulátor</Text>
      <StockInput value={ticker} onChange={setTicker} />

      <Pressable
        onPress={handleCalc}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null
        ]}
      >
        <Text style={styles.buttonText}>Számítás</Text>
      </Pressable>
      {analysis && <StockAnalysis analysis={analysis} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonPressed: {
    backgroundColor: "#005BBB",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
