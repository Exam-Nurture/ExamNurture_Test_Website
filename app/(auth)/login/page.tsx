"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Left — brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10"
        style={{ background: "linear-gradient(135deg, var(--ink-1) 0%, #1E293B 100%)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--blue), var(--cyan))" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <span className="text-[18px] font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
            Exam<span style={{ color: "var(--cyan)" }}>Nurture</span>
          </span>
        </div>

        <div>
          <p className="text-[30px] font-bold text-white leading-snug" style={{ fontFamily: "var(--font-sora)" }}>
            Your smartest study partner for JEE & NEET
          </p>
          <div className="flex flex-col gap-3 mt-6">
            {["180+ Previous Year Papers", "AI-powered weak area detection", "Real-time All India Rank", "Detailed solutions & analytics"].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-[13px] text-white/75">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: "var(--green)" }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-[12px] text-white/40">© 2026 ExamNurture. All rights reserved.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-[9px] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--blue), var(--cyan))" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <span className="text-[16px] font-bold" style={{ fontFamily: "var(--font-sora)" }}>
              Exam<span style={{ color: "var(--cyan)" }}>Nurture</span>
            </span>
          </div>

          <h1 className="text-[26px] font-bold mb-1" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
            Welcome back
          </h1>
          <p className="text-[13px] mb-7" style={{ color: "var(--ink-3)" }}>
            Sign in to continue your exam preparation
          </p>

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink-2)" }}>
                Email or Mobile
              </label>
              <input
                type="text"
                placeholder="rahul@example.com"
                className="w-full px-3.5 py-3 rounded-[10px] text-[14px] outline-none transition-all"
                style={{ border: "1px solid var(--line)", background: "white", color: "var(--ink-1)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink-2)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-3 pr-10 rounded-[10px] text-[14px] outline-none transition-all"
                  style={{ border: "1px solid var(--line)", background: "white", color: "var(--ink-1)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--ink-4)" }}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <a href="#" className="text-[12px] font-medium" style={{ color: "var(--blue)" }}>Forgot password?</a>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full py-3 rounded-[10px] text-[14px] font-semibold text-white text-center flex items-center justify-center gap-2 transition-all hover:brightness-105 mt-1"
              style={{ background: "var(--blue)", boxShadow: "0 6px 16px -4px rgba(37,99,235,.45)" }}
            >
              Sign In <ArrowRight size={16} />
            </Link>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
              <span className="text-[12px]" style={{ color: "var(--ink-4)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
            </div>

            <button
              type="button"
              className="w-full py-3 rounded-[10px] text-[14px] font-medium transition-all hover:bg-[var(--bg)] flex items-center justify-center gap-2.5"
              style={{ border: "1px solid var(--line)", color: "var(--ink-1)" }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/></svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-[13px] mt-6" style={{ color: "var(--ink-3)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold" style={{ color: "var(--blue)" }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
