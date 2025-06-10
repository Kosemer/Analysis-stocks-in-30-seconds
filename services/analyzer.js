const sectorBenchmarks = {
  "Technology": { low: 18, high: 40, comment: "Magas növekedés, magasabb P/E elfogadott." },
  "Healthcare": { low: 15, high: 28, comment: "Stabil kereslet, de a biotechnológia torzíthatja az átlagot." },
  "Financial Services": { low: 8, high: 15, comment: "Általában alacsony P/E jellemzi, erősen szabályozott." },
  "Consumer Cyclical": { low: 12, high: 25, comment: "Erősen függ a gazdasági ciklusoktól." },
  "Consumer Defensive": { low: 15, high: 25, comment: "Stabil, kiszámítható bevétel, recesszióállóbb." },
  "Industrials": { low: 14, high: 25, comment: "Ciklikus, a gazdasági aktivitástól függ." },
  "Energy": { low: 6, high: 16, comment: "Extrém ciklikus, a nyersanyagárak mozgása határozza meg." },
  "Utilities": { low: 15, high: 25, comment: "Stabil, alacsony növekedés, de megbízható osztalék." },
  "Real Estate": { low: 12, high: 30, comment: "A P/E félrevezető lehet, P/FFO a mérvadóbb." },
  "Basic Materials": { low: 10, high: 20, comment: "Erősen ciklikus, a globális kereslettől függ." },
  "Communication Services": { low: 12, high: 28, comment: "Vegyes kép: stabil telekom és gyorsan növekvő média." },
  "default": { low: 15, high: 25, comment: "Általános piaci átlag." }
};

const sectorTranslations = {
  "Technology": "Technológia",
  "Healthcare": "Egészségügy",
  "Financial Services": "Pénzügyi szolgáltatások",
  "Consumer Cyclical": "Ciklikus fogyasztási cikkek",
  "Consumer Defensive": "Nem-ciklikus fogyasztási cikkek",
  "Industrials": "Ipari termékek",
  "Energy": "Energia",
  "Utilities": "Közművek",
  "Real Estate": "Ingatlan",
  "Basic Materials": "Alapanyagok",
  "Communication Services": "Kommunikációs szolgáltatások",
  "default": "Általános / Egyéb"
};

export function analyzeStock(data) {
    // Az elmúlt 5 év ROE értékei (pl. 1.65 = 165%)
    const roeValues = (data.roeList || [])
    .slice(0, 5)
    .map(entry => {
      const val = typeof entry.roe === "string" ? parseFloat(entry.roe) : entry.roe;
      return isNaN(val) ? 0 : val * 100; // Itt szorozzuk fel százalékká!
    });
  
  const roeAvg = roeValues.length > 0
    ? roeValues.reduce((sum, v) => sum + v, 0) / roeValues.length
    : 0;


    // <<< P/E szektor-specifikus elemzés >>>

    // A cég szektorának és a TTM P/E rátának kinyerése
    const sector = data.sector || 'default'; // Ha nincs szektor, a defaultot használjuk
    const peRatioTTM = parseFloat(data.priceToEarningsRatioTTM);

    // A szektornak megfelelő benchmark megkeresése
    const benchmark = sectorBenchmarks[sector] || sectorBenchmarks.default;
    const sectorDisplay = sectorTranslations[sector] || sectorTranslations.default;

    // Az értékelés logikája
    let pePassed = false;
    let peComment = "P/E érték nem elérhető vagy nem értelmezhető.";

    if (!isNaN(peRatioTTM)) {
        if (peRatioTTM <= 0) {
            pePassed = false;
            peComment = "A cég veszteséges (negatív P/E).";
        } else if (peRatioTTM >= benchmark.low && peRatioTTM <= benchmark.high) {
            pePassed = true;
            peComment = `A P/E a szektorban elfogadott ${benchmark.low}-${benchmark.high} tartományon belül van.`;
        } else if (peRatioTTM < benchmark.low) {
            pePassed = false; // Vagy lehet true, ha az "olcsó" a cél. Ez stratégia kérdése.
            peComment = `A P/E alacsonyabb a szektorra jellemzőnél. Lehet alulértékelt vagy problémákkal küzd.`;
        } else { // peRatioTTM > benchmark.high
            pePassed = false;
            peComment = `A P/E magasabb a szektorra jellemzőnél. Lehet túlértékelt vagy erős növekedési kilátásai vannak.`;
        }
    }
    // <<<  >>>
    
  const result = {
    profitGrowth: { value: data.profitGrowth, passed: data.profitGrowth > 0 },
    peRatioFromRatios: { value: data.peRatioFromRatios, passed: data.peRatioFromRatios < 25 },

    peRatioTTM: {
      value: !isNaN(peRatioTTM) ? peRatioTTM : 'n.a.',
      passed: pePassed,
      benchmark: `${benchmark.low} - ${benchmark.high}`,
      comment: peComment,
      sector: sector,
      sectorDisplay: sectorDisplay
  },
// Ezt a kettőt még meg kell jeleníteni a UI-on
    //priceToEarningsRatioTTM: { value: data.priceToEarningsRatioTTM, passed: data.priceToEarningsRatioTTM < 25 },
    priceToEarningsGrowthRatioTTM: { value: data.priceToEarningsGrowthRatioTTM, passed: data.priceToEarningsGrowthRatioTTM < 25 },


    pegRatioFromRatios: { value: data.pegRatioFromRatios, passed: data.pegRatioFromRatios < 2 },
    roe5Y: { 
      value: roeAvg, 
      passed: roeAvg > 5  // mert az értékek 100-szorosak a valódi %-hoz képest
    },
    roeList: data.roeList,
    quickRatio: {
      value: parseFloat(data.quickRatio),
      passed: parseFloat(data.quickRatio) >= 0.7 && parseFloat(data.quickRatio) < 2,
    },
    quickRatioTTM: {
      value: parseFloat(data.quickRatioTTM),
      passed: parseFloat(data.quickRatio) >= 0.7 && parseFloat(data.quickRatio) < 2,
    },    
    currentRatio: {
      value: data.currentRatio,
      passed: data.currentRatio >= 1 && data.currentRatio <= 2,
    },
    avgVolume50: {
      value: data.avgVolume50,
      passed: data.avgVolume50 > 1_000_000,
    },
    /* Éves bevételnövekedés ellenőrzése */
    revenueGrowthByYear: data.revenueGrowthByYear.map((entry) => {
      const numericGrowth = parseFloat(entry.growthPercent.replace("%", ""));
      const passed = !isNaN(numericGrowth) && numericGrowth > 0;
      return {
        ...entry,
        passed,
      };
    }),

    revenueGrowth10Percent: {
      value: data.revenueGrowthByYear,
      passed: data.isRevenueGrowing10Percent === true,
    },
    /* Éves bevételnövekedés ellenőrzése */
  };

  return result;
}
