import React from "react";
import { View, Text, Pressable } from "react-native";
import AnimatedExpandable from "./AnimatedExpandable";

export default function PeRatioCard({ data, isExpanded, onToggle, styles }) {
  return (
    <Pressable onPress={onToggle} style={styles.card}>
      <Text style={styles.subtitle}>📊 P/E Ratio</Text>
      <Text style={styles.item}>
        {typeof (data?.value ?? data) === "number"
          ? (data?.value ?? data).toFixed(2)
          : "–"}
        {data?.passed === true
          ? "✅"
          : data?.passed === false
          ? "❌"
          : ""}
      </Text>
      <AnimatedExpandable expanded={isExpanded}>
        <View>
          <Text style={styles.expandedText}>
            <Text>
              📘 <Text style={{ fontWeight: "bold" }}>A P/E Ratio (Price to Earnings, ár/nyereség arány)</Text> azt mutatja meg, hogy a részvény ára hányszorosát éri a cég egy részvényre jutó éves nyereségének.{"\n"}
              Ez egy gyakran használt mutató a részvények értékeléséhez.
              {"\n\n"}
              <Text style={{ fontWeight: "bold" }}>Mit jelent az értéke?</Text>
              {"\n\n"}
              <Text style={{ fontWeight: "bold" }}>Alacsony P/E (kb. 15 alatt)</Text>
              {"\n"}A részvény alulértékelt lehet, de előfordulhat, hogy a vállalat kilátásai rosszak vagy a befektetők bizalma gyenge. Értékalapú befektetők számára vonzó lehet.{"\n\n"}
              <Text style={{ fontWeight: "bold" }}>Normál P/E (kb. 15–25 között)</Text>
              {"\n"}Átlagosnak tekinthető, stabil és kiegyensúlyozott vállalatot jelezhet.{"\n\n"}
              <Text style={{ fontWeight: "bold" }}>Magas P/E (25 felett)</Text>
              {"\n"}A befektetők nagy növekedést várnak a cégtől, de fennáll a veszélye annak is, hogy a részvény túl van árazva.
            </Text>
          </Text>

          <Text style={[styles.expandedText, { fontWeight: "bold", marginTop: 16, marginBottom: 8 }]}>
            Átlagos P/E arányok iparáganként (TTM)
          </Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeaderRow]}><Text style={[styles.tableCell, styles.tableHeader]}>Iparág</Text><Text style={[styles.tableCell, styles.tableHeader, { textAlign: "right" }]}>Átlagos P/E</Text></View>
            <View style={[styles.tableRow, styles.tableRowOdd]}><Text style={[styles.tableCell, styles.tableCellLight]}>Technológia</Text><Text style={[styles.tableCell, styles.tableCellLight, { textAlign: "right" }]}>20-50+</Text></View>
            <View style={[styles.tableRow, styles.tableRowEven]}><Text style={[styles.tableCell, styles.tableCellLight]}>Egészségügy</Text><Text style={[styles.tableCell, styles.tableCellLight, { textAlign: "right" }]}>15-30</Text></View>
            <View style={[styles.tableRow, styles.tableRowOdd]}><Text style={[styles.tableCell, styles.tableCellLight]}>Pénzügy</Text><Text style={[styles.tableCell, styles.tableCellLight, { textAlign: "right" }]}>10-20</Text></View>
            <View style={[styles.tableRow, styles.tableRowEven]}><Text style={[styles.tableCell, styles.tableCellLight]}>Ipar és alapanyagok</Text><Text style={[styles.tableCell, styles.tableCellLight, { textAlign: "right" }]}>10-25</Text></View>
            <View style={[styles.tableRow, styles.tableRowOdd, { borderBottomWidth: 0 }]}><Text style={[styles.tableCell, styles.tableCellLight]}>Fogyasztási cikkek</Text><Text style={[styles.tableCell, styles.tableCellLight, { textAlign: "right" }]}>15-25</Text></View>
          </View>
        </View>
      </AnimatedExpandable>
    </Pressable>
  );
}