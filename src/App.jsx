import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import HeroDeck from "./components/HeroDeck";
import CashflowMatrix from "./components/CashflowMatrix";
import CategorySpectrum from "./components/CategorySpectrum";
import RunwayPredictor from "./components/RunwayPredictor";
import LedgerViewport from "./components/LedgerViewport";
import AnalyticsViewport from "./components/AnalyticsViewport";
import VaultsViewport from "./components/VaultsViewport";
import ParallaxMonolithCard from "./components/ParallaxMonolithCard";
import BotanicalCradle from "./components/BotanicalCradle";
import AuthModal from "./components/AuthModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import TransactionModal from "./components/TransactionModal";
import CommandPalette from "./components/CommandPalette";
import RestoreModal from "./components/RestoreModal";
import LandingHero from "./components/LandingHero";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentCurrency, setCurrentCurrency] = useState("USD");
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [vaultTransfers, setVaultTransfers] = useState([]);

  // Modals & Palette Controllers
  const [authDialog, setAuthDialog] = useState({ isOpen: false, mode: "signin" });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  // Initial User Session Loader
  useEffect(() => {
    const activeUserId = localStorage.getItem("auraledger_active_user_id");
    const existingUsers = JSON.parse(localStorage.getItem("auraledger_users") || "[]");

    if (activeUserId) {
      const found = existingUsers.find((u) => u.id === activeUserId);
      if (found) {
        setCurrentUser(found);
        setCurrentCurrency(found.currency || "USD");
        loadUserData(found.id);
      }
    }
  }, []);

  // Top Scroll Reset on Tab Switch
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  // Global Keyboard Shortcuts Engine
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is inside an input, textarea, or select
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputActive = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

      // 1. Cmd+K / Ctrl+K Toggle (Always Active)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (isInputActive || isCommandPaletteOpen || isTxModalOpen || isPasswordModalOpen) {
        return;
      }

      // 2. Single-Key Sovereign Shortcuts
      switch (e.key.toLowerCase()) {
        case "n":
          e.preventDefault();
          setIsTxModalOpen(true);
          break;
        case "d":
          e.preventDefault();
          setActiveTab("dashboard");
          break;
        case "l":
          e.preventDefault();
          setActiveTab("ledger");
          break;
        case "a":
          e.preventDefault();
          setActiveTab("analytics");
          break;
        case "v":
          e.preventDefault();
          setActiveTab("vaults");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, isTxModalOpen, isPasswordModalOpen]);

  const loadUserData = useCallback((userId) => {
    const userStorageKey = `auraledger_data_${userId}`;
    const savedData = localStorage.getItem(userStorageKey);

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTransactions(parsed.transactions || []);
      setVaultTransfers(parsed.vaultTransfers || []);
    } else {
      setTransactions([]);
      setVaultTransfers([]);
    }
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setCurrentCurrency(user.currency || "USD");
    loadUserData(user.id);
    setAuthDialog({ isOpen: false, mode: "signin" });
  };

  const handleSignOut = () => {
    localStorage.removeItem("auraledger_active_user_id");
    setCurrentUser(null);
    setTransactions([]);
    setVaultTransfers([]);
  };

  // Transaction Actions
  const handleCreateTransaction = (newTx) => {
    if (!currentUser) return;
    const updated = [newTx, ...transactions];
    setTransactions(updated);

    const userStorageKey = `auraledger_data_${currentUser.id}`;
    const existing = JSON.parse(localStorage.getItem(userStorageKey) || "{}");
    localStorage.setItem(userStorageKey, JSON.stringify({ ...existing, transactions: updated, vaultTransfers }));
  };

  const handleDeleteTransaction = (txId) => {
    if (!currentUser) return;
    const updated = transactions.filter((t) => t.id !== txId);
    setTransactions(updated);

    const userStorageKey = `auraledger_data_${currentUser.id}`;
    const existing = JSON.parse(localStorage.getItem(userStorageKey) || "{}");
    localStorage.setItem(userStorageKey, JSON.stringify({ ...existing, transactions: updated, vaultTransfers }));
  };

  const handleExecuteVaultTransfer = (transferData) => {
    if (!currentUser) return;
    const updated = [transferData, ...vaultTransfers];
    setVaultTransfers(updated);

    const userStorageKey = `auraledger_data_${currentUser.id}`;
    const existing = JSON.parse(localStorage.getItem(userStorageKey) || "{}");
    localStorage.setItem(userStorageKey, JSON.stringify({ ...existing, transactions, vaultTransfers: updated }));
  };

  const handleRestoreBackup = ({ transactions: newTxList, vaultTransfers: newTrList }) => {
    if (!currentUser) return;
    setTransactions(newTxList);
    setVaultTransfers(newTrList);

    const userStorageKey = `auraledger_data_${currentUser.id}`;
    localStorage.setItem(userStorageKey, JSON.stringify({
      transactions: newTxList,
      vaultTransfers: newTrList,
      restoredAt: new Date().toISOString()
    }));
  };

  // Compute Live Balances
  const currentNetLiquidity = useMemo(() => {
    const base = Number(currentUser?.startingBalance) || 0;
    const netDelta = transactions.reduce((acc, tx) => {
      const amt = Number(tx.amount) || 0;
      return tx.type === "income" ? acc + amt : acc - amt;
    }, 0);
    return Math.max(0, base + netDelta);
  }, [currentUser, transactions]);

  const vaultBalances = useMemo(() => {
    const totalBase = Number(currentUser?.startingBalance) || 0;
    let primary = totalBase * 0.5;
    let reserve = totalBase * 0.3;
    let growth = totalBase * 0.2;

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      const factor = tx.type === "income" ? 1 : -1;
      const vId = tx.vaultId || "primary";

      if (vId === "reserve") reserve += amt * factor;
      else if (vId === "growth") growth += amt * factor;
      else primary += amt * factor;
    });

    vaultTransfers.forEach((tr) => {
      const amt = Number(tr.amount) || 0;
      if (tr.sourceVault === "primary") primary -= amt;
      if (tr.sourceVault === "reserve") reserve -= amt;
      if (tr.sourceVault === "growth") growth -= amt;

      if (tr.targetVault === "primary") primary += amt;
      if (tr.targetVault === "reserve") reserve += amt;
      if (tr.targetVault === "growth") growth += amt;
    });

    return {
      primary: Math.max(0, Math.round(primary)),
      reserve: Math.max(0, Math.round(reserve)),
      growth: Math.max(0, Math.round(growth))
    };
  }, [currentUser, transactions, vaultTransfers]);

  if (!currentUser) {
    return (
      <>
        <LandingHero onOpenAuth={(mode) => setAuthDialog({ isOpen: true, mode: mode || "signin" })} />
        {authDialog.isOpen && (
          <AuthModal
            initialMode={authDialog.mode}
            onAuthSuccess={handleAuthSuccess}
            onClose={() => setAuthDialog({ isOpen: false, mode: "signin" })}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fbfaf8] text-zinc-900 pb-28 font-sans relative">
      {/* Living Atmospheric Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 right-10 w-[650px] h-[650px] bg-gradient-to-bl from-orange-300/30 via-amber-200/20 to-transparent rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1.1, 0.9, 1.1], rotate: [0, -35, 0], opacity: [0.18, 0.3, 0.18] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-80 -left-20 w-[550px] h-[550px] bg-gradient-to-tr from-amber-200/35 via-orange-100/20 to-transparent rounded-full blur-[100px]" 
        />
      </div>

      {/* Tactile Navbar with Cmd+K Trigger Badge */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentCurrency={currentCurrency}
        setCurrentCurrency={setCurrentCurrency}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenNewTransaction={() => setIsTxModalOpen(true)}
        onOpenChangePassword={() => setIsPasswordModalOpen(true)}
      />

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 pt-4 space-y-6 sm:space-y-8">
        <HeroDeck 
          userProfile={currentUser} 
          currentCurrency={currentCurrency}
          transactions={transactions}
          onOpenNewTransaction={() => setIsTxModalOpen(true)} 
        />

        {/* 1. Dashboard Viewport */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 sm:space-y-12 select-none">
            <ParallaxMonolithCard floatDelay={0} accentGlow="rgba(234, 88, 12, 0.2)">
              <CashflowMatrix
                transactions={transactions}
                startingBalance={currentNetLiquidity}
                currentCurrency={currentCurrency}
              />
            </ParallaxMonolithCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 pt-4 sm:[transform-style:preserve-3d]">
              <BotanicalCradle variant="emerald" floatDelay={0}>
                <CategorySpectrum transactions={transactions} currentCurrency={currentCurrency} />
              </BotanicalCradle>
              <BotanicalCradle variant="amber" floatDelay={0.4}>
                <RunwayPredictor currentBalance={currentNetLiquidity} transactions={transactions} currentCurrency={currentCurrency} />
              </BotanicalCradle>
            </div>
          </div>
        )}

        {/* 2. Analytics Viewport */}
        {activeTab === "analytics" && (
          <AnalyticsViewport
            transactions={transactions}
            currentNetLiquidity={currentNetLiquidity}
            currentCurrency={currentCurrency}
          />
        )}

        {/* 3. Ledger Viewport */}
        {activeTab === "ledger" && (
          <LedgerViewport
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            currentCurrency={currentCurrency}
            currentUser={currentUser}
            vaultTransfers={vaultTransfers}
            onRestoreBackup={handleRestoreBackup}
          />
        )}

        {/* 4. Vaults Viewport */}
        {activeTab === "vaults" && (
          <VaultsViewport
            vaultBalances={vaultBalances}
            totalLiquidity={currentNetLiquidity}
            onExecuteTransfer={handleExecuteVaultTransfer}
            transferHistory={vaultTransfers}
            currentCurrency={currentCurrency}
          />
        )}
      </main>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        onOpenNewTransaction={() => setIsTxModalOpen(true)}
        onOpenRestore={() => setIsRestoreModalOpen(true)}
        onOpenChangePassword={() => setIsPasswordModalOpen(true)}
        setCurrentCurrency={setCurrentCurrency}
        currentCurrency={currentCurrency}
      />

      {/* Modals */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        currentUser={currentUser}
        onPasswordUpdated={(u) => setCurrentUser(u)}
      />

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSubmit={handleCreateTransaction}
        currentCurrency={currentCurrency}
      />

      <RestoreModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onRestoreSuccess={handleRestoreBackup}
      />
    </div>
  );
}