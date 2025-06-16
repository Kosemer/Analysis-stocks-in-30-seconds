import React from "react";
import { Text, Pressable } from "react-native";
import AnimatedExpandable from "./AnimatedExpandable";

export default function QuickRatioCard({ data, isExpanded, onToggle, styles }) {
  return (
    <Pressable onPress={onToggle} style={styles.card}>
      <Text style={styles.subtitle}>
        ⚖️ Quick ratio (Gyors likviditási mutató) Az elmúlt pénzügyi évre vetítve
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
          {"\n"}A quick ratio azt mutatja meg, hogy a vállalat képes-e a legrövidebb időn belül (pl. készpénz, követelések) fedezni rövid távú tartozásait, anélkül hogy eladósodna vagy eladná a készleteit. Az elmúlt pénzügyi év teljesítményét veszi figyelembe.
          {"\n\n"}❗ <Text style={{ fontWeight: "bold", fontSize: 16 }}>Mit jelent az értéke?{"\n"}</Text>
          {"\n"}
          <Text style={styles.expandedText}>
            <Text style={{ fontWeight: "bold" }}>Quick Ratio magyarázat:</Text>
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