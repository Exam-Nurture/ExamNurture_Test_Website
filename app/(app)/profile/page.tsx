import { Mail, Phone, Target, BookOpen, Award } from "lucide-react";

export const metadata = { title: "Profile — ExamNurture" };

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 fade-up max-w-[720px]">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>
          Profile
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--ink-3)" }}>Your account and preferences</p>
      </div>

      {/* Avatar + info */}
      <div className="rounded-[14px] p-6" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-[16px] flex items-center justify-center text-white text-[24px] font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--blue), var(--cyan))" }}
          >R</div>
          <div className="flex-1">
            <div className="text-[18px] font-bold" style={{ fontFamily: "var(--font-sora)", color: "var(--ink-1)" }}>Rahul Sharma</div>
            <div className="text-[13px] mt-0.5" style={{ color: "var(--ink-3)" }}>Free Plan · Member since Jan 2026</div>
            <div className="flex flex-wrap gap-4 mt-3">
              <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--ink-3)" }}>
                <Mail size={13} /> dilip8002312965@gmail.com
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--ink-3)" }}>
                <Phone size={13} /> +91 98765 43210
              </span>
            </div>
          </div>
          <button
            className="px-4 py-2 rounded-[10px] text-[13px] font-semibold text-white transition-all hover:brightness-105"
            style={{ background: "var(--blue)" }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Exam target */}
      <div className="rounded-[14px] p-5" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
        <div className="text-[14px] font-semibold mb-4" style={{ color: "var(--ink-1)" }}>Target Exam</div>
        <div className="flex items-center gap-3 p-3 rounded-[10px]" style={{ background: "var(--blue-soft)", border: "1px solid rgba(37,99,235,.2)" }}>
          <Target size={18} style={{ color: "var(--blue)" }} />
          <div>
            <div className="text-[14px] font-semibold" style={{ color: "var(--blue)" }}>JEE Main 2025</div>
            <div className="text-[12px]" style={{ color: "var(--ink-3)" }}>87 days remaining · Registration closes in 12 days</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tests Completed",  val: "42", icon: <BookOpen size={18} />, color: "#2563EB" },
          { label: "Day Streak",       val: "12", icon: <span className="text-lg">🔥</span>, color: "#F59E0B" },
          { label: "Certificates",     val: "3",  icon: <Award size={18} />,    color: "#10B981" },
        ].map((s) => (
          <div key={s.label} className="rounded-[14px] p-4 text-center" style={{ background: "white", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
            <div className="flex justify-center mb-2" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-[24px] font-bold" style={{ color: s.color, fontFamily: "var(--font-sora)" }}>{s.val}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upgrade CTA */}
      <div
        className="rounded-[14px] p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)" }}
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,.4), transparent 65%)" }} />
        <div className="relative">
          <div className="text-[18px] font-bold text-white mb-1">Upgrade to Pro</div>
          <p className="text-[13px] text-white/75 mb-4">Unlock unlimited mocks, detailed analytics, and priority support.</p>
          <button className="px-5 py-2.5 bg-white rounded-[9px] text-[13px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ color: "var(--blue)" }}
          >
            Upgrade Now →
          </button>
        </div>
      </div>
    </div>
  );
}
