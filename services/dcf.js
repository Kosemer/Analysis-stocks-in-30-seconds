export function calculateDCF(fcf, growth, discount, terminal, years = 5) {
  if (!fcf || !growth || !discount || !terminal) {
    console.warn("Hiányzó vagy hibás DCF paraméter(ek):", { fcf, growth, discount, terminal });
    return 0;
  }

  let npv = 0;

  for (let t = 1; t <= years; t++) {
    const projectedFCF = fcf * Math.pow(1 + growth, t);
    const discountedFCF = projectedFCF / Math.pow(1 + discount, t);
    npv += discountedFCF;
  }

  const lastFCF = fcf * Math.pow(1 + growth, years);
  const terminalValue = (lastFCF * (1 + terminal)) / (discount - terminal);
  const terminalNPV = terminalValue / Math.pow(1 + discount, years);

  const totalValue = npv + terminalNPV;
  console.log("📊 DCF kalkulált érték:", totalValue.toFixed(2));
  return totalValue;
}
