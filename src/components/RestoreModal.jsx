import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, 
  FileCode2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RotateCcw, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { parseAndValidateBackup } from "../utils/importer";

export default function RestoreModal({ isOpen, onClose, onRestoreSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file) => {
    setError(null);
    setPreviewData(null);
    setIsProcessing(true);

    try {
      const validated = await parseAndValidateBackup(file);
      setPreviewData(validated);
    } catch (err) {
      setError(err.message || "Failed to validate backup archive.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleConfirmRestore = () => {
    if (!previewData) return;
    onRestoreSuccess({
      transactions: previewData.transactions,
      vaultTransfers: previewData.vaultTransfers
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 select-none font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 450, damping: 30 }}
        className="relative z-10 w-full max-w-lg rounded-[32px] bg-white border border-stone-200/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] p-6 sm:p-8 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200/60">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950 font-mono leading-tight">
                Disaster Recovery
              </h3>
              <p className="text-[11px] font-mono text-stone-400">Restore Sovereign JSON Archive</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dropzone Stage */}
        {!previewData ? (
          <div className="mt-5 space-y-4 font-mono">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-orange-500 bg-orange-50/50"
                  : "border-stone-200 bg-stone-50/60 hover:bg-stone-50 hover:border-stone-300"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />

              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-400 mb-3">
                <UploadCloud className="w-6 h-6 text-orange-600" />
              </div>

              <p className="text-xs font-bold text-zinc-900">
                Click to browse or drop backup JSON
              </p>
              <p className="text-[10px] text-stone-400 mt-1">
                AuraLedger_Backup_*.json • Zero-Knowledge Local Parse
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          /* Preview Stage */
          <div className="mt-5 space-y-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Valid Archive Verified</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-1">
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase">Entries</span>
                  <strong className="text-zinc-900">{previewData.transactionsCount} Transactions</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase">Allocations</span>
                  <strong className="text-zinc-900">{previewData.transfersCount} Transfers</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase">Schema</span>
                  <span className="text-zinc-700">{previewData.schemaVersion}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase">Original Operator</span>
                  <span className="text-zinc-700 truncate block">{previewData.operator?.name || "Anonymous"}</span>
                </div>
              </div>
            </div>

            {/* Overwrite Warning Banner */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-800 text-[11px]">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                Restoring this backup will replace current active transactions with the uploaded archive records.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewData(null)}
                className="w-1/2 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-stone-600 transition-all cursor-pointer"
              >
                Choose Other
              </button>

              <button
                type="button"
                onClick={handleConfirmRestore}
                className="w-1/2 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Commit Restore</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}