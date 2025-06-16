import React from "react";
import { Text, Pressable } from "react-native";
import AnimatedExpandable from "./AnimatedExpandable";

export default function CurrentRatioCard({ data, isExpanded, onToggle, styles }) {
  return (
    <Pressable onPress={onToggle} style={styles.card}>
      <Text style={styles.subtitle}>
        💼 Current Ratio {"\n"}(Rövid távú likviditási mutató)
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
          {"\n"}A current ratio azt mutatja meg, hogy a vállalat képes-e rövid lejáratú tartozásait fedezni forgóeszközeivel. Általánosságban: minél nagyobb az érték 1 felett, annál stabilabb a cég likviditása.
          {"\n\n"}❗ <Text style={{ fontWeight: "bold", fontSize: 16 }}>Aktuális értékelés:{"\n"}</Text>
          {"\n"}
          <Text style={styles.expandedText}>
            <Text style={{ fontWeight: "bold" }}>Current Ratio magyarázat:</Text>
            {"\n\n"}
            <Text style={styles.redText}>1 alatt – ❌ Rossz: <Text style={styles.defaultText}>A vállalatnak több rövid lejáratú kötelezettsége van, mint forgóeszköze. Ez pénzügyi nehézségekre utalhat, és azt jelentheti, hogy a cégnek problémái lehetnek a rövid távú kötelezettségek teljesítésével.</Text></Text>
            {"\n\n"}
            <Text style={styles.orangeText}>1 – 1,3 között – ⚠️ Elfogadható: <Text style={styles.defaultText}>A vállalatnak elegendő forgóeszköze van a rövid lejáratú kötelezettségek fedezésére, de a mozgástér szűkebb lehet.</Text></Text>
            {"\n\n"}
            <Text style={styles.greenText}>1,3 – 2 között – ✅ Jó: <Text style={styles.defaultText}>Ez általában pozitív jel, de érdemes összevetni iparági átlagokkal is.</Text></Text>
            {"\n\n"}
            <Text style={styles.warningText}>2 felett – ❗ Túl magas: <Text style={styles.defaultText}>Ez azt jelezheti, hogy a vállalat nem használja hatékonyan az eszközeit, és túl sok készpénzt vagy készletet tart fenn anélkül, hogy azt befektetné vagy felhasználná.</Text></Text>
          </Text>
        </Text>
      </AnimatedExpandable>
    </Pressable>
  );
}