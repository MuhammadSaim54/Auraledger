/**
 * AuraLedger Sovereign Backup Ingestion Engine
 * Parses, validates, and normalizes client-exported JSON cold backups.
 */

export async function parseAndValidateBackup(file) {
  if (!file) {
    throw new Error("No backup archive selected.");
  }

  if (!file.name.endsWith(".json") && file.type !== "application/json") {
    throw new Error("Invalid file format. Please upload an AuraLedger .json backup.");
  }

  const rawText = await file.text();
  let parsed;

  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    throw new Error("Corrupted backup file: JSON syntax could not be parsed.");
  }

  // Schema & Root Integrity Checks
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Malformed backup file structure.");
  }

  if (!parsed.schemaVersion && !parsed.ledger) {
    throw new Error("Unrecognized schema: Missing AuraLedger signature parameters.");
  }

  const transactions = Array.isArray(parsed.ledger?.transactions)
    ? parsed.ledger.transactions
    : [];

  const vaultTransfers = Array.isArray(parsed.ledger?.vaultTransfers)
    ? parsed.ledger.vaultTransfers
    : [];

  // Sanitize transactions
  const sanitizedTransactions = transactions.map((tx, idx) => ({
    id: tx.id || `restored_${Date.now()}_${idx}`,
    title: tx.title || tx.descriptor || "Restored Entry",
    amount: Math.abs(Number(tx.amount)) || 0,
    type: tx.type === "income" ? "income" : "expense",
    category: tx.category || "groceries",
    vaultId: tx.vaultId || "primary",
    tag: tx.tag || "#restored",
    date: tx.date || new Date().toISOString()
  }));

  // Sanitize transfers
  const sanitizedTransfers = vaultTransfers.map((tr, idx) => ({
    id: tr.id || `transfer_${Date.now()}_${idx}`,
    amount: Math.abs(Number(tr.amount)) || 0,
    sourceVault: tr.sourceVault || "primary",
    targetVault: tr.targetVault || "reserve",
    date: tr.date || new Date().toISOString(),
    note: tr.note || "Restored allocation"
  }));

  return {
    operator: parsed.operator || null,
    exportedAt: parsed.exportedAt || null,
    schemaVersion: parsed.schemaVersion || "legacy",
    transactionsCount: sanitizedTransactions.length,
    transfersCount: sanitizedTransfers.length,
    transactions: sanitizedTransactions,
    vaultTransfers: sanitizedTransfers
  };
}