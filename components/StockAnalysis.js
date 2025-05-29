import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StockAnalysis({ analysis }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Elemzés eredménye</Text>

      {/* Általános mutatók */}
      {Object.entries(analysis).map(([label, result]) => {
        if (label === "revenueGrowthByYear") return null;

        const isObject =
          result !== null &&
          typeof result === "object" &&
          !Array.isArray(result);

        const value = isObject && "value" in result ? result.value : result;
        const passed = isObject && "passed" in result ? result.passed : null;

        // Külön kezelés a volume + avgVolume50 esetére
        if (label === "volume") {
          return (
            <View key="volume" style={{ marginBottom: 10 }}>
              <Text style={styles.subtitle}>📊 Volume/Forgalom</Text>
              <Text style={styles.item}>
                Forgalom (napi): {value}
                {"\n"}
                50 napos átlag:{" "}
                {typeof analysis.avgVolume50 === "number" &&
                !isNaN(analysis.avgVolume50)
                  ? (analysis.avgVolume50 / 1e6).toFixed(2) + "M darab"
                  : "n.a."}
              </Text>
            </View>
          );
        }

        // Ne jelenítsük meg külön újra avgVolume50-et
        if (label === "avgVolume50") return null;

        return (
          <Text key={label} style={styles.item}>
            {label}: {typeof value === "object" ? JSON.stringify(value) : value}{" "}
            {passed === true ? "✅" : passed === false ? "❌" : ""}
          </Text>
        );
      })}

      {/* Quick Ratio külön blokk */}
      {analysis.quickRatio && (
        <View style={styles.quickRatioContainer}>
          <Text style={styles.subtitle}>⚡ Quick Ratio</Text>
          <Text style={styles.item}>{analysis.quickRatio}</Text>
        </View>
      )}

      {/* Éves bevételnövekedések megjelenítése */}
      {analysis.revenueGrowthByYear && (
        <View style={styles.growthContainer}>
          <Text style={styles.subtitle}>📈 Éves bevételnövekedések:</Text>
          {analysis.revenueGrowthByYear.map((entry) => (
            <Text key={entry.year} style={styles.item}>
              {entry.year}: {entry.growthPercent}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  subtitle: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
  },
  item: {
    fontSize: 16,
    marginBottom: 6,
  },
  growthContainer: {
    marginTop: 10,
  },
});
