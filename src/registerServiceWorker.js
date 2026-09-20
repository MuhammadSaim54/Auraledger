export function registerServiceWorker() {
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[AuraLedger FinOS] Sovereign Offline Engine Active:", reg.scope);
        })
        .catch((err) => {
          console.warn("[AuraLedger FinOS] Service Worker registration failed:", err);
        });
    });
  }
}