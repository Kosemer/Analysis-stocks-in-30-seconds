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
  useColorScheme, // <<< VÁLTOZÁS 1: Importáljuk a useColorScheme hookot
  Keyboard,
  ActivityIndicator,
} from "react-native";
import StockInput from "./components/StockInput";
import StockAnalysis from "./components/StockAnalysis";
import { fetchStockData } from "./services/api";
import { calculateDCF } from "./services/dcf";
import { analyzeStock } from "./services/analyzer";
import { getUniqueSectors } from "./utils/getUniqueSectors";
import UsdHufWidget from "./services/UsdHufWidget";

// <<< VÁLTOZÁS 2: Téma definíciók az App komponenshez >>>
const lightTheme = {
  background: '#F8F9FA', // Enyhén törtfehér, hogy a widgetek kiemelkedjenek
  textPrimary: '#212529', // Sötét szöveg
  textSecondary: '#6C757D', // Halványabb szöveg (pl. timestamp)
  buttonBackground: '#75EDA9', // Klasszikus kék gomb
  buttonPressed: '#4E9A6F', // Sötétebb kék lenyomáskor
  buttonText: '#212529', // Fehér szöveg a gombon
    // --- ÁRNYÉK BEÁLLÍTÁSOK ---
    shadowColor: '#000000', // Világos módban a fekete árnyék jó, de az opacitás fontos
    shadowOpacity: 0.1,     // Finom, alig látható opacitás
};

const darkTheme = {
  background: '#0B132B',
  textPrimary: '#FFFFFF',
  textSecondary: '#A9B4C2',
  buttonBackground: '#75EDA9',
  buttonPressed: '#4E9A6F', // Sötétebb zöld lenyomáskor
  buttonText: '#0B132B',
};

// <<< VÁLTOZÁS 3: A StyleSheet egy dinamikus függvény lett >>>
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    // A paddingTop-ot kivettem innen, mert a StatusBar kezeli
  },
  header: {
    padding: 20,
    backgroundColor: theme.background, // A header háttere is legyen a téma szerint
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme.textPrimary,
  },
  button: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonPressed: {
    backgroundColor: theme.buttonPressed,
  },
  buttonText: {
    color: theme.buttonText,
    fontWeight: "bold",
    fontSize: 18,
  },
  stickyTitle: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: theme.textPrimary,
    zIndex: 10,
    backgroundColor: theme.background,
    paddingBottom: 10,
    paddingTop: 10,
  },
  timestampText: {
    color: theme.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default function App() {
  // <<< VÁLTOZÁS 4: A téma kiválasztása a rendszer beállítása alapján >>>
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  // A state és egyéb logika változatlan
  const [ticker, setTicker] = useState("AAPL");
  const [companyName, setCompanyName] = useState("Apple Inc.");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  // ... a handleStockChange, handleCalc és az animációs logika változatlan ...
  const handleStockChange = (selection) => {
    if (typeof selection === 'string') { setTicker(selection); setCompanyName(''); }
    else if (selection) { setTicker(selection.Symbol || selection.symbol); setCompanyName(selection.Security || selection.name); }
  };
  const handleCalc = async () => {
    // Elrejti a billentyűzetet és a javaslatokat a számítás indításakor
    Keyboard.dismiss(); 
    setIsAnalysisLoading(true); // <<< TÖLTÉS INDÍTÁSA
    setAnalysis(null);          // <<< RÉGI ADATOK TÖRLÉSE
    try {
      // Az adatlekérési logika, ahogy eredetileg is volt
      const data = await fetchStockData(ticker.toUpperCase());
      const totalValue = calculateDCF(
        data.freeCashFlow,
        data.growthRate,
        data.discountRate,
        data.terminalGrowth
      );
      const valuePerShare = totalValue / data.sharesOutstanding;
      
      // Az analízis lefuttatása
      const evaluation = analyzeStock(data);
      evaluation.revenueGrowthByYear = data.revenueGrowthByYear;
      
      // Az állapotok beállítása a friss adatokkal
      // setFairValue(valuePerShare); // Ezt a sort valószínűleg nem használod, de itt volt
      // setCurrentPrice(data.currentPrice); // Ezt a sort valószínűleg nem használod, de itt volt
      setAnalysis(evaluation);
      
      if (evaluation.timestamp && evaluation.timestamp.value) {
        setLastUpdated(evaluation.timestamp.value);
      }
      
      // getUniqueSectors(); // Ha erre a függvényre nincs szükséged, ki is veheted
    } catch (err) {
      console.error("Adatlekérési vagy számítási hiba:", err);
      Alert.alert(
        "Hiba",
        `Nem sikerült lekérni vagy feldolgozni az adatokat a(z) '${ticker.toUpperCase()}' szimbólumhoz. Kérlek, ellenőrizd a beírt ticker nevet.`
      );
      // Hiba esetén töröljük a korábbi analízist
      setAnalysis(null); 
      setLastUpdated(null);
    }
    finally {
      setIsAnalysisLoading(false); // <<< TÖLTÉS BEFEJEZÉSE (sikeres és sikertelen esetben is)
    }
  };
  const headerOpacity = scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0], extrapolate: "clamp" });
  const headerTranslate = scrollY.interpolate({ inputRange: [0, 100], outputRange: [0, -50], extrapolate: "clamp" });
  

  return (
    // A paddingTop a belső View-ra került, hogy a StatusBar alá is a megfelelő szín kerüljön
    <View style={styles.container}>
      {/* <<< VÁLTOZÁS 5: A StatusBar dinamikussá tétele >>> */}
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background} 
      />
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
            position: "absolute",
            top: 50, // Vagy amennyi a StatusBar magassága
            left: 0,
            right: 0,
            zIndex: 5,
          },
        ]}
      >
        <Text style={styles.title}>📊 Részvény elemző</Text>

        {/* FONTOS: A gyerekkomponenseknek is át kell adni a témát! */}
        <StockInput value={ticker} onChange={handleStockChange} theme={theme} />

        <Pressable
          onPress={handleCalc}
          style={({ pressed }) => [ styles.button, pressed && styles.buttonPressed ]}
        >
          <Text style={styles.buttonText}>Számítás</Text>
        </Pressable>
        
        {lastUpdated && (
          <Text style={styles.timestampText}>
            Adatok frissítve: {new Date(lastUpdated * 1000).toLocaleString('hu-HU')}
          </Text>
        )}
      </Animated.View>
      
      <Animated.Text style={[ styles.stickyTitle, { opacity: scrollY.interpolate({ inputRange: [80, 120], outputRange: [0, 1], extrapolate: "clamp" }) } ]}>
        {companyName ? `${companyName} (${ticker.toUpperCase()})` : ticker.toUpperCase()}
      </Animated.Text>

      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: 260 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        <UsdHufWidget />
        {/* FONTOS: A gyerekkomponenseknek is át kell adni a témát! */}
        {isAnalysisLoading && (
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.buttonBackground} />
          </View>
        )}
        
        {/* 2. Ha nem tölt, ÉS van analízis, jelenítsük meg az eredményt */}
        {!isAnalysisLoading && analysis && (
          <StockAnalysis analysis={analysis} />
        )}
        
      </Animated.ScrollView>
    </View>
  );
}