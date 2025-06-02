import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import ResultCard from "./ResultCard";

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
  console.log("ROE (5Y):", analysis.roe5Y);
  const toggleCard = (key) => {
    setExpandedCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {analysis.currentPrice && (
          <ResultCard currentPrice={analysis.currentPrice} fairValue={150.0} />
        )}
        <Text style={styles.title}>📋 Elemzés eredménye</Text>

        {analysis.volume && (
          <Pressable onPress={() => toggleCard("volume")} style={styles.card}>
            <Text style={styles.subtitle}>📊 Volume (Forgalom)</Text>
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
                Az adott részvényből hány darabot adtak-vettek egy nap alatt.
                {"\n"} ➡️ Minél nagyobb, annál aktívabb a kereskedés.
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
                  A cég bevétele (árbevétele) mennyivel nőtt az előző évhez
                  képest, százalékosan.
                  {"\n"}➡️ Jelzi, hogy nő-e a cég üzlete.
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
                <Text style={styles.subtitle}>
                  ⚖️ Quick ratio (Gyors likviditási mutató)
                </Text>
                <Text style={styles.item}>
                  {analysis.quickRatio?.value ?? analysis.quickRatio}{" "}
                  {analysis.quickRatio?.passed === true
                    ? "✅"
                    : analysis.quickRatio?.passed === false
                    ? "❌\n❗Likviditási problémák\nEz azt jelenti, hogy a cégnek nehézségei lehetnek a rövid távú kötelezettségeinek teljesítésében (például számlák, hitelek kifizetése)."
                    : ""}
                </Text>
                <AnimatedExpandable expanded={expandedCards["quickRatio"]}>
                  <Text style={styles.expandedText}>
                    Megmutatja, hogy a cég gyorsan elérhető pénzből (készpénz,
                    követelés stb.) ki tudja-e fizetni rövid távú tartozásait.
                    {"\n"}➡️ 1 felett jó, mert a cég nem szorul rá eladásra.
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
                    ? "❌\n❗Gyenge jövedelmezőség\nA gyenge jövedelmezőség arra utal, hogy a cég működése nem elég nyereséges, így nem biztos, hogy jó befektetés hosszú távon."
                    : ""}
                </Text>
                <AnimatedExpandable expanded={expandedCards["roe5Y"]}>
                  <Text style={styles.expandedText}>
                    cég mennyi nyereséget termel a részvényesek pénzéhez képest.
                    {"\n"}➡️ Minél magasabb, annál hatékonyabban dolgozik a cég
                    a befektetők pénzével.
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
                    ? "❌\n❗Alacsony nyereségnövekedés\nA cég profitja lassan vagy alig nő évről évre.\nEz a mutató inkább csak tájékoztató jellegű, nem lehet teljesen pontosat számolni❗"
                    : ""}
                </Text>
                <AnimatedExpandable expanded={expandedCards["pegRatio"]}>
                  <Text style={styles.expandedText}>
                    Azt mutatja meg, hogy a cég P/E aránya (ára a nyereségéhez
                    képest) mennyire indokolt a várható növekedés alapján.
                    {"\n"}➡️ 1 körül jó, ha 1-nél kisebb, akkor olcsónak számít
                    a részvény.
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
                    ? "❌\n❗Valószínűleg túlértékelt\nA részvény ára magasabb, mint amit a cég teljesítménye indokol."
                    : ""}
                </Text>
                <AnimatedExpandable expanded={expandedCards["peRatio"]}>
                  <Text style={styles.expandedText}>
                    Price to Earnings – Ár/nyereség arány{"\n"}A részvény ára
                    hányszorosát éri a cég egy részvényre jutó éves
                    nyereségének.
                    {"\n"}➡️ Magas: drága, alacsony: olcsóbb – de függ a
                    növekedési kilátásoktól is.
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
