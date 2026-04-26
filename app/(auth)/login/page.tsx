"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 mesh-gradient relative overflow-hidden text-white">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <span className="text-xl font-bold font-[var(--font-sora)]">
            Exam<span className="text-cyan-300">Nurture</span>
          </span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 max-w-md"
        >
          <h1 className="text-4xl font-bold font-[var(--font-sora)] leading-tight mb-4">
            Welcome back to your preparation journey
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Access thousands of mock tests, detailed analytics, and personalized weak area detection.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="flex -space-x-3">
               <div className="w-10 h-10 rounded-full border-2 border-blue-900 bg-gray-300"></div>
               <div className="w-10 h-10 rounded-full border-2 border-blue-900 bg-gray-400"></div>
               <div className="w-10 h-10 rounded-full border-2 border-blue-900 bg-gray-500"></div>
             </div>
             <p>Join 10,000+ students cracking exams</p>
          </div>
        </motion.div>

        <p className="relative z-10 text-sm text-white/50">© 2026 ExamNurture. All rights reserved.</p>
        
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-400 mix-blend-overlay blur-3xl opacity-50 pulse-ring"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500 mix-blend-overlay blur-3xl opacity-30"></div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-[9px] flex items-center justify-center bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <span className="text-[16px] font-bold font-[var(--font-sora)]">
              Exam<span className="text-[var(--cyan)]">Nurture</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-2 font-[var(--font-sora)] text-[var(--ink-1)]">
            Sign In
          </h2>
          <p className="text-[var(--ink-3)] mb-8">
            Enter your credentials to access your account.
          </p>

          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--ink-2)]">Email or Mobile</label>
              <input
                type="text"
                placeholder="rahul@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border border-[var(--line)] bg-[var(--card)] text-[var(--ink-1)] focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--ink-2)]">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all border border-[var(--line)] bg-[var(--card)] text-[var(--ink-1)] focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-4)] hover:text-[var(--ink-2)] transition-colors"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <a href="#" className="text-xs font-medium text-[var(--blue)] hover:underline underline-offset-4">
                  Forgot password?
                </a>
              </div>
            </div>

            <Link href="/dashboard" className="w-full mt-2">
              <Button size="lg" className="w-full text-base group">
                Sign In 
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-[1px] bg-[var(--line)]" />
              <span className="text-xs text-[var(--ink-4)] uppercase tracking-wider font-medium">Or</span>
              <div className="flex-1 h-[1px] bg-[var(--line)]" />
            </div>

            <Button variant="outline" size="lg" type="button" className="w-full gap-3 text-base">
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
              </svg>
              Continue with Google
            </Button>
          </form>

          <p className="text-center text-sm mt-8 text-[var(--ink-3)]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[var(--blue)] hover:underline underline-offset-4">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
