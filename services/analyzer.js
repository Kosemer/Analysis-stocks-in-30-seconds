export function analyzeStock(data) {
  return {
    profitGrowth: { value: data.profitGrowth, passed: data.profitGrowth > 0 },
    peRatio: { value: data.peRatio, passed: data.peRatio < 25 },
    pegRatio: { value: data.pegRatio, passed: data.pegRatio < 1.5 },
    roe5Y: { value: data.roe5Y, passed: data.roe5Y > 10 },
    quickRatio: { value: data.quickRatio, passed: data.quickRatio > 1 },
    volume: { value: data.volume, passed: data.volume > 1_000_000 },
  };
}
