import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Headphones, Sparkles } from "lucide-react";

const ROLES = [
  { title: "Exam Content Reviewer", team: "Academic", icon: BookOpen, detail: "Review mocks, PYQs, and explanations for accuracy." },
  { title: "Student Success Mentor", team: "Learner Support", icon: Headphones, detail: "Guide aspirants through study plans and platform workflows." },
  { title: "Course Operations Associate", team: "Operations", icon: GraduationCap, detail: "Coordinate launches, schedules, and live class readiness." },
];

export const metadata = { title: "Careers - ExamNurture" };

export default function CareersPage() {
  return (
    <div className="bg-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 mb-4">
            <Sparkles size={16} /> Careers
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950 mb-5" style={{ fontFamily: "var(--font-sora)" }}>
            Build for serious exam aspirants.
          </h1>
          <p className="text-lg text-gray-600 leading-8">
            Join a focused team creating practical learning tools for competitive exam preparation across India.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {ROLES.map(({ title, team, icon: Icon, detail }) => (
            <article key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Icon size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{team}</p>
              <h2 className="text-lg font-bold text-gray-950 mb-3">{title}</h2>
              <p className="text-sm leading-7 text-gray-600">{detail}</p>
            </article>
          ))}
        </div>

        <Link href="/contact" className="mt-10 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
          Contact hiring team <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
