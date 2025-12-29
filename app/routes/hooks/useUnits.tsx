import { useLocalStorage } from "./useLocalStorage";

export interface MoneyUnit {
  id: number;
  code: string;   // USD, EUR, GOLD, TOMAN
  name: string;   // US Dollar, Gold gram, Iranian Toman
  symbol: string; // $, g, T
}

export function useUnits() {
  const defaultUnits: MoneyUnit[] = [
    { id: 1, code: "USD",  name: "US Dollar",      symbol: "$" },
    { id: 2, code: "EUR",  name: "Euro",           symbol: "€" },
    { id: 3, code: "GBP",  name: "British Pound",  symbol: "£" },
    { id: 4, code: "BTC",  name: "Bitcoin",        symbol: "₿" },
  ];

  const [units, setUnits] = useLocalStorage<MoneyUnit[]>("units", defaultUnits);

  const addUnit = (unit: Omit<MoneyUnit, "id">) => {
    if (units.some(u => u.code === unit.code)) {
      throw new Error("A currency with this code already exists.");
    }
    const newUnit = { ...unit, id: Date.now() };
    setUnits([...units, newUnit]);
    return newUnit;
  };

  const updateUnit = (id: number, updated: Partial<MoneyUnit>) =>
    setUnits(units.map(u => (u.id === id ? { ...u, ...updated } : u)));

  const deleteUnit = (id: number) =>
    setUnits(units.filter(u => u.id !== id));

  return { units, addUnit, updateUnit, deleteUnit, setUnits };
}
