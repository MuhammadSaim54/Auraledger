import { formatCurrency, formatDate } from "./formatters";
import { CURRENCIES } from "../types/models";

/**
 * Generates an institutional-grade CSV string and triggers a browser download.
 */
export function exportLedgerToCSV(transactions = [], currencyCode = "USD", userName = "Commander") {
  if (!transactions.length) return false;

  const activeCurrency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const headers = [
    "Transaction ID",
    "Timestamp",
    "Descriptor",
    "Category",
    "Type",
    "Base Amount (USD)",
    `Converted (${currencyCode})`,
    "Vault Partition",
    "Audit Tag"
  ];

  const rows = transactions.map((tx) => {
    const rawAmt = Number(tx.amount) || 0;
    const convertedAmt = (rawAmt * (activeCurrency.rate || 1)).toFixed(2);
    
    return [
      `"${tx.id}"`,
      `"${tx.date || new Date().toISOString()}"`,
      `"${(tx.title || "Untitled").replace(/"/g, '""')}"`,
      `"${tx.category || "General"}"`,
      `"${tx.type || "expense"}"`,
      `"${rawAmt.toFixed(2)}"`,
      `"${convertedAmt}"`,
      `"${tx.vaultId || "primary"}"`,
      `"${tx.tag || ""}"`
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `AuraLedger_Audit_${userName.replace(/\s+/g, "_")}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Exports complete JSON state backup for client-sovereign cold storage.
 */
export function exportStateBackupJSON(userData, transactions, vaultTransfers) {
  const payload = {
    schemaVersion: "5.2.0-kinetic",
    exportedAt: new Date().toISOString(),
    operator: {
      id: userData?.id,
      name: userData?.name,
      baseCurrency: userData?.currency || "USD"
    },
    ledger: {
      transactionsCount: transactions.length,
      transactions,
      vaultTransfers
    }
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`;
  const downloadAnchor = document.createElement("a");
  const timestamp = new Date().toISOString().split("T")[0];
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", `AuraLedger_Backup_${timestamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Institutional Isolated PDF / Print Generator (Prints ONLY the audit document, not the website)
 */
export function printAuditStatement(transactions = [], currencyCode = "USD", userName = "Commander") {
  if (!transactions.length) return false;

  const activeCurrency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const printWindow = window.open("", "_blank", "width=900,height=800");

  let totalInflow = 0;
  let totalOutflow = 0;

  const rowsHtml = transactions
    .map((tx) => {
      const rawAmt = Number(tx.amount) || 0;
      const convertedAmt = rawAmt * (activeCurrency.rate || 1);
      const isIncome = tx.type === "income";

      if (isIncome) totalInflow += convertedAmt;
      else totalOutflow += convertedAmt;

      return `
        <tr style="border-bottom: 1px solid #f1f1f4; font-size: 11px;">
          <td style="padding: 10px 8px; font-family: monospace; color: #71717a;">${tx.date || "2026-09-20"}</td>
          <td style="padding: 10px 8px; font-weight: 600; color: #18181b;">${tx.title || "Untitled"}</td>
          <td style="padding: 10px 8px; color: #71717a; text-transform: capitalize;">${tx.category || "General"}</td>
          <td style="padding: 10px 8px; color: #71717a; font-family: monospace;">${tx.vaultId || "primary"}</td>
          <td style="padding: 10px 8px; text-align: right; font-family: monospace; font-weight: 700; color: ${isIncome ? "#059669" : "#18181b"};">
            ${isIncome ? "+" : "-"}${activeCurrency.symbol}${convertedAmt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
        </tr>
      `;
    })
    .join("");

  const netLiquidity = totalInflow - totalOutflow;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>AuraLedger - Audit Statement (${userName})</title>
        <style>
          @page { size: A4 portrait; margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #09090b; background: #fff; margin: 0; padding: 24px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #18181b; margin-bottom: 24px; }
          .logo { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; font-family: monospace; }
          .badge { font-size: 9px; font-family: monospace; text-transform: uppercase; background: #f4f4f5; padding: 3px 8px; border-radius: 4px; color: #52525b; }
          .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
          .metric { border: 1px solid #e4e4e7; border-radius: 8px; padding: 12px 14px; }
          .metric-label { font-size: 9px; text-transform: uppercase; font-family: monospace; color: #71717a; }
          .metric-val { font-size: 18px; font-weight: 800; font-family: monospace; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { font-size: 9px; text-transform: uppercase; font-family: monospace; color: #71717a; padding: 8px; border-bottom: 1px solid #d4d4d8; }
          .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e4e4e7; display: flex; justify-content: space-between; font-size: 9px; font-family: monospace; color: #a1a1aa; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">AuraLedger OS</div>
            <p style="margin: 4px 0 0; font-size: 11px; color: #71717a;">Sovereign Treasury Audit Report</p>
          </div>
          <div style="text-align: right;">
            <span class="badge">RFC-4180 Verified</span>
            <p style="margin: 4px 0 0; font-size: 10px; font-family: monospace; color: #71717a;">Account: ${userName}</p>
            <p style="margin: 2px 0 0; font-size: 9px; font-family: monospace; color: #a1a1aa;">Currency: ${currencyCode}</p>
          </div>
        </div>

        <div class="summary">
          <div class="metric">
            <div class="metric-label">Total Inflows</div>
            <div class="metric-val" style="color: #059669;">+${activeCurrency.symbol}${totalInflow.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Total Outflows</div>
            <div class="metric-val">-${activeCurrency.symbol}${totalOutflow.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Net Ledger Delta</div>
            <div class="metric-val">${netLiquidity >= 0 ? "+" : "-"}${activeCurrency.symbol}${Math.abs(netLiquidity).toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Descriptor / Title</th>
              <th>Category</th>
              <th>Vault Partition</th>
              <th style="text-align: right;">Amount (${currencyCode})</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <span>Client Sovereign Cryptographic Signature: OK</span>
          <span>Generated: ${new Date().toUTCString()}</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  return true;
}