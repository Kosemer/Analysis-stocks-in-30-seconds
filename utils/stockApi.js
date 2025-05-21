// Ez egy fiktív API adat szimulációja valódi API helyett
export async function fetchStockData(symbol) {
  const mockData = {
    AAPL: {
      profitGrowth: 12.1,
      peRatio: 24.8,
      pegRatio: 1.9,
      roe5Y: 6.2,
      quickRatio: 1.6,
      volume: 120000,
    },
    MSFT: {
      profitGrowth: 15.5,
      peRatio: 22.5,
      pegRatio: 1.4,
      roe5Y: 11.2,
      quickRatio: 2.1,
      volume: 150000,
    },
    GOOGL: {
      profitGrowth: 8.7,
      peRatio: 27.5,
      pegRatio: 2.2,
      roe5Y: 5.8,
      quickRatio: 1.3,
      volume: 95000,
    },
  };

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData[symbol]), 500);
  });
}