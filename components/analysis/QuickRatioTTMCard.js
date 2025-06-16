import React from "react";
import { Text, Pressable } from "react-native";
import AnimatedExpandable from "./AnimatedExpandable";

export default function QuickRatioTTMCard({ data, isExpanded, onToggle, styles }) {
  return (
    <Pressable onPress={onToggle} style={styles.card}>
      <Text style={styles.subtitle}>
        📘 Quick Ratio TTM {"\n"}(Gyors likviditási mutató – 12 hónapra vetítve)
      </Text>
      <Text
        style={[
          styles.item,
          data?.passed === true ? styles.greenText : styles.redText,
        ]}
      >
        {data?.value ?? data} {data?.passed === true ? "✅" : "❌"}
      </Text>
      <AnimatedExpandable expanded={isExpanded}>
        <Text style={styles.expandedText}>
          📘 <Text style={{ fontWeight: "bold", fontSize: 16 }}>Mit jelent ez a mutató?{"\n"}</Text>
          {"\n"}A Quick Ratio TTM ugyanazt a mutatót méri, mint a Quick Ratio, de az elmúlt 12 hónap teljesítményét veszi figyelembe. Ez azt jelenti, hogy nem egy adott pénzügyi év vagy negyedév adatait használja, hanem folyamatosan frissül az elmúlt 12 hónap adatai alapján.
          {"\n\n"}❗ <Text style={{ fontWeight: "bold", fontSize: 16 }}>Aktuális értékelés:{"\n"}</Text>
          {"\n"}
          <Text style={styles.expandedText}>
            <Text style={{ fontWeight: "bold" }}>Quick Ratio (TTM) magyarázat:</Text>
            {"\n\n"}
            <Text style={styles.redText}>0,7 alatt – ❌ Rossz: <Text style={styles.defaultText}>A vállalatnak nincs elegendő likvid eszköze a rövid távú kötelezettségeinek fedezésére.</Text></Text>
            {"\n\n"}
            <Text style={styles.orangeText}>0,7 és 1 között – ⚠️ Elfogadható: <Text style={styles.defaultText}>de nem túl erős likviditás. Érdemes figyelni a trendet.</Text></Text>
            {"\n\n"}
            <Text style={styles.greenText}>1 felett – ✅ Jó: <Text style={styles.defaultText}>A vállalatnak elegendő likvid eszköze van a rövid lejáratú kötelezettségeinek fedezésére.</Text></Text>
            {"\n\n"}
            <Text style={styles.warningText}>2 felett – ❗ Túl magas: <Text style={styles.defaultText}>Ez azt jelezheti, hogy a vállalat túl sok készpénzt vagy likvid eszközt tart fenn anélkül, hogy azt hatékonyan befektetné.</Text></Text>
          </Text>
        </Text>
      </AnimatedExpandable>
    </Pressable>
  );
}