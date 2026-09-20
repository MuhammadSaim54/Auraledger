import { CURRENCIES } from "../types/models";

export function formatCurrency(amount = 0, currencyCode = "USD") {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const numAmount = Number(amount) || 0;
  const converted = numAmount * currency.rate;

  const isPKR = currency.code === "PKR";

  // Clean localized number with proper symbol prefix
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: isPKR ? 0 : 2,
    maximumFractionDigits: isPKR ? 0 : 2
  }).format(converted);

  return `${currency.symbol}${formattedNumber}`;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  }).format(date);
}

export function convertRawAmount(amount = 0, currencyCode = "USD") {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  return (Number(amount) || 0) * currency.rate;
}