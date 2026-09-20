import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
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
import LandingHero from "./components/LandingHero";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentCurrency, setCurrentCurrency] = useState("USD");
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [vaultTransfers, setVaultTransfers] = useState([]);

  // Auth Dialog Controller
  const [authDialog, setAuthDialog] = useState({ isOpen: false, mode: "signin" });

  // Change Password Dialog Controller
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Fast Ingest Transaction Modal Controller
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

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

  // Top Scroll Reset on Viewport / Tab Transition
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

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

  const handleOpenAuth = (mode = "signin") => {
    setAuthDialog({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthDialog({ isOpen: false, mode: "signin" });
  };

  const handleOpenNewTransaction = () => {
    setIsTxModalOpen(true);
  };

  // Transaction Creation Handler
  const handleCreateTransaction = (newTx) => {
    if (!currentUser) return;

    const updatedTransactions = [newTx, ...transactions];
    setTransactions(updatedTransactions);

    const userStorageKey = `auraledger_data_${currentUser.id}`;
    const existingData = JSON.parse(localStorage.getItem(userStorageKey) || "{}");
    
    const payload = {
      ...existingData,
      transactions: updatedTransactions,
      vaultTransfers
    };

    localStorage.setItem(userStorageKey, JSON.stringify(payload));
  };

  // Transaction Delete Handler
  const handleDeleteTransaction = (txId) => {
    if (!currentUser) return;

    const updatedTransactions = transactions.filter((t) => t.id !== txId);
    setTransactions(updatedTransactions);

    const userStorageKey = `auraledger_data_${currentUser.id}`;
    const existingData = JSON.parse(localStorage.getItem(userStorageKey) || "{}");
    
    const payload = {
      ...existingData,
      transactions: updatedTransactions,
      vaultTransfers
    };

    localStorage.setItem(userStorageKey, JSON.stringify(payload));
  };

  // Internal Vault Transfer Handler
  const handleExecuteVaultTransfer = (transferData) => {
    if (!currentUser) return;

    const updatedTransfers = [transferData, ...vaultTransfers];
    setVaultTransfers(updatedTransfers);

    const userStorageKey = `auraledger_data_${currentUser.id}`;
    const existingData = JSON.parse(localStorage.getItem(userStorageKey) || "{}");

    const payload = {
      ...existingData,
      transactions,
      vaultTransfers: updatedTransfers
    };

    localStorage.setItem(userStorageKey, JSON.stringify(payload));
  };

  // Sovereign Disaster Recovery: Restore Backup Handler
  const handleRestoreBackup = ({ transactions: newTxList, vaultTransfers: newTrList }) => {
    if (!currentUser) return;

    setTransactions(newTxList);
    setVaultTransfers(newTrList);

    const userStorageKey = `auraledger_data_${currentUser.id}`;
    const payload = {
      transactions: newTxList,
      vaultTransfers: newTrList,
      restoredAt: new Date().toISOString()
    };

    localStorage.setItem(userStorageKey, JSON.stringify(payload));
  };

  // Live Net Balance Computation
  const currentNetLiquidity = useMemo(() => {
    const base = Number(currentUser?.startingBalance) || 0;
    const netDelta = transactions.reduce((acc, tx) => {
      const amt = Number(tx.amount) || 0;
      return tx.type === "income" ? acc + amt : acc - amt;
    }, 0);
    return Math.max(0, base + netDelta);
  }, [currentUser, transactions]);

  // Dynamic Vault Balances Computation
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

  // 1. Landing View for Non-authenticated State
  if (!currentUser) {
    return (
      <>
        <LandingHero onOpenAuth={handleOpenAuth} />
        {authDialog.isOpen && (
          <AuthModal
            initialMode={authDialog.mode}
            onAuthSuccess={handleAuthSuccess}
            onClose={handleCloseAuth}
          />
        )}
      </>
    );
  }

  // 2. Main Executive Operating System Shell
  return (
    <div className="min-h-screen w-full bg-[#fbfaf8] text-zinc-900 pb-28 font-sans relative">
      {/* Living Atmospheric Aurora Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.25, 1],
            rotate: [0, 45, 0],
            opacity: [0.22, 0.35, 0.22]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 right-10 w-[650px] h-[650px] bg-gradient-to-bl from-orange-300/30 via-amber-200/20 to-transparent rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{
            scale: [1.1, 0.9, 1.1],
            rotate: [0, -35, 0],
            opacity: [0.18, 0.3, 0.18]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-80 -left-20 w-[550px] h-[550px] bg-gradient-to-tr from-amber-200/35 via-orange-100/20 to-transparent rounded-full blur-[100px]" 
        />
      </div>

      {/* Tactile FinOS Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentCurrency={currentCurrency}
        setCurrentCurrency={setCurrentCurrency}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenNewTransaction={handleOpenNewTransaction}
        onOpenChangePassword={() => setIsPasswordModalOpen(true)}
      />

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 pt-4 space-y-6 sm:space-y-8">
        {/* Executive Cockpit Header */}
        <HeroDeck 
          userProfile={currentUser} 
          currentCurrency={currentCurrency}
          transactions={transactions}
          onOpenNewTransaction={handleOpenNewTransaction} 
        />

        {/* 1. Dashboard Viewport */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 sm:space-y-12 select-none">
            {/* Cashflow Matrix: Flagship Parallax Monolith */}
            <ParallaxMonolithCard
              floatDelay={0}
              accentGlow="rgba(234, 88, 12, 0.2)"
            >
              <CashflowMatrix
                transactions={transactions}
                startingBalance={currentNetLiquidity}
                currentCurrency={currentCurrency}
              />
            </ParallaxMonolithCard>

            {/* Asymmetrical Floating Dual Tier with Botanical Leaf Cradles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 pt-4 sm:[transform-style:preserve-3d]">
              {/* Left Card: Emerald Botanical Canopy Cradle */}
              <BotanicalCradle variant="emerald" floatDelay={0}>
                <CategorySpectrum 
                  transactions={transactions} 
                  currentCurrency={currentCurrency} 
                />
              </BotanicalCradle>

              {/* Right Card: Amber Botanical Canopy Cradle */}
              <BotanicalCradle variant="amber" floatDelay={0.4}>
                <RunwayPredictor
                  currentBalance={currentNetLiquidity}
                  transactions={transactions}
                  currentCurrency={currentCurrency}
                />
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

        {/* 3. Ledger Viewport (Connected to Phase 9 Restore Engine) */}
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

        {/* 5. Executive Workspaces */}
        {activeTab !== "dashboard" && activeTab !== "analytics" && activeTab !== "ledger" && activeTab !== "vaults" && (
          <div className="rounded-3xl border border-dashed border-stone-200/90 p-8 sm:p-12 text-center bg-white/50 backdrop-blur-sm">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Executive Workspace</p>
            <h3 className="text-xl font-bold text-zinc-900 capitalize mt-1">{activeTab} Viewport</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Active Tenant: <strong className="text-zinc-800">{currentUser.name}</strong> • Isolated Vault ID: <span className="font-mono">{currentUser.id}</span>
            </p>
          </div>
        )}
      </main>

      {/* Change Password Dialog Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        currentUser={currentUser}
        onPasswordUpdated={(updatedUser) => setCurrentUser(updatedUser)}
      />

      {/* Fast Ingestion Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSubmit={handleCreateTransaction}
        currentCurrency={currentCurrency}
      />
    </div>
  );
}