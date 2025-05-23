import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
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
    
      try {
        await saveLastValue(ticker, valuePerShare);
      } catch (saveErr) {
        console.warn("Mentési hiba:", saveErr);
      }
    
      if (data.currentPrice < valuePerShare) {
        try {
          await sendNotification(ticker, data.currentPrice, valuePerShare);
        } catch (notifErr) {
          console.warn("Értesítési hiba:", notifErr);
        }
      }
    } catch (err) {
      console.error("Adatlekérési vagy számítási hiba:", err);
      Alert.alert("Hiba", "Nem sikerült lekérni vagy feldolgozni az adatokat.");
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 DCF Részvény Érték Kalkulátor</Text>
      <StockInput value={ticker} onChange={setTicker} />
      <Button title="Számítás" onPress={handleCalc} />
      {fairValue && currentPrice && <ResultCard currentPrice={currentPrice} fairValue={fairValue} />}
      {analysis && <StockAnalysis analysis={analysis} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});