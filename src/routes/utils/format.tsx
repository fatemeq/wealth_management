// utils/format.ts - Updated formatMoney function
export const formatNumber = (num: number) => {
  if (num === null || num === undefined) return "0";
  return num.toLocaleString("en-US");
};

export const formatMoney = (num: number, decimals: number = 2) => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  // Format with fixed decimals first
  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // Remove trailing zeros and decimal point if all decimals are zero
  if (formatted.indexOf('.') === -1) return formatted;
  return formatted.replace(/\.?0+$/, '');
};

/**
 * Formats a number WHILE TYPING inside an input.
 * Example: 10000 → 10,000 → 1,234,567.89
 */
export const formatInputNumber = (value: string) => {
  if (!value) return "";

  // Remove existing commas
  const cleaned = value.replace(/,/g, "");

  // Prevent invalid input from breaking formatting
  if (cleaned === "" || isNaN(Number(cleaned))) return value;

  // Split integer & decimal parts
  const [integerPart, decimalPart] = cleaned.split(".");

  // Format integer part with separators
  const formattedInt = Number(integerPart).toLocaleString("en-US");

  // Rebuild full number if there is a decimal part
  return decimalPart !== undefined
    ? `${formattedInt}.${decimalPart}`
    : formattedInt;
};
