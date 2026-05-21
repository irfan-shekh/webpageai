"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2 } from "lucide-react";

interface ProjectNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  projectName: string;
  setProjectName: (name: string) => void;
  onSubmit: () => void;
  buttonText: string;
  isLoading?: boolean;
}

export const ProjectNameModal: React.FC<ProjectNameModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  projectName,
  setProjectName,
  onSubmit,
  buttonText,
  isLoading = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl pointer-events-auto"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none p-4"
          >
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#06080d]/80 p-8 backdrop-blur-2xl shadow-2xl pointer-events-auto relative overflow-hidden">
              {/* Decorative radial gradients */}
              <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04)_0,transparent_60%)] pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 relative z-10">
                <div>
                  <h3 className="text-lg font-black text-white">{title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
                </div>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                </button>
              </div>

              <div className="space-y-3 relative z-10">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Website Name</label>
                <input
                  ref={inputRef}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && projectName.trim() && !isLoading) {
                      onSubmit();
                    }
                  }}
                  placeholder="e.g. Aura Coffee Brand"
                  maxLength={60}
                  className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/40 transition-all text-base disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-3 mt-8 relative z-10">
                <motion.button
                  whileHover={isLoading ? undefined : { scale: 1.02 }}
                  whileTap={isLoading ? undefined : { scale: 0.98 }}
                  onClick={onSubmit}
                  disabled={!projectName.trim() || isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {buttonText}
                    </>
                  )}
                </motion.button>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
