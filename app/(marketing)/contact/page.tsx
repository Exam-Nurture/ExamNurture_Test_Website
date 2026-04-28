"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ArrowUpRight } from "lucide-react";
import { apiSubmitContact } from "@/lib/api";

const SUBJECTS = [
  "General Inquiry",
  "Test Series / Courses",
  "Mentorship",
  "Technical Support",
  "Partnership / Collaboration",
  "Feedback",
  "Other",
];

const socials = [
  {
    label: "Instagram", href: "https://www.instagram.com/examnurture/",
    hoverBg: "hover:bg-[#E1306C]",
    hoverText: "hover:text-white hover:border-transparent",
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  },
  {
    label: "YouTube", href: "https://www.youtube.com/@examnurture",
    hoverBg: "hover:bg-[#FF0000]",
    hoverText: "hover:text-white hover:border-transparent",
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
  {
    label: "X", href: "https://x.com/ExamNurture2025",
    hoverBg: "hover:bg-black",
    hoverText: "hover:text-white hover:border-transparent",
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    label: "LinkedIn", href: "https://www.linkedin.com/in/examnurture/",
    hoverBg: "hover:bg-[#0A66C2]",
    hoverText: "hover:text-white hover:border-transparent",
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
];

export default function ContactPage() {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await apiSubmitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/80 flex flex-col lg:flex-row">

        {/* ── LEFT: Dark info panel ── */}
        <div className="lg:w-[42%] bg-[#0F172A] p-10 flex flex-col justify-between relative overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-600/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-cyan-500/10 pointer-events-none" />

          <div className="relative">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-12">
              <img src="/examnurture-logo.jpg" alt="ExamNurture" className="w-9 h-9 rounded-xl object-cover" />
              <span className="font-bold text-lg text-white" style={{ fontFamily: "var(--font-sora, sans-serif)" }}>
                Exam<span className="text-cyan-400">Nurture</span>
              </span>
            </Link>

            <h2 className="text-3xl font-extrabold text-white mb-3 leading-snug"
              style={{ fontFamily: "var(--font-sora, sans-serif)" }}>
              Let's talk
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-10">
              Have a question or want to explore a partnership? We're here and reply within 24 hours.
            </p>

            {/* Contact rows */}
            <div className="space-y-6">
              <a href="mailto:info@examnurture.com" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <Mail className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">info@examnurture.com</p>
                </div>
              </a>

              <a href="tel:+917050722933" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <Phone className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Phone</p>
                  <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">+91 70507 22933</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Address</p>
                  <p className="text-sm font-semibold text-white leading-relaxed">Kashyap Mohalla, Chainpur<br />Jharkhand — 822110</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: socials + WhatsApp */}
          <div className="relative mt-12">
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/8 text-slate-400 text-xs font-medium transition-all duration-200 border border-white/10 ${s.hoverBg} ${s.hoverText}`}>
                  {s.icon}
                  {s.label}
                </a>
              ))}
            </div>

            <a href="https://wa.me/917050722933" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/25 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.524 5.845L.057 23.49a.75.75 0 00.906.978l5.808-1.524A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.745 9.745 0 01-5.195-1.495l-.372-.22-3.847 1.01 1.028-3.752-.242-.385A9.75 9.75 0 1112 21.75z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Chat on WhatsApp</p>
                <p className="text-xs text-slate-400">+91 70507 22933</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#25D366] transition-colors shrink-0" />
            </a>
          </div>
        </div>

        {/* ── RIGHT: Form panel ── */}
        <div className="flex-1 bg-white p-10 flex flex-col justify-center">

          {status === "success" ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
              <p className="text-gray-400 text-sm max-w-xs mb-6">
                We'll reply within 24 hours. Keep an eye on your inbox.
              </p>
              <button onClick={() => setStatus("idle")}
                className="text-sm font-semibold text-blue-600 hover:underline underline-offset-2">
                Send another →
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-sora, sans-serif)" }}>
                  Send a message
                </h3>
                <p className="text-sm text-gray-400">Fill in the form and we'll get right back to you.</p>
              </div>

              {status === "error" && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Name</label>
                    <input required value={form.name} onChange={set("name")} placeholder="Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                    <input required type="email" value={form.email} onChange={set("email")} placeholder="you@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
                  <select required value={form.subject} onChange={set("subject")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer bg-white">
                    <option value="" disabled>Select a topic…</option>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea required rows={5} value={form.message} onChange={set("message")} placeholder="Tell us how we can help…"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all resize-none" />
                </div>

                <button type="submit" disabled={status === "sending"}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-sm transition-all disabled:opacity-60 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 mt-2">
                  {status === "sending" ? (
                    <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Sending…</>
                  ) : (
                    <><Send className="w-4 h-4" />Send Message</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
