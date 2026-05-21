"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutTemplate,
  FolderOpen,
  X,
  Eye,
  Send,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Loader2,
  Sparkles,
  Search,
  Bell,
  Sliders,
  LogOut,
  Folder,
  Layout,
  BarChart3,
  Settings,
  CreditCard,
  User,
  HelpCircle,
  TrendingUp,
  Download,
  Terminal,
  Layers,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import toast from "react-hot-toast";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TemplateBrowserPreview } from "@/components/dashboard/TemplateBrowserPreview";
import { ProjectNameModal } from "@/components/dashboard/ProjectNameModal";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";
import { BillingTab } from "@/components/dashboard/BillingTab";
import { generateHtml } from "@/lib/generateHtml";

interface SavedPage {
  id: string;
  name: string;
  createdAt: string;
  content: unknown;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [pages, setPages] = useState<SavedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Sidebar navigation state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as "dark" | "light";
      return saved || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };


  // Selected template state
  const [selectedTemplate, setSelectedTemplate] = useState<{
    id: string;
    name: string;
    prompt: string;
    style: string;
    color: string;
  } | null>(null);

  // Template Preview Modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  interface PreviewTemplate {
    id: string;
    name: string;
    desc: string;
    accent: string;
    badge: string;
    prompt: string;
    isUserProject?: boolean;
    htmlContent?: string;
  }

  const [previewingTemplate, setPreviewingTemplate] = useState<PreviewTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Project name modal state
  const [showNameModal, setShowNameModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Rename project modal state
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus modal inputs
  useEffect(() => {
    if (showNameModal) {
      setTimeout(() => nameInputRef.current?.focus(), 80);
    }
  }, [showNameModal]);

  useEffect(() => {
    if (showRenameModal) {
      setTimeout(() => renameInputRef.current?.focus(), 80);
    }
  }, [showRenameModal]);

  const openModal = () => {
    setSelectedTemplate(null);
    setProjectName("");
    setShowNameModal(true);
  };

  const openTemplateModal = (template: {
    id: string;
    name: string;
    prompt: string;
    accent: string;
  }) => {
    setSelectedTemplate({
      id: template.id,
      name: template.name,
      prompt: template.prompt,
      style: "dark",
      color: template.accent
    });
    setProjectName(template.name);
    setShowNameModal(true);
  };

  const handleClose = () => {
    if (projectName.trim()) {
      if (!confirm("Discard project name?")) return;
    }
    setShowNameModal(false);
  };

  const openRenameModal = (id: string, currentName: string) => {
    setEditingPageId(id);
    setEditProjectName(currentName);
    setShowRenameModal(true);
  };

  const confirmAndNavigate = () => {
    const name = projectName.trim();
    if (!name) {
      nameInputRef.current?.focus();
      return;
    }
    setShowNameModal(false);
    if (selectedTemplate) {
      router.push(`/generate?name=${encodeURIComponent(name)}&prompt=${encodeURIComponent(selectedTemplate.prompt)}&style=${selectedTemplate.style}&color=${selectedTemplate.color}`);
    } else {
      router.push(`/generate?name=${encodeURIComponent(name)}`);
    }
  };

  const handleRename = async () => {
    const name = editProjectName.trim();
    if (!name || !editingPageId) {
      renameInputRef.current?.focus();
      return;
    }

    setRenaming(true);
    try {
      const res = await fetch(`/api/pages/${editingPageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setPages((prev) =>
          prev.map((p) => (p.id === editingPageId ? { ...p, name } : p))
        );
        toast.success("Project renamed successfully");
        setShowRenameModal(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to rename project");
      }
    } catch (error) {
      console.error("Rename failed", error);
      toast.error("An unexpected error occurred");
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== id));
        toast.success("Project deleted successfully");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const openProjectSimulator = (page: SavedPage) => {
    const isHtmlString = typeof page.content === 'string';
    const htmlContent = isHtmlString 
      ? (page.content as string) 
      : generateHtml(page.content as Parameters<typeof generateHtml>[0], page.name);

    setPreviewingTemplate({
      id: page.id,
      name: page.name,
      desc: "Live custom generated website sandbox preview",
      accent: "emerald",
      badge: "User Design",
      prompt: "",
      isUserProject: true,
      htmlContent
    });
    setShowPreviewModal(true);
  };

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch("/api/pages");
        if (res.ok) {
          const data = await res.json();
          setPages(data);
        }
      } catch (error) {
        console.error("Failed to fetch pages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* ── ✅ GORGEOUS SIGN-OUT GLASSMORPHIC SCREEN OVERLAY ── */}
      <AnimatePresence>
        {loggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[9999] flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#06080d] border border-white/5 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl relative max-w-xs text-center"
            >
              <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">Securing Session</h3>
                <p className="text-[10px] text-slate-500 mt-1 font-sans">Signing out and redirecting safely...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Dark blurred overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] lg:hidden"
            />
            {/* Sliding Sidebar Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#06080d] border-r border-white/5 z-[1000] flex flex-col justify-between p-6 lg:hidden"
            >
              <div>
                {/* Header / Brand logo */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setShowMobileMenu(false); router.push("/"); }}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-black tracking-widest text-white font-mono uppercase">
                      Webpage<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">AI</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Navigation links */}
                <nav className="space-y-1.5">
                  {[
                    { id: "dashboard", label: "Overview", icon: Layout },
                    { id: "projects", label: "My Projects", icon: Folder, badge: pages.length },
                    { id: "templates", label: "Templates", icon: LayoutTemplate },
                    { id: "analytics", label: "Analytics", icon: BarChart3 },
                    { id: "settings", label: "Settings", icon: Settings },
                    { id: "billing", label: "Billing", icon: CreditCard }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === item.id
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-emerald-400" : ""}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* User Workspace Profile Footer */}
              <div className="border-t border-white/5 pt-6 bg-black/10 -mx-6 px-6 -mb-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-white/10 flex items-center justify-center text-xs text-emerald-300 font-bold uppercase">
                      {session?.user?.name ? session.user.name[0] : <User className="w-4 h-4" />}
                    </div>
                    <div className="truncate max-w-[140px]">
                      <p className="text-xs font-bold text-white leading-none truncate">{session?.user?.name || "AI Architect"}</p>
                      <p className="text-[10px] text-slate-500 mt-1 truncate">{session?.user?.email || "architect@webpageai.com"}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                  disabled={loggingOut}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/5 text-xs font-bold transition-all ${
                    loggingOut
                      ? "bg-white/5 border-white/10 text-slate-500 cursor-not-allowed"
                      : "hover:border-red-500/20 hover:bg-red-500/10 text-slate-400 hover:text-red-400"
                  }`}
                >
                  {loggingOut ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </>
                  )}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="bg-[#02040a] text-slate-200 min-h-screen font-sans flex relative overflow-hidden">
      {/* 🌌 AMBIENT BACKGROUND GLOWS */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-[20%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-teal-600/5 rounded-full blur-[110px] animate-pulse [animation-delay:2s]" />
        
        {/* Grid Line overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* ── 1. LEFT SIDEBAR (The Command Center) ── */}
      <aside className="w-72 border-r border-white/5 bg-[#06080d]/30 backdrop-blur-xl flex flex-col justify-between shrink-0 hidden lg:flex relative z-20">
        <div className="p-6">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-black tracking-widest text-white font-mono uppercase">
              Webpage<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "Overview", icon: Layout },
              { id: "projects", label: "My Projects", icon: Folder, badge: pages.length },
              { id: "templates", label: "Templates", icon: LayoutTemplate },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
              { id: "settings", label: "Settings", icon: Settings },
              { id: "billing", label: "Billing", icon: CreditCard }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-emerald-400" : ""}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Workspace Profile Footer */}
        <div className="p-6 border-t border-white/5 bg-black/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-white/10 flex items-center justify-center text-xs text-emerald-300 font-bold uppercase">
                {session?.user?.name ? session.user.name[0] : <User className="w-4 h-4" />}
              </div>
              <div className="truncate max-w-[140px]">
                <p className="text-xs font-bold text-white leading-none truncate">{session?.user?.name || "AI Architect"}</p>
                <p className="text-[10px] text-slate-500 mt-1 truncate">{session?.user?.email || "architect@webpageai.com"}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/5 text-xs font-bold transition-all ${
              loggingOut
                ? "bg-white/5 border-white/10 text-slate-500 cursor-not-allowed"
                : "hover:border-red-500/20 hover:bg-red-500/10 text-slate-400 hover:text-red-400"
            }`}
          >
            {loggingOut ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── 2. MAIN WORKING INTERFACE AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        
        {/* TOPBAR (Search, Assist, Notifications) */}
        <header className="h-20 border-b border-white/5 px-4 sm:px-8 flex items-center justify-between backdrop-blur-md sticky top-0 bg-[#02040a]/80 z-30">
          <div className="flex items-center gap-2 sm:gap-4 w-full max-w-[200px] sm:max-w-xs md:w-96">
            {/* Mobile Hamburger menu toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <button 
                onClick={() => setShowMobileMenu(true)} 
                className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search templates or generated sites..."
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* AI Assistant Quick Tooltip */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={openModal}
              className="px-4 py-2 text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/15 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              AI Console
            </motion.button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title={!mounted ? "Loading Theme" : theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {!mounted ? (
                <div className="w-4 h-4 rounded-full bg-white/10" />
              ) : theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 animate-[spin_30s_linear_infinite]" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Notifications Alert Bell */}
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-10">
          {activeTab === "dashboard" && (
            <>
              {/* STATS ANALYTICS WIDGETS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Active Project Websites", count: pages.length, desc: "Created multi-page masterpieces", icon: FolderOpen, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                  { label: "Total Compiled HTMLs", count: pages.length, desc: "Ready self-contained ZIP downloads", icon: Download, color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
                  { label: "AI Generative Credits", count: "100 / 100", desc: "Refreshes automatically monthly", icon: Sparkles, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" }
                ].map((stat, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/5 bg-[#06080d]/40 p-6 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl font-black text-white mt-2 tracking-tight">{stat.count}</p>
                      <p className="text-xs text-slate-400 mt-1">{stat.desc}</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* DYNAMIC WELCOME BANNER & QUICK GENERATE LAUNCHER */}
              <div className="rounded-3xl border border-white/5 bg-linear-to-r from-emerald-500/10 via-[#06080d]/40 to-teal-500/5 p-8 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[70px] pointer-events-none" />
                
                <div className="max-w-2xl relative z-10">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    Welcome back, <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">{session?.user?.name || "AI Creator"}</span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    Unlock full startup-grade websites in seconds. Click below to initialize a high-fidelity workspace and begin drafting multi-page templates.
                  </p>
                  
                  <div className="mt-8">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={openModal}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-sm font-extrabold text-white shadow-xl shadow-emerald-500/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Generate New Website
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* RECENT PROJECTS CONTAINER */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">Your Generated Projects</h3>
                    <p className="text-xs text-slate-500 mt-1">Review, preview, rename, or purge websites.</p>
                  </div>
                </div>

                {/* EMPTY PROJECTS VIEW */}
                {loading ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
                    {[1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className="relative rounded-2xl border border-white/5 bg-[#06080d]/45 p-6 backdrop-blur-xl shadow-2xl overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-10 h-10 rounded-xl bg-white/5" />
                          <div className="w-16 h-4 rounded-full bg-white/5" />
                        </div>
                        <div className="h-5 w-2/3 bg-white/5 rounded-lg mb-3" />
                        <div className="h-3 w-1/3 bg-white/5 rounded-lg" />
                        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                          <div className="flex gap-2">
                            <div className="h-4 w-12 bg-white/5 rounded" />
                            <div className="h-4 w-12 bg-white/5 rounded" />
                          </div>
                          <div className="flex gap-1">
                            <div className="h-8 w-8 bg-white/5 rounded-lg" />
                            <div className="h-8 w-8 bg-white/5 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pages.length === 0 ? (
                  <div className="text-center rounded-3xl border border-white/5 bg-[#06080d]/20 p-16 backdrop-blur-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
                      <LayoutTemplate className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white">No creations compiled yet</h4>
                    <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
                      Describe a layout or business to save your first futuristic multi-page website project.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={openModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 px-5 py-3 text-xs font-bold text-white transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        Initialize Builder
                      </button>
                    </div>
                  </div>
                ) : (
                  /* GRID OF PRESET WEBSITES */
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pages.map((page, index) => (
                      <motion.div
                        key={page.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -6 }}
                        className="group relative rounded-2xl border border-white/5 bg-[#06080d]/45 p-6 backdrop-blur-xl shadow-2xl hover:border-emerald-500/30 transition-all duration-300"
                      >
                        {/* Device Visual Header representation */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <LayoutTemplate className="h-5 w-5 group-hover:rotate-6 transition-transform" />
                          </div>
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            SPA Router
                          </span>
                        </div>

                        {/* Website Metadata */}
                        <h4 className="text-base font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                          {page.name}
                        </h4>
                        
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide mt-2" suppressHydrationWarning>
                          Created {new Date(page.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>

                        {/* Dashboard controls footer */}
                        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openProjectSimulator(page)}
                              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                            >
                              View Demo
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-white/10 select-none">|</span>
                            <Link
                              href={`/preview/${page.id}`}
                              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                              Preview
                              <ExternalLink className="w-3 h-3 opacity-55" />
                            </Link>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openRenameModal(page.id, page.name);
                              }}
                              className="p-2 rounded-lg text-slate-500 hover:text-emerald-300 hover:bg-white/5 transition-all"
                              title="Rename Site"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(page.id);
                              }}
                              disabled={deletingId === page.id}
                              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Delete Site"
                            >
                              {deletingId === page.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Your Compiled Multi-Page Websites</h3>
                  <p className="text-xs text-slate-500 mt-1">Directly manage, preview, or export generated projects from database.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openModal}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-xs font-bold text-white shadow-xl shadow-emerald-500/25 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </motion.button>
              </div>

              {/* EMPTY PROJECTS VIEW */}
              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
                  {[1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl border border-white/5 bg-[#06080d]/45 p-6 backdrop-blur-xl shadow-2xl overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-10 rounded-xl bg-white/5" />
                        <div className="w-16 h-4 rounded-full bg-white/5" />
                      </div>
                      <div className="h-5 w-2/3 bg-white/5 rounded-lg mb-3" />
                      <div className="h-3 w-1/3 bg-white/5 rounded-lg" />
                      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex gap-2">
                          <div className="h-4 w-12 bg-white/5 rounded" />
                          <div className="h-4 w-12 bg-white/5 rounded" />
                        </div>
                        <div className="flex gap-1">
                          <div className="h-8 w-8 bg-white/5 rounded-lg" />
                          <div className="h-8 w-8 bg-white/5 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : pages.length === 0 ? (
                <div className="text-center rounded-3xl border border-white/5 bg-[#06080d]/20 p-16 backdrop-blur-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
                    <LayoutTemplate className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">No creations compiled yet</h4>
                  <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
                    Describe a layout or business to save your first futuristic multi-page website project.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={openModal}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 px-5 py-3 text-xs font-bold text-white transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Initialize Builder
                    </button>
                  </div>
                </div>
              ) : (
                /* GRID OF PRESET WEBSITES */
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pages.map((page, index) => (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="group relative rounded-2xl border border-white/5 bg-[#06080d]/45 p-6 backdrop-blur-xl shadow-2xl hover:border-emerald-500/30 transition-all duration-300"
                    >
                      {/* Device Visual Header representation */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <LayoutTemplate className="h-5 w-5 group-hover:rotate-6 transition-transform" />
                        </div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          SPA Router
                        </span>
                      </div>

                      {/* Website Metadata */}
                      <h4 className="text-base font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                        {page.name}
                      </h4>
                      
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide mt-2" suppressHydrationWarning>
                        Created {new Date(page.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>

                      {/* Dashboard controls footer */}
                      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openProjectSimulator(page)}
                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                          >
                            View Demo
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-white/10 select-none">|</span>
                          <Link
                            href={`/preview/${page.id}`}
                            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            Preview
                            <ExternalLink className="w-3 h-3 opacity-55" />
                          </Link>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openRenameModal(page.id, page.name);
                            }}
                            className="p-2 rounded-lg text-slate-500 hover:text-emerald-300 hover:bg-white/5 transition-all"
                            title="Rename Site"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(page.id);
                            }}
                            disabled={deletingId === page.id}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete Site"
                          >
                            {deletingId === page.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "templates" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-white">Generative Blueprint Templates</h3>
                <p className="text-xs text-slate-500 mt-1">Select a premium pre-engineered structure to kickstart your Next-Gen website compiler instantly.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    id: "saas",
                    name: "CloudSync SaaS Hub",
                    desc: "A futuristic dark-mode SaaS dashboard template containing grid lists, price segments, and contact pages.",
                    accent: "emerald",
                    badge: "Dark SaaS",
                    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                    glow: "from-emerald-500/10 via-[#06080d]/40 to-teal-500/5",
                    pages: ["Home", "Features", "Pricing", "Contact"],
                    prompt: "Create a premium dark mode SaaS dashboard platform named 'CloudSync'. The layout must match the CloudSync Hub preview with these exact elements: Navigation must have Logo 'CloudSync', desktop nav links (Features, Pricing, Contact) in sleek tiny gray text, and a glowing green 'Get Started' button. The Home section must have a central glowing green badge 'Sync Engine v2.0', a bold header 'Sync your enterprise data in real-time', a slate subheadline 'Deploy secure distributed databases, sync states globally, and track anomalies inside a single glowing command center', and two primary/secondary action buttons. Include a 3-column Bento grid featuring zero-trust, global edge latency metrics, and automations. The features page must outline active data nodes. The pricing section must include a clean tier grid (Free, Pro, Enterprise) with an interactive monthly/annual billing toggle in Javascript that smoothly animates and updates prices. The contact page must have a glassmorphic form."
                  },
                  {
                    id: "portfolio",
                    name: "Nexus Agency Portfolio",
                    desc: "A sleek minimalist brand portfolio focused on advanced typography, work galleries, and team bios.",
                    accent: "teal",
                    badge: "Minimalist",
                    color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
                    glow: "from-teal-500/10 via-[#06080d]/40 to-emerald-500/5",
                    pages: ["Home", "Works", "About", "Contact"],
                    prompt: "Create a premium, minimalist design agency portfolio website named 'Nexus Studios' with custom dark layouts. The layout must match the Nexus agency portfolio preview with these exact elements: Navigation must have minimal brand signature 'NEXUS / CORE' on the left and a monospaced styled 'MENU //' anchor on the right. The Home section must show high-end typographic headers in large black/white fonts 'WE SHAPE HIGH-END DIGITAL MASTERPIECES', alongside a monospaced paragraph: 'Independent design agency crafting responsive React codebases, custom UI presets, and elegant interactive platforms.' Below the header, include a 2-column clean showcase layout featuring 'DeFi System Design' (Web3 Portal - 2026) and 'Abstract Fluid Graphics' (WebGL Visualizer - 2025) each with a simulated dark canvas card. Include a Works section, a detailed timeline about section, and a minimalist monospaced contact form."
                  },
                  {
                    id: "coffee",
                    name: "Aura Beans Coffee Shop",
                    desc: "A boutique café landing page and interactive product menu with warm brown glassmorphic visual palettes.",
                    accent: "amber",
                    badge: "Local Business",
                    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                    glow: "from-amber-500/10 via-[#06080d]/40 to-orange-500/5",
                    pages: ["Home", "Menu", "Story", "Contact"],
                    prompt: "Create a boutique café landing page named 'Aura Beans Coffee Shop' with an elegant warm-brown glassmorphic visual palette. The layout must match the Aura Beans preview with these exact elements: Navigation must show the brand 'AURA BEANS COFFEE' centered with the thin subtitle 'Established 2026' beneath. The Home section must display a cozy centered text block featuring the italicized quote: 'Grown with love, roasted in micro-lots, brewed with absolute precision.' followed by: 'We source organic, high-altitude coffee beans directly from small farmers worldwide. Each batch is light-roasted to amplify floral and citrus notes.' Below this, place a cozy brews glassmorphic card with amber gradients featuring these exact priced menu items: 1) 'Bourbon Infused Cold Brew' ($6.50) with description 'Whiskey barrel oak hints, double filtered', 2) 'Organic Lavender Matcha Latte' ($5.50) with description 'Ceremonial green tea with fresh blossoms', and 3) 'Himalayan Sea Salt Espresso' ($4.50) with description 'Dark micro-lot with subtle creamy salt foam'. Include a vintage Story section and a contact sheet with warm amber inputs."
                  },
                  {
                    id: "fitness",
                    name: "Vigor Gym & Fitness",
                    desc: "A high-octane dark fitness arena dashboard page highlighting classes, trainer bios, and membership joins.",
                    accent: "rose",
                    badge: "Sport / Vigor",
                    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                    glow: "from-rose-500/10 via-[#06080d]/40 to-pink-500/5",
                    pages: ["Home", "Programs", "Trainers", "Join"],
                    prompt: "Create a high-energy dark-mode fitness gym website named 'Vigor Arena' with energetic rose-pink accents. The layout must match the Vigor fitness preview with these exact elements: Navigation must feature the italic brand logo 'VIGOR ARENA' and an interactive 'Join Gym //' tab. The Home section must feature a massive visual banner box with rose gradient glows, the bold uppercase italic slogan 'NO PAIN. NO LIMITS. UNLEASH VIGOR ARENA.', a description '24/7 Premium turf, olympic power racks, and expert metabolic coaches waiting for you.', and a glowing pink action button 'Claim 1-Day VIP Pass'. Include a 2-column classes grid highlighting 'HIIT Conditioning' (Daily 8:00 AM) and 'Barbell Powerlifting' (Daily 6:00 PM). Include a Programs listing page, Trainer schedules/bios, and a contact sheet with glowing rose inputs."
                  },
                  {
                    id: "agency",
                    name: "Vertex Creative Agency",
                    desc: "A premium glassmorphic marketing agency portal focusing on custom digital bento services and client briefs.",
                    accent: "cyan",
                    badge: "Agency",
                    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
                    glow: "from-cyan-500/10 via-[#06080d]/40 to-blue-500/5",
                    pages: ["Home", "Services", "Case Studies", "Contact"],
                    prompt: "Create a premium glassmorphic marketing agency website named 'Vertex Agency' with vibrant cyan-blue accents. The layout must match the Vertex agency preview with these exact elements: Navigation must show the brand 'VERTEX.' and a cyan 'Services //' navigation tab. The Home section must show a bold hero section stating 'We drive average 400% ROI conversions' with beautiful cyan gradients and a description 'Vertex crafts data-driven organic funnels, responsive web components, and optimized digital footprints for venture startups.' Below the hero, place a custom cyan-glow testimonial panel featuring the quote: 'The Vertex crew scaled our monthly lead generation flow by 6x in under 90 days. Their system is absolute magic.' signed by 'Sarah Jenkins, VP Marketing, FinFlow'. Include a bento grid listing custom marketing services, case files, and a briefing contact form."
                  },
                  {
                    id: "startup",
                    name: "CyberCore Tech Startup",
                    desc: "A high-fidelity neon startup template loaded with interactive command line panels and active data streams.",
                    accent: "emerald",
                    badge: "AI Tech",
                    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                    glow: "from-emerald-500/15 via-[#06080d]/40 to-teal-500/5",
                    pages: ["Home", "Tech Stack", "Pricing", "Console"],
                    prompt: "Create a futuristic neon-emerald tech startup landing page named 'CyberCore' with cyberpunk themes and terminal frames. The layout must match the CyberCore tech startup preview with these exact elements: Navigation must show monospaced brand logo 'CYBERCORE // TERMINAL' and a health indicator 'SYSTEM_STABLE: 100%'. The Home section must contain a realistic terminal element titled 'core_node_active.sh' with a green state dot showing a simulated command line sequence: '$ cybercore --init --style=cyber-emerald', followed by active status rows: '✓ Resolving cybernetic grid layout anchors...', '✓ Ingesting multi-page structural nodes...', and '✓ Status: ACTIVE. Secure client routing online.' Next to it, place the action console stating 'Spawn Fully Autonomous AI Frameworks', describing: 'Deploy serverless modules with self-contained styling in one tap.', and a glowing neon-emerald CTA button 'Initialize Cyber Terminal'. Include tech stack details, pricing modules, and a console interface form."
                  }
                ].map((tpl) => (
                  <motion.div
                    key={tpl.id}
                    whileHover={{ y: -6 }}
                    className="group relative rounded-2xl border border-white/5 bg-[#06080d]/45 p-6 backdrop-blur-xl shadow-2xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="flex items-center justify-between mb-5">
                        <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${tpl.color}`}>
                          {tpl.badge}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {tpl.pages.length} Pages
                        </span>
                      </div>

                      {/* Content */}
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {tpl.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                        {tpl.desc}
                      </p>

                      {/* Included Pages Badges */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {tpl.pages.map((pg, i) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-sans border border-white/[0.02]">
                            {pg}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-8 border-t border-white/5 pt-4 flex gap-2.5">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setPreviewingTemplate(tpl);
                          setShowPreviewModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all shadow-md"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        View Demo
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openTemplateModal(tpl)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-black text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-md shadow-emerald-500/5 group-hover:shadow-emerald-500/10"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white transition-colors" />
                        Use Template
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ── ✅ ANALYTICS TAB SECTION ── */}
          {activeTab === "analytics" && <AnalyticsTab />}

          {/* ── ✅ SETTINGS TAB SECTION ── */}
          {activeTab === "settings" && (
            <SettingsTab
              userName={session?.user?.name}
              userEmail={session?.user?.email}
            />
          )}

          {/* ── ✅ BILLING TAB SECTION ── */}
          {activeTab === "billing" && <BillingTab />}
        </main>
      </div>

      {/* ── ✅ PROJECTS / WEBSITE CREATE DIALOG MODAL (Preserved Logic) ── */}
      <ProjectNameModal
        isOpen={showNameModal}
        onClose={handleClose}
        title="New Website"
        subtitle="Let's name your project"
        projectName={projectName}
        setProjectName={setProjectName}
        onSubmit={confirmAndNavigate}
        buttonText="Create & Continue"
      />

      {/* ── ✅ RENAME DIALOG MODAL (Preserved Logic) ── */}
      <ProjectNameModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        title="Rename Site"
        subtitle="Let's edit project name"
        projectName={editProjectName}
        setProjectName={setEditProjectName}
        onSubmit={handleRename}
        buttonText="Save Changes"
        isLoading={renaming}
      />

      {/* ── ✅ TEMPLATE PREVIEW DIALOG MODAL (Browser Simulator) ── */}
      <TemplateBrowserPreview
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        template={previewingTemplate}
        onUseTemplate={(tpl) => {
          if (tpl.isUserProject) {
            router.push(`/preview/${tpl.id}`);
          } else {
            openTemplateModal({
              id: tpl.id,
              name: tpl.name,
              prompt: tpl.prompt || "",
              accent: tpl.accent
            });
          }
        }}
      />
    </div>
    </>
  );
}