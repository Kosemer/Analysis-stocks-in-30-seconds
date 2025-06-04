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

        {/*KÉSZ, HELYES ADATOK*/}
        {analysis.revenueGrowthByYear && (
          <View style={styles.growthContainer}>
            <Pressable
              onPress={() => toggleCard("revenueGrowthByYear")}
              style={styles.card}
            >
              <Text style={styles.subtitle}>📈 Éves bevételnövekedések:</Text>
              {analysis.revenueGrowthByYear.map((entry) => {
                const parsedGrowth = parseFloat(
                  entry.growthPercent.replace("%", "")
                );
                const passed = parsedGrowth > 10;
                return (
                  <Text key={entry.year} style={styles.item}>
                    {entry.year}: {entry.growthPercent}{" "}
                    {passed
                      ? "✅"
                      : "❌\n❗Növekedés hiánya\nEz azt jelzi, hogy a vállalat bevétele nem nőtt megfelelő ütemben, ami hosszabb távon gondot jelenthet."}
                  </Text>
                );
              })}

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
        {/*KÉSZ, HELYES ADATOK*/}

        {/*KÉSZ, HELYES ADATOK*/}
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
                  ⚖️ Quick ratio (Gyors likviditási mutató) Az elmúlt pénzügyi
                  évre vetítve
                </Text>
                <Text style={styles.item}>
                  {analysis.quickRatio?.value ?? analysis.quickRatio}{" "}
                  {analysis.quickRatio?.passed === true ? "✅" : "❌"}
                </Text>

                <AnimatedExpandable expanded={expandedCards["quickRatio"]}>
                  <Text style={styles.expandedText}>
                    📘{" "}
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Mit jelent ez a mutató?{"\n"}
                    </Text>
                    {"\n"}A quick ratio azt mutatja meg, hogy a vállalat képes-e
                    a legrövidebb időn belül (pl. készpénz, követelések) fedezni
                    rövid távú tartozásait, anélkül hogy eladósodna vagy eladná
                    a készleteit. Az elmúlt pénzügyi év teljesítményét veszi
                    figyelembe.
                    {"\n\n"}❗{" "}
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Aktuális értékelés:{"\n"}
                    </Text>
                    {"\n"}
                    {(() => {
                      const ratio =
                        analysis.quickRatio?.value ?? analysis.quickRatio;
                      if (ratio < 0.7) {
                        return `0,7 alatt – ❌ Rossz: A vállalatnak nincs elegendő likvid eszköze a rövid távú kötelezettségeinek fedezésére.`;
                      } else if (ratio >= 0.7 && ratio < 1) {
                        return `0,7 és 1 között – ⚠️ Elfogadható, de nem túl erős likviditás. Érdemes figyelni a trendet.`;
                      } else if (ratio >= 2) {
                        return `2 felett – ❗ Túl magas: Ez azt jelezheti, hogy a vállalat túl sok készpénzt vagy likvid eszközt tart fenn anélkül, hogy azt hatékonyan befektetné.`;
                      } else {
                        return `1 felett – ✅ Jó: A vállalatnak elegendő likvid eszköze van a rövid lejáratú kötelezettségeinek fedezésére.`;
                      }
                    })()}
                  </Text>
                </AnimatedExpandable>
              </Pressable>
            )}
            {/*KÉSZ, HELYES ADATOK*/}

            {/*KÉSZ, HELYES ADATOK*/}
            {analysis.quickRatioTTM !== undefined && (
              <Pressable
                onPress={() => toggleCard("quickRatioTTM")}
                style={styles.card}
              >
                <Text style={styles.subtitle}>
                  📘 Quick Ratio TTM {"\n"}(Gyors likviditási mutató – 12
                  hónapra vetítve)
                </Text>
                <Text style={styles.item}>
                  {analysis.quickRatioTTM?.value ?? analysis.quickRatioTTM}{" "}
                  {analysis.quickRatioTTM?.passed === true ? "✅" : "❌"}
                </Text>

                <AnimatedExpandable expanded={expandedCards["quickRatioTTM"]}>
                  <Text style={styles.expandedText}>
                    📘{" "}
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Mit jelent ez a mutató?{"\n"}
                    </Text>
                    {"\n"}A Quick Ratio TTM ugyanazt a mutatót méri, mint a
                    Quick Ratio, de az elmúlt 12 hónap teljesítményét veszi
                    figyelembe. Ez azt jelenti, hogy nem egy adott pénzügyi év
                    vagy negyedév adatait használja, hanem folyamatosan frissül
                    az elmúlt 12 hónap adatai alapján.
                    {"\n\n"}❗{" "}
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Aktuális értékelés:{"\n"}
                    </Text>
                    {"\n"}
                    {(() => {
                      const ratio =
                        analysis.quickRatioTTM?.value ?? analysis.quickRatioTTM;
                      if (ratio < 0.7) {
                        return `0,7 alatt – ❌ Rossz: A vállalatnak nincs elegendő likvid eszköze a rövid távú kötelezettségeinek fedezésére.`;
                      } else if (ratio >= 0.7 && ratio < 1) {
                        return `0,7 és 1 között – ⚠️ Elfogadható, de nem túl erős likviditás. Érdemes figyelni a trendet.`;
                      } else if (ratio >= 2) {
                        return `2 felett – ❗ Túl magas: Ez azt jelezheti, hogy a vállalat túl sok készpénzt vagy likvid eszközt tart fenn anélkül, hogy azt hatékonyan befektetné.`;
                      } else {
                        return `1 felett – ✅ Jó: A vállalatnak elegendő likvid eszköze van a rövid lejáratú kötelezettségeinek fedezésére.`;
                      }
                    })()}
                  </Text>
                </AnimatedExpandable>
              </Pressable>
            )}
            {/*KÉSZ, HELYES ADATOK*/}

            {/*KÉSZ, HELYES ADATOK*/}
            {analysis.currentRatio !== undefined && (
              <Pressable
                onPress={() => toggleCard("currentRatio")}
                style={styles.card}
              >
                <Text style={styles.subtitle}>
                  💼 Current Ratio {"\n"}(Rövid távú likviditási mutató)
                </Text>
                <Text style={styles.item}>
                  {analysis.currentRatio?.value ?? analysis.currentRatio}{" "}
                  {analysis.currentRatio?.passed === true ? "✅" : "❌"}
                </Text>

                <AnimatedExpandable expanded={expandedCards["currentRatio"]}>
                  <Text style={styles.expandedText}>
                    📘{" "}
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Mit jelent ez a mutató?{"\n"}
                    </Text>
                    {"\n"}A current ratio azt mutatja meg, hogy a vállalat
                    képes-e rövid lejáratú tartozásait fedezni forgóeszközeivel.
                    Általánosságban: minél nagyobb az érték 1 felett, annál
                    stabilabb a cég likviditása.
                    {"\n\n"}❗{" "}
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Aktuális értékelés:{"\n"}
                    </Text>
                    {"\n"}
                    {(() => {
                      const ratio =
                        analysis.currentRatio?.value ?? analysis.currentRatio;
                      if (ratio < 1) {
                        return `Ha a current ratio értéke kevesebb mint 1, az azt jelzi, hogy a vállalatnak több rövid lejáratú kötelezettsége van, mint forgóeszköze. Ez pénzügyi nehézségekre utalhat, és azt jelentheti, hogy a cégnek problémái lehetnek a rövid távú kötelezettségek teljesítésével.`;
                      } else if (ratio >= 1 && ratio < 1.3) {
                        return `Ez az érték általában elfogadhatónak tekinthető, mivel a vállalatnak elegendő forgóeszköze van a rövid lejáratú kötelezettségek fedezésére.`;
                      } else if (ratio >= 2) {
                        return `Ha a current ratio túl magas, például 2 vagy annál nagyobb, az azt jelezheti, hogy a vállalat nem használja hatékonyan az eszközeit, és túl sok készpénzt vagy készletet tart fenn anélkül, hogy azt befektetné vagy felhasználná.`;
                      } else {
                        return `A current ratio 1.3 és 2 között van – ez általában pozitív jel, de érdemes összevetni iparági átlagokkal is.`;
                      }
                    })()}
                  </Text>
                </AnimatedExpandable>
              </Pressable>
            )}
            {/*KÉSZ, HELYES ADATOK*/}

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
    fontSize: 15,
    color: "#555",
    textAlign: "center",
  },
});
