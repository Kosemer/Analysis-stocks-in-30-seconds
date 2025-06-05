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
    
  const result = {
    profitGrowth: { value: data.profitGrowth, passed: data.profitGrowth > 0 },
    peRatio: { value: data.peRatio, passed: data.peRatio < 25 },
    pegRatio: { value: data.pegRatio, passed: data.pegRatio < 2 },
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
      console.log(
        "Checking year:",
        entry.year,
        "Parsed:",
        numericGrowth,
        "Passed:",
        passed
      );
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
console.log("222222222222" , data.roeList)
  return result;
}
