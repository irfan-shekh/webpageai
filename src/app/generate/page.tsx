"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { LandingPageData } from "@/components/landing-page/Renderer";
import {
  Loader2,
  Save,
  Send,
  Code,
  Eye,
  History,
  Terminal,
  FileText,
  Download,
  FolderOpen,
  Monitor,
  Smartphone,
  User,
  Bot,
  Sparkles,
  ChevronLeft,
  Sun,
  Moon,
  Trash2,
  Sliders,
  Laptop,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { generateHtml } from "@/lib/generateHtml";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import PreviewIframe from "@/components/PreviewIframe";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export function GenerateWorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  // Core generated website content
  const [data, setData] = useState<string>("");
  
  // UI Loading States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [input, setInput] = useState("");
  const [projectName, setProjectName] = useState(() => {
    const nameFromQuery = searchParams.get("name");
    return nameFromQuery ? decodeURIComponent(nameFromQuery) : "Untitled Project";
  });

  // Style Presets State
  const [activeStyle, setActiveStyle] = useState(() => {
    const styleFromQuery = searchParams.get("style");
    return styleFromQuery || "dark";
  });
  const [activeColor, setActiveColor] = useState(() => {
    const colorFromQuery = searchParams.get("color");
    return colorFromQuery || "emerald";
  });

  // Left panel view mode / Chat history list
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const nameFromQuery = searchParams.get("name");
    const initialName = nameFromQuery ? decodeURIComponent(nameFromQuery) : "Untitled Project";
    return [
      {
        role: "ai",
        content: `Welcome to your **WebpageAI Workspace**! I'm ready to build a high-fidelity, responsive multi-page website for **"${initialName}"**.\n\nSpecify your desired styles, pages, and CTA buttons, or click one of the quick suggestions below to start!`
      }
    ];
  });
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Responsive device preview toggles
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [responsiveMode, setResponsiveMode] = useState<"desktop" | "mobile">("desktop");
  const [mobileTab, setMobileTab] = useState<"console" | "preview">("console");

  // Auto-scroll chat window
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Quick suggestions builder prompts
  const suggestions = [
    "A gorgeous boutique coffee shop named Aura Beans containing Home, Menu, Story, and Contact pages with warm brown glassmorphic vibes.",
    "A clean dark mode SaaS platform named CloudSync featuring an interactive bento grid, pricing tiers, and active status indicators.",
    "A sleek minimalist design portfolio named Nexus Studios showing off clean typography and contact page templates."
  ];

  /* ─── AI Prompt Compiler Submission ─── */
  const handleSubmit = async (promptText: string) => {
    if (!promptText.trim() || loading) return;

    setLoading(true);
    setInput("");

    // Add user prompt to chat
    const userMsg: ChatMessage = {
      role: "user",
      content: promptText
    };
    setChatHistory(prev => [...prev, userMsg]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          style: activeStyle,
          color: activeColor,
          projectName
        }),
      });

      if (!res.ok) {
        throw new Error("Generative engine failed to compile.");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        throw new Error("Generative engine did not return a stream.");
      }

      let accumulatedHtml = "";
      setData(""); // Reset previous preview

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedHtml += chunk;
        setData(accumulatedHtml);
      }
      
      // Swing mobile view over to preview
      setMobileTab("preview");
      
      // Add AI confirmation message
      setChatHistory(prev => [...prev, {
        role: "ai",
        content: `✨ Perfect! I've successfully compiled your multi-page website project in real-time. Under the hood, I've constructed:
*   **Fully responsive pages** mapped to clean sections.
*   **Embedded client-side router** to support seamless transitions without reloads.
*   **Futuristic dark visual aesthetics** with beautiful gradients.

Browse your site in the preview canvas on the right, or export/download it directly to host it anywhere!`
      }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected compile error occurred.";
      toast.error(message);
      setChatHistory(prev => [...prev, {
        role: "ai",
        content: `Sorry, I hit an error compiling your website: ${message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-run template generator if parameters are provided in URL query
  useEffect(() => {
    const promptFromQuery = searchParams.get("prompt");
    
    if (promptFromQuery && !data && !loading) {
      // Defer execution to the next event loop tick to avoid synchronous cascading state updates during the render phase
      const timer = setTimeout(() => {
        handleSubmit(decodeURIComponent(promptFromQuery));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams, data, loading]);

  /* ─── Save project to PostgreSQL ─── */
  const handleSave = async () => {
    if (!data) return;
    setSaving(true);

    const name = projectName.trim() || "Untitled Project";
    const htmlContent = typeof data === 'string' ? data : generateHtml(data, name);

    if (session?.user) {
      try {
        const res = await fetch("/api/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, content: data }),
        });
        if (res.ok) {
          toast.success("Saved to your database projects!");
        } else {
          toast.error("Could not save to database.");
        }
      } catch {
        toast.error("Database connection timeout.");
      }
    } else {
      toast("Sign in to save projects to your account.", { icon: "ℹ️" });
    }

    downloadHtml(htmlContent, name);
    setSaving(false);
  };

  /* ─── Export & Download single HTML file ─── */
  const downloadHtml = (htmlContent: string, name: string) => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
  };

  return (
    <div className="bg-[#02040a] text-slate-200 min-h-screen font-sans flex flex-col md:flex-row relative overflow-hidden h-screen">
      
      {/* 🌌 AMBIENT BACKGROUND SYSTEM */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50px] left-[10%] w-[350px] h-[350px] bg-emerald-600/5 rounded-full blur-[90px] animate-pulse" />
        <div className="absolute bottom-[-50px] right-[20%] w-[300px] h-[300px] bg-teal-600/5 rounded-full blur-[80px] animate-pulse [animation-delay:1.5s]" />
      </div>

      {/* ── MOBILE BAR SWITCHER ── */}
      <div className="flex md:hidden bg-black/40 border-b border-white/5 p-3.5 justify-between items-center z-30 shrink-0 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white truncate max-w-[130px]">{projectName}</span>
        </div>
        <div className="flex bg-white/5 rounded-xl p-0.5 border border-white/5">
          <button
            onClick={() => setMobileTab("console")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
              mobileTab === "console" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "text-slate-400 border border-transparent"
            }`}
          >
            Console
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
              mobileTab === "preview" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "text-slate-400 border border-transparent"
            }`}
          >
            Preview {data ? "⚡" : ""}
          </button>
        </div>
      </div>

      {/* ── 1. LEFT COLUMN: CHAT & STYLING PANEL ── */}
      <aside className={`w-full md:w-100 xl:w-112 border-r border-white/5 bg-[#06080d]/30 backdrop-blur-2xl flex flex-col justify-between shrink-0 h-full relative z-20 ${mobileTab === 'console' ? 'flex' : 'hidden md:flex'}`}>
        
        {/* Workspace Brand Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="truncate max-w-[180px]">
              <h1 className="text-sm font-black text-white truncate leading-none">{projectName}</h1>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-sans">
                <Database className="w-2.5 h-2.5 text-emerald-400" />
                AI Compiler Canvas
              </p>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Active
          </span>
        </div>

        {/* Chat log & Preset controls Scrollable wrapper */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          
          {/* Chat dialogue balloons container */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {chatHistory.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[90%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  {/* Balloon Icon capsules */}
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                    msg.role === "user" 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-teal-500/10 border-teal-500/20 text-teal-400"
                  }`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Balloon Texts */}
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                    msg.role === "user"
                      ? "bg-emerald-500/5 border-emerald-500/10 text-white rounded-tr-none"
                      : "bg-white/[0.01] border-white/5 text-slate-300 rounded-tl-none whitespace-pre-line"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Generative loading overlay indicator inside chat */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 max-w-[85%]"
              >
                <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 text-xs text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  AI is compiling layouts...
                </div>
              </motion.div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick preset suggestions (Only visible when not loading) */}
          {!data && !loading && (
            <div className="space-y-3 pt-4 border-t border-white/5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quick Start Templates</p>
              <div className="space-y-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(sug)}
                    className="w-full text-left p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-emerald-500/5 hover:border-emerald-500/20 text-[11px] text-slate-400 hover:text-emerald-300 transition-all leading-normal"
                  >
                    {sug.length > 90 ? `${sug.substring(0, 90)}...` : sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preset Customization Options Drawer */}
          <div className="space-y-4 pt-4 border-t border-white/5 relative z-10">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Sliders className="w-3 h-3 text-emerald-400" />
              Branding & Layout Tuning
            </p>

            {/* Style Selector Buttons */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-semibold uppercase">Style Framework</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "dark", label: "Futuristic Dark" },
                  { id: "light", label: "Sleek Minimalist" },
                  { id: "glassmorphism", label: "Glassmorphism" },
                  { id: "brutalism", label: "Brutalist Neon" }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setActiveStyle(style.id)}
                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${
                      activeStyle === style.id
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        : "bg-white/[0.01] text-slate-500 border-white/5 hover:text-white"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors Preset Selector */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-semibold uppercase">Primary Accent Glow</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
                  { id: "teal", label: "Mint Teal", color: "bg-teal-500" },
                  { id: "cyan", label: "Ice Cyan", color: "bg-cyan-500" },
                  { id: "amber", label: "Warm Gold", color: "bg-amber-500" }
                ].map(col => (
                  <button
                    key={col.id}
                    onClick={() => setActiveColor(col.id)}
                    className={`p-1 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                      activeColor === col.id
                        ? "bg-white/5 border-emerald-500/40 text-emerald-300"
                        : "bg-white/[0.01] border-white/5 text-slate-600 hover:text-white"
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${col.color}`} />
                    <span className="text-[9px] uppercase font-bold tracking-tighter">{col.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input TextArea Command Box Footer */}
        <div className="p-4 border-t border-white/5 bg-black/10">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(input);
                }
              }}
              placeholder="Refine layout, add an about section..."
              disabled={loading}
              className="w-full bg-black/40 border border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none h-16 min-h-[64px]"
            />
            <button
              onClick={() => handleSubmit(input)}
              disabled={loading || !input.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-white/5 text-white disabled:text-slate-600 shadow-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── 2. RIGHT COLUMN: PREVIEW CANVAS & ACTIONS ── */}
      <main className={`flex-1 flex flex-col min-w-0 h-full relative z-10 bg-black/30 ${mobileTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
        
        {/* Canvas Toolbar Header */}
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-black/20 z-30">
          <div className="flex items-center gap-3">
            {/* View Mode controls (Preview vs Code representation) */}
            <div className="flex items-center bg-white/5 border border-white/5 rounded-xl p-1">
              <button
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "preview" 
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </button>
              <button
                onClick={() => setViewMode("code")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "code" 
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Source Code
              </button>
            </div>

            {/* Devices dimensions switcher (Only active in Preview mode) */}
            {viewMode === "preview" && (
              <div className="flex items-center bg-white/5 border border-white/5 rounded-xl p-1 hidden sm:flex">
                <button
                  onClick={() => setResponsiveMode("desktop")}
                  className={`p-1.5 rounded-lg transition-all ${
                    responsiveMode === "desktop" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
                  title="Desktop preview"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setResponsiveMode("mobile")}
                  className={`p-1.5 rounded-lg transition-all ${
                    responsiveMode === "mobile" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
                  title="Mobile preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Action buttons (Save database, export code) */}
          <div className="flex items-center gap-3">
            {data && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save & Export
              </motion.button>
            )}
          </div>
        </header>

        {/* Live Canvas workspace frame wrapper */}
        <div className="flex-1 p-2 sm:p-6 flex items-center justify-center overflow-hidden relative">
          
          {/* SKELETON PLACEHOLDER OR EMPTY STATE */}
          {!data && !loading && (
            <div className="text-center max-w-sm relative z-10">
              <div className="inline-flex p-4 bg-emerald-500/10 rounded-2xl mb-6 border border-emerald-500/20">
                <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white">Generative workspace ready</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-sans">
                Choose a presets template on the left, or input your business details in the console to initialize a responsive multi-page masterwork.
              </p>
            </div>
          )}

          {/* GENERATING SKELETON PROGRESS WRAPPER */}
          {loading && (
            <div className="absolute inset-0 bg-[#02040a]/60 backdrop-blur-[4px] flex flex-col items-center justify-center z-30">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-[#06080d]/90 border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl relative"
              >
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-xs font-extrabold text-white tracking-wider uppercase font-mono">
                  Compiling multi-page workspace...
                </span>
              </motion.div>
            </div>
          )}

          {/* PREVIEW SIMULATOR CANVAS VIEW */}
          {data && viewMode === "preview" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl border border-white/5 bg-black/60 shadow-2xl overflow-hidden relative transition-all duration-500 ${
                responsiveMode === "mobile" ? "w-full max-w-[360px] h-[580px] max-h-full" : "w-full h-full"
              }`}
            >
              {/* Responsive mock indicator bar */}
              <div className="h-6 border-b border-white/5 bg-black/40 flex items-center px-4 justify-between text-[10px] text-slate-500">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="truncate max-w-[200px] font-mono tracking-tighter uppercase">
                  {responsiveMode === "mobile" ? "Phone Preview (360x640)" : "Desktop Preview (Responsive)"}
                </div>
                <div className="w-10 text-right">80%</div>
              </div>

              {/* Render dynamic smooth-router preview */}
              <PreviewIframe
                htmlContent={data}
                className="w-full h-[calc(100%-24px)] border-0 bg-white"
              />
            </motion.div>
          )}

          {/* EDITABLE CODE VIEW EDITOR */}
          {data && viewMode === "code" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full rounded-2xl border border-white/5 bg-[#06080d]/40 backdrop-blur-xl p-5 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  INDEX.HTML (READY EXPORT)
                </span>
                <span className="uppercase text-[9px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  Self-contained
                </span>
              </div>
              <textarea
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="flex-1 w-full bg-transparent text-slate-300 font-mono text-[11px] leading-relaxed resize-none focus:outline-none scrollbar-thin"
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function GenerateWorkspace() {
  return (
    <Suspense fallback={
      <div className="bg-[#02040a] text-white min-h-screen flex items-center justify-center flex-col gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span className="text-xs font-mono text-slate-400">LOADING GENERATOR CONSOLE...</span>
      </div>
    }>
      <GenerateWorkspaceContent />
    </Suspense>
  );
}