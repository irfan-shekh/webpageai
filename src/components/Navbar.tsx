"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { Sparkles, LogOut, User, Loader2, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [theme, setTheme] = React.useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as "dark" | "light";
      return saved || "dark";
    }
    return "dark";
  });

  React.useEffect(() => {
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

  React.useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  // Hide Navbar on dashboard and live preview canvas routes
  if (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/preview')
  ) {
    return null;
  }

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut();
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Failed to log out');
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

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#02040a]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Home"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight font-mono uppercase">
                Webpage<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-1.5 text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
              >
                Home
              </Link>

              <div className="flex items-center min-w-[100px] justify-end gap-3">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer mr-1"
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
                {!mounted || isPending ? (
                  /* Skeleton Loader: Matches the shape of the buttons to prevent jumping */
                  <div className="h-8 w-24 animate-pulse rounded-full bg-white/10" />
                ) : session ? (
                  <>
                    {/* Dashboard Button */}
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/30 transition-all"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Dashboard</span>
                    </Link>

                    {/* User Avatar (Simplified for speed) */}
                    <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 pr-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white max-w-[100px] truncate">
                        {session.user.name || 'User'}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className={`p-2 transition-colors ${loggingOut ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-red-400'}`}
                      title="Logout"
                    >
                      {loggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-lg shadow-emerald-600/10 transition-all"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}