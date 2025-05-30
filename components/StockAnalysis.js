import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";

// 🔽 Dinamikus magasság animációval rendelkező komponens
const AnimatedExpandable = ({ expanded, children }) => {
  const animation = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? contentHeight : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, contentHeight]);

  return (
    <Animated.View style={{ height: animation, overflow: "hidden" }}>
      {/* Láthatatlan, mérhető tartalom */}
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, opacity: 0 }}
        onLayout={(e) => {
          if (contentHeight === 0) {
            setContentHeight(e.nativeEvent.layout.height);
          }
        }}
      >
        {children}
      </View>

      {/* Látható tartalom */}
      <View pointerEvents={expanded ? "auto" : "none"}>{children}</View>
    </Animated.View>
  );
};

export default function StockAnalysis({ analysis }) {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (key) => {
    setExpandedCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>📋 Elemzés eredménye</Text>

        {analysis.volume && (
          <Pressable onPress={() => toggleCard("volume")} style={styles.card}>
            <Text style={styles.subtitle}>📊 Volume/Forgalom</Text>
            <Text style={styles.item}>
              Forgalom (napi): {analysis.volume?.value ?? analysis.volume}
              {"\n"}
              50 napos átlag:{" "}
              {typeof analysis.avgVolume50 === "number"
                ? (analysis.avgVolume50 / 1e6).toFixed(2) + "M darab"
                : "n.a."}
            </Text>

            <AnimatedExpandable expanded={expandedCards["volume"]}>
              <Text style={styles.expandedText}>
                Ez a rész dinamikusan lenyílik és bármilyen hosszúságú szöveget
                tartalmazhat.{"\n"}Például: részletes magyarázat, extra adatok,
                stb.Ez a rész dinamikusan lenyílik és bármilyen hosszúságú szöveget
                tartalmazhat.{"\n"}Például: részletes magyarázat, extra adatok,
                stb.Ez a rész dinamikusan lenyílik és bármilyen hosszúságú szöveget
                tartalmazhat.{"\n"}Például: részletes magyarázat, extra adatok,
                stb.
              </Text>
            </AnimatedExpandable>
          </Pressable>
        )}

        {analysis.revenueGrowthByYear && (
          <View style={styles.growthContainer}>
            <Pressable
              onPress={() => toggleCard("revenueGrowthByYear")}
              style={styles.card}
            >
              <Text style={styles.subtitle}>📈 Éves bevételnövekedések:</Text>
              {analysis.revenueGrowthByYear.map((entry) => (
                <Text key={entry.year} style={styles.item}>
                  {entry.year}: {entry.growthPercent}
                </Text>
              ))}
              <AnimatedExpandable
                expanded={expandedCards["revenueGrowthByYear"]}
              >
                <Text style={styles.expandedText}>
                  Itt lehet részletes elemzést megjeleníteni a bevétel
                  változásáról, például okokat, hatásokat, stb.
                </Text>
              </AnimatedExpandable>
            </Pressable>
          </View>
        )}

        {(analysis.quickRatio ||
          analysis.roe5Y ||
          analysis.pegRatio ||
          analysis.peRatio) && (
          <View style={styles.metricsContainer}>
            {analysis.quickRatio !== undefined && (
              <Pressable
                onPress={() => toggleCard("quickRatio")}
                style={styles.card}
              >
                <Text style={styles.subtitle}>⚖️ Quick Ratio</Text>
                <Text style={styles.item}>
                  {analysis.quickRatio?.value ?? analysis.quickRatio}{" "}
                  {analysis.quickRatio?.passed === true
                    ? "✅"
                    : analysis.quickRatio?.passed === false
                    ? "❌"
                    : ""}
                </Text>
                <AnimatedExpandable expanded={expandedCards["quickRatio"]}>
                  <Text style={styles.expandedText}>
                    A Quick Ratio azt mutatja meg, hogy a cég rövid távon mennyire
                    likvid.{"\n"}Ha 1 felett van, az általában pozitív jel.
                  </Text>
                </AnimatedExpandable>
              </Pressable>
            )}

            {analysis.roe5Y !== undefined && (
              <Pressable
                onPress={() => toggleCard("roe5Y")}
                style={styles.card}
              >
                <Text style={styles.subtitle}>💰 ROE (5 év)</Text>
                <Text style={styles.item}>
                  {analysis.roe5Y?.value ?? analysis.roe5Y}{" "}
                  {analysis.roe5Y?.passed === true
                    ? "✅"
                    : analysis.roe5Y?.passed === false
                    ? "❌"
                    : ""}
                </Text>
                <AnimatedExpandable expanded={expandedCards["roe5Y"]}>
                  <Text style={styles.expandedText}>
                    A ROE (Return on Equity) megmutatja, hogy a cég mennyire
                    hatékonyan használja a saját tőkét profittermelésre.
                  </Text>
                </AnimatedExpandable>
              </Pressable>
            )}

            {analysis.pegRatio !== undefined && (
              <Pressable
                onPress={() => toggleCard("pegRatio")}
                style={styles.card}
              >
                <Text style={styles.subtitle}>📉 PEG Ratio</Text>
                <Text style={styles.item}>
                  {analysis.pegRatio?.value ?? analysis.pegRatio}{" "}
                  {analysis.pegRatio?.passed === true
                    ? "✅"
                    : analysis.pegRatio?.passed === false
                    ? "❌"
                    : ""}
                </Text>
                <AnimatedExpandable expanded={expandedCards["pegRatio"]}>
                  <Text style={styles.expandedText}>
                    A PEG Ratio a P/E arányt hasonlítja a növekedési ütemhez.
                    Általában 1 alatti érték kedvezőnek számít.
                  </Text>
                </AnimatedExpandable>
              </Pressable>
            )}

            {analysis.peRatio !== undefined && (
              <Pressable
                onPress={() => toggleCard("peRatio")}
                style={styles.card}
              >
                <Text style={styles.subtitle}>📊 P/E Ratio</Text>
                <Text style={styles.item}>
                  {analysis.peRatio?.value ?? analysis.peRatio}{" "}
                  {analysis.peRatio?.passed === true
                    ? "✅"
                    : analysis.peRatio?.passed === false
                    ? "❌"
                    : ""}
                </Text>
                <AnimatedExpandable expanded={expandedCards["peRatio"]}>
                  <Text style={styles.expandedText}>
                    A Price/Earnings mutató a részvény árát hasonlítja a cég
                    egy részvényre jutó profitjához.
                  </Text>
                </AnimatedExpandable>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  item: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
  },
  growthContainer: {
    marginTop: 10,
  },
  metricsContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  expandedText: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});
