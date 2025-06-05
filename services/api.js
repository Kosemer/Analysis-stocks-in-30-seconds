// --- Konstansok ---
const API_KEY = "erGPxRwdctAkDQfGz3Ngtmz8kUJha5zA";
const BASE_URL_FMP = "https://financialmodelingprep.com/api/v3";

// --- Fő adatlekérő függvény ---
export async function fetchStockData(ticker) {
  try {
    // --- 1. Adatlekérés ---

    // Profil (pl. sharesOutstanding)
    const profileRes = await fetch(
      `${BASE_URL_FMP}/profile/${ticker}?apikey=${API_KEY}`
    );
    const profileData = await profileRes.json();
    const profile = profileData[0] || {};

    // Aktuális ár és volumen
    const quoteRes = await fetch(
      `${BASE_URL_FMP}/quote/${ticker}?apikey=${API_KEY}`
    );
    const quoteData = await quoteRes.json();
    const quote = quoteData[0] || {};

    // Income statement (bevételek)
    const incomeRes = await fetch(
      `${BASE_URL_FMP}/income-statement/${ticker}?limit=5&apikey=${API_KEY}`
    );
    const incomeData = await incomeRes.json();

    // Key metrics (pl. PE, ROE, EPS growth)
    const metricsRes = await fetch(
      `${BASE_URL_FMP}/key-metrics-ttm/${ticker}?limit=5&apikey=${API_KEY}`
    );
    const metricsData = await metricsRes.json();

    // Balance sheet (pl. quick ratio)
    /*const balanceRes = await fetch(
      `${BASE_URL_FMP}/balance-sheet-statement/${ticker}?limit=5&apikey=${API_KEY}`
    );
    const balanceData = await balanceRes.json();*/

    // Ratios TTM (pl. PEG ráta)
    /*const ratiosRes = await fetch(
      `${BASE_URL_FMP}/ratios-ttm/${ticker}?apikey=${API_KEY}`
    );
    const ratiosData = await ratiosRes.json();*/

    // EPS növekedés (külön végpontból)
    const growthRes = await fetch(
      `${BASE_URL_FMP}/financial-growth/${ticker}?apikey=${API_KEY}`
    );
    const growthData = await growthRes.json();

    // Történelmi napi adatok (volume 50 napos átlaghoz)
    const histRes = await fetch(
      `${BASE_URL_FMP}/historical-chart/1day/${ticker}?apikey=${API_KEY}`
    );
    const histData = await histRes.json();

    // Quick Ratio (TTM)
    const quickRatioTTMRes = await fetch(
      `${BASE_URL_FMP}/ratios-ttm/${ticker}?apikey=${API_KEY}`
    );
    const quickRatioTTMData = await quickRatioTTMRes.json();

    // Quick Ratio (normál)
    const quickRatioNormalRes = await fetch(
      `${BASE_URL_FMP}/ratios/${ticker}?limit=1&apikey=${API_KEY}`
    );
    const quickRatioNormalData = await quickRatioNormalRes.json();

    // Current Ratio
    const metricsResCurrentRatio = await fetch(
      `${BASE_URL_FMP}/key-metrics/${ticker}?limit=5&apikey=${API_KEY}`
    );
    const metricsDataCurrentRatio = await metricsResCurrentRatio.json();

    const currentRatio =
      metricsDataCurrentRatio[0]?.currentRatio != null
        ? metricsDataCurrentRatio[0].currentRatio.toFixed(2)
        : "n.a.";

    // --- 2. Értékek feldolgozása ---

    // Quick Ratio értékek meghatározása
    const quickRatioTTM =
      quickRatioTTMData[0]?.quickRatioTTM != null
        ? quickRatioTTMData[0].quickRatioTTM.toFixed(2)
        : "n.a.";

    const quickRatio =
      quickRatioNormalData[0]?.quickRatio != null
        ? quickRatioNormalData[0].quickRatio.toFixed(2)
        : "n.a.";

    // Bevételnövekedés kiszámítása
    const annualIncome = incomeData
      .filter((item) => item.period === "FY")
      .slice(0, 4);
    let revenueGrowthRates = [];
    let revenueGrowthByYear = [];
    if (annualIncome.length >= 2) {
      const revenues = annualIncome.map((r) => ({
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
    const isRevenueGrowing10Percent =
      revenueGrowthRates.length > 0
        ? revenueGrowthRates.every((g) => g >= 0.1)
        : "n.a.";

    // PE ráta
    const peRatioRaw = metricsData[0]?.peRatioTTM;
    const peRatio = peRatioRaw != null ? peRatioRaw.toFixed(2) : "n.a.";

    // ROE (TTM alapján)
    const roe5Y =
      metricsData[0]?.roeTTM != null
        ? (metricsData[0].roeTTM * 100).toFixed(2) + "%"
        : "n.a.";

        console.log("metricsDataCurrentRatio:", metricsDataCurrentRatio);


    // ROE 5 éves átlag (éves key-metrics alapján)
    const roe5YArray = metricsDataCurrentRatio
      .filter((m) => typeof m.returnOnEquity === "number")
      .map((m) => m.returnOnEquity);

    const roe5YAvg =
      roe5YArray.length > 0
        ? (
            roe5YArray.reduce((sum, val) => sum + val, 0) / roe5YArray.length
          ).toFixed(2) + "%"
        : "n.a.";

    console.log("ROE (5Y átlag):", roe5YAvg);

    // EPS növekedés (financial-growth végpontból)
    const profitGrowthRaw =
      growthData.length > 0 && typeof growthData[0].epsgrowth === "number"
        ? growthData[0].epsgrowth
        : null;
    const profitGrowth =
      typeof profitGrowthRaw === "number" ? profitGrowthRaw : "n.a.";

    // PEG ráta számítása manuálisan (ha adatok elérhetők)
    let pegRatio = "n.a.";
    if (
      typeof peRatioRaw === "number" &&
      typeof profitGrowthRaw === "number" &&
      profitGrowthRaw !== 0
    ) {
      pegRatio = (peRatioRaw / profitGrowthRaw).toFixed(2);
    }

    console.log("P/E:", peRatioRaw);
    console.log("EPS growth raw:", profitGrowthRaw);
    console.log("PEG számítás helyesen:", peRatioRaw / profitGrowthRaw);

    // Quick ratio számítása
    /*let quickRatio = "n.a.";
    if (balanceData.length > 0) {
      const bs = balanceData[0];
      const cash = bs.cashAndCashEquivalents || 0;
      const marketableSecurities = bs.shortTermInvestments || 0;
      const receivables = bs.netReceivables || 0;
      const currentLiabilities = bs.totalCurrentLiabilities || 0;
      if (currentLiabilities > 0) {
        const quickAssets = cash + marketableSecurities + receivables;
        quickRatio = (quickAssets / currentLiabilities).toFixed(2);
      }
    }*/

    // Volume formatálása
    function formatVolume(volume) {
      if (typeof volume !== "number") return "n.a.";
      if (volume >= 1e9) return (volume / 1e9).toFixed(2) + "B darab";
      if (volume >= 1e6) return (volume / 1e6).toFixed(2) + "M darab";
      if (volume >= 1e3) return (volume / 1e3).toFixed(2) + "k darab";
      return volume.toString() + " darab";
    }
    const volumeRaw = typeof quote.volume === "number" ? quote.volume : "n.a.";
    const volume = volumeRaw !== "n.a." ? formatVolume(volumeRaw) : "n.a.";

    // 50 napos volumen átlag
    const volume50Days = histData
      .slice(0, 50)
      .map((day) => day.volume)
      .filter((v) => typeof v === "number");
    const avgVolume50 =
      volume50Days.length > 0
        ? volume50Days.reduce((sum, v) => sum + v, 0) / volume50Days.length
        : "n.a.";

    // Statikus értékek (DCF-hez)
    const sharesOutstanding = profile.sharesOutstanding || 0;
    const currentPrice = quote.price || 0;
    const freeCashFlow = 6000000000;
    const growthRate = 0.12;
    const discountRate = 0.08;
    const terminalGrowth = 0.03;

    // --- 3. Visszatérési érték ---
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
      roe5YAvg,
      quickRatio,
      quickRatioTTM,
      volume,
      avgVolume50,
      revenueGrowthByYear,
      isRevenueGrowing10Percent,
      currentRatio,
    };
  } catch (error) {
    console.error("API hiba:", error);
    throw new Error("API hiba: " + error.message);
  }
}
