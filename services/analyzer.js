export function analyzeStock(data) {
  return {
    profitGrowth: { value: data.profitGrowth, passed: data.profitGrowth > 0 },
    peRatio: { value: data.peRatio, passed: data.peRatio < 25 },
    pegRatio: { value: data.pegRatio, passed: data.pegRatio < 2 },
    roe5Y: { value: data.roe5Y, passed: data.roe5Y > 10 },
    quickRatio: { value: data.quickRatio, passed: data.quickRatio > 1.5 },
    avgVolume50: { value: data.avgVolume50, passed: data.avgVolume50 > 1_000_000 },

    currentPrice: data.currentPrice
  };
}
