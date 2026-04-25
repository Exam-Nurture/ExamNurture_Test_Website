"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

const EXAMS = ["JEE Main", "JEE Advanced", "NEET", "BITSAT", "MHT CET", "Other"];

export default function RegisterPage() {
  const [exam, setExam] = useState("JEE Main");

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--blue), var(--cyan))" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <span className="text-[18px] font-bold" style={{ fontFamily: "var(--font-sora)" }}>
            Exam<span style={{ color: "var(--cyan)" }}>Nurture</span>
          </span>
        </div>

        <h1 className="text-[26px] font-bold mb-1" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
          Create your account
        </h1>
        <p className="text-[13px] mb-7" style={{ color: "var(--ink-3)" }}>
          Start your exam prep journey for free
        </p>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name" placeholder="Rahul" type="text" />
            <Field label="Last Name"  placeholder="Sharma" type="text" />
          </div>
          <Field label="Email" placeholder="rahul@example.com" type="email" />
          <Field label="Mobile" placeholder="+91 98765 43210" type="tel" />

          {/* Target exam */}
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink-2)" }}>
              Target Exam
            </label>
            <div className="relative">
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full appearance-none px-3.5 py-3 pr-9 rounded-[10px] text-[14px] outline-none transition-all"
                style={{ border: "1px solid var(--line)", background: "white", color: "var(--ink-1)" }}
              >
                {EXAMS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ink-3)" }} />
            </div>
          </div>

          <Field label="Password" placeholder="Minimum 8 characters" type="password" />

          {/* Terms */}
          <p className="text-[12px]" style={{ color: "var(--ink-3)" }}>
            By signing up you agree to our{" "}
            <a href="#" style={{ color: "var(--blue)" }}>Terms of Service</a> and{" "}
            <a href="#" style={{ color: "var(--blue)" }}>Privacy Policy</a>.
          </p>

          <Link
            href="/dashboard"
            className="w-full py-3 rounded-[10px] text-[14px] font-semibold text-white text-center flex items-center justify-center gap-2 transition-all hover:brightness-105"
            style={{ background: "var(--blue)", boxShadow: "0 6px 16px -4px rgba(37,99,235,.45)" }}
          >
            Create Account <ArrowRight size={16} />
          </Link>
        </form>

        <p className="text-center text-[13px] mt-5" style={{ color: "var(--ink-3)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "var(--blue)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type }: { label: string; placeholder: string; type: string }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink-2)" }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3.5 py-3 rounded-[10px] text-[14px] outline-none transition-all"
        style={{ border: "1px solid var(--line)", background: "white", color: "var(--ink-1)" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
      />
    </div>
  );
}
