import { useLocalStorage } from "./useLocalStorage";

export interface ExchangeRate {
  id: number;
  from: string;   // e.g. USD
  to: string;     // e.g. TOMAN
  value: number;  // e.g. 42000
}

export function useExchangeRates() {
  const [rates, setRates] = useLocalStorage<ExchangeRate[]>("exchangeRates", []);

  const addRate = (from: string, to: string, value: number) => {
    const existing = rates.find(r => r.from === from && r.to === to);
    if (existing) throw new Error("Rate already exists");

    const newRate: ExchangeRate = {
      id: Date.now(),
      from,
      to,
      value,
    };

    setRates([...rates, newRate]);
    return newRate;
  };

  const updateRate = (id: number, value: number) =>
    setRates(rates.map(r => (r.id === id ? { ...r, value } : r)));

  const deleteRate = (id: number) =>
    setRates(rates.filter(r => r.id !== id));

  // Generic converter: supports GOLD ↔ TOMAN ↔ USD if you define rates
  const convert = (amount: number, from: string, to: string): number => {
    if (!amount || from === to) return amount;

    // direct
    const direct = rates.find(r => r.from === from && r.to === to);
    if (direct) return amount * direct.value;

    // inverse
    const inverse = rates.find(r => r.from === to && r.to === from);
    if (inverse) return amount / inverse.value;

    // pivot USD
    const pivot = "USD";
    const fromPivot = rates.find(r => r.from === from && r.to === pivot);
    const toPivot = rates.find(r => r.from === to && r.to === pivot);

    if (fromPivot && toPivot) {
      return (amount * fromPivot.value) / toPivot.value;
    }

    // fallback
    console.warn("No rate for", from, "→", to);
    return amount;
  };

  return { rates, addRate, updateRate, deleteRate, convert };
}
