import React from "react";
import { Text, Pressable } from "react-native";
import AnimatedExpandable from "./AnimatedExpandable";

export default function PegRatioCard({ data, isExpanded, onToggle, styles }) {
  return (
    <Pressable onPress={onToggle} style={styles.card}>
      <Text style={styles.subtitle}>📉 PEG Ratio</Text>
      <Text style={styles.item}>
        {(data?.value ?? data) != null
          ? (data?.value ?? data).toFixed(2)
          : "–"}
        {data?.passed === true
          ? "✅"
          : data?.passed === false
          ? "❌\n❗Alacsony nyereségnövekedés\nA cég profitja lassan vagy alig nő évről évre.\nEz a mutató inkább csak tájékoztató jellegű, nem lehet teljesen pontosat számolni❗"
          : ""}
      </Text>
      <AnimatedExpandable expanded={isExpanded}>
        <Text style={styles.expandedText}>
          Azt mutatja meg, hogy a cég P/E aránya (ára a nyereségéhez
          képest) mennyire indokolt a várható növekedés alapján.
          {"\n"}➡️ 1 körül jó, ha 1-nél kisebb, akkor olcsónak számít
          a részvény.
        </Text>
      </AnimatedExpandable>
    </Pressable>
  );
}