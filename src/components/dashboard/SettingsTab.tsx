"use client";

import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface SettingsTabProps {
  userName?: string | null;
  userEmail?: string | null;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ userName, userEmail }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl space-y-8"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white tracking-wide uppercase">Workspace & Compiler Settings</h3>
        <p className="text-xs text-slate-400 mt-1 font-sans">Configure global AI templates, active models, and developer integrations.</p>
      </div>

      {/* Form Settings Blocks */}
      <div className="space-y-6">
        {/* 1. Account Settings Card */}
        <div className="p-6 rounded-2xl border border-white/5 bg-[#06080d]/40 backdrop-blur-xl space-y-5">
          <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2">Account Profile</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Profile Name</label>
              <input
                type="text"
                defaultValue={userName || "Developer Guest"}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 cursor-not-allowed focus:outline-none text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Registered Email</label>
              <input
                type="text"
                defaultValue={userEmail || "guest@webpageai.app"}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 cursor-not-allowed focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* 2. AI Model Selection Card */}
        <div className="p-6 rounded-2xl border border-white/5 bg-[#06080d]/40 backdrop-blur-xl space-y-5">
          <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2">AI Compiler Presets</h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Core Synthesis Engine</label>
              <select className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/40 text-xs">
                <option>Gemini 2.5 Flash Engine (Optimized & Rapid)</option>
                <option>Gemini 2.5 Pro Compiler (Deep Bento Integration)</option>
                <option>DeepSeek-Coder v2 Pipeline (Precision Scripts)</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider ml-1">
                <span className="text-slate-400 font-sans">Creative Style Variance</span>
                <span className="text-emerald-400 font-mono">0.45 (Balanced)</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                defaultValue="0.45"
                className="w-full accent-emerald-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[9px] text-slate-500 block leading-relaxed font-sans">
                Lower variance produces structured layouts with highly consistent color tokens. Higher variance promotes unusual shapes, gradients, and layouts.
              </span>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-300">Live Code Auto-Format</h5>
                <p className="text-[10px] text-slate-500 mt-0.5 font-sans">Prettify and clean-compile React structure on saves</p>
              </div>
              <button className="w-10 h-6 bg-emerald-500 rounded-full p-0.5 flex items-center justify-end transition-all">
                <span className="w-5 h-5 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.success("Settings saved successfully!")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
          >
            Save Options
          </button>
        </div>
      </div>
    </motion.div>
  );
};
