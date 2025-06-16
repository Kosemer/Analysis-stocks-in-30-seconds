import React from "react";
import { View, Text, Pressable } from "react-native";
import AnimatedExpandable from "./AnimatedExpandable";

export default function RoeCard({ data, isExpanded, onToggle, styles }) {
  const { list, fiveYear } = data;

  return (
    <Pressable onPress={onToggle} style={styles.card}>
      <Text style={styles.subtitle}>💰 Átlagos ROE (Elmúlt 5 év)</Text>
      <Text style={styles.item}>{fiveYear?.passed ? "✅" : "❌"}</Text>
      <Text
        style={[
          styles.item,
          { fontWeight: "bold" },
          fiveYear?.value >= 0 ? styles.greenText : styles.redText,
        ]}
      >
        {fiveYear?.value?.toFixed(2)}%
      </Text>
      <AnimatedExpandable expanded={isExpanded}>
        <View style={{ paddingHorizontal: 16 }}>
          {list.map((entry) => {
            const roeValue = parseFloat(entry.roe) * 100;
            const roeColor = roeValue >= 0 ? styles.greenText : styles.redText;
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
                <Text style={{ fontWeight: "bold", color: '#fff'}}>{entry.year}</Text>
                <Text style={roeColor}>{roeValue.toFixed(2)}%</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.expandedText}>
          <Text>
            📘<Text style={{ fontWeight: "bold" }}>A ROE (Return on Equity, magyarul saját tőke megtérülése)</Text> egy pénzügyi mutató, amely azt méri, hogy egy vállalat mennyire hatékonyan használja fel a saját tőkéjét a nyereség termelésére.{"\n"}
            Minél magasabb az érték, annál hatékonyabban használja a vállalat a tőkét.{"\n\n"}
            <Text style={{ fontWeight: "bold" }}>Mit jelent az értéke?</Text>
            {"\n"}{"\n"}
            <Text style={{ fontWeight: "bold" }}>Magas ROE (pl. 15% felett)</Text> {"\n"}A vállalat hatékonyan használja a saját tőkéjét, és jó megtérülést biztosít a részvényesek számára.{"\n"}{"\n"}
            <Text style={{ fontWeight: "bold" }}>Alacsony ROE (pl. 10% alatt)</Text> {"\n"} A vállalat kevésbé hatékonyan működik, vagy magas tőkeigénye van.{"\n"}{"\n"}
            <Text style={{ fontWeight: "bold" }}>Negatív ROE</Text> {"\n"}A vállalat veszteséges, ami figyelmeztető jel lehet a befektetők számára.
          </Text>
        </Text>
      </AnimatedExpandable>
    </Pressable>
  );
}