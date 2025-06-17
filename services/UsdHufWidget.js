import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme } from "react-native";

// API konstansok
const BASE_URL_FMP = "https://financialmodelingprep.com/api/v3";
const API_KEY = "kCkgQOjqMBI4Jhkchxn5FsJOQiNulc7Q"; // FONTOS: Cseréld le a sajátodra!

// --- TÉMA DEFINÍCIÓK ---
// Itt definiáljuk a két színpalettát. A komponens ezekből fog dolgozni.

const lightTheme = {
  background: '#FFFFFF',
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  positive: '#28a745',
  negative: '#dc3545',
  border: '#DEE2E6',
  shadow: '#999',
  loader: '#007BFF',
  needleBg: '#FFFFFF',
  needleText: '#212529',
  needleShadow: '#000',
  needleStick: '#6C757D',
};

const darkTheme = {
  background: '#1C2541',
  textPrimary: '#F5F5F5',
  textSecondary: '#A9B4C2',
  positive: '#75EDA9',
  negative: '#F94144',
  border: '#3A506B',
  shadow: '#000',
  loader: '#75EDA9',
  needleBg: '#FFFFFF',
  needleText: '#0B132B',
  needleShadow: '#fff',
  needleStick: '#A9B4C2',
};

// A stílusgenerátor függvény változatlan marad, mert csak a kapott 'theme' objektumból dolgozik.
const getStyles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.background,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 20,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: theme === lightTheme ? 0.1 : 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginTop: 40
    },
    title: {
        fontSize: 22, fontWeight: "600", color: theme.textPrimary,
        textAlign: "center", marginBottom: 12,
    },
    separator: { height: 1, backgroundColor: theme.border, marginBottom: 15 },
    mainRow: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: theme.border,
    },
    price: { fontSize: 28, fontWeight: "bold", color: theme.textPrimary },
    change: { fontSize: 20, fontWeight: "bold" },
    positive: { color: theme.positive },
    negative: { color: theme.negative },
    detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
    label: { fontSize: 16, color: theme.textSecondary },
    value: { fontSize: 16, color: theme.textPrimary, fontWeight: "500" },
    errorText: { color: theme.negative, textAlign: "center" },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    changeLabel: { fontSize: 14, fontWeight: "bold", color: theme.textSecondary, textAlign: "right" },
    deviza: { fontSize: 14, fontWeight: "bold", color: theme.textSecondary, textAlign: "left" },
    rangeContainer: { marginTop: 15, marginBottom: 35 },
    rangeLabelsTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    rangeLabelText: { color: theme.textSecondary, fontSize: 14, fontWeight: '500' },
    rangeValueText: { color: theme.textPrimary, fontSize: 16, fontWeight: '600' },
    rangeBarShadow: {
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15, shadowRadius: 3, elevation: 4,
    },
    rangeBar: { flexDirection: 'row', height: 10, borderRadius: 5, width: '100%', overflow: 'hidden', marginBottom: 10 },
    rangeSegment: { flex: 1 },
    needleContainer: {
        position: 'absolute', bottom: -25, alignItems: 'center',
        transform: [{ translateX: -35 }], width: 70,
    },
    needle: {
        width: 2, height: 12, backgroundColor: theme.needleStick,
        position: 'absolute', top: -10,
    },
    currentPriceBubble: {
        backgroundColor: theme.needleBg, paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 15, minWidth: 70, alignItems: 'center', justifyContent: 'center',
        shadowColor: theme.needleShadow,
        shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4,
        elevation: 8,
    },
    currentPriceText: { color: theme.needleText, fontWeight: '600', fontSize: 12 },
    currencySymbol: { color: theme.textSecondary, fontWeight: '500', fontSize: 12 },
});


/**
 * Egyetlen, témára érzékeny komponens, ami lekéri és megjeleníti az USD/HUF árfolyamot.
 * Automatikusan vált világos és sötét mód között a rendszer beállításai alapján.
 */
const UsdHufWidget = () => {
  // 1. Érzékeljük a rendszer színsémáját
  const colorScheme = useColorScheme();

  // 2. A séma alapján kiválasztjuk a megfelelő témát.
  // Ha a colorScheme null, biztonsági okokból a világosat választjuk.
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  
  // 3. A kiválasztott téma alapján generáljuk a stílusokat.
  const styles = getStyles(theme);

  // A komponens többi része (state, adatlekérés) változatlan.
  const [forexData, setForexData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... az adatlekérő fetchUsdHuf logika pontosan ugyanaz, mint eddig ...
    const fetchUsdHuf = async () => {
        try {
          const forexRes = await fetch(`${BASE_URL_FMP}/quote/USDHUF?apikey=${API_KEY}`);
          if (!forexRes.ok) throw new Error("Hálózati hiba a devizaadatok lekérésekor.");
          const forexJson = await forexRes.json();
          if (!forexJson || forexJson.length === 0) throw new Error("Nem érkezett adat az USD/HUF árfolyamról.");
          const forex = forexJson[0];
          setForexData({
            name: forex.name || "Amerikai dollár / Magyar forint",
            price: forex.price ?? "n.a.", change: forex.change ?? "n.a.",
            changesPercentage: forex.changesPercentage ?? "n.a.", yearLow: forex.yearLow ?? "n.a.",
            yearHigh: forex.yearHigh ?? "n.a.", priceAvg50: forex.priceAvg50 ?? "n.a.",
            priceAvg200: forex.priceAvg200 ?? "n.a.",
          });
        } catch (err) {
          console.error("Hiba az USD/HUF adatok lekérésekor:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUsdHuf();
  }, []);

  // A renderelés most már a dinamikusan generált 'styles' és 'theme' objektumokat használja.
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={theme.loader} size="large" />
      </View>
    );
  }

  if (error) {
    // ... hiba megjelenítés ...
    return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Hiba: {error}</Text>
        </View>
      );
  }

  if (!forexData) {
    return null;
  }

  const positionPercentage = forexData.yearHigh > forexData.yearLow
      ? ((forexData.price - forexData.yearLow) / (forexData.yearHigh - forexData.yearLow)) * 100
      : 0;
  const clampedPosition = Math.max(0, Math.min(100, positionPercentage));

  // A JSX teljesen ugyanaz, mint eddig, de a `styles` objektum tartalma
  // most már a rendszer témájától függően változik.
  return (
    <View style={styles.container}>
        {/* ... A teljes JSX tartalom ide kerül, változtatás nélkül ... */}
        <Text style={styles.title}>{forexData.name}</Text>
        <View style={styles.separator} />
        
        <View style={styles.headerRow}>
          <Text style={styles.deviza}>Aktuális árfolyam</Text>
          <Text style={styles.changeLabel}>Napi változás</Text>
        </View>
  
        <View style={styles.mainRow}>
          <Text style={styles.price}>{Number(forexData.price).toFixed(2)} Ft</Text>
          <Text style={[styles.change, forexData.change >= 0 ? styles.positive : styles.negative]}>
            {forexData.change > 0 ? "+" : ""}
            {Number(forexData.change).toFixed(2)} ({Number(forexData.changesPercentage).toFixed(2)}%)
          </Text>
        </View>
  
        <View style={styles.rangeContainer}>
          <View style={styles.rangeLabelsTop}>
              <View style={{ alignItems: 'flex-start' }}>
                  <Text style={styles.rangeLabelText}>Éves Min.</Text>
                  <Text style={styles.rangeValueText}>{Number(forexData.yearLow).toFixed(2)} Ft</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.rangeLabelText}>Éves Max.</Text>
                  <Text style={styles.rangeValueText}>{Number(forexData.yearHigh).toFixed(2)} Ft</Text>
              </View>
          </View>
  
          <View style={styles.rangeBarShadow}>
              <View style={styles.rangeBar}>
                  <View style={[styles.rangeSegment, { backgroundColor: '#e63946' }]} />
                  <View style={[styles.rangeSegment, { backgroundColor: '#f77f00' }]} />
                  <View style={[styles.rangeSegment, { backgroundColor: '#fcbf49' }]} />
                  <View style={[styles.rangeSegment, { backgroundColor: '#90be6d' }]} />
                  <View style={[styles.rangeSegment, { backgroundColor: '#43aa8b' }]} />
              </View>
          </View>
  
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
          <Text style={styles.value}>{Number(forexData.priceAvg50).toFixed(2)} Ft</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>200 napos átlag:</Text>
          <Text style={styles.value}>{Number(forexData.priceAvg200).toFixed(2)} Ft</Text>
        </View>
    </View>
  );
};

export default UsdHufWidget;