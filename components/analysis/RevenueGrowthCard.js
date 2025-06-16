import React from "react";
import { View, Text, Pressable } from "react-native";
import AnimatedExpandable from "./AnimatedExpandable";

export default function RevenueGrowthCard({ data, isExpanded, onToggle, styles }) {
  const { byYear, fiveYear } = data;

  return (
    <View style={styles.growthContainer}>
      <Pressable onPress={onToggle} style={styles.card}>
        <Text style={styles.subtitle}>📈 Éves bevételnövekedések</Text>

        <View style={{ paddingHorizontal: 16 }}>
          {byYear.map((entry) => {
            const parsedGrowth = parseFloat(entry.growthPercent.replace("%", ""));
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
                  {entry.year}: {entry.growthPercent} {passed ? "✅" : "❌"}
                </Text>
              </View>
            );
          })}
        </View>

        {fiveYear?.value && (
          <Text
            style={[
              styles.item,
              { fontWeight: "bold" },
              fiveYear.value >= 10 ? styles.greenText : styles.redText,
            ]}
          >
            {fiveYear.value.toFixed(2)}%
          </Text>
        )}

        <AnimatedExpandable expanded={isExpanded}>
          <Text style={styles.expandedText}>
            <Text>
              📘 <Text style={{ fontWeight: "bold" }}>Bevételnövekedés (Revenue Growth)</Text> azt mutatja, hogy a vállalat árbevétele hogyan változott évről évre.{"\n"}
              {"\n"}
              <Text style={styles.greenText}>Magas növekedés (pl. 10% felett)</Text> {"\n"} A cég üzleti tevékenysége dinamikusan bővül.{"\n"}
              {"\n"}
              <Text style={styles.redText}>Alacsony növekedés (pl. 10% alatt)</Text> {"\n"}❗ Növekedés hiánya{"\n"}
              Ez azt jelzi, hogy a vállalat bevétele nem nőtt megfelelő ütemben, ami hosszabb távon gondot jelenthet.{"\n"}
              {"\n"}
              <Text style={styles.redText}>Alacsony vagy negatív növekedés</Text> {"\n"} Figyelmeztető jel, mivel a bevétel stagnál vagy csökken.{"\n"}
            </Text>
          </Text>
        </AnimatedExpandable>
      </Pressable>
    </View>
  );
}