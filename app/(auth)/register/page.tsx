"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const EXAM_GROUPS = [
  { group: "State PSC",     exams: ["JPSC Prelims", "BPSC Prelims", "UPPSC Prelims", "MPSC Prelims", "RPSC Prelims"] },
  { group: "Banking",       exams: ["SBI PO", "IBPS PO", "RBI Grade B", "SBI Clerk", "IBPS Clerk", "RBI Assistant"] },
  { group: "Police / SI",   exams: ["UP Daroga / SI", "Jharkhand Daroga", "Bihar SI", "Rajasthan SI", "MP SI"] },
  { group: "SSC",           exams: ["SSC CGL", "SSC CHSL", "SSC CPO", "SSC MTS", "SSC GD Constable"] },
  { group: "Railway",       exams: ["RRB NTPC", "RRB Group D", "RRB ALP", "RPF Constable"] },
  { group: "University",    exams: ["UET Jharkhand", "BHU UET", "DU Entrance", "JNU Entrance"] },
  { group: "Other",         exams: ["Other / Not listed"] },
];

export default function RegisterPage() {
  const [exam, setExam] = useState("JPSC Prelims");

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Left — Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] my-auto"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <span className="text-xl font-bold font-[var(--font-sora)] text-[var(--ink-1)]">
              Exam<span className="text-[var(--cyan)]">Nurture</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2 font-[var(--font-sora)] text-[var(--ink-1)]">
            Create your account
          </h1>
          <p className="text-[var(--ink-3)] mb-8">
            Start your exam prep journey for free — no credit card required
          </p>

          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" placeholder="Rahul" type="text" />
              <Field label="Last Name"  placeholder="Sharma" type="text" />
            </div>
            <Field label="Email"  placeholder="rahul@example.com" type="email" />
            <Field label="Mobile" placeholder="+91 98765 43210"  type="tel" />

            {/* Target exam — grouped select */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--ink-2)]">Primary Target Exam</label>
              <div className="relative">
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full appearance-none px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all border border-[var(--line)] bg-[var(--card)] text-[var(--ink-1)] focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
                >
                  {EXAM_GROUPS.map((g) => (
                    <optgroup key={g.group} label={g.group}>
                      {g.exams.map((ex) => (
                        <option key={ex} value={ex}>{ex}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--ink-3)]"
                />
              </div>
            </div>

            <Field label="Password" placeholder="Minimum 8 characters" type="password" />

            <p className="text-xs text-[var(--ink-3)]">
              By signing up you agree to our{" "}
              <a href="#" className="text-[var(--blue)] hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-[var(--blue)] hover:underline">Privacy Policy</a>.
            </p>

            <Link href="/dashboard" className="w-full mt-2">
              <Button size="lg" className="w-full text-base group">
                Create Account
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </form>

          <p className="text-center text-sm mt-8 text-[var(--ink-3)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--blue)] hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right — Features Panel */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-12 mesh-gradient relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-lg mx-auto"
        >
          <div className="glass p-10 rounded-2xl border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold font-[var(--font-sora)] mb-6 text-white">
              Why choose ExamNurture?
            </h2>
            <div className="space-y-6">
              {[
                { title: "200+ Previous Year Papers", desc: "Practice with actual exam questions from past years." },
                { title: "AI-powered Analysis", desc: "Instantly discover your weak areas and get personalized study recommendations." },
                { title: "Real-time State Rank", desc: "See exactly where you stand against thousands of other aspirants." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">{feature.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-6 border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-white/80 font-medium">4.8/5 from 2,000+ reviews</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-cyan-400 mix-blend-overlay blur-3xl opacity-40 wave"></div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type }: { label: string; placeholder: string; type: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[var(--ink-2)]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border border-[var(--line)] bg-[var(--card)] text-[var(--ink-1)] focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]"
      />
    </div>
  );
}
