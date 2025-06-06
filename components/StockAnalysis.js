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
              <Text style={styles.subtitle}>📈 Éves bevételnövekedések</Text>

              {/* Átlagos növekedés sikeresség ikon
              <Text style={styles.item}>
                {analysis.revenueGrowth5Y?.passed ? "✅" : "❌"}
              </Text> */}

              <View style={{ paddingHorizontal: 16 }}>
                {analysis.revenueGrowthByYear.map((entry) => {
                  const parsedGrowth = parseFloat(
                    entry.growthPercent.replace("%", "")
                  );
                  const passed = parsedGrowth >= 10;
                  const colorStyle = passed ? styles.greenText : styles.redText;

                  return (
                    <View
                      key={entry.year}
                      style={{
                        paddingVertical: 5,
                        borderBottomWidth: 0.5,
                        borderColor: "#ccc",
                      }}
                    >
                      <Text style={[styles.item, colorStyle]}>
                        {entry.year}: {entry.growthPercent}{" "}
                        {passed ? "✅" : "❌"}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Átlagos érték (ha van) */}
              {analysis.revenueGrowth5Y?.value && (
                <Text
                  style={[
                    styles.item,
                    { fontWeight: "bold" },
                    analysis.revenueGrowth5Y.value >= 10
                      ? styles.greenText
                      : styles.redText,
                  ]}
                >
                  {analysis.revenueGrowth5Y.value.toFixed(2)}%
                </Text>
              )}

              {/* Éves bontás táblázatszerűen */}
              <AnimatedExpandable
                expanded={expandedCards["revenueGrowthByYear"]}
              >
                {/* Magyarázó szöveg alul */}
                <Text style={styles.expandedText}>
                  <Text>
                    📘{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      Bevételnövekedés (Revenue Growth)
                    </Text>{" "}
                    azt mutatja, hogy a vállalat árbevétele hogyan változott
                    évről évre.{"\n"}
                    {"\n"}
                    <Text style={styles.greenText}>
                      Magas növekedés (pl. 10% felett)
                    </Text>{" "}
                    {"\n"} A cég üzleti tevékenysége dinamikusan bővül.{"\n"}
                    {"\n"}
                    <Text style={styles.redText}>
                      Alacsony növekedés (pl. 10% alatt)
                    </Text>{" "}
                    {"\n"}❗ Növekedés hiánya{"\n"}
                    Ez azt jelzi, hogy a vállalat bevétele nem nőtt megfelelő
                    ütemben, ami hosszabb távon gondot jelenthet.{"\n"}
                    {"\n"}
                    <Text style={styles.redText}>
                      Alacsony vagy negatív növekedés
                    </Text>{" "}
                    {"\n"} Figyelmeztető jel, mivel a bevétel stagnál vagy
                    csökken.
                    {"\n"}
                  </Text>
                </Text>
              </AnimatedExpandable>
            </Pressable>
          </View>
        )}

        {/*KÉSZ, HELYES ADATOK*/}

        {/*KÉSZ, HELYES ADATOK*/}
        {(analysis.quickRatio ||
          analysis.roe5Y ||
          analysis.pegRatioFromRatios ||
          analysis.peRatioFromRatios) && (
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

                <Text
                  style={[
                    styles.item,
                    analysis.quickRatio?.passed === true
                      ? styles.greenText
                      : styles.redText,
                  ]}
                >
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
                      Mit jelent az értéke?{"\n"}
                    </Text>
                    {"\n"}
                    <Text style={styles.expandedText}>
                      <Text style={{ fontWeight: "bold" }}>
                        Quick Ratio magyarázat:
                      </Text>
                      {"\n\n"}
                      <Text style={styles.redText}>
                        0,7 alatt – ❌ Rossz:{" "}
                        <Text style={styles.defaultText}>
                          A vállalatnak nincs elegendő likvid eszköze a rövid
                          távú kötelezettségeinek fedezésére.
                        </Text>
                      </Text>
                      {"\n\n"}
                      <Text style={styles.orangeText}>
                        0,7 és 1 között – ⚠️ Elfogadható:{" "}
                        <Text style={styles.defaultText}>
                          de nem túl erős likviditás. Érdemes figyelni a
                          trendet.
                        </Text>
                      </Text>
                      {"\n\n"}
                      <Text style={styles.greenText}>
                        1 felett – ✅ Jó:{" "}
                        <Text style={styles.defaultText}>
                          A vállalatnak elegendő likvid eszköze van a rövid
                          lejáratú kötelezettségeinek fedezésére.
                        </Text>
                      </Text>
                      {"\n\n"}
                      <Text style={styles.warningText}>
                        2 felett – ❗ Túl magas:{" "}
                        <Text style={styles.defaultText}>
                          Ez azt jelezheti, hogy a vállalat túl sok készpénzt
                          vagy likvid eszközt tart fenn anélkül, hogy azt
                          hatékonyan befektetné.
                        </Text>
                      </Text>
                    </Text>
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
                <Text
                  style={[
                    styles.item,
                    analysis.quickRatioTTM?.passed === true
                      ? styles.greenText
                      : styles.redText,
                  ]}
                >
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
                    {/* Szöveg megjelenítése értékelés alapján. */}
                    {/* {(() => {
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
                    })()}*/}
                    <Text style={styles.expandedText}>
                      <Text style={{ fontWeight: "bold" }}>
                        Quick Ratio (TTM) magyarázat:
                      </Text>
                      {"\n\n"}
                      <Text style={styles.redText}>
                        0,7 alatt – ❌ Rossz:{" "}
                        <Text style={styles.defaultText}>
                          A vállalatnak nincs elegendő likvid eszköze a rövid
                          távú kötelezettségeinek fedezésére.
                        </Text>
                      </Text>
                      {"\n\n"}
                      <Text style={styles.orangeText}>
                        0,7 és 1 között – ⚠️ Elfogadható:{" "}
                        <Text style={styles.defaultText}>
                          de nem túl erős likviditás. Érdemes figyelni a
                          trendet.
                        </Text>
                      </Text>
                      {"\n\n"}
                      <Text style={styles.greenText}>
                        1 felett – ✅ Jó:{" "}
                        <Text style={styles.defaultText}>
                          A vállalatnak elegendő likvid eszköze van a rövid
                          lejáratú kötelezettségeinek fedezésére.
                        </Text>
                      </Text>
                      {"\n\n"}
                      <Text style={styles.warningText}>
                        2 felett – ❗ Túl magas:{" "}
                        <Text style={styles.defaultText}>
                          Ez azt jelezheti, hogy a vállalat túl sok készpénzt
                          vagy likvid eszközt tart fenn anélkül, hogy azt
                          hatékonyan befektetné.
                        </Text>
                      </Text>
                    </Text>
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
                <Text
                  style={[
                    styles.item,
                    analysis.currentRatio?.passed === true
                      ? styles.greenText
                      : styles.redText,
                  ]}
                >
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
                    {/*{(() => {
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
                    })()}*/}
                    <Text style={styles.expandedText}>
                      <Text style={{ fontWeight: "bold" }}>
                        Current Ratio magyarázat:
                      </Text>
                      {"\n\n"}

                      <Text style={styles.redText}>
                        1 alatt – ❌ Rossz:{" "}
                        <Text style={styles.defaultText}>
                          A vállalatnak több rövid lejáratú kötelezettsége van,
                          mint forgóeszköze. Ez pénzügyi nehézségekre utalhat,
                          és azt jelentheti, hogy a cégnek problémái lehetnek a
                          rövid távú kötelezettségek teljesítésével.
                        </Text>
                      </Text>
                      {"\n\n"}

                      <Text style={styles.orangeText}>
                        1 – 1,3 között – ⚠️ Elfogadható:{" "}
                        <Text style={styles.defaultText}>
                          A vállalatnak elegendő forgóeszköze van a rövid
                          lejáratú kötelezettségek fedezésére, de a mozgástér
                          szűkebb lehet.
                        </Text>
                      </Text>
                      {"\n\n"}

                      <Text style={styles.greenText}>
                        1,3 – 2 között – ✅ Jó:{" "}
                        <Text style={styles.defaultText}>
                          Ez általában pozitív jel, de érdemes összevetni
                          iparági átlagokkal is.
                        </Text>
                      </Text>
                      {"\n\n"}

                      <Text style={styles.warningText}>
                        2 felett – ❗ Túl magas:{" "}
                        <Text style={styles.defaultText}>
                          Ez azt jelezheti, hogy a vállalat nem használja
                          hatékonyan az eszközeit, és túl sok készpénzt vagy
                          készletet tart fenn anélkül, hogy azt befektetné vagy
                          felhasználná.
                        </Text>
                      </Text>
                    </Text>
                  </Text>
                </AnimatedExpandable>
              </Pressable>
            )}
            {/*KÉSZ, HELYES ADATOK*/}

            {/*KÉSZ, HELYES ADATOK*/}
            {analysis.roeList && Array.isArray(analysis.roeList) && (
              <Pressable
                onPress={() => toggleCard("roeList")}
                style={styles.card}
              >
                <Text style={styles.subtitle}>
                  💰 Átlagos ROE (Elmúlt 5 év)
                </Text>

                {/* Pipa vagy kereszt az átlagos ROE alapján */}
                <Text style={styles.item}>
                  {analysis.roe5Y?.passed ? "✅" : "❌"}
                </Text>

                {/* Átlagos ROE érték kiírása */}
                {/* Átlagos ROE érték kiírása */}
                <Text
                  style={[
                    styles.item,
                    { fontWeight: "bold" },
                    analysis.roe5Y?.value >= 0
                      ? styles.greenText
                      : styles.redText,
                  ]}
                >
                  {analysis.roe5Y?.value?.toFixed(2)}%
                </Text>

                <AnimatedExpandable expanded={expandedCards["roeList"]}>
                  <View style={{ paddingHorizontal: 16 }}>
                    {analysis.roeList.map((entry) => {
                      const roeValue = parseFloat(entry.roe) * 100;
                      const roeColor =
                        roeValue >= 0 ? styles.greenText : styles.redText;

                      return (
                        <View
                          key={entry.year}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 5,
                            borderBottomWidth: 0.5,
                            borderColor: "#ccc",
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {entry.year}
                          </Text>
                          <Text style={roeColor}>{roeValue.toFixed(2)}%</Text>
                        </View>
                      );
                    })}
                  </View>

                  <Text style={styles.expandedText}>
                    <Text>
                      📘
                      <Text style={{ fontWeight: "bold" }}>
                        A ROE (Return on Equity, magyarul saját tőke
                        megtérülése)
                      </Text>{" "}
                      egy pénzügyi mutató, amely azt méri, hogy egy vállalat
                      mennyire hatékonyan használja fel a saját tőkéjét a
                      nyereség termelésére.{"\n"}
                      Minél magasabb az érték, annál hatékonyabban használja a
                      vállalat a tőkét.{"\n\n"}
                      <Text style={{ fontWeight: "bold" }}>
                        Mit jelent az értéke?
                      </Text>
                      {"\n"}
                      {"\n"}
                      <Text style={{ fontWeight: "bold" }}>
                        Magas ROE (pl. 15% felett)
                      </Text>{" "}
                      {"\n"}A vállalat hatékonyan használja a saját tőkéjét, és
                      jó megtérülést biztosít a részvényesek számára.{"\n"}
                      {"\n"}
                      <Text style={{ fontWeight: "bold" }}>
                        Alacsony ROE (pl. 10% alatt)
                      </Text>{" "}
                      {"\n"} A vállalat kevésbé hatékonyan működik, vagy magas
                      tőkeigénye van.{"\n"}
                      {"\n"}
                      <Text style={{ fontWeight: "bold" }}>
                        Negatív ROE
                      </Text>{" "}
                      {"\n"}A vállalat veszteséges, ami figyelmeztető jel lehet
                      a befektetők számára.
                    </Text>
                  </Text>
                </AnimatedExpandable>
              </Pressable>
            )}
            {/*KÉSZ, HELYES ADATOK*/}

            {analysis.pegRatioFromRatios !== undefined && (
              <Pressable
                onPress={() => toggleCard("pegRatioFromRatios")}
                style={styles.card}
              >
                <Text style={styles.subtitle}>📉 PEG Ratio</Text>
                <Text style={styles.item}>
                  {(analysis.pegRatioFromRatios?.value ??
                    analysis.pegRatioFromRatios) != null
                    ? (
                        analysis.pegRatioFromRatios?.value ??
                        analysis.pegRatioFromRatios
                      ).toFixed(2)
                    : "–"}

                  {analysis.pegRatioFromRatios?.passed === true
                    ? "✅"
                    : analysis.pegRatioFromRatios?.passed === false
                    ? "❌\n❗Alacsony nyereségnövekedés\nA cég profitja lassan vagy alig nő évről évre.\nEz a mutató inkább csak tájékoztató jellegű, nem lehet teljesen pontosat számolni❗"
                    : ""}
                </Text>
                <AnimatedExpandable
                  expanded={expandedCards["pegRatioFromRatios"]}
                >
                  <Text style={styles.expandedText}>
                    Azt mutatja meg, hogy a cég P/E aránya (ára a nyereségéhez
                    képest) mennyire indokolt a várható növekedés alapján.
                    {"\n"}➡️ 1 körül jó, ha 1-nél kisebb, akkor olcsónak számít
                    a részvény.
                  </Text>
                </AnimatedExpandable>
              </Pressable>
            )}

            {analysis.peRatioFromRatios !== undefined && (
              <Pressable
                onPress={() => toggleCard("peRatioFromRatios")}
                style={styles.card}
              >
                <Text style={styles.subtitle}>📊 P/E Ratio</Text>
                <Text style={styles.item}>
                  {typeof (
                    analysis.peRatioFromRatios?.value ??
                    analysis.peRatioFromRatios
                  ) === "number"
                    ? (
                        analysis.peRatioFromRatios?.value ??
                        analysis.peRatioFromRatios
                      ).toFixed(2)
                    : "–"}
                  {analysis.peRatioFromRatios?.passed === true
                    ? "✅"
                    : analysis.peRatioFromRatios?.passed === false
                    ? "❌"
                    : ""}
                </Text>
                <AnimatedExpandable
                  expanded={expandedCards["peRatioFromRatios"]}
                >
                  <Text style={styles.expandedText}>
                    <Text>
                      📘{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        A P/E Ratio (Price to Earnings, ár/nyereség arány)
                      </Text>{" "}
                      azt mutatja meg, hogy a részvény ára hányszorosát éri a
                      cég egy részvényre jutó éves nyereségének.{"\n"}
                      Ez egy gyakran használt mutató a részvények értékeléséhez.
                      {"\n\n"}
                      <Text style={{ fontWeight: "bold" }}>
                        Mit jelent az értéke?
                      </Text>
                      {"\n\n"}
                      <Text style={{ fontWeight: "bold" }}>
                        Alacsony P/E (kb. 15 alatt)
                      </Text>
                      {"\n"}A részvény alulértékelt lehet, de előfordulhat, hogy
                      a vállalat kilátásai rosszak vagy a befektetők bizalma
                      gyenge. Értékalapú befektetők számára vonzó lehet.{"\n\n"}
                      <Text style={{ fontWeight: "bold" }}>
                        Normál P/E (kb. 15–25 között)
                      </Text>
                      {"\n"}
                      Átlagosnak tekinthető, stabil és kiegyensúlyozott
                      vállalatot jelezhet.{"\n\n"}
                      <Text style={{ fontWeight: "bold" }}>
                        Magas P/E (25 felett)
                      </Text>
                      {"\n"}A befektetők nagy növekedést várnak a cégtől, de
                      fennáll a veszélye annak is, hogy a részvény túl van
                      árazva.
                    </Text>
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
  greenText: {
    color: "#3CB371",
    fontWeight: "bold",
  },
  redText: {
    color: "red",
    fontWeight: "bold",
  },
  growthAlertText: {
    color: "red",
    fontWeight: "normal",
    fontSize: 14,
  },
});
