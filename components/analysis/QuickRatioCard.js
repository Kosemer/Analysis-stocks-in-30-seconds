import React from "react";
import { View, Text, Pressable } from "react-native";
import AnimatedExpandable from "./AnimatedExpandable";

export default function QuickRatioCard({ data, isExpanded, onToggle, styles }) {

  // 1. Az adatstruktúra frissítése: különválasztjuk az ikont és a szöveget
  const explanationData = [
    {
      range: "0,7 alatt",
      icon: "❌",
      statusLabel: "Rossz",
      style: styles.redText,
      description: "A vállalatnak nincs elegendő likvid eszköze a rövid távú kötelezettségeinek fedezésére.",
    },
    {
      range: "0,7 és 1 között",
      icon: "⚠️",
      statusLabel: "Elfogadható",
      style: styles.orangeText,
      description: "A likviditás nem túl erős, érdemes figyelni a trendet.",
    },
    {
      range: "1 felett",
      icon: "✅",
      statusLabel: "Jó",
      style: styles.greenText,
      description: "A vállalatnak elegendő likvid eszköze van a rövid lejáratú kötelezettségeinek fedezésére.",
    },
    {
      range: "2 felett",
      icon: "❗",
      statusLabel: "Túl magas",
      style: styles.warningText,
      description: "A vállalat túl sok készpénzt tart anélkül, hogy azt hatékonyan befektetné.",
    },
  ];

  return (
    <Pressable onPress={onToggle} style={styles.card}>
      {/* ... a kártya felső része változatlan ... */}
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
        <View>
            <Text style={styles.expandedText}>
              📘 <Text style={{ fontWeight: "bold" }}>Mit jelent ez a mutató?</Text>
              {"\n"}A quick ratio azt mutatja meg, hogy a vállalat képes-e a legrövidebb időn belül (pl. készpénz, követelések) fedezni rövid távú tartozásait, anélkül hogy eladósodna vagy eladná a készleteit. Az elmúlt pénzügyi év teljesítményét veszi figyelembe.
            </Text>

            <Text style={styles.explanationTitle}>❗ Mit jelent az értéke?</Text>

            <View style={styles.explanationTable}>
                {explanationData.map((row, index) => (
                    <View 
                        key={index} 
                        style={[styles.explanationRow, index === explanationData.length - 1 && { borderBottomWidth: 0 }]}
                    >
                        <Text style={[styles.explanationCell, styles.rangeCell]}>{row.range}</Text>
                        
                        {/* === ITT TÖRTÉNT A VÁLTOZÁS === */}
                        {/* A status cella most egy View, ami két Text elemet tartalmaz */}
                        <View style={[styles.explanationCell, styles.statusCell]}>
                            <Text style={styles.statusIcon}>{row.icon}</Text>
                            <Text style={[styles.statusLabelText, row.style]}>{row.statusLabel}</Text>
                        </View>
                        
                        <Text style={[styles.explanationCell, styles.descriptionCell]}>{row.description}</Text>
                    </View>
                ))}
            </View>
        </View>
      </AnimatedExpandable>
    </Pressable>
  );
}