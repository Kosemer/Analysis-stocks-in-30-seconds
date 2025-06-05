export function analyzeStock(data) {
  const result = {
    profitGrowth: { value: data.profitGrowth, passed: data.profitGrowth > 0 },
    peRatio: { value: data.peRatio, passed: data.peRatio < 25 },
    pegRatio: { value: data.pegRatio, passed: data.pegRatio < 2 },
    roe5Y: { value: data.roe5Y, passed: data.roe5Y > 10 },
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

  return result;
}
