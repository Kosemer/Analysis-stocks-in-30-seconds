import React from "react";
import { View, Text, Pressable } from "react-native";
import AnimatedExpandable from "./AnimatedExpandable";

export default function PeRatioTTMCard({ data, isExpanded, onToggle, styles }) {
  return (
    <Pressable onPress={onToggle} style={styles.card}>
      <Text style={styles.subtitle}>
        📊 P/E Ratio (TTM){"\n"} Árfolyam/nyereség arány az elmúlt 12 hónapban
      </Text>
      <View style={styles.valueRow}>
        <Text style={styles.itemValue}>
          {typeof data.value === "number" ? data.value.toFixed(2) : "–"}
        </Text>
        <Text style={styles.itemIcon}>
          {data.passed ? "✅" : "❌"}
        </Text>
      </View>
      {data.comment && (
        <Text style={styles.commentText}>{data.comment}</Text>
      )}
      <AnimatedExpandable expanded={isExpanded}>
        <View>
          <Text style={styles.expandedHeader}>Elemzés adatai</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cég szektora:</Text>
            <Text style={styles.detailValue}>{data.sectorDisplay}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Referencia P/E tartomány:</Text>
            <Text style={styles.detailValue}>{data.benchmark}</Text>
          </View>
          <Text style={styles.expandedHeader}>Általános tudnivalók</Text>
          <Text style={styles.expandedText}>
            📘 <Text style={{ fontWeight: "bold" }}>A P/E Ratio (Price to Earnings, ár/nyereség arány)</Text> azt mutatja meg, hogy a részvény ára hányszorosát éri a cég egy részvényre jutó éves nyereségének...
          </Text>
        </View>
      </AnimatedExpandable>
    </Pressable>
  );
}