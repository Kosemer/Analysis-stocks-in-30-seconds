const sectorBenchmarks = {
  Technology: {
    low: 18,
    high: 40,
    comment: "Magas növekedés, magasabb P/E elfogadott.",
  },
  Healthcare: {
    low: 15,
    high: 28,
    comment: "Stabil kereslet, de a biotechnológia torzíthatja az átlagot.",
  },
  "Financial Services": {
    low: 8,
    high: 15,
    comment: "Általában alacsony P/E jellemzi, erősen szabályozott.",
  },
  "Consumer Cyclical": {
    low: 12,
    high: 25,
    comment: "Erősen függ a gazdasági ciklusoktól.",
  },
  "Consumer Defensive": {
    low: 15,
    high: 25,
    comment: "Stabil, kiszámítható bevétel, recesszióállóbb.",
  },
  Industrials: {
    low: 14,
    high: 25,
    comment: "Ciklikus, a gazdasági aktivitástól függ.",
  },
  Energy: {
    low: 6,
    high: 16,
    comment: "Extrém ciklikus, a nyersanyagárak mozgása határozza meg.",
  },
  Utilities: {
    low: 15,
    high: 25,
    comment: "Stabil, alacsony növekedés, de megbízható osztalék.",
  },
  "Real Estate": {
    low: 12,
    high: 30,
    comment: "A P/E félrevezető lehet, P/FFO a mérvadóbb.",
  },
  "Basic Materials": {
    low: 10,
    high: 20,
    comment: "Erősen ciklikus, a globális kereslettől függ.",
  },
  "Communication Services": {
    low: 12,
    high: 28,
    comment: "Vegyes kép: stabil telekom és gyorsan növekvő média.",
  },
  default: { low: 15, high: 25, comment: "Általános piaci átlag." },
};

const pegSectorBenchmarks = {
  // Magas növekedésű szektor, ahol a befektetők hajlandóak prémiumot fizetni a jövőbeli potenciálért.
  // Egy 1.0 alatti PEG itt különösen vonzó lehet.
  Technology: {
    low: 0.8,
    high: 1.8,
    comment:
      "A magas növekedési várakozások miatt az 1.0 feletti PEG is elfogadott lehet egy minőségi cégnél.",
  },

  // Vegyes kép: a stabil gyógyszergyártók és a robbanásszerűen növekvő biotechnológiai cégek.
  Healthcare: {
    low: 0.9,
    high: 1.9,
    comment:
      "A biotechnológiai cégek miatt magasabb PEG is előfordulhat, míg a nagy gyógyszergyáraknál az 1.5 feletti érték már drágának számíthat.",
  },

  // Általában érett, lassabban növekvő iparág.
  "Financial Services": {
    low: 0.7,
    high: 1.5,
    comment:
      "Konzervatívabb szektor, itt egy 1.0 feletti PEG már óvatosságra ad okot. A stabilitás fontosabb a gyors növekedésnél.",
  },

  // Erősen függ a gazdasági ciklusoktól és a fogyasztói költésektől.
  "Consumer Cyclical": {
    low: 0.8,
    high: 1.6,
    comment:
      "A növekedés ingadozó lehet, ezért a befektetők általában 1.0 alatti PEG értéket keresnek biztonsági ráhagyásként.",
  },

  // Stabil, de lassú növekedésű cégek. A PEG itt kevésbé informatív.
  "Consumer Defensive": {
    low: 1.2,
    high: 2.5,
    comment:
      "Az alacsony növekedés miatt a PEG ráta természetesen magas. Itt az osztalék és a stabilitás fontosabb mérőszám.",
  },

  // Ciklikus szektor, a gazdaság teljesítményétől függ.
  Industrials: {
    low: 0.9,
    high: 1.7,
    comment:
      "A gazdasági fellendülés idején a növekedés gyors lehet, de a méltányos ár fontos szempont.",
  },

  // Extrém módon ciklikus, a nyersanyagáraktól függ. A PEG itt nagyon félrevezető lehet.
  Energy: {
    low: 0.5,
    high: 1.5,
    comment:
      "A PEG ráta szinte használhatatlan az ingadozó nyereség miatt. Egy hirtelen profitugrás irreálisan alacsony PEG-et mutathat.",
  },

  // A Consumer Defensive-hez hasonlóan stabil, de alacsony növekedésű.
  Utilities: {
    low: 1.5,
    high: 3.0,
    comment:
      "Nagyon alacsony növekedés, magas osztalék. A PEG szinte mindig magas, nem hasznos értékelési mutató ebben a szektorban.",
  },

  // A P/E és a PEG is félrevezető, mivel a cégek (REIT-ek) nem a nettó nyereséget maximalizálják.
  "Real Estate": {
    low: 1.0,
    high: 2.5,
    comment:
      "A PEG nem a legjobb mutató. Helyette a P/FFO (Price to Funds From Operations) és annak növekedése a mérvadó.",
  },

  // Erősen ciklikus, a globális kereslettől függ.
  "Basic Materials": {
    low: 0.8,
    high: 1.6,
    comment:
      "Hasonló a többi ciklikus szektorhoz, a növekedés megbízhatatlan lehet, ezért az alacsonyabb PEG preferált.",
  },

  // Kétarcú szektor: stabil telekom cégek és gyorsan növekvő médiavállalatok.
  "Communication Services": {
    low: 0.9,
    high: 2.0,
    comment:
      "A telekom cégeknél magasabb, a növekedési média cégeknél 1.5 alatti PEG az elvárt.",
  },

  // Általános piaci iránymutatás, ha nincs specifikus iparági adat.
  default: {
    low: 0.8,
    high: 1.5,
    comment:
      "Általános szabály: 1.0 alatt potenciálisan alulértékelt, 1.0 körül méltányos, 1.5 felett valószínűleg túlértékelt.",
  },
};

const sectorTranslations = {
  Technology: "Technológia",
  Healthcare: "Egészségügy",
  "Financial Services": "Pénzügyi szolgáltatások",
  "Consumer Cyclical": "Ciklikus fogyasztási cikkek",
  "Consumer Defensive": "Nem-ciklikus fogyasztási cikkek",
  Industrials: "Ipari termékek",
  Energy: "Energia",
  Utilities: "Közművek",
  "Real Estate": "Ingatlan",
  "Basic Materials": "Alapanyagok",
  "Communication Services": "Kommunikációs szolgáltatások",
  default: "Általános / Egyéb",
};

export function analyzeStock(data) {
  // Az elmúlt 5 év ROE értékei (pl. 1.65 = 165%)
  const roeValues = (data.roeList || []).slice(0, 5).map((entry) => {
    const val =
      typeof entry.roe === "string" ? parseFloat(entry.roe) : entry.roe;
    return isNaN(val) ? 0 : val * 100; // Itt szorozzuk fel százalékká!
  });

  const roeAvg =
    roeValues.length > 0
      ? roeValues.reduce((sum, v) => sum + v, 0) / roeValues.length
      : 0;

  // <<< P/E szektor-specifikus elemzés >>>

  // A cég szektorának és a TTM P/E rátának kinyerése
  const sector = data.sector || "default"; // Ha nincs szektor, a defaultot használjuk
  const peRatioTTM = parseFloat(data.priceToEarningsRatioTTM);

  // A szektornak megfelelő benchmark megkeresése
  const benchmark = sectorBenchmarks[sector] || sectorBenchmarks.default;
  const sectorDisplay =
    sectorTranslations[sector] || sectorTranslations.default;

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
    } else {
      // peRatioTTM > benchmark.high
      pePassed = false;
      peComment = `A P/E magasabb a szektorra jellemzőnél. Lehet túlértékelt vagy erős növekedési kilátásai vannak.`;
    }
  }
  // <<<  >>>

   // <<< PEG szektor-specifikus elemzés (ÚJ LOGIKA) >>>
   const pegRatioValue = parseFloat(data.pegRatioFromRatios);
   const pegBenchmark = pegSectorBenchmarks[sector] || pegSectorBenchmarks.default;
   let pegPassed = false;
   let pegComment = "PEG érték nem elérhető vagy nem értelmezhető.";
 
   if (!isNaN(pegRatioValue)) {
     if (pegRatioValue < 0) {
       pegPassed = false;
       pegComment = `A cég veszteséges vagy a növekedési kilátások negatívak (negatív PEG: ${pegRatioValue.toFixed(2)}).`;
     } else if (pegRatioValue >= pegBenchmark.low && pegRatioValue <= pegBenchmark.high) {
       pegPassed = true;
       pegComment = `A PEG ráta a szektorban elfogadott ${pegBenchmark.low}-${pegBenchmark.high} tartományon belül van.`;
     } else if (pegRatioValue < pegBenchmark.low) {
       pegPassed = true; // Az alacsony PEG általában jó jel, ezért itt 'passed'
       pegComment = `A PEG ráta kedvező, alacsonyabb a szektorra jellemzőnél, ami potenciálisan alulértékelt részvényre utal.`;
     } else { // pegRatioValue > pegBenchmark.high
       pegPassed = false;
       pegComment = `A PEG ráta magasabb a szektorra jellemzőnél, ami potenciálisan túlértékelt részvényre utal.`;
     }
   }
  

  const result = {
    currentPrice: { value: data.currentPrice, passed: data.currentPrice },
    profitGrowth: { value: data.profitGrowth, passed: data.profitGrowth > 0 },
    peRatioFromRatios: {
      value: data.peRatioFromRatios,
      passed: data.peRatioFromRatios < 25,
    },

    peRatioTTM: {
      value: !isNaN(peRatioTTM) ? peRatioTTM : "n.a.",
      passed: pePassed,
      benchmark: `${benchmark.low} - ${benchmark.high}`,
      comment: peComment,
      sector: sector,
      sectorDisplay: sectorDisplay,
    },
    // Ezt a kettőt még meg kell jeleníteni a UI-on
    //priceToEarningsRatioTTM: { value: data.priceToEarningsRatioTTM, passed: data.priceToEarningsRatioTTM < 25 },
    priceToEarningsGrowthRatioTTM: {
      value: data.priceToEarningsGrowthRatioTTM,
      passed: data.priceToEarningsGrowthRatioTTM < 25,
    },

    pegRatioFromRatios: {
      value: !isNaN(pegRatioValue) ? pegRatioValue : "n.a.",
      passed: pegPassed,
      benchmark: `${pegBenchmark.low} - ${pegBenchmark.high}`,
      comment: pegComment,
      sector: sector,
      sectorDisplay: sectorDisplay,
    },
    roe5Y: {
      value: roeAvg,
      passed: roeAvg > 5, // mert az értékek 100-szorosak a valódi %-hoz képest
    },
    roeList: data.roeList,
    quickRatio: {
      value: parseFloat(data.quickRatio),
      passed:
        parseFloat(data.quickRatio) >= 0.7 && parseFloat(data.quickRatio) < 2,
    },
    quickRatioTTM: {
      value: parseFloat(data.quickRatioTTM),
      passed:
        parseFloat(data.quickRatio) >= 0.7 && parseFloat(data.quickRatio) < 2,
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
    currentPrice: { value: data.currentPrice, passed: data.currentPrice },
    changesPercentage: { value: data.changesPercentage, passed: data.changesPercentage > 0 },
    change: { value: data.change, passed: data.change > 0 },
    dayLow: { value: data.dayLow, passed: data.dayLow === false},
    dayHigh: { value: data.dayHigh, passed: data.dayHigh === true },
    priceAvg50: { value: data.priceAvg50, passed: data.priceAvg50 },
    priceAvg200: { value: data.priceAvg200, passed: data.priceAvg200 },
    volume: { value: data.volume, passed: data.volume }, 
    avgVolume: { value: data.avgVolume, passed: data.avgVolume }, 
    timestamp: { value: data.timestamp, passed: data.timestamp },
  };

  return result;
}
