import { CURRENCIES } from "../types/models";

export function formatCurrency(amount, currencyCode = "USD") {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amount * currency.rate;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
    .format(converted)
    .replace(currency.code, currency.symbol)
    .trim();
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}