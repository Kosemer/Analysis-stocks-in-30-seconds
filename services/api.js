const API_KEY = "erGPxRwdctAkDQfGz3Ngtmz8kUJha5zA";
const BASE_URL_FMP = "https://financialmodelingprep.com/api/v3";

export async function fetchStockData(ticker) {
  try {
    // 1. Profiladatok (pl. sharesOutstanding)
    const profileRes = await fetch(`${BASE_URL_FMP}/profile/${ticker}?apikey=${API_KEY}`);
    const profileData = await profileRes.json();
    const profile = profileData[0] || {};

    // 2. Aktuális ár és egyéb árfolyamadatok
    const quoteRes = await fetch(`${BASE_URL_FMP}/quote/${ticker}?apikey=${API_KEY}`);
    const quoteData = await quoteRes.json();
    const quote = quoteData[0] || {};

    // 3. Income Statement (bevétel, profit növekedéshez)
    const incomeRes = await fetch(`${BASE_URL_FMP}/income-statement/${ticker}?limit=5&apikey=${API_KEY}`);
    const incomeData = await incomeRes.json();

    // 4. Key Metrics (pl. EPS growth, PE, PEG, ROE)
    const metricsRes = await fetch(`${BASE_URL_FMP}/key-metrics-ttm/${ticker}?limit=5&apikey=${API_KEY}`);
    const metricsData = await metricsRes.json();

    // 5. Balance Sheet (pl. quick ratio)
    const balanceRes = await fetch(`${BASE_URL_FMP}/balance-sheet-statement/${ticker}?limit=5&apikey=${API_KEY}`);
    const balanceData = await balanceRes.json();

    console.log("Key Metrics TTM adat:", metricsData);

    // --- Feldolgozás ---

    // Bevételnövekedés számítása (az éves jelentésekből)
    const annualIncome = incomeData.filter(item => item.period === "FY").slice(0, 4);
    let revenueGrowthRates = [];
    let revenueGrowthByYear = [];
    if (annualIncome.length >= 2) {
      const revenues = annualIncome.map(r => ({
        year: parseInt(r.calendarYear),
        value: r.revenue || 0,
      }));
      for (let i = 0; i < revenues.length - 1; i++) {
        const current = revenues[i];
        const previous = revenues[i + 1];
        if (previous.value === 0) continue;
        const growth = (current.value - previous.value) / previous.value;
        revenueGrowthRates.push(growth);
        revenueGrowthByYear.push({
          year: current.year,
          growthPercent: (growth * 100).toFixed(2) + "%",
        });
      }
    }
    const isRevenueGrowing10Percent = revenueGrowthRates.length > 0 ? revenueGrowthRates.every(g => g >= 0.10) : "n.a.";

    // EPS növekedés (TTM alapján, key metrics-ből)
    // A legfrissebb key metric elem EPS növekedését vesszük
    const profitGrowth = (metricsData.length > 0 && typeof metricsData[0].epsGrowthTTM === "number")
      ? metricsData[0].epsGrowthTTM
      : "n.a.";

    // PE, PEG, ROE szintén key metrics legfrissebb eleméből
    const peRatio = metricsData[0]?.peRatioTTM != null
    ? metricsData[0].peRatioTTM.toFixed(2)
    : "n.a.";
  
  const roe5Y = metricsData[0]?.roeTTM != null
    ? (metricsData[0].roeTTM * 100).toFixed(2) + "%"
    : "n.a.";

    const pegRatio = metricsData[0]?.pegRatioTTM != null
    ? ratiosData[0].pegRatioTTM.toFixed(2)
    : "n.a.";
    
  

    // Quick ratio a legfrissebb balance sheet adatból:
    // quickRatio = (Cash + Marketable Securities + Receivables) / Current Liabilities
    let quickRatio = "n.a.";
    if (balanceData.length > 0) {
      const bs = balanceData[0];
      const currentAssets = bs.cashAndCashEquivalents + (bs.marketableSecurities || 0) + (bs.accountsReceivable || 0);
      const currentLiabilities = bs.currentLiabilities || 1; // elkerüljük a nullával osztást
      quickRatio = (currentAssets / currentLiabilities).toFixed(2);
    }

    // Volume az aktuális árfolyam adatból
    function formatVolume(volume) {
      if (typeof volume !== "number") return "n.a.";
    
      if (volume >= 1e9) {
        return (volume / 1e9).toFixed(2) + "B darab";
      } else if (volume >= 1e6) {
        return (volume / 1e6).toFixed(2) + "M darab";
      } else if (volume >= 1e3) {
        return (volume / 1e3).toFixed(2) + "k darab";
      } else {
        return volume.toString() + " darab";
      }
    }
    const volumeRaw = typeof quote.volume === "number" ? quote.volume : "n.a.";
    const volume = volumeRaw !== "n.a." ? formatVolume(volumeRaw) : "n.a.";
        

    // Shares outstanding
    const sharesOutstanding = profile.sharesOutstanding || 0;

    // Aktuális árfolyam
    const currentPrice = quote.price || 0;

    // Statikus értékek (szükség szerint módosíthatod)
    const freeCashFlow = 6000000000;
    const growthRate = 0.12;
    const discountRate = 0.08;
    const terminalGrowth = 0.03;

    return {
      currentPrice,
      sharesOutstanding,
      freeCashFlow,
      growthRate,
      discountRate,
      terminalGrowth,

      profitGrowth,
      peRatio,
      pegRatio,
      roe5Y,
      quickRatio,
      volume,

      revenueGrowthByYear,
      isRevenueGrowing10Percent,
    };

  } catch (error) {
    console.error("API hiba:", error);
    throw new Error("API hiba: " + error.message);
  }
}
