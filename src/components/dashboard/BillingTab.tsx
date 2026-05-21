"use client";

import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export const BillingTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white tracking-wide uppercase">Subscription & Resource Quotas</h3>
        <p className="text-xs text-slate-400 mt-1 font-sans">Upgrade compiler tiers, purchase extra domain bindings, and track usage meters.</p>
      </div>

      {/* Grid: Plan card + meters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Subscription Tier Panel (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-white/5 bg-[#06080d]/40 backdrop-blur-xl flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-sans">
                Active Workspace Tier
              </span>
              <h4 className="text-2xl font-black text-white mt-3">Developer Pro Pass</h4>
              <p className="text-xs text-slate-500 mt-1 font-sans">High-priority compiles enabled • Unlimited landing grids</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">$19</span>
              <span className="text-slate-500 text-[10px] block mt-0.5 font-sans">per month</span>
            </div>
          </div>

          <div className="my-6 border-t border-white/5 pt-4 space-y-3.5">
            <div className="flex justify-between text-xs text-slate-400 font-sans">
              <span>Renewal Cycle</span>
              <span className="text-white font-extrabold font-mono">June 21, 2026</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-sans">
              <span>Authorized Domains</span>
              <span className="text-white font-extrabold font-mono">Unlimited (*.webpageai.app)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.success("Redirecting to Stripe dashboard...")}
              className="px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all font-sans"
            >
              Update Payment Details
            </button>
            <button
              onClick={() => toast.success("Pro pass is already active on this workspace.")}
              className="px-5 py-3 rounded-xl bg-emerald-500 text-xs font-extrabold text-white shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all font-sans"
            >
              Tier Active
            </button>
          </div>
        </div>

        {/* 2. Usage Meters Card (1 col) */}
        <div className="p-6 rounded-3xl border border-white/5 bg-[#06080d]/40 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Monthly Usage Quotas</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 font-sans">Allocation limits resets on next cycle</p>
          </div>

          <div className="space-y-5 my-6 flex-1 flex flex-col justify-center">
            {/* Meter 1: AI website compiles */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-sans">
                <span className="text-slate-400">AI Site Compiles</span>
                <span className="text-white font-mono">8 / 50</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "16%" }} />
              </div>
            </div>

            {/* Meter 2: Monthly traffic bandwidth */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-sans">
                <span className="text-slate-400">Total Visits (Leads)</span>
                <span className="text-white font-mono">24.8K / 100K</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: "24.8%" }} />
              </div>
            </div>

            {/* Meter 3: Custom domain slots */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-sans">
                <span className="text-slate-400">Custom Domain Slots</span>
                <span className="text-white font-mono">2 / 5</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "40%" }} />
              </div>
            </div>
          </div>

          <span className="text-[9px] text-slate-500 text-center font-mono">Resets automatically in 30 days</span>
        </div>
      </div>
    </motion.div>
  );
};
