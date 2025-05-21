const API_KEY = "d0jmdq9r01qjm8s227m0d0jmdq9r01qjm8s227mg";
const BASE_URL = "https://finnhub.io/api/v1";

export async function fetchStockData(ticker) {
  try {
    const profileRes = await fetch(`${BASE_URL}/stock/profile2?symbol=${ticker}&token=${API_KEY}`);
    const profile = await profileRes.json();

    const quoteRes = await fetch(`${BASE_URL}/quote?symbol=${ticker}&token=${API_KEY}`);
    const quote = await quoteRes.json();

    const metricsRes = await fetch(`${BASE_URL}/stock/metric?symbol=${ticker}&metric=all&token=${API_KEY}`);
    const metricsData = await metricsRes.json();
    const metrics = metricsData.metric || {};

    // ÚJ: nettó profit lekérdezése (éves jelentésekből)
    const financialsRes = await fetch(`${BASE_URL}/stock/financials-reported?symbol=${ticker}&token=${API_KEY}`);
    const financialsData = await financialsRes.json();

    let profitGrowth = "n.a.";
    try {
      const reports = financialsData.data;
      if (reports && reports.length >= 2) {
        const latest = reports[0];
        const prev = reports[1];

        const latestNetIncome = extractNetIncome(latest);
        const prevNetIncome = extractNetIncome(prev);

        if (typeof latestNetIncome === "number" && typeof prevNetIncome === "number" && prevNetIncome !== 0) {
          profitGrowth = ((latestNetIncome - prevNetIncome) / Math.abs(prevNetIncome)) * 100;
        }
      }
    } catch (e) {
      console.warn("Nem sikerült kiszámolni a profitGrowth értéket:", e);
    }

    const result = {
      currentPrice: quote.c,
      sharesOutstanding: profile.shareOutstanding * 1_000_000,
      freeCashFlow: 6000000000, // placeholder
      growthRate: 0.12,         // placeholder
      discountRate: 0.08,
      terminalGrowth: 0.03,

      // új elemzési mutatók
      profitGrowth: profitGrowth,
      peRatio: metrics.peBasicExclExtraTTM ?? 0,
      pegRatio: metrics.pegRatioTTM ?? 0,
      roe5Y: metrics.roe5Y ?? 0,
      quickRatio: metrics.quickRatioAnnual ?? 0,
      volume: typeof quote.v === "number" ? quote.v : "n.a.",
    };

    console.log("Lekért adatok:", result);
    return result;
  } catch (error) {
    console.error("API hiba:", error);
    throw new Error("API hiba: " + error);
  }
}

// 🧠 Segédfüggvény a nettó profit kinyerésére a strukturált jelentésből
function extractNetIncome(report) {
  const incomeStatement = report.report?.ic;
  if (!incomeStatement) return null;

  const netIncomeItem = incomeStatement.find(item => item.concept === "NetIncome" || item.label === "Net Income");
  return netIncomeItem ? Number(netIncomeItem.value) : null;
}
