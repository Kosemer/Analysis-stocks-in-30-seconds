// file: ./utils/getUniqueSectors.js

const API_KEY = "erGPxRwdctAkDQfGz3Ngtmz8kUJha5zA";

// Használd az 'export' kulcsszót a függvény előtt
export async function getUniqueSectors() {
  const screenerUrl = `https://financialmodelingprep.com/api/v3/stock-screener?limit=1000&apikey=${API_KEY}`;
  try {
    const response = await fetch(screenerUrl);
    const data = await response.json();
    const sectors = new Set(data.map(stock => stock.sector).filter(Boolean)); // .filter(Boolean) kiszűri a null/undefined értékeket
    const uniqueSectors = [...sectors].sort();
    console.log("Elérhető szektorok:", uniqueSectors);
    return uniqueSectors;
  } catch (error) {
    console.error("Hiba a szektorok lekérése közben:", error);
  }
}