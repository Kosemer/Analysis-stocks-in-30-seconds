import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Animated,
  ScrollView,
  StatusBar,
} from "react-native";
import StockInput from "./components/StockInput";
import StockAnalysis from "./components/StockAnalysis";
import { fetchStockData } from "./services/api";
import { calculateDCF } from "./services/dcf";
import { analyzeStock } from "./services/analyzer";
import { getUniqueSectors } from "./utils/getUniqueSectors";
import UsdHufWidget from "./services/UsdHufWidget";

export default function App() {
  const [ticker, setTicker] = useState("AAPL");
  const [companyName, setCompanyName] = useState("Apple Inc.");
  const [fairValue, setFairValue] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  // <<< MÓDOSÍTÁS 1: Új state változó a timestamp tárolására >>>
  const [lastUpdated, setLastUpdated] = useState(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const handleStockChange = (selection) => {
    if (typeof selection === 'string') {
      setTicker(selection);
      setCompanyName('');
    } else if (typeof selection === 'object' && selection !== null) {
      const symbol = selection.Symbol || selection.symbol;
      const name = selection.Security || selection.name;
      setTicker(symbol);
      setCompanyName(name);
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const handleCalc = async () => {
    try {
      const data = await fetchStockData(ticker.toUpperCase());
      const totalValue = calculateDCF(
        data.freeCashFlow,
        data.growthRate,
        data.discountRate,
        data.terminalGrowth
      );
      const valuePerShare = totalValue / data.sharesOutstanding;
      setFairValue(valuePerShare);
      setCurrentPrice(data.currentPrice);
      const evaluation = analyzeStock(data);
      evaluation.revenueGrowthByYear = data.revenueGrowthByYear;
      setAnalysis(evaluation);
      
      // <<< MÓDOSÍTÁS 2: Beállítjuk a lastUpdated state-et a friss adatokból >>>
      if (evaluation.timestamp && evaluation.timestamp.value) {
        setLastUpdated(evaluation.timestamp.value);
      }
      
      await getUniqueSectors();
    } catch (err) {
      console.error("Adatlekérési vagy számítási hiba:", err);
      Alert.alert("Hiba", "Nem sikerült lekérni vagy feldolgozni az adatokat.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" />
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            zIndex: 5,
          },
        ]}
      >
        <Text style={styles.title}>📊 Részvény elemző</Text>
        <StockInput value={ticker} onChange={handleStockChange} />
        <Pressable
          onPress={handleCalc}
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.buttonText}>Számítás</Text>
        </Pressable>
        
        {/* <<< MÓDOSÍTÁS 3: A timestamp megjelenítése a gomb alatt >>> */}
        {lastUpdated && (
          <Text style={styles.timestampText}>
            Adatok frissítve: {new Date(lastUpdated * 1000).toLocaleString('hu-HU', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </Text>
        )}
        
      </Animated.View>
      
      <Animated.Text
        style={[
          styles.stickyTitle,
          {
            opacity: scrollY.interpolate({
              inputRange: [80, 120],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        {companyName ? `${companyName} (${ticker.toUpperCase()})` : ticker.toUpperCase()}
      </Animated.Text>

      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: 260 }} // << Kicsit megnöveltem, hogy elférjen a timestamp
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
         <UsdHufWidget />
        {analysis && <StockAnalysis analysis={analysis} />}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B132B",
    paddingTop: 50,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  button: {
    backgroundColor: "#75EDA9",
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
    color: "#0B132B",
    fontWeight: "bold",
    fontSize: 18,
  },
  stickyTitle: {
    position: "absolute",
    top: 60, // Kicsit lejjebb igazítottam a jobb elhelyezkedésért
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    zIndex: 10,
  },
  // <<< MÓDOSÍTÁS 4: Új stílus a timestamp szöveghez >>>
  timestampText: {
    color: '#A9B4C2', // Halvány, szürkéskék szín a designból
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8, // Kis térköz a gomb felett
  },
});