// Initial Mock & State Schema for AuraLedger
export const CURRENCIES = {
  USD: { symbol: "$", code: "USD", rate: 1, label: "USD ($)" },
  PKR: { symbol: "₨", code: "PKR", rate: 280, label: "PKR (₨)" },
  EUR: { symbol: "€", code: "EUR", rate: 0.92, label: "EUR (€)" },
  GBP: { symbol: "£", code: "GBP", rate: 0.79, label: "GBP (£)" }
};

export const CATEGORIES = [
  { id: "groceries", label: "Groceries", color: "#f97316", icon: "ShoppingCart" },
  { id: "dining", label: "Cafes & Dining", color: "#ea580c", icon: "Utensils" },
  { id: "tech", label: "Dev Tools & Tech", color: "#6366f1", icon: "Laptop" },
  { id: "apparel", label: "Apparel & Lifestyle", color: "#ec4899", icon: "Shirt" },
  { id: "housing", label: "Housing & Utilities", color: "#14b8a6", icon: "Home" },
  { id: "freelance", label: "Freelance & Salary", color: "#10b981", icon: "Briefcase" },
  { id: "investments", label: "Investments", color: "#8b5cf6", icon: "TrendingUp" }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-1",
    title: "Stripe Client Payout",
    merchant: "Stripe Inc.",
    category: "freelance",
    type: "income",
    amount: 1450.00,
    status: "Completed",
    account: "Primary Vault (•••• 9286)",
    date: "2026-09-18",
    tag: "#client"
  },
  {
    id: "tx-2",
    title: "Adobe Creative Cloud",
    merchant: "Adobe Systems",
    category: "tech",
    type: "expense",
    amount: 59.99,
    status: "In progress",
    account: "Visa Platinum (•••• 2041)",
    date: "2026-09-17",
    tag: "#software"
  },
  {
    id: "tx-3",
    title: "Organic Harvest Market",
    merchant: "Whole Foods",
    category: "groceries",
    type: "expense",
    amount: 128.40,
    status: "Completed",
    account: "Visa Platinum (•••• 2041)",
    date: "2026-09-16",
    tag: "#food"
  },
  {
    id: "tx-4",
    title: "Vercel Pro Subscription",
    merchant: "Vercel Inc.",
    category: "tech",
    type: "expense",
    amount: 20.00,
    status: "Completed",
    account: "Primary Vault (•••• 9286)",
    date: "2026-09-15",
    tag: "#infra"
  }
];

export const INITIAL_VAULTS = [
  { id: "v-1", name: "BMW M5 Dream Fund", target: 45000, current: 14200, icon: "Car" },
  { id: "v-2", name: "High-End Studio Rig", target: 3500, current: 2850, icon: "Monitor" },
  { id: "v-3", name: "Runway Reserve", target: 12000, current: 8900, icon: "ShieldCheck" }
];