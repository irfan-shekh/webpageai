"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import PreviewIframe from "@/components/PreviewIframe";

interface Template {
  id: string;
  name: string;
  desc?: string;
  accent: string;
  badge: string;
  prompt?: string;
  isUserProject?: boolean;
  htmlContent?: string;
}

interface TemplateBrowserPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  onUseTemplate: (tpl: Template) => void;
}

export const TemplateBrowserPreview: React.FC<TemplateBrowserPreviewProps> = ({
  isOpen,
  onClose,
  template,
  onUseTemplate
}) => {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [activeMockPage, setActiveMockPage] = useState("Home");
  const [isAnnual, setIsAnnual] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  // Reset active page to Home whenever template changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setActiveMockPage("Home");
        setSubmittingForm(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, template]);

  const handleMockFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    setTimeout(() => {
      setSubmittingForm(false);
      toast.success("Mock form submitted! (Website routing simulation)");
    }, 800);
  };

  if (!template) return null;

  // Visual Theme configurations based on template accent
  const accentText = 
    template.accent === "emerald" ? "text-emerald-400" :
    template.accent === "teal" ? "text-teal-400" :
    template.accent === "amber" ? "text-amber-400" :
    template.accent === "rose" ? "text-rose-400" :
    template.accent === "cyan" ? "text-cyan-400" : "text-emerald-400";

  const accentBg = 
    template.accent === "emerald" ? "bg-emerald-500" :
    template.accent === "teal" ? "bg-teal-500" :
    template.accent === "amber" ? "bg-amber-500" :
    template.accent === "rose" ? "bg-rose-500" :
    template.accent === "cyan" ? "bg-cyan-500" : "bg-emerald-500";

  const accentBorder = 
    template.accent === "emerald" ? "border-emerald-500/20" :
    template.accent === "teal" ? "border-teal-500/20" :
    template.accent === "amber" ? "border-amber-500/20" :
    template.accent === "rose" ? "border-rose-500/20" :
    template.accent === "cyan" ? "border-cyan-500/20" : "border-emerald-500/20";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl pointer-events-auto"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div className="w-full h-full max-w-6xl bg-[#03060c] border border-white/10 rounded-3xl overflow-hidden flex flex-col pointer-events-auto shadow-2xl relative">
              
              {/* Top ambient glow */}
              <div className="absolute top-[-30%] right-[-20%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

              {/* simulated Browser Chrome header */}
              <div className="px-6 py-4 border-b border-white/5 bg-black/45 flex items-center justify-between flex-shrink-0 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500/20 border border-red-500/40" />
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold bg-white/5 px-2.5 py-0.5 rounded border border-white/5">
                    Interactive SPA Simulator
                  </span>
                </div>

                {/* URL representation */}
                <div className="hidden md:flex items-center gap-2 bg-black/50 border border-white/5 px-6 py-1.5 rounded-xl w-96 text-[11px] text-slate-400 font-mono">
                  <span className="text-emerald-400 select-none">https://</span>
                  <span className="text-white truncate">
                    {template.isUserProject 
                      ? `${template.name.toLowerCase().replace(/\s+/g, "-")}.webpageai.app/`
                      : `${template.id}.webpageai.app/${activeMockPage.toLowerCase().replace(" ", "-")}`
                    }
                  </span>
                </div>

                {/* Device switches and close */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                        previewDevice === "desktop" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                        previewDevice === "mobile" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Mobile
                    </button>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Viewport content */}
              <div className="flex-1 overflow-y-auto bg-[#020408] p-6 md:p-12 relative z-10 flex justify-center items-start">
                <div
                  className={`w-full transition-all duration-300 ${
                    previewDevice === "mobile" 
                      ? "max-w-sm border border-white/10 rounded-[32px] p-4 bg-[#05080f] shadow-2xl relative overflow-hidden" 
                      : "max-w-5xl"
                  }`}
                >
                  {/* simulated Mobile Frame details */}
                  {previewDevice === "mobile" && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-black rounded-full z-30 flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 0. DYNAMIC USER PROJECT COMPILER PREVIEW */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {template.isUserProject && (
                    <div className="w-full h-[65vh] min-h-[480px] bg-white rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                      <PreviewIframe htmlContent={template.htmlContent || ""} className="w-full h-full border-0 bg-white" />
                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 1. SAAS COMPILER INTERACTIVE ROUTER */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {template.id === "saas" && (
                    <div className="space-y-12">
                      {/* Navbar Router */}
                      <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                        <span className="text-sm font-extrabold text-white flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveMockPage("Home")}>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          CloudSync
                        </span>
                        <div className="flex gap-4 text-[10px] font-bold tracking-wide font-sans">
                          {["Home", "Features", "Pricing", "Contact"].map((p) => (
                            <span
                              key={p}
                              onClick={() => setActiveMockPage(p)}
                              className={`cursor-pointer transition-colors ${
                                activeMockPage === p ? "text-emerald-400" : "text-slate-400 hover:text-white"
                              }`}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Content sections */}
                      <AnimatePresence mode="wait">
                        {activeMockPage === "Home" && (
                          <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                          >
                            <div className="text-center space-y-4 py-6">
                              <span className="text-[9px] font-extrabold px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full uppercase tracking-wider">
                                Sync Engine v2.0
                              </span>
                              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">
                                Sync your enterprise data <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">in real-time</span>
                              </h1>
                              <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed font-sans">
                                Deploy secure distributed databases, sync states globally, and track anomalies inside a single glowing command center.
                              </p>
                              <div className="flex justify-center gap-3">
                                <span className="px-4 py-2 rounded-lg bg-emerald-500 text-[10px] font-extrabold text-white cursor-pointer" onClick={() => setActiveMockPage("Pricing")}>
                                  Start Free Trial
                                </span>
                                <span className="px-4 py-2 rounded-lg bg-white/5 text-[10px] font-extrabold text-slate-300 border border-white/5 cursor-pointer hover:bg-white/10" onClick={() => setActiveMockPage("Features")}>
                                  Explore Features
                                </span>
                              </div>
                            </div>

                            {/* Thematic Visual Preview Asset */}
                            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative my-6">
                              <img src="/templates/saas.png" alt="SaaS Dashboard preview" className="w-full h-auto object-cover" />
                            </div>

                            {/* Bento Grid widgets */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { title: "Zero Trust Encrypted", desc: "Military-grade end-to-end data locking standards." },
                                { title: "Global CDN Edge", desc: "State assets delivered globally at sub-5ms delays." },
                                { title: "Smart Automations", desc: "Execute custom web node trigger queries instantly." }
                              ].map((b, idx) => (
                                <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-black/45 hover:border-emerald-500/25 transition-all">
                                  <h4 className="text-xs font-bold text-white">{b.title}</h4>
                                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed font-sans">{b.desc}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Features" && (
                          <motion.div
                            key="features"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6 py-4"
                          >
                            <div className="text-center space-y-2">
                              <h2 className="text-xl font-bold text-white">Full-Stack Cloud Capabilities</h2>
                              <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">Everything you need to orchestrate live distributed grids.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                              {[
                                { name: "Realtime Socket Pipelines", desc: "Direct packet streams feeding UI models instantly without HTTP requests." },
                                { name: "Global Database Replications", desc: "Active multi-master nodes distributed dynamically across 30+ regional edge centers." },
                                { name: "Anomaly Analytics AI", desc: "Auto-detect network bottlenecks, database locking alerts, and API token spikes." },
                                { name: "Infinite Serverless Scaling", desc: "Auto-adjust bandwidth triggers to accommodate traffic flow automatically." }
                              ].map((f, i) => (
                                <div key={i} className="p-5 rounded-2xl border border-white/5 bg-[#06080e]/40 space-y-2">
                                  <h4 className="text-xs font-bold text-emerald-400">{f.name}</h4>
                                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{f.desc}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Pricing" && (
                          <motion.div
                            key="pricing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6 py-4"
                          >
                            <div className="text-center space-y-2">
                              <h2 className="text-xl font-bold text-white">Clear & Flexible Plans</h2>
                              <p className="text-xs text-slate-400 font-sans">Pick a framework tier to accelerate compilation nodes.</p>

                              {/* Interactive Monthly/Annual switch */}
                              <div className="flex justify-center items-center gap-3 mt-4">
                                <span className={`text-[10px] font-bold ${!isAnnual ? "text-white" : "text-slate-500"}`}>Monthly</span>
                                <button
                                  onClick={() => setIsAnnual(!isAnnual)}
                                  className="w-10 h-5.5 bg-emerald-500/20 border border-white/5 rounded-full p-0.5 flex items-center transition-all"
                                >
                                  <div className={`w-4 h-4 rounded-full bg-emerald-500 transition-all ${isAnnual ? "translate-x-4.5" : "translate-x-0"}`} />
                                </button>
                                <span className={`text-[10px] font-bold ${isAnnual ? "text-emerald-400" : "text-slate-500"} flex items-center gap-1`}>
                                  Yearly <span className="text-[9px] text-emerald-300 font-mono bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/10">Save 20%</span>
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                              {[
                                { name: "Developer Starter", price: 0, desc: "Perfect for compiling mock UI wireframes." },
                                { name: "Professional Pass", price: isAnnual ? 15 : 19, desc: "High-priority LLM compile cycles.", active: true },
                                { name: "Enterprise Custom", price: 99, desc: "Custom SLA, dedicated model nodes." }
                              ].map((p, i) => (
                                <div
                                  key={i}
                                  className={`p-5 rounded-2xl border flex flex-col justify-between h-64 ${
                                    p.active ? "bg-emerald-500/5 border-emerald-500/30" : "bg-black/45 border-white/5"
                                  }`}
                                >
                                  <div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.name}</span>
                                    <h3 className="text-2xl font-black text-white mt-2">
                                      ${p.price}
                                      <span className="text-xs text-slate-500 font-normal">/mo</span>
                                    </h3>
                                    <p className="text-[10px] text-slate-400 mt-2 font-sans">{p.desc}</p>
                                  </div>
                                  <button
                                    onClick={() => toast.success(`Selected mock plan: ${p.name}`)}
                                    className={`w-full py-2.5 rounded-xl text-[10px] font-bold ${
                                      p.active ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
                                    }`}
                                  >
                                    Get Started
                                  </button>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Contact" && (
                          <motion.div
                            key="contact"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-md mx-auto py-4 space-y-4"
                          >
                            <div className="text-center space-y-2">
                              <h2 className="text-xl font-bold text-white">Let&apos;s Synthesize Your Stack</h2>
                              <p className="text-xs text-slate-400 font-sans">Submit a brief to request a dedicated compile region.</p>
                            </div>
                            <form onSubmit={handleMockFormSubmit} className="space-y-3.5 bg-black/40 p-5 rounded-2xl border border-white/5 mt-4">
                              <input
                                required
                                type="text"
                                placeholder="Developer Name"
                                className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-xs focus:outline-none focus:border-emerald-500"
                              />
                              <input
                                required
                                type="email"
                                placeholder="Work Email"
                                className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-xs focus:outline-none focus:border-emerald-500"
                              />
                              <textarea
                                required
                                rows={3}
                                placeholder="Describe project scale..."
                                className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-xs focus:outline-none focus:border-emerald-500"
                              />
                              <button
                                type="submit"
                                disabled={submittingForm}
                                className="w-full py-3 rounded-lg bg-emerald-500 text-xs font-bold text-white hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                              >
                                {submittingForm ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Request Region Node"}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 2. PORTFOLIO COMPILER INTERACTIVE ROUTER */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {template.id === "portfolio" && (
                    <div className="space-y-10">
                      {/* Header Router */}
                      <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                        <span className="text-[10px] font-mono tracking-widest text-slate-500 cursor-pointer" onClick={() => setActiveMockPage("Home")}>
                          NEXUS / STUDIOS
                        </span>
                        <div className="flex gap-4 text-[10px] font-mono tracking-widest uppercase">
                          {["Home", "Works", "About", "Contact"].map((p) => (
                            <span
                              key={p}
                              onClick={() => setActiveMockPage(p)}
                              className={`cursor-pointer transition-all ${
                                activeMockPage === p ? "text-teal-400 font-bold" : "text-slate-400 hover:text-white"
                              }`}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {activeMockPage === "Home" && (
                          <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8 py-4"
                          >
                            <div className="space-y-4 py-6">
                              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
                                WE SHAPE HIGH-END <span className="text-teal-400">DIGITAL MASTERPIECES</span>
                              </h1>
                              <p className="text-xs text-slate-400 max-w-lg leading-relaxed font-mono">
                                Independent design agency crafting responsive React codebases, custom UI presets, and elegant interactive platforms.
                              </p>
                            </div>

                            {/* Thematic Visual Preview Asset */}
                            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative my-6">
                              <img src="/templates/portfolio.png" alt="Nexus Agency Creative Showcase" className="w-full h-36 object-cover" />
                            </div>

                            {/* Works grid preview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { name: "DeFi System Design", type: "Web3 Portal", tag: "2026" },
                                { name: "Abstract Fluid Graphics", type: "WebGL Visualizer", tag: "2025" }
                              ].map((pr, i) => (
                                <div key={i} className="group p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                                  <div className="rounded-lg overflow-hidden border border-white/5 shadow-lg my-1">
                                    <img src="/templates/portfolio.png" alt="WebGL visualizer mockup" className="w-full h-24 object-cover" />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-white">{pr.name}</h4>
                                    <span className="text-[9px] font-mono text-teal-400">{pr.tag}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Works" && (
                          <motion.div
                            key="works"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4"
                          >
                            <h2 className="text-xl font-bold text-white font-mono tracking-wider">PROJECT INDEX //</h2>
                            <div className="space-y-3">
                              {[
                                { client: "Decentralized Liquidity V3", tag: "SaaS UI Core", year: "2026" },
                                { client: "Quantum Ledger Dashboard", tag: "Fintech Platform", year: "2026" },
                                { client: "Voxel Audio Synth Sandbox", tag: "WebGL Engine", year: "2025" },
                                { client: "Aura Coffee E-Commerce", tag: "Bespoke Portal", year: "2025" }
                              ].map((w, idx) => (
                                <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5 hover:border-teal-500/20 transition-colors group cursor-pointer">
                                  <div>
                                    <span className="text-xs text-white font-mono font-bold group-hover:text-teal-400 transition-colors">{w.client}</span>
                                    <span className="text-[9px] text-slate-500 ml-3 font-mono">[{w.tag}]</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">{w.year}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "About" && (
                          <motion.div
                            key="about"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4 font-mono text-xs text-slate-400 leading-relaxed"
                          >
                            <h2 className="text-xl font-bold text-white tracking-wider">THE STUDIO //</h2>
                            <p>
                              Nexus Studios bridges pure design aesthetics with clean-compiled engineering. We believe that frontend design is not just layout alignment—it is a visual narrative.
                            </p>
                            <div className="border-t border-white/5 pt-4 space-y-4">
                              <h3 className="text-white font-bold tracking-widest text-[10px] uppercase">Agency Timeline</h3>
                              {[
                                { year: "2026", event: "Voted Visual Brand of the Year by Webflow Developers" },
                                { year: "2025", event: "Pioneered bento-grid WebGL dynamic browser shaders" },
                                { year: "2024", event: "Founded Nexus Agency with 3 remote creative developers" }
                              ].map((t, i) => (
                                <div key={i} className="flex items-start gap-4">
                                  <span className="text-teal-400 font-black">{t.year}</span>
                                  <span>{t.event}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Contact" && (
                          <motion.div
                            key="contact"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-md mx-auto py-4 space-y-4"
                          >
                            <h2 className="text-xl font-bold text-white font-mono tracking-wider">INITIATE BRIEF //</h2>
                            <form onSubmit={handleMockFormSubmit} className="space-y-3.5 p-5 border border-white/5 bg-white/[0.02] rounded-xl font-mono text-xs">
                              <input
                                required
                                type="text"
                                placeholder="CLIENT NAME"
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-slate-700 focus:outline-none focus:border-teal-500 uppercase tracking-widest text-[10px]"
                              />
                              <input
                                required
                                type="email"
                                placeholder="CORRESPONDENCE EMAIL"
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-slate-700 focus:outline-none focus:border-teal-500 uppercase tracking-widest text-[10px]"
                              />
                              <textarea
                                required
                                rows={3}
                                placeholder="BRIEF MEMORANDUM..."
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-slate-700 focus:outline-none focus:border-teal-500 uppercase tracking-widest text-[10px]"
                              />
                              <button
                                type="submit"
                                disabled={submittingForm}
                                className="w-full py-3 bg-teal-500 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
                              >
                                {submittingForm ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "TRANSMIT MEMO //"}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 3. COFFEE SHOP COMPILER INTERACTIVE ROUTER */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {template.id === "coffee" && (
                    <div className="space-y-10">
                      {/* Cozy Coffee Header */}
                      <div className="text-center py-2 border-b border-white/5">
                        <h1 className="text-base font-black text-amber-400 tracking-widest font-mono uppercase cursor-pointer" onClick={() => setActiveMockPage("Home")}>
                          AURA BEANS COFFEE
                        </h1>
                        <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2 font-mono">
                          {["Home", "Menu", "Story", "Contact"].map((p) => (
                            <span
                              key={p}
                              onClick={() => setActiveMockPage(p)}
                              className={`cursor-pointer transition-colors ${
                                activeMockPage === p ? "text-amber-300" : "text-slate-500 hover:text-white"
                              }`}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {activeMockPage === "Home" && (
                          <motion.div
                            key="home"
                            initial={{ opacity: 0, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 py-4"
                          >
                            <div className="text-center max-w-md mx-auto space-y-4">
                              <p className="text-xs text-amber-300 italic font-serif">&ldquo;Grown with love, roasted in micro-lots, brewed with absolute precision.&rdquo;</p>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                                We source organic, high-altitude coffee beans directly from small farmers worldwide. Each batch is light-roasted to amplify floral and citrus notes.
                              </p>
                              <button
                                onClick={() => setActiveMockPage("Menu")}
                                className="px-5 py-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-[9px] text-amber-400 uppercase tracking-widest font-bold font-mono hover:bg-amber-500/20"
                              >
                                View Specialties Menu
                              </button>
                            </div>

                            {/* Cozy Coffee Visual Preview */}
                            <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl my-4">
                              <img src="/templates/coffee.png" alt="Cozy Aura Coffee Brew" className="w-full h-36 object-cover" />
                            </div>

                            {/* Specialty Brews preview card */}
                            <div className="p-6 rounded-2xl border border-white/5 bg-linear-to-r from-amber-500/10 to-orange-500/5 max-w-lg mx-auto">
                              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-4">Our Specialty Brews</h3>
                              <div className="space-y-3">
                                {[
                                  { item: "Bourbon Infused Cold Brew", desc: "Whiskey barrel oak hints, double filtered", price: "$6.50" },
                                  { item: "Organic Lavender Matcha Latte", desc: "Ceremonial green tea with fresh blossoms", price: "$5.50" }
                                ].map((m, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-white/5 last:border-0 last:pb-0">
                                    <div>
                                      <h4 className="font-bold text-white">{m.item}</h4>
                                      <p className="text-[9px] text-slate-500 mt-0.5 font-sans">{m.desc}</p>
                                    </div>
                                    <span className="font-extrabold text-amber-400">{m.price}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Menu" && (
                          <motion.div
                            key="menu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4 max-w-xl mx-auto"
                          >
                            <h2 className="text-sm font-black text-amber-400 uppercase tracking-widest text-center">SPECIALTY BREWS MENU</h2>
                            <div className="grid grid-cols-1 gap-4">
                              {[
                                { category: "Signature Espresso", items: [
                                  { name: "Himalayan Sea Salt Espresso", desc: "Dark micro-lot with subtle creamy salt foam", price: "$4.50" },
                                  { name: "Bourbon Barrel Infused Espresso", desc: "Barrel-aged beans extracted at 9 bars", price: "$5.00" }
                                ]},
                                { category: "Pour-Over & Infusions", items: [
                                  { name: "Ethiopian Yirgacheffe Pour-over", desc: "Light roast with jasmine and lemon citrus notes", price: "$6.00" },
                                  { name: "Organic Lavender Matcha Latte", desc: "Ceremonial stone-ground green tea with blossom steam", price: "$5.50" }
                                ]}
                              ].map((cat, idx) => (
                                <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-[#06080e]/40 space-y-3">
                                  <h3 className="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest">{cat.category}</h3>
                                  <div className="space-y-3">
                                    {cat.items.map((it, i) => (
                                      <div key={i} className="flex justify-between text-xs pb-2 border-b border-white/5 last:border-0 last:pb-0">
                                        <div>
                                          <h4 className="font-bold text-white">{it.name}</h4>
                                          <p className="text-[9px] text-slate-500 mt-0.5">{it.desc}</p>
                                        </div>
                                        <span className="font-extrabold text-amber-400">{it.price}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Story" && (
                          <motion.div
                            key="story"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4 py-4 max-w-md mx-auto text-xs text-slate-400 leading-relaxed font-sans"
                          >
                            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono text-center">THE ROASTERY ORIGIN STORY</h2>
                            <p>
                              Founded in 2026 inside a small glass greenhouse, Aura Beans was born from a singular passion: sourcing chemical-free organic coffee beans from independent family micro-farms.
                            </p>
                            <p>
                              Each micro-lot bean is carefully inspected and roasted at low temperatures inside a vintage drum roaster, capturing the natural origin notes of local soil, rainfall, and shade.
                            </p>
                          </motion.div>
                        )}

                        {activeMockPage === "Contact" && (
                          <motion.div
                            key="contact"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-md mx-auto py-4 space-y-4"
                          >
                            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono text-center">BREW INQUIRIES</h2>
                            <form onSubmit={handleMockFormSubmit} className="space-y-3.5 bg-black/40 p-5 rounded-2xl border border-white/5">
                              <input
                                required
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-lg placeholder:text-slate-700"
                              />
                              <input
                                required
                                type="email"
                                placeholder="Your Email"
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-lg placeholder:text-slate-700"
                              />
                              <textarea
                                required
                                rows={3}
                                placeholder="Message to Roaster..."
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-lg placeholder:text-slate-700"
                              />
                              <button
                                type="submit"
                                disabled={submittingForm}
                                className="w-full py-3 bg-amber-500 text-xs font-bold text-black hover:bg-amber-600 transition-all rounded-lg flex items-center justify-center gap-2"
                              >
                                {submittingForm ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Transmit Brew Request"}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 4. FITNESS COMPILER INTERACTIVE ROUTER */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {template.id === "fitness" && (
                    <div className="space-y-8">
                      {/* Fitness Header */}
                      <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                        <span className="text-sm font-black text-rose-500 italic tracking-wider cursor-pointer" onClick={() => setActiveMockPage("Home")}>
                          VIGOR ARENA
                        </span>
                        <div className="flex gap-4 text-[9px] font-black uppercase tracking-wider font-mono">
                          {["Home", "Programs", "Trainers", "Join"].map((p) => (
                            <span
                              key={p}
                              onClick={() => setActiveMockPage(p)}
                              className={`cursor-pointer transition-colors ${
                                activeMockPage === p ? "text-rose-400" : "text-slate-400 hover:text-white"
                              }`}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {activeMockPage === "Home" && (
                          <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4"
                          >
                            <div className="text-center py-8 bg-[#0a050d] rounded-2xl border border-rose-500/20 p-6 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[40px] pointer-events-none" />
                              <h2 className="text-xl md:text-3xl font-black text-white uppercase italic leading-none tracking-tight">
                                NO PAIN. NO LIMITS.<br />
                                <span className="text-rose-400">UNLEASH VIGOR ARENA.</span>
                              </h2>
                              <p className="text-[10px] text-slate-400 mt-3 max-w-xs mx-auto leading-relaxed">
                                24/7 Premium turf, olympic power racks, and expert metabolic coaches waiting for you.
                              </p>
                              <button
                                onClick={() => setActiveMockPage("Join")}
                                className="inline-block mt-4 px-4 py-2 bg-rose-500 text-[10px] font-extrabold text-white rounded cursor-pointer hover:bg-rose-600 transition-colors uppercase tracking-widest"
                              >
                                Claim VIP Pass
                              </button>
                            </div>

                            {/* Energetic Gym visual preview */}
                            <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-rose-500/10 shadow-xl my-4">
                              <img src="/templates/fitness.png" alt="Vigor Gym Equipment" className="w-full h-32 object-cover" />
                            </div>

                            {/* Classes sample */}
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { name: "HIIT Conditioning", time: "Daily 8:00 AM" },
                                { name: "Barbell Powerlifting", time: "Daily 6:00 PM" }
                              ].map((c, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                  <h4 className="text-xs font-bold text-white">{c.name}</h4>
                                  <p className="text-[9px] text-rose-400 mt-1">{c.time}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Programs" && (
                          <motion.div
                            key="programs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4 max-w-lg mx-auto"
                          >
                            <h2 className="text-base font-bold text-white uppercase italic tracking-wider text-center">METABOLIC PROGRAMS</h2>
                            <div className="space-y-3">
                              {[
                                { name: "Turf Conditioning (HIIT)", desc: "High-intensity circuits using kettlebells, sleds, and concept rowers." },
                                { name: "Strength & Powerlifting", desc: "Barbell-focused squat, bench, and deadlift techniques under guidance." },
                                { name: "Cardio Endurance Tunnels", desc: "Zone-2 steady-state cardiovascular threshold optimization work." }
                              ].map((prg, i) => (
                                <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/35">
                                  <h4 className="text-xs font-bold text-rose-400">{prg.name}</h4>
                                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed font-sans">{prg.desc}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Trainers" && (
                          <motion.div
                            key="trainers"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4 max-w-lg mx-auto"
                          >
                            <h2 className="text-base font-bold text-white uppercase italic tracking-wider text-center">METABOLIC COACHES</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {[
                                { name: "Coach Marcus Vance", cert: "CSCS / Olympic Lifter", focus: "Strength & Hypertrophy" },
                                { name: "Coach Sarah Lin", cert: "M.S. Exercise Physiology", focus: "Conditioning & Zone 2" }
                              ].map((coach, i) => (
                                <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#06080e]/40 space-y-2">
                                  <h4 className="text-xs font-bold text-white">{coach.name}</h4>
                                  <span className="text-[8px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/10 block w-max">{coach.cert}</span>
                                  <p className="text-[9px] text-slate-500 font-sans">Specializes in {coach.focus}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Join" && (
                          <motion.div
                            key="join"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-md mx-auto py-4 space-y-4"
                          >
                            <h2 className="text-base font-bold text-white uppercase italic tracking-wider text-center">CLAIM 1-DAY PASS</h2>
                            <form onSubmit={handleMockFormSubmit} className="space-y-3.5 bg-black/40 p-5 rounded-2xl border border-white/5">
                              <input
                                required
                                type="text"
                                placeholder="Athletic Name"
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500 rounded-lg placeholder:text-slate-700"
                              />
                              <input
                                required
                                type="email"
                                placeholder="Phone / Email"
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500 rounded-lg placeholder:text-slate-700"
                              />
                              <select className="w-full px-4 py-3 bg-black border border-white/10 text-slate-400 text-xs focus:outline-none focus:border-rose-500 rounded-lg">
                                <option>HIIT Conditioning Class Slot</option>
                                <option>Barbell Powerlifting Class Slot</option>
                                <option>General Turf VIP Day Entry</option>
                              </select>
                              <button
                                type="submit"
                                disabled={submittingForm}
                                className="w-full py-3 bg-rose-500 text-xs font-black text-white hover:bg-rose-600 transition-all rounded-lg flex items-center justify-center gap-2 uppercase tracking-wider"
                              >
                                {submittingForm ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Authorize Pass"}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 5. AGENCY COMPILER INTERACTIVE ROUTER */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {template.id === "agency" && (
                    <div className="space-y-8">
                      {/* Agency Header */}
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-xs font-black text-white tracking-widest cursor-pointer" onClick={() => setActiveMockPage("Home")}>
                          VERTEX.
                        </span>
                        <div className="flex gap-4 text-[9px] font-bold uppercase tracking-wider font-sans">
                          {["Home", "Services", "Case Studies", "Contact"].map((p) => (
                            <span
                              key={p}
                              onClick={() => setActiveMockPage(p)}
                              className={`cursor-pointer transition-colors ${
                                activeMockPage === p ? "text-cyan-400" : "text-slate-400 hover:text-white"
                              }`}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {activeMockPage === "Home" && (
                          <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4"
                          >
                            <div className="space-y-3 py-4">
                              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">
                                We drive average <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">400% ROI conversions</span>
                              </h1>
                              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                                Vertex crafts data-driven organic funnels, responsive web components, and optimized digital footprints for venture startups.
                              </p>
                            </div>

                            {/* Agency Visual Preview */}
                            <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl my-4">
                              <img src="/templates/agency.png" alt="Vertex Lead Generation Dashboard" className="w-full h-32 object-cover" />
                            </div>

                            {/* Testimonial panel */}
                            <div className="p-5 rounded-2xl border border-white/5 bg-linear-to-r from-cyan-500/10 to-blue-500/5 max-w-lg mx-auto">
                              <p className="text-xs text-slate-300 italic font-sans">&ldquo;The Vertex crew scaled our monthly lead generation flow by 6x in under 90 days. Their system is absolute magic.&rdquo;</p>
                              <div className="mt-3 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40" />
                                <div>
                                  <p className="text-[9px] font-bold text-white">Sarah Jenkins</p>
                                  <p className="text-[8px] text-slate-500 font-sans">VP Marketing, FinFlow</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Services" && (
                          <motion.div
                            key="services"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4 max-w-lg mx-auto"
                          >
                            <h2 className="text-base font-bold text-white text-center">OUR CAPABILITIES</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {[
                                { title: "Lead Generation Tunnels", desc: "Build optimized pipelines that capture visitor intentions." },
                                { title: "Custom Bento UI Components", desc: "Vibrant high-contrast React panels built for conversion focus." },
                                { title: "Search Engine Optimization", desc: "Drive structured keywords to rank high on global indexes." },
                                { title: "Conversion Auditing", desc: "Trace user mouse patterns to adjust color nodes and triggers." }
                              ].map((srv, i) => (
                                <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#06080e]/40 space-y-2">
                                  <h4 className="text-xs font-bold text-cyan-400">{srv.title}</h4>
                                  <p className="text-[10px] text-slate-400 leading-normal font-sans">{srv.desc}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Case Studies" && (
                          <motion.div
                            key="cases"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4 max-w-lg mx-auto"
                          >
                            <h2 className="text-base font-bold text-white text-center">SUCCESS REVIEWS</h2>
                            <div className="space-y-3">
                              {[
                                { client: "FinFlow Ledger Node", growth: "+620% leads acquisition", time: "90 days" },
                                { client: "Voxel Audio Sandbox", growth: "+310% active compiles", time: "45 days" }
                              ].map((c, i) => (
                                <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/35 flex justify-between items-center">
                                  <div>
                                    <h4 className="text-xs font-bold text-white">{c.client}</h4>
                                    <p className="text-[10px] text-cyan-400 mt-1 font-mono">{c.growth}</p>
                                  </div>
                                  <span className="text-[9px] text-slate-500 font-sans">{c.time}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Contact" && (
                          <motion.div
                            key="contact"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-md mx-auto py-4 space-y-4"
                          >
                            <h2 className="text-base font-bold text-white text-center font-sans">REQUEST BRIEF DEPLOY</h2>
                            <form onSubmit={handleMockFormSubmit} className="space-y-3.5 bg-black/40 p-5 rounded-2xl border border-white/5">
                              <input
                                required
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 rounded-lg placeholder:text-slate-700"
                              />
                              <input
                                required
                                type="email"
                                placeholder="Corporate Email"
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 rounded-lg placeholder:text-slate-700"
                              />
                              <textarea
                                required
                                rows={3}
                                placeholder="Brief project summary..."
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 rounded-lg placeholder:text-slate-700"
                              />
                              <button
                                type="submit"
                                disabled={submittingForm}
                                className="w-full py-3 bg-cyan-500 text-xs font-bold text-black hover:bg-cyan-600 transition-all rounded-lg flex items-center justify-center gap-2"
                              >
                                {submittingForm ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Transmit Brief"}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* 6. CYBERSTARTUP COMPILER INTERACTIVE ROUTER */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {template.id === "startup" && (
                    <div className="space-y-8">
                      {/* Cyber Header */}
                      <div className="flex justify-between items-center font-mono text-[10px] py-1 border-b border-white/5">
                        <span className="text-emerald-400 cursor-pointer" onClick={() => setActiveMockPage("Home")}>
                          CYBERCORE // TERMINAL
                        </span>
                        <div className="flex gap-4 text-slate-500 uppercase">
                          {["Home", "Tech Stack", "Pricing", "Console"].map((p) => (
                            <span
                              key={p}
                              onClick={() => setActiveMockPage(p)}
                              className={`cursor-pointer transition-colors ${
                                activeMockPage === p ? "text-emerald-400 font-black" : "text-slate-600 hover:text-slate-300"
                              }`}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {activeMockPage === "Home" && (
                          <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4"
                          >
                            {/* Terminal Shell Panel */}
                            <div className="p-4 rounded-xl bg-black border border-emerald-500/25 font-mono text-[10px] space-y-2.5">
                              <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-500">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 animate-ping" />
                                <span>core_node_active.sh</span>
                              </div>
                              <p className="text-slate-400">$ cybercore --init --style=cyber-emerald</p>
                              <p className="text-emerald-400">✓ Resolving cybernetic grid layout anchors...</p>
                              <p className="text-emerald-400">✓ Ingesting multi-page structural nodes...</p>
                              <p className="text-emerald-300">✓ Status: ACTIVE. Secure client routing online.</p>
                            </div>

                            {/* Cyber Terminal visual preview */}
                            <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-emerald-500/20 shadow-xl my-4">
                              <img src="/templates/startup.png" alt="CyberCore Terminal Screen" className="w-full h-28 object-cover" />
                            </div>

                            <div className="text-center space-y-3 py-4 font-mono">
                              <h3 className="text-sm font-bold text-white">Spawn Fully Autonomous AI Frameworks</h3>
                              <p className="text-[10px] text-slate-400">Deploy serverless modules with self-contained styling in one tap.</p>
                              <div
                                onClick={() => setActiveMockPage("Console")}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-[10px] font-black text-black cursor-pointer hover:bg-emerald-600 transition-colors"
                              >
                                Initialize Cyber Terminal
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Tech Stack" && (
                          <motion.div
                            key="tech"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4 font-mono text-[10px] max-w-lg mx-auto"
                          >
                            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest text-center border-b border-white/5 pb-2">ACTIVE SYSTEM STACK</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {[
                                { title: "Serverless Edge Sync", status: "STATUS_ONLINE", info: "Edge runtime bindings distributed worldwide." },
                                { title: "Vibrant Glassmorphism", status: "STABLE_COMPILATION", info: "Dynamic CSS tokens with saturation variance." },
                                { title: "Single File Bundle (SPA)", status: "COMPILATION_DONE", info: "Zero bundle assets reload requirements." },
                                { title: "Secure Cryptography Nodes", status: "SECURE_LOCKED", info: "Automatic Zero-Trust protocol tokens active." }
                              ].map((tc, i) => (
                                <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/45 space-y-2">
                                  <div className="flex justify-between font-bold">
                                    <span className="text-white">{tc.title}</span>
                                    <span className="text-emerald-400 text-[8px]">{tc.status}</span>
                                  </div>
                                  <p className="text-slate-500 leading-normal">{tc.info}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Pricing" && (
                          <motion.div
                            key="pricing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 py-4 font-mono text-[10px] max-w-lg mx-auto"
                          >
                            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest text-center border-b border-white/5 pb-2">CYBER SUBSCRIPTIONS</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {[
                                { name: "NODE STARTER", price: "0 CREDITS", info: "Unlimited local compiles." },
                                { name: "PRO SUITE REGION", price: "19 CREDITS", info: "Dedicated Edge synchronization active." }
                              ].map((prc, i) => (
                                <div key={i} className="p-4 rounded-xl border border-emerald-500/10 bg-black/45 flex flex-col justify-between h-44">
                                  <div>
                                    <h4 className="text-white font-bold">{prc.name}</h4>
                                    <span className="text-emerald-400 text-xs font-black block mt-2">{prc.price}</span>
                                    <p className="text-slate-500 mt-2">{prc.info}</p>
                                  </div>
                                  <button
                                    onClick={() => toast.success(`Selected tier: ${prc.name}`)}
                                    className="w-full py-2 bg-emerald-500 text-black text-[9px] font-black hover:bg-emerald-600 transition-colors uppercase tracking-widest mt-3"
                                  >
                                    ACTIVATE_NODE
                                  </button>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeMockPage === "Console" && (
                          <motion.div
                            key="console"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-md mx-auto py-4 space-y-4 font-mono text-[10px]"
                          >
                            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest text-center border-b border-white/5 pb-2">CYBERNETIC_TRANSMISSION</h2>
                            <form onSubmit={handleMockFormSubmit} className="space-y-3.5 bg-black border border-emerald-500/25 p-5 rounded-xl">
                              <input
                                required
                                type="text"
                                placeholder="CORE CLIENT ID"
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-800"
                              />
                              <input
                                required
                                type="email"
                                placeholder="CORE EMAIL ID"
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-800"
                              />
                              <textarea
                                required
                                rows={3}
                                placeholder="COMPILE ARGUMENTS..."
                                className="w-full px-4 py-3 bg-black border border-white/10 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-800"
                              />
                              <button
                                type="submit"
                                disabled={submittingForm}
                                className="w-full py-3 bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                              >
                                {submittingForm ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "EXECUTE_TRANSMIT"}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* Simulated web footer */}
                  {/* ────────────────────────────────────────────────────────── */}
                  <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Active Page: {activeMockPage}</span>
                    <span className={`${accentText} uppercase tracking-widest font-extrabold select-none`}>
                      Live Routing Simulator
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="px-6 py-5 border-t border-white/5 bg-black/45 flex items-center justify-between flex-shrink-0 relative z-10 flex-wrap gap-4">
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    {template.isUserProject ? "Live compiled website active" : "Interactive website preview active"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
                    {template.isUserProject 
                      ? "This is a live representation of your fully generated multi-page website." 
                      : "Explore mock pages, change pricing billing toggle, and submit contact sheets before compilation."
                    }
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={onClose}
                    className="flex-1 md:flex-none px-5 py-3 rounded-xl border border-white/5 hover:bg-white/5 text-xs font-bold text-slate-400 hover:text-white transition-all pointer-events-auto"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onUseTemplate(template);
                    }}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-xl ${accentBg} text-xs font-bold text-white shadow-xl hover:scale-105 transition-all pointer-events-auto`}
                  >
                    {template.isUserProject ? "Edit Design" : "Use This Template"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
