import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import HeroDeck from "./components/HeroDeck";
import CashflowMatrix from "./components/CashflowMatrix";
import CategorySpectrum from "./components/CategorySpectrum";
import RunwayPredictor from "./components/RunwayPredictor";
import AuthModal from "./components/AuthModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import LandingHero from "./components/LandingHero";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentCurrency, setCurrentCurrency] = useState("USD");
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [vaults, setVaults] = useState([]);

  // Auth Dialog Controller
  const [authDialog, setAuthDialog] = useState({ isOpen: false, mode: "signin" });

  // Change Password Dialog Controller
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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

  const loadUserData = useCallback((userId) => {
    const userStorageKey = `auraledger_data_${userId}`;
    const savedData = localStorage.getItem(userStorageKey);

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTransactions(parsed.transactions || []);
      setVaults(parsed.vaults || []);
    } else {
      setTransactions([]);
      setVaults([]);
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
    setVaults([]);
  };

  const handleOpenAuth = (mode = "signin") => {
    setAuthDialog({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthDialog({ isOpen: false, mode: "signin" });
  };

  const handleOpenNewTransaction = () => {
    console.log("Open Fast Ingest Modal for User:", currentUser?.name);
  };

  // 1. If NO USER IS LOGGED IN -> Show Premium Landing Page
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

  // 2. If LOGGED IN -> Show Main FinTech Application Shell
  return (
    <div className="min-h-screen w-full bg-[#fbfaf8] text-zinc-900 pb-20 font-sans">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-orange-200/25 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-80 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/35 to-transparent rounded-full blur-3xl" />
      </div>

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

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8">
        {/* Executive Cockpit Header */}
        <HeroDeck 
          userProfile={currentUser} 
          currentCurrency={currentCurrency}
          transactions={transactions}
          onOpenNewTransaction={handleOpenNewTransaction} 
        />

        {/* Phase 3 Analytics Suite (Dashboard View) */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 sm:space-y-8">
            {/* 3.1 Hardware-Accelerated Cashflow Curve */}
            <CashflowMatrix
              transactions={transactions}
              startingBalance={Number(currentUser.startingBalance) || 200000}
              currentCurrency={currentCurrency}
            />

            {/* 3.2 & 3.3 Outflow Spectrum & Burn Velocity Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <CategorySpectrum 
                transactions={transactions} 
                currentCurrency={currentCurrency} 
              />
              <RunwayPredictor
                currentBalance={Number(currentUser.startingBalance) || 200000}
                transactions={transactions}
                currentCurrency={currentCurrency}
              />
            </div>
          </div>
        )}

        {/* Modular Viewport for Other Tabs */}
        {activeTab !== "dashboard" && (
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
    </div>
  );
}