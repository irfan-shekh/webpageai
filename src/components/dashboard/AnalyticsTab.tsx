"use client";

import React from "react";
import { motion } from "framer-motion";

export const AnalyticsTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white tracking-wide uppercase">Workspace Analytics</h3>
        <p className="text-xs text-slate-400 mt-1 font-sans">Real-time compilation metrics, conversion insights, and traffic flow.</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Website Visits", val: "24,812", change: "+14.2% month-over-month", color: "text-emerald-400" },
          { label: "Compilation Rate", val: "99.8%", change: "Zero failed builds in 30d", color: "text-cyan-400" },
          { label: "Avg. Engagement Time", val: "2m 45s", change: "+18s avg session length", color: "text-purple-400" },
          { label: "Estimated Leads", val: "1,142", change: "+8.4% conversion velocity", color: "text-amber-400" }
        ].map((stat, idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-[#06080d]/40 backdrop-blur-xl animate-pulse-slow">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">{stat.label}</span>
            <h4 className={`text-3xl font-black mt-2 tracking-tight ${stat.color}`}>{stat.val}</h4>
            <span className="text-[10px] text-slate-400 mt-2 block font-medium font-sans">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Central Dashboard Graph Card & Channels Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulated Chart (Left 2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-white/5 bg-[#06080d]/45 backdrop-blur-xl flex flex-col justify-between h-96">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-white">Daily Traffic Overview</h4>
              <p className="text-[10px] text-slate-500 font-sans">Visitor velocity index across active domains</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 px-3 py-1 bg-white/5 rounded-lg border border-white/5">Last 7 Days</span>
          </div>

          {/* Glassmorphic Columns Graph */}
          <div className="flex items-end justify-between gap-3 h-52 mt-6 px-4">
            {[
              { day: "Mon", height: "h-[35%]", val: "2.1K" },
              { day: "Tue", height: "h-[50%]", val: "3.2K" },
              { day: "Wed", height: "h-[40%]", val: "2.5K" },
              { day: "Thu", height: "h-[75%]", val: "4.8K" },
              { day: "Fri", height: "h-[60%]", val: "3.9K" },
              { day: "Sat", height: "h-[85%]", val: "5.4K" },
              { day: "Sun", height: "h-[95%]", val: "6.2K" }
            ].map((g, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono text-emerald-400 font-black mb-1">
                  {g.val}
                </div>
                <div className={`w-full ${g.height} rounded-t-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/10 group-hover:scale-x-105 transition-all duration-300 relative`}>
                  <div className="absolute inset-0 bg-emerald-400/20 blur-[15px] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] text-slate-500 mt-2 font-mono">{g.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Channels Table (Right 1 col) */}
        <div className="p-6 rounded-3xl border border-white/5 bg-[#06080d]/45 backdrop-blur-xl h-96 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Acquisition Channels</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 font-sans">Top referrers feeding lead tunnels</p>
          </div>

          <div className="space-y-4 my-4 flex-1 flex flex-col justify-center">
            {[
              { name: "Direct Traffic", val: "48%", color: "bg-emerald-500" },
              { name: "Google Organic Search", val: "32%", color: "bg-cyan-500" },
              { name: "Social Channels", val: "12%", color: "bg-purple-500" },
              { name: "Partner Referrals", val: "8%", color: "bg-amber-500" }
            ].map((ch, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-slate-400 font-medium">{ch.name}</span>
                  <span className="text-white font-extrabold">{ch.val}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full ${ch.color}`} style={{ width: ch.val }} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[9px] text-slate-500 text-center border-t border-white/5 pt-3">
            Active updates enabled • Powered by WebpageAI Engine
          </div>
        </div>
      </div>
    </motion.div>
  );
};
