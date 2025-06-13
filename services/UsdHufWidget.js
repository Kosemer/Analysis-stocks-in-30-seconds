import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

// API konstansok. Érdemes lehet egy közös config fájlba tenni őket.
const BASE_URL_FMP = "https://financialmodelingprep.com/api/v3";
// FONTOS: Cseréld le a saját, érvényes API kulcsodra!
const API_KEY = "kCkgQOjqMBI4Jhkchxn5FsJOQiNulc7Q";

/**
 * Komponens, ami lekéri és megjeleníti az aktuális USD/HUF árfolyamot
 * és a hozzá tartozó részletes adatokat.
 */
const UsdHufWidget = () => {
  // State-ek az adatok, a töltés és a hiba kezelésére
  const [forexData, setForexData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ez a hook felel az adatlekérésért. Csak egyszer fut le, amikor a komponens betöltődik.
  useEffect(() => {
    const fetchUsdHuf = async () => {
      try {
        const forexRes = await fetch(
          `${BASE_URL_FMP}/quote/USDHUF?apikey=${API_KEY}`
        );

        if (!forexRes.ok) {
          throw new Error("Hálózati hiba a devizaadatok lekérésekor.");
        }

        const forexJson = await forexRes.json();

        if (!forexJson || forexJson.length === 0) {
          throw new Error("Nem érkezett adat az USD/HUF árfolyamról.");
        }

        const forex = forexJson[0];

        // Adatok formázása egy objektumba, a hiányzó értékeket 'n.a.'-val helyettesítjük
        const formattedData = {
          name: forex.name || "Amerikai dollár / Magyar forint",
          price: forex.price ?? "n.a.",
          change: forex.change ?? "n.a.",
          changesPercentage: forex.changesPercentage ?? "n.a.",
          yearLow: forex.yearLow ?? "n.a.",
          yearHigh: forex.yearHigh ?? "n.a.",
          priceAvg50: forex.priceAvg50 ?? "n.a.",
          priceAvg200: forex.priceAvg200 ?? "n.a.",
        };

        setForexData(formattedData);
      } catch (err) {
        console.error("Hiba az USD/HUF adatok lekérésekor:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsdHuf();
  }, []); // Az üres függőségi tömb [] biztosítja, hogy ez csak egyszer fusson le

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#75EDA9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Hiba: {error}</Text>
      </View>
    );
  }

  // Ha valamiért nincs adat, de hiba sem volt, ne jelenítsünk meg semmit
  if (!forexData) {
    return null;
  }

  // Feltételezzük, hogy forexData tartalmazza a `price`, `yearLow` és `yearHigh` értékeket.
  // Számoljuk ki a pont pozícióját százalékban.
  const positionPercentage =
    forexData && forexData.yearHigh > forexData.yearLow
      ? ((forexData.price - forexData.yearLow) /
          (forexData.yearHigh - forexData.yearLow)) *
        100
      : 0;

  // Biztosítjuk, hogy a pozíció 0 és 100 között maradjon
  const clampedPosition = Math.max(0, Math.min(100, positionPercentage));

  // Az adatok megjelenítése
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{forexData.name}</Text>
      <View style={styles.mainRow}>
        <Text style={styles.price}>
          {Number(forexData.price).toFixed(2)} Ft
        </Text>
        <Text
          style={[
            styles.change,
            forexData.change >= 0 ? styles.positive : styles.negative,
          ]}
        >
          {forexData.change > 0 ? "+" : ""}
          {Number(forexData.change).toFixed(2)} (
          {Number(forexData.changesPercentage).toFixed(2)}%)
        </Text>
      </View>

      <View style={styles.rangeContainer}>
    {/* Felső címkék (Min/Max) */}
    <View style={styles.rangeLabelsTop}>
    <View style={{ alignItems: 'flex-start' }}>
        <Text style={styles.rangeLabelText}>Éves Min.</Text>
        <Text style={styles.rangeValueText}>
            {Number(forexData.yearLow).toFixed(2)}
            {/* Hozzáadjuk a pénznemet egy külön stílusú Text komponensben */}
            <Text style={styles.rangeCurrencySymbol}> Ft</Text>
        </Text>
    </View>
    <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.rangeLabelText}>Éves Max.</Text>
        <Text style={styles.rangeValueText}>
            {Number(forexData.yearHigh).toFixed(2)}
            {/* Itt is hozzáadjuk */}
            <Text style={styles.rangeCurrencySymbol}> Ft</Text>
        </Text>
    </View>
</View>

    {/* A sáv konténere az árnyék miatt */}
    <View style={styles.rangeBarShadow}>
        <View style={styles.rangeBar}>
             {/* A szegmentált sávos megoldás, ha a gradient nem működik */}
            <View style={[styles.rangeSegment, { backgroundColor: '#e63946' }]} />
            <View style={[styles.rangeSegment, { backgroundColor: '#f77f00' }]} />
            <View style={[styles.rangeSegment, { backgroundColor: '#fcbf49' }]} />
            <View style={[styles.rangeSegment, { backgroundColor: '#90be6d' }]} />
            <View style={[styles.rangeSegment, { backgroundColor: '#43aa8b' }]} />
        </View>
    </View>

    {/* Az "úszó" indikátor */}
    <View style={[styles.needleContainer, { left: `${clampedPosition}%` }]}>
        <View style={styles.needle} />
        <View style={styles.currentPriceBubble}>
    <Text style={styles.currentPriceText}>
        {Number(forexData.price).toFixed(2)}
        <Text style={styles.currencySymbol}> Ft</Text>
    </Text>
</View>
    </View>
</View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>50 napos átlag:</Text>
        <Text style={styles.value}>{`${Number(forexData.priceAvg50).toFixed(
          2
        )} Ft`}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>200 napos átlag:</Text>
        <Text style={styles.value}>
          {" "}
          {`${Number(forexData.priceAvg200).toFixed(2)} Ft`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C2541",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3A506B",
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  change: {
    fontSize: 20,
    fontWeight: "bold",
  },
  positive: {
    color: "#75EDA9",
  },
  negative: {
    color: "#F94144",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    color: "#A9B4C2",
  },
  value: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  errorText: {
    color: "#F94144",
    textAlign: "center",
  },
  rangeContainer: {
    marginTop: 15,
    marginBottom: 35, // Nagyobb alsó margó az "úszó" árnak
},
rangeLabelsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
},
rangeLabelText: {
    color: '#A9B4C2',
    fontSize: 14,
    fontWeight: '500',
},
rangeValueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
},
rangeBarShadow: {
    // iOS árnyék
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    // Android árnyék
    elevation: 8,
},
rangeBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 10
},
rangeSegment: {
    flex: 1,
},
needleContainer: {
    position: 'absolute',
    bottom: -25, // A sáv alá pozicionáljuk
    alignItems: 'center',
    // A 'left' tulajdonságot dinamikusan adjuk hozzá
    transform: [{ translateX: -30 }], // A buborék szélességének felével toljuk el
    width: 60, // A buborék szélessége
},
needle: {
    width: 2,
    height: 12,
    backgroundColor: '#A9B4C2',
    position: 'absolute',
    top: -10, // A buborék fölé nyúlik, bele a sávba
},
currentPriceBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 15,
    minWidth: 70, 
    alignItems: 'center',      // Vízszintes középre igazítás
    justifyContent: 'center', // Függőleges középre igazítás
    // iOS árnyék
    shadowColor: "#fff",
    shadowOffset: {
        width: 0,
        height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    // Android árnyék
    elevation: 10,
},
// A styles objektumban
currentPriceText: {
    color: '#0B132B',
    fontWeight: '600',      // Félkövér, de nem a legvastagabb
    fontSize: 12,           // Kisebb méret
    letterSpacing: 0.3,     // Finom karakterköz
},
currencySymbol: {
    color: '#555e7b',      // Halványabb, de olvasható szín
    fontWeight: '500',      // Kicsit vastagabb, mint a normál
    fontSize: 12,           // Még kisebb, hogy ne legyen tolakodó
    letterSpacing: 0.2,     // A pénznemnek is adunk egy kis teret
},
});

export default UsdHufWidget;
