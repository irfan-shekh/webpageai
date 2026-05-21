"use client";

import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import {
    Sparkles,
    Zap,
    Palette,
    LayoutTemplate,
    FolderOpen,
    X,
    Send,
    Layout,
    ArrowRight,
    CheckCircle2,
    Globe,
    MousePointer2,
    Layers,
    MessageSquare,
    BarChart3,
    Rocket,
    Play,
    Plus,
    Activity,
    Lock,
    Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Quick visual showcase item interface
interface ShowcaseCard {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    glow: string;
}

export default function Home() {
    const router = useRouter();
    const { data: session } = useSession();

    const [showNameModal, setShowNameModal] = useState(false);
    const [projectName, setProjectName] = useState("");
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Auto-typing text suggestions for hero prompt area
    const promptSuggestions = [
        "Create a sleek dark mode SaaS website with glowing emerald cards...",
        "A premium boutique coffee shop website named Specialty Sage Beans...",
        "A high-end crypto dashboard with futuristic cyber mint accents...",
        "A minimalist design studio portfolio with sharp grid lines..."
    ];
    const [typingText, setTypingText] = useState("");
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (showNameModal) {
            setTimeout(() => nameInputRef.current?.focus(), 80);
        }
    }, [showNameModal]);

    // Typing effect loop
    useEffect(() => {
        const currentSuggestion = promptSuggestions[suggestionIndex];
        let timer: NodeJS.Timeout;

        if (isDeleting) {
            if (charIndex === 0) {
                timer = setTimeout(() => {
                    setIsDeleting(false);
                    setSuggestionIndex(prev => (prev + 1) % promptSuggestions.length);
                }, 500);
            } else {
                timer = setTimeout(() => {
                    setTypingText(currentSuggestion.substring(0, charIndex - 1));
                    setCharIndex(prev => prev - 1);
                }, 30);
            }
        } else {
            if (charIndex === currentSuggestion.length) {
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, 2500);
            } else {
                timer = setTimeout(() => {
                    setTypingText(currentSuggestion.substring(0, charIndex + 1));
                    setCharIndex(prev => prev + 1);
                }, 60);
            }
        }

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, suggestionIndex]);

    const handleGenerateClick = () => {
        if (!session) {
            toast.error('Please sign in to continue');
            router.push('/login');
        } else {
            setShowNameModal(true);
        }
    };

    const confirmAndNavigate = () => {
        if (!projectName.trim()) return;
        const slug = projectName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        router.push(`/generate?name=${slug}`);
    };

    const handleDashboardClick = () => {
        if (!session) {
            toast.error('Please sign in to access the dashboard');
            router.push('/login');
        } else {
            router.push('/dashboard');
        }
    };

    const handleClose = () => {
        if (projectName.trim()) {
            if (!confirm("Discard project name?")) return;
        }
        setShowNameModal(false);
    };

    // Features data list matching brand new color scheme
    const featuresList: ShowcaseCard[] = [
        {
            title: "Multi-Page Architect",
            description: "Automatically crafts complete sites containing Home, Services, Pricing, and Contact sections mapped to sub-routes.",
            icon: Layout,
            color: "from-emerald-500 to-teal-600",
            glow: "rgba(16,185,129,0.15)"
        },
        {
            title: "Instant Single Page Router",
            description: "Embedded click-intercepting routing engine guarantees that page swaps happen naturally and instantly without reloads.",
            icon: Zap,
            color: "from-teal-400 to-emerald-500",
            glow: "rgba(20,184,166,0.15)"
        },
        {
            title: "Futuristic Visual Engine",
            description: "Uses vibrant dark themes, custom auroras, sleek modern typography, and glassmorphism styling to wow visitors.",
            icon: Palette,
            color: "from-emerald-400 to-cyan-500",
            glow: "rgba(52,211,153,0.15)"
        },
        {
            title: "100% Portable ZIP Exports",
            description: "Export clean, production-ready, fully self-contained HTML files with Tailwind CSS bundled right in.",
            icon: Globe,
            color: "from-teal-500 to-emerald-600",
            glow: "rgba(20,184,166,0.15)"
        }
    ];

    return (
        <div className="bg-[#02040a] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden relative min-h-screen">
            {/* 🌌 DYNAMIC GLOWING BACKGROUND ORBS */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* Emerald and Sage Auroras */}
                <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_60%)] rounded-full blur-[140px] animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(52,211,153,0.07),transparent_60%)] rounded-full blur-[120px] animate-pulse [animation-delay:1.5s]" />
                <div className="absolute bottom-[10%] left-[10%] w-[45vw] h-[45vw] bg-[radial-gradient(circle,rgba(6,182,212,0.08),transparent_60%)] rounded-full blur-[130px] animate-pulse [animation-delay:3s]" />
                
                {/* Tech Grid Backdrop */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* ── HERO / GENERATOR INTERFACE SECTION ── */}
            <section className="relative pt-32 pb-40 border-b border-white/5">
                <div className="container mx-auto px-6 max-w-7xl relative">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Floating Subtitle Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-xl backdrop-blur-md"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin [animation-duration:8s]" />
                            <span>Next-Gen AI Web Compiler</span>
                        </motion.div>

                        {/* Title with Gradient Text */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tight mb-8 leading-[1.05]"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            Compile Futuristic
                            <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(16,185,129,0.25)]">
                                Multi-Page Websites
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed"
                        >
                            Describe your layout or business ecosystem, and our cyber-emerald compiler constructs a fully responsive, highly interactive multi-page SPA in real-time.
                        </motion.p>

                        {/* Centered Futuristic AI Prompt Command Console */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative max-w-3xl mx-auto rounded-[2rem] border border-white/5 bg-[#080d1a]/40 p-3 shadow-2xl backdrop-blur-2xl"
                        >
                            {/* Glass background light source */}
                            <div className="absolute inset-0 rounded-[2rem] bg-linear-to-r from-emerald-500/5 to-teal-500/5 opacity-30 pointer-events-none" />

                            <div className="relative flex flex-col md:flex-row items-center gap-3">
                                {/* Prompt Shell Icon */}
                                <div className="flex items-center gap-2 pl-4 text-slate-500 hidden md:flex">
                                    <Sparkles className="w-5 h-5 text-emerald-400" />
                                    <span className="text-xs font-bold font-mono tracking-widest uppercase">AI:</span>
                                </div>

                                {/* Dynamic Typing Placeholder Input Visual */}
                                <div className="w-full text-left bg-black/30 border border-white/5 rounded-xl px-5 py-4 text-slate-400 text-sm font-medium h-[54px] flex items-center overflow-hidden">
                                    <span className="font-mono text-emerald-300 mr-2 shrink-0">&gt;</span>
                                    <span className="truncate text-slate-300 font-sans">{typingText}</span>
                                    <span className="w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />
                                </div>

                                {/* CTA Buttons Group */}
                                <div className="flex w-full md:w-auto items-center gap-3 shrink-0">
                                    {session ? (
                                        <>
                                            <button
                                                onClick={handleDashboardClick}
                                                className="w-full md:w-auto px-6 py-4 rounded-xl text-sm font-bold text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 transition-all backdrop-blur-md"
                                            >
                                                Dashboard
                                            </button>
                                            <button
                                                onClick={handleGenerateClick}
                                                className="w-full md:w-auto relative group flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-300"
                                            >
                                                <Rocket className="w-4 h-4 text-emerald-200 group-hover:animate-bounce" />
                                                Build Site
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => router.push('/login')}
                                            className="w-full md:w-auto px-8 py-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            Get Started Free
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── BENTO GRID FEATURES SECTION ── */}
            <section className="py-32 border-b border-white/5 bg-[#040811]/30 relative">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Architected For Visual Perfection
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
                            Under the hood, WebpageAI bundles advanced performance frameworks with gorgeous visual layers natively.
                        </p>
                    </div>

                    {/* Bento Layout Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuresList.map((feat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative rounded-3xl border border-white/5 p-8 backdrop-blur-xl transition-all duration-300"
                                style={{
                                    background: "rgba(8, 12, 22, 0.45)",
                                    boxShadow: `0 15px 40px -10px ${feat.glow}`
                                }}
                            >
                                <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                
                                {/* Glowing colored icon capsule */}
                                <div className={`inline-flex p-3 rounded-2xl bg-linear-to-br ${feat.color} text-white mb-8 shadow-lg`}>
                                    <feat.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-emerald-300 transition-colors">
                                    {feat.title}
                                </h3>
                                
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {feat.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BREATHTAKING PORTFOLIO MULTI-PAGE SHOWCASE ── */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                                <Activity className="w-3.5 h-3.5" />
                                <span>World-Class Custom Components</span>
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                Live Preview Canvas & Real-time Edits
                            </h2>
                            <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                                Our dynamic builder workspace features a live responsive preview device simulator. Swap layouts from desktop to mobile instantly, modify branding elements, or type custom directives to the AI to re-orchestrate code block components in real-time.
                            </p>
                            
                            <div className="space-y-4">
                                {[
                                    "Stunning pre-integrated dark modes and glassmorphism styling presets.",
                                    "Embedded click-intercepting router runs without any browser reloads.",
                                    "Zero clutter: download perfectly organized clean code bundle in a single click."
                                ].map((bullet, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <span className="text-slate-300 text-sm leading-normal">{bullet}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Premium mockup display */}
                        <div className="w-full lg:w-1/2 relative">
                            {/* Colorful backing glow behind device */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="rounded-2xl border border-white/5 bg-black/60 p-4 shadow-2xl backdrop-blur-md"
                            >
                                <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <div className="h-4 w-32 bg-white/5 rounded mx-auto" />
                                </div>
                                <div className="aspect-video bg-[#04060b] rounded-xl overflow-hidden relative group">
                                    {/* Mockup Image placeholder using elegant overlay */}
                                    <div className="absolute inset-0 bg-linear-to-br from-emerald-950/20 via-[#02040a] to-[#04060b] flex items-center justify-center p-6 text-center">
                                        <div>
                                            <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-bounce" />
                                            <p className="text-white font-bold text-lg tracking-tight">Interactive Preview Simulator</p>
                                            <p className="text-xs text-slate-500 mt-2">Home · Services · Contact · Instant Router</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ACCORDION SECTION ── */}
            <section className="py-32 border-t border-white/5 bg-[#040811]/10">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "How does the multi-page generation work?",
                                a: "Our prompt compiler analyzes your business details and maps out structured HTML sections (e.g. #page-home, #page-services). It then generates a sleek client-side JavaScript router script that intercepts menu links, giving the visitor an instantaneous, animated SPA experience without server-side page reloads."
                            },
                            {
                                q: "Can I download and host the generated website anywhere?",
                                a: "Absolutely! The 'Download HTML' button bundles the entire website (all simulated page routes, customized styling layers, layouts, assets, and the JavaScript router block) into a single clean standard HTML file that you can self-host anywhere, run locally, or deploy to Vercel/Netlify."
                            },
                            {
                                q: "Is the generated website responsive?",
                                a: "Yes, every generated section utilizes robust Tailwind responsive utilities (e.g. grid-cols-1 md:grid-cols-3) to ensure it renders flawlessly on smartphones, tablets, laptops, and massive displays alike."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] p-6 transition-all duration-300">
                                <h4 className="text-lg font-bold text-white mb-2">{item.q}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MODERN FUTURISTIC FOOTER ── */}
            <footer className="border-t border-white/5 py-20 bg-black/60 relative">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 border-b border-white/5 pb-12">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-black text-white tracking-widest uppercase font-mono">
                                Webpage<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">AI</span>
                            </span>
                        </div>
                        <div className="flex gap-6 text-sm text-slate-400">
                            <span className="hover:text-white transition-colors cursor-pointer">Product</span>
                            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
                            <span className="hover:text-white transition-colors cursor-pointer">Docs</span>
                            <span className="hover:text-white transition-colors cursor-pointer">Pricing</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-600 text-xs">
                        <p>© 2026 WebpageAI Inc. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-400">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── ✅ MODAL COMPONENT (Preserved Logic + World-Class Aesthetics) ── */}
            <AnimatePresence>
                {showNameModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none p-4"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-md mx-auto rounded-[2.2rem] border border-white/5 bg-[#06080d] p-8 md:p-10 shadow-2xl pointer-events-auto relative overflow-hidden"
                            >
                                {/* Background glow in modal */}
                                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />

                                <div className="flex justify-between items-center mb-8 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-white/5">
                                            <FolderOpen className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl text-white font-bold tracking-tight font-sans">New Website</h2>
                                            <p className="text-xs text-slate-500 mt-0.5">Let&apos;s name your project</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                                    </button>
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Website Name</label>
                                    <input
                                        ref={nameInputRef}
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && projectName.trim()) {
                                                confirmAndNavigate();
                                            }
                                        }}
                                        placeholder="e.g. Specialty Beans Coffee"
                                        maxLength={60}
                                        className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/40 transition-all text-base"
                                    />
                                </div>

                                <div className="flex flex-col gap-3 mt-8 relative z-10">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={confirmAndNavigate}
                                        disabled={!projectName.trim()}
                                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create & Continue
                                    </motion.button>
                                    <button
                                        onClick={handleClose}
                                        className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}