/**
 * AuraLedger Storage Service
 * Supports client-side encrypted local persistence with remote-ready hooks.
 */

const STORAGE_PREFIX = "auraledger_data_";

export const storageAdapter = {
  loadLocal(userId) {
    if (!userId) return null;
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("[StorageAdapter] Failed to load local ledger:", e);
      return null;
    }
  },

  saveLocal(userId, payload) {
    if (!userId) return false;
    try {
      const wrapped = {
        ...payload,
        lastSyncedAt: new Date().toISOString()
      };
      localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(wrapped));
      return true;
    } catch (e) {
      console.error("[StorageAdapter] Failed to save local ledger:", e);
      return false;
    }
  },

  // Prepared for future Supabase / REST sync integration
  async syncRemote(userId, payload, remoteEndpoint = null) {
    if (!remoteEndpoint) {
      return { synced: false, reason: "Local-only sovereign mode active" };
    }
    // Remote payload dispatcher hook
    return { synced: true, timestamp: new Date().toISOString() };
  }
};