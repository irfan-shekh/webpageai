"use client";

import React, { useState } from 'react';
import { signUp, signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, UserPlus, User, Mail, Lock, Sparkles, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signUp.email({ name, email, password });
      if (res.error) {
        toast.error(res.error.message || 'Signup failed');
      } else {
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    try {
      await signIn.social({
        provider,
        callbackURL: '/dashboard',
      });
    } catch (err) {
      toast.error(`Failed to sign up with ${provider}`);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden bg-[#030712]">
      {/* Dynamic Glassmorphic Glow Backdrops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-teal-500/10 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[110px] animate-bounce" style={{ animationDuration: '10s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="relative w-full max-w-[460px] z-10"
      >
        <div className="relative group">
          {/* Neon Border Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-[2.5rem] blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>

          {/* Premium Form Card */}
          <div className="relative bg-[#0b0f19]/60 border border-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-10 sm:p-12">
            <div className="text-center mb-10">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl mb-6 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              >
                <UserPlus className="w-8 h-8 text-black font-extrabold" />
              </motion.div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">Join the Future</h2>
              <p className="text-xs text-slate-400 font-medium tracking-wide">Create your AI-powered workspace</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors z-10" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="block w-full rounded-2xl border border-white/5 bg-[#030712]/40 pl-12 pr-4 py-4 text-xs text-white placeholder:text-slate-600 transition-all focus:bg-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 outline-none"
                />
              </div>

              {/* Email Input */}
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors z-10" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="block w-full rounded-2xl border border-white/5 bg-[#030712]/40 pl-12 pr-4 py-4 text-xs text-white placeholder:text-slate-600 transition-all focus:bg-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 outline-none"
                />
              </div>

              {/* Password Input */}
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors z-10" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Password"
                  className="block w-full rounded-2xl border border-white/5 bg-[#030712]/40 pl-12 pr-4 py-4 text-xs text-white placeholder:text-slate-600 transition-all focus:bg-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 outline-none"
                />
              </div>

              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ y: 0, scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden group py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs tracking-wider transition-all hover:from-emerald-450 hover:to-teal-450 disabled:opacity-50 shadow-lg shadow-emerald-500/15"
              >
                <div className="relative z-10 flex justify-center items-center gap-1.5">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <>
                      <span>GET STARTED</span>
                      <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </div>
                {/* Visual Shine Overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:animate-shine" />
              </motion.button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">or continue with</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  type="button"
                  onClick={() => handleSocialSignIn('google')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-white/5 bg-[#030712]/40 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.64l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  type="button"
                  onClick={() => handleSocialSignIn('github')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-white/5 bg-[#030712]/40 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span>GitHub</span>
                </motion.button>
              </div>
            </form>

            <p className="mt-10 text-center text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-white hover:text-emerald-400 font-extrabold transition-all underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

