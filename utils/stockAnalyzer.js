export function analyzeStock(stock) {
  return {
    profitGrowth: stock.profitGrowth > 10,
    peRatio: stock.peRatio < 25,
    pegRatio: stock.pegRatio < 2,
    roe5Y: stock.roe5Y > 5,
    quickRatio: stock.quickRatio > 1.5,
    volume: stock.volume > 100000,
  };
}