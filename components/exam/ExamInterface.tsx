"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bookmark, ChevronLeft, ChevronRight,
  AlertTriangle, X, Languages,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type QStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";
type Lang    = "en" | "hi";
type Opt     = "A" | "B" | "C" | "D";

/** Full MCQ shape — matches the global question template */
export interface MCQQuestion {
  id:                  number;
  state?:              "active" | "inactive";
  subject_superset?:   string;
  subject:             string;      // "PHYSICS"
  chapter?:            string;
  topic?:              string;
  difficulty?:         "easy" | "medium" | "hard";

  // English content
  question:            string;
  option_a:            string;
  option_b:            string;
  option_c:            string;
  option_d:            string;
  answer:              Opt;
  explanation?:        string;

  // Hindi content (optional)
  question_hindi?:     string;
  option_a_hindi?:     string;
  option_b_hindi?:     string;
  option_c_hindi?:     string;
  option_d_hindi?:     string;
  explanation_hindi?:  string;

  // Image URLs (empty array = no images)
  question_images?:    string[];
  option_a_images?:    string[];
  option_b_images?:    string[];
  option_c_images?:    string[];
  option_d_images?:    string[];
  explanation_images?: string[];
}

interface QState { status: QStatus; answer: Opt | null }

// ─────────────────────────────────────────────────────────────
// Demo data — replace with API fetch in production
// ─────────────────────────────────────────────────────────────
const DEMO_QUESTIONS: Record<string, MCQQuestion[]> = {
  physics: [
    {
      id: 1, subject: "PHYSICS", chapter: "CIRCULAR MOTION", topic: "VELOCITY",
      difficulty: "medium",
      question: "A particle moves in a circle of radius R with uniform speed v. The magnitude of change in velocity when it covers half the circle is:",
      question_hindi: "एक कण R त्रिज्या के वृत्त में एकसमान चाल v से घूमता है। आधे वृत्त को पार करने पर वेग में परिवर्तन का परिमाण होगा:",
      option_a: "v",            option_a_hindi: "v",
      option_b: "2v",           option_b_hindi: "2v",
      option_c: "√2 · v",       option_c_hindi: "√2 · v",
      option_d: "Zero",         option_d_hindi: "शून्य",
      answer: "B",
      explanation: "When a particle completes half a circle, its direction of velocity reverses. Initial velocity = v (say rightward), final velocity = v (leftward). Change = v - (-v) = 2v.",
      explanation_hindi: "जब कण अर्धवृत्त पूर्ण करता है, वेग की दिशा विपरीत हो जाती है। परिवर्तन = 2v।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 2, subject: "PHYSICS", chapter: "QUANTUM MECHANICS", topic: "PLANCK CONSTANT",
      difficulty: "hard",
      question: "The dimensional formula for Planck's constant is the same as that of:",
      question_hindi: "प्लैंक नियतांक का विमीय सूत्र किसके समान है?",
      option_a: "Energy",              option_a_hindi: "ऊर्जा",
      option_b: "Angular momentum",    option_b_hindi: "कोणीय संवेग",
      option_c: "Power",               option_c_hindi: "शक्ति",
      option_d: "Linear momentum",     option_d_hindi: "रैखिक संवेग",
      answer: "B",
      explanation: "Planck's constant h = E/f. Its SI unit is J·s = kg·m²·s⁻¹ which is same as angular momentum (L = Iω = kg·m²·s⁻¹).",
      explanation_hindi: "प्लैंक नियतांक h = E/f। इसकी SI इकाई J·s = kg·m²·s⁻¹ है जो कोणीय संवेग के समान है।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 3, subject: "PHYSICS", chapter: "WORK & ENERGY", topic: "KINETIC ENERGY",
      difficulty: "easy",
      question: "A body of mass 2 kg moves with velocity 5 m/s. Its kinetic energy is:",
      question_hindi: "2 kg द्रव्यमान का एक पिंड 5 m/s के वेग से गति करता है। इसकी गतिज ऊर्जा है:",
      option_a: "10 J",  option_a_hindi: "10 J",
      option_b: "25 J",  option_b_hindi: "25 J",
      option_c: "50 J",  option_c_hindi: "50 J",
      option_d: "5 J",   option_d_hindi: "5 J",
      answer: "B",
      explanation: "KE = ½mv² = ½ × 2 × 5² = ½ × 2 × 25 = 25 J.",
      explanation_hindi: "KE = ½mv² = ½ × 2 × 25 = 25 J।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 4, subject: "PHYSICS", chapter: "CURRENT ELECTRICITY", topic: "RESISTANCE",
      difficulty: "medium",
      question: "Two resistors of 6 Ω and 3 Ω are connected in parallel. The equivalent resistance is:",
      question_hindi: "6 Ω और 3 Ω के दो प्रतिरोधक समांतर में जोड़े गए हैं। तुल्य प्रतिरोध है:",
      option_a: "9 Ω",   option_a_hindi: "9 Ω",
      option_b: "2 Ω",   option_b_hindi: "2 Ω",
      option_c: "4.5 Ω", option_c_hindi: "4.5 Ω",
      option_d: "18 Ω",  option_d_hindi: "18 Ω",
      answer: "B",
      explanation: "1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 → R = 2 Ω.",
      explanation_hindi: "1/R = 1/6 + 1/3 = 1/2 → R = 2 Ω।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 5, subject: "PHYSICS", chapter: "OPTICS", topic: "MIRRORS",
      difficulty: "easy",
      question: "The focal length of a concave mirror of radius of curvature 20 cm is:",
      question_hindi: "20 cm वक्रता त्रिज्या के अवतल दर्पण की फोकस दूरी है:",
      option_a: "20 cm", option_a_hindi: "20 सेमी",
      option_b: "10 cm", option_b_hindi: "10 सेमी",
      option_c: "40 cm", option_c_hindi: "40 सेमी",
      option_d: "5 cm",  option_d_hindi: "5 सेमी",
      answer: "B",
      explanation: "Focal length f = R/2 = 20/2 = 10 cm.",
      explanation_hindi: "फोकस दूरी f = R/2 = 20/2 = 10 सेमी।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
  ],
  chemistry: [
    {
      id: 101, subject: "CHEMISTRY", chapter: "ORGANIC CHEMISTRY", topic: "IUPAC NOMENCLATURE",
      difficulty: "medium",
      question: "The IUPAC name of CH₃–CH(OH)–CH₃ is:",
      question_hindi: "CH₃–CH(OH)–CH₃ का IUPAC नाम है:",
      option_a: "Propan-1-ol",        option_a_hindi: "प्रोपान-1-ओल",
      option_b: "Propan-2-ol",        option_b_hindi: "प्रोपान-2-ओल",
      option_c: "2-methylpropanol",   option_c_hindi: "2-मेथिलप्रोपेनॉल",
      option_d: "Isopropane",         option_d_hindi: "आइसोप्रोपेन",
      answer: "B",
      explanation: "The –OH group is on carbon 2 of a 3-carbon chain, so it is propan-2-ol.",
      explanation_hindi: "–OH समूह 3-कार्बन श्रृंखला के कार्बन 2 पर है, इसलिए यह प्रोपान-2-ओल है।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 102, subject: "CHEMISTRY", chapter: "PERIODIC TABLE", topic: "ELECTRONEGATIVITY",
      difficulty: "easy",
      question: "Which of the following has the highest electronegativity?",
      question_hindi: "निम्नलिखित में से किसकी विद्युत-ऋणात्मकता सर्वाधिक है?",
      option_a: "Oxygen",   option_a_hindi: "ऑक्सीजन",
      option_b: "Nitrogen", option_b_hindi: "नाइट्रोजन",
      option_c: "Fluorine", option_c_hindi: "फ्लुओरीन",
      option_d: "Chlorine", option_d_hindi: "क्लोरीन",
      answer: "C",
      explanation: "Fluorine is the most electronegative element (3.98 on Pauling scale), placed at the top-right of the periodic table.",
      explanation_hindi: "फ्लुओरीन सबसे अधिक विद्युत-ऋणात्मक तत्व है (पॉलिंग पैमाने पर 3.98)।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 103, subject: "CHEMISTRY", chapter: "CHEMICAL BONDING", topic: "HYBRIDISATION",
      difficulty: "medium",
      question: "The hybridization of carbon in CH₄ is:",
      question_hindi: "CH₄ में कार्बन का संकरण है:",
      option_a: "sp",    option_a_hindi: "sp",
      option_b: "sp²",   option_b_hindi: "sp²",
      option_c: "sp³",   option_c_hindi: "sp³",
      option_d: "sp³d",  option_d_hindi: "sp³d",
      answer: "C",
      explanation: "In CH₄, carbon forms 4 single bonds (σ bonds). It uses all 4 orbitals (1s + 3p) → sp³ hybridization, tetrahedral geometry.",
      explanation_hindi: "CH₄ में कार्बन 4 एकल बंध बनाता है। यह सभी 4 ऑर्बिटल्स (1s + 3p) उपयोग करता है → sp³ संकरण, चतुष्फलकीय आकृति।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 104, subject: "CHEMISTRY", chapter: "REDOX REACTIONS", topic: "OXIDISING AGENT",
      difficulty: "medium",
      question: "Which is the oxidising agent in Fe + CuSO₄ → FeSO₄ + Cu?",
      question_hindi: "Fe + CuSO₄ → FeSO₄ + Cu में ऑक्सीकारक कौन है?",
      option_a: "Fe",     option_a_hindi: "Fe",
      option_b: "CuSO₄",  option_b_hindi: "CuSO₄",
      option_c: "FeSO₄",  option_c_hindi: "FeSO₄",
      option_d: "Cu",     option_d_hindi: "Cu",
      answer: "B",
      explanation: "Cu²⁺ in CuSO₄ gains electrons (is reduced) → it is the oxidising agent. Fe loses electrons (is oxidised).",
      explanation_hindi: "CuSO₄ में Cu²⁺ इलेक्ट्रॉन ग्रहण करता है (अपचयित) → यह ऑक्सीकारक है। Fe इलेक्ट्रॉन खोता है।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 105, subject: "CHEMISTRY", chapter: "IONIC EQUILIBRIUM", topic: "pH",
      difficulty: "easy",
      question: "The pH of a neutral aqueous solution at 25°C is:",
      question_hindi: "25°C पर उदासीन जलीय विलयन का pH है:",
      option_a: "0",                     option_a_hindi: "0",
      option_b: "7",                     option_b_hindi: "7",
      option_c: "14",                    option_c_hindi: "14",
      option_d: "Depends on temperature", option_d_hindi: "तापमान पर निर्भर करता है",
      answer: "B",
      explanation: "At 25°C, Kw = 10⁻¹⁴, so [H⁺] = [OH⁻] = 10⁻⁷ mol/L → pH = 7. (Note: at other temperatures Kw changes, so pH ≠ 7 for neutral.)",
      explanation_hindi: "25°C पर Kw = 10⁻¹⁴, अतः [H⁺] = 10⁻⁷ → pH = 7।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
  ],
  mathematics: [
    {
      id: 201, subject: "MATHEMATICS", chapter: "LIMITS", topic: "STANDARD LIMITS",
      difficulty: "easy",
      question: "The value of lim(x → 0) (sin x / x) is:",
      question_hindi: "lim(x → 0) (sin x / x) का मान है:",
      option_a: "0",         option_a_hindi: "0",
      option_b: "1",         option_b_hindi: "1",
      option_c: "∞",         option_c_hindi: "∞",
      option_d: "Undefined", option_d_hindi: "अपरिभाषित",
      answer: "B",
      explanation: "By L'Hôpital's rule or the standard limit, lim(x→0) sin(x)/x = 1.",
      explanation_hindi: "मानक सीमा द्वारा, lim(x→0) sin(x)/x = 1।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 202, subject: "MATHEMATICS", chapter: "DIFFERENTIATION", topic: "LOG DERIVATIVE",
      difficulty: "easy",
      question: "The derivative of ln(x) with respect to x is:",
      question_hindi: "x के सापेक्ष ln(x) का अवकलज है:",
      option_a: "1/x",      option_a_hindi: "1/x",
      option_b: "x",        option_b_hindi: "x",
      option_c: "ln(x)/x",  option_c_hindi: "ln(x)/x",
      option_d: "eˣ",       option_d_hindi: "eˣ",
      answer: "A",
      explanation: "d/dx[ln x] = 1/x for x > 0.",
      explanation_hindi: "d/dx[ln x] = 1/x (x > 0 के लिए)।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 203, subject: "MATHEMATICS", chapter: "PERMUTATION & COMBINATION", topic: "PERMUTATIONS",
      difficulty: "medium",
      question: "The number of permutations of the letters of the word 'MATH' is:",
      question_hindi: "शब्द 'MATH' के अक्षरों के क्रमचयों की संख्या है:",
      option_a: "12", option_a_hindi: "12",
      option_b: "24", option_b_hindi: "24",
      option_c: "16", option_c_hindi: "16",
      option_d: "6",  option_d_hindi: "6",
      answer: "B",
      explanation: "MATH has 4 distinct letters. Number of permutations = 4! = 4 × 3 × 2 × 1 = 24.",
      explanation_hindi: "MATH में 4 विभिन्न अक्षर हैं। क्रमचयों की संख्या = 4! = 24।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 204, subject: "MATHEMATICS", chapter: "SEQUENCES & SERIES", topic: "INFINITE GP",
      difficulty: "medium",
      question: "The sum of the series 1 + 1/2 + 1/4 + 1/8 + … to infinity equals:",
      question_hindi: "श्रेणी 1 + 1/2 + 1/4 + 1/8 + … का अनंत तक योगफल है:",
      option_a: "1",  option_a_hindi: "1",
      option_b: "2",  option_b_hindi: "2",
      option_c: "3",  option_c_hindi: "3",
      option_d: "∞",  option_d_hindi: "∞",
      answer: "B",
      explanation: "Infinite GP: S = a/(1-r) = 1/(1 - 1/2) = 1/(1/2) = 2.",
      explanation_hindi: "अनंत गुणोत्तर श्रेणी: S = a/(1-r) = 1/(1/2) = 2।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
    {
      id: 205, subject: "MATHEMATICS", chapter: "INTEGRATION", topic: "STANDARD INTEGRALS",
      difficulty: "easy",
      question: "∫ eˣ dx is equal to:",
      question_hindi: "∫ eˣ dx किसके बराबर है?",
      option_a: "eˣ + C",        option_a_hindi: "eˣ + C",
      option_b: "xeˣ + C",       option_b_hindi: "xeˣ + C",
      option_c: "eˣ/x + C",      option_c_hindi: "eˣ/x + C",
      option_d: "xeˣ − eˣ + C",  option_d_hindi: "xeˣ − eˣ + C",
      answer: "A",
      explanation: "The integral of eˣ is eˣ itself: ∫eˣdx = eˣ + C.",
      explanation_hindi: "eˣ का समाकल eˣ ही होता है: ∫eˣdx = eˣ + C।",
      question_images: [], option_a_images: [], option_b_images: [], option_c_images: [], option_d_images: [], explanation_images: [],
    },
  ],
};

// Pad each subject to 25 questions by cycling the base questions
const QUESTIONS: Record<string, MCQQuestion[]> = {};
Object.keys(DEMO_QUESTIONS).forEach((k) => {
  const base = DEMO_QUESTIONS[k];
  QUESTIONS[k] = Array.from({ length: 25 }, (_, i) => ({
    ...base[i % base.length],
    id: base[i % base.length].id + i * 1000,   // unique id per slot
  }));
});

// ─────────────────────────────────────────────────────────────
// Subjects
// ─────────────────────────────────────────────────────────────
const SUBJECTS = [
  { id: "physics",     label: "Physics",     color: "var(--green)" },
  { id: "chemistry",   label: "Chemistry",   color: "var(--red)"   },
  { id: "mathematics", label: "Mathematics", color: "var(--amber)" },
];

// ─────────────────────────────────────────────────────────────
// Status colours
// ─────────────────────────────────────────────────────────────
const S: Record<QStatus, { bg: string; fg: string; ring?: string }> = {
  "not-visited":     { bg: "var(--bg)",        fg: "var(--ink-4)",  ring: "var(--line)" },
  "not-answered":    { bg: "var(--red-soft)",   fg: "var(--red)"    },
  "answered":        { bg: "var(--green-soft)", fg: "var(--green)"  },
  "marked":          { bg: "var(--amber-soft)", fg: "var(--amber)"  },
  "answered-marked": { bg: "var(--blue-soft)",  fg: "var(--blue)"   },
};

const LEGEND: { key: QStatus; label: string }[] = [
  { key: "not-visited",     label: "Not visited"       },
  { key: "not-answered",    label: "Not answered"      },
  { key: "answered",        label: "Answered"          },
  { key: "marked",          label: "Marked for review" },
  { key: "answered-marked", label: "Answered & marked" },
];

const OPTS: Opt[] = ["A", "B", "C", "D"];

const DIFF_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  easy:   { bg: "var(--green-soft)",  fg: "var(--green)",  label: "Easy"   },
  medium: { bg: "var(--amber-soft)",  fg: "var(--amber)",  label: "Medium" },
  hard:   { bg: "var(--red-soft)",    fg: "var(--red)",    label: "Hard"   },
};

function fmtTime(s: number) {
  const h  = String(Math.floor(s / 3600)).padStart(2, "0");
  const m  = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sc = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sc}`;
}

function initState(): Record<string, QState[]> {
  const r: Record<string, QState[]> = {};
  SUBJECTS.forEach((s) => {
    r[s.id] = Array.from({ length: 25 }, () => ({ status: "not-visited", answer: null }));
  });
  return r;
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// ExamImage — robust lazy-loading with skeleton + error fallback
// Works for any external URL (S3, CDN, backend storage, etc.)
// ─────────────────────────────────────────────────────────────
function ExamImage({
  src,
  alt,
  className = "",
  style = {},
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  return (
    <div
      className={`relative rounded-[8px] overflow-hidden ${className}`}
      style={{ border: "1px solid var(--line-soft)", background: "var(--bg)", ...style }}
    >
      {/* Skeleton shown while loading */}
      {status === "loading" && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ background: "var(--line-soft)" }}
        />
      )}

      {/* Error state */}
      {status === "error" && (
        <div
          className="flex items-center justify-center px-4 py-3 text-[11px]"
          style={{ color: "var(--ink-4)", minHeight: 48 }}
        >
          ⚠ Image unavailable
        </div>
      )}

      {/* Actual image — always rendered so browser fires load/error */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setStatus("ok")}
        onError={() => setStatus("error")}
        className="max-w-full object-contain"
        style={{
          display: status === "error" ? "none" : "block",
          opacity:  status === "ok"    ? 1       : 0,
          transition: "opacity 200ms ease",
          maxHeight: 220,
        }}
      />
    </div>
  );
}

/** Renders a list of image URLs as a row below question/option text */
function ImageRow({ urls, maxHeight = 220 }: { urls?: string[]; maxHeight?: number }) {
  if (!urls || urls.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {urls.map((url, i) => (
        <ExamImage
          key={url + i}
          src={url}
          alt={`Image ${i + 1}`}
          style={{ maxHeight }}
        />
      ))}
    </div>
  );
}

/** Renders option text + optional images */
function OptionContent({
  text,
  images,
}: {
  text: string;
  images?: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {text && <span className="text-[14px] leading-relaxed">{text}</span>}
      <ImageRow urls={images} maxHeight={120} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
export default function ExamInterface({ examId }: { examId: string }) {
  const [si, setSi]               = useState(0);
  const [qi, setQi]               = useState(0);
  const [qs, setQs]               = useState(initState);
  const [timeLeft, setTimeLeft]   = useState(3 * 60 * 60);
  const [showModal, setShowModal] = useState(false);
  const [animKey, setAnimKey]     = useState(0);
  const [lang, setLang]           = useState<Lang>("en");

  const sub       = SUBJECTS[si];
  const questions = QUESTIONS[sub.id];
  const cur       = qs[sub.id][qi];
  const q         = questions[qi];

  // ── Timer ──
  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Mark as not-answered on first visit ──
  useEffect(() => {
    setQs((prev) => {
      if (prev[sub.id][qi].status !== "not-visited") return prev;
      const arr = [...prev[sub.id]];
      arr[qi] = { ...arr[qi], status: "not-answered" };
      return { ...prev, [sub.id]: arr };
    });
    setAnimKey((k) => k + 1);
  }, [sub.id, qi]);

  const patch = useCallback((p: Partial<QState>) => {
    setQs((prev) => {
      const arr = [...prev[sub.id]];
      arr[qi] = { ...arr[qi], ...p };
      return { ...prev, [sub.id]: arr };
    });
  }, [sub.id, qi]);

  const selectAnswer = (opt: Opt) => {
    const wasMarked = cur.status === "marked" || cur.status === "answered-marked";
    patch({ answer: opt, status: wasMarked ? "answered-marked" : "answered" });
  };

  const clearResponse = () => patch({ answer: null, status: "not-answered" });

  const markAndNext = () => {
    patch({ status: cur.answer !== null ? "answered-marked" : "marked" });
    advance();
  };

  const saveAndNext = () => {
    if (cur.answer !== null) patch({ status: "answered" });
    advance();
  };

  const advance = () => {
    if (qi < questions.length - 1) { setQi((x) => x + 1); return; }
    if (si < SUBJECTS.length - 1)  { setSi((x) => x + 1); setQi(0); }
  };

  const retreat = () => {
    if (qi > 0) { setQi((x) => x - 1); return; }
    if (si > 0) { setSi((x) => x - 1); setQi(QUESTIONS[SUBJECTS[si - 1].id].length - 1); }
  };

  // ── Counts ──
  const counts = (sid: string) => {
    const arr = qs[sid];
    return {
      answered: arr.filter((x) => x.status === "answered" || x.status === "answered-marked").length,
      marked:   arr.filter((x) => x.status === "marked"   || x.status === "answered-marked").length,
    };
  };
  const allCounts     = SUBJECTS.map((s) => counts(s.id));
  const totalAnswered = allCounts.reduce((a, c) => a + c.answered, 0);
  const totalMarked   = allCounts.reduce((a, c) => a + c.marked,   0);
  const totalQ        = SUBJECTS.reduce((a, s) => a + QUESTIONS[s.id].length, 0);
  const isLow         = timeLeft < 600;
  const hasHindi      = !!(q.question_hindi);

  // ── Resolve text by language ──
  const qText    = lang === "hi" && q.question_hindi    ? q.question_hindi    : q.question;
  const optTexts: Record<Opt, string> = {
    A: lang === "hi" && q.option_a_hindi ? q.option_a_hindi : q.option_a,
    B: lang === "hi" && q.option_b_hindi ? q.option_b_hindi : q.option_b,
    C: lang === "hi" && q.option_c_hindi ? q.option_c_hindi : q.option_c,
    D: lang === "hi" && q.option_d_hindi ? q.option_d_hindi : q.option_d,
  };
  const optImages: Record<Opt, string[]> = {
    A: q.option_a_images ?? [],
    B: q.option_b_images ?? [],
    C: q.option_c_images ?? [],
    D: q.option_d_images ?? [],
  };
  const diff     = q.difficulty ? DIFF_STYLE[q.difficulty] : null;

  // ─────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col h-screen select-none"
      style={{ background: "var(--bg)", fontFamily: "var(--font-inter)", color: "var(--ink-1)" }}
    >

      {/* ══════════════════ TOP BAR ══════════════════════════════════════ */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-5 h-[48px] z-50"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--line-soft)" }}
      >
        {/* Left */}
        <div className="flex items-center gap-3.5 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-[11px] font-medium transition-colors hover:text-[var(--ink-2)] flex-shrink-0"
            style={{ color: "var(--ink-4)" }}
          >
            <ChevronLeft size={13} />
            Exit
          </Link>
          <div className="w-px h-3.5 flex-shrink-0" style={{ background: "var(--line)" }} />
          <span className="text-[12px] font-semibold truncate" style={{ color: "var(--ink-2)" }}>
            JEE Main — Full Mock #14
          </span>
        </div>

        {/* Centre — Subject tabs */}
        <nav className="hidden md:flex items-end gap-0 h-full">
          {SUBJECTS.map((s, idx) => {
            const c      = allCounts[idx];
            const active = si === idx;
            return (
              <button
                key={s.id}
                onClick={() => { setSi(idx); setQi(0); }}
                className="relative flex flex-col items-center justify-center px-5 h-full text-[12px] font-medium transition-colors"
                style={{ color: active ? "var(--ink-1)" : "var(--ink-4)" }}
              >
                <span>{s.label}</span>
                <span className="text-[10px] mt-0.5 tabular-nums" style={{ color: active ? s.color : "var(--ink-3)" }}>
                  {c.answered}/{QUESTIONS[s.id].length}
                </span>
                {active && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                    style={{ background: "var(--blue)" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Language toggle — only show when Hindi is available */}
          {hasHindi && (
            <button
              onClick={() => setLang((l) => l === "en" ? "hi" : "en")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] text-[11px] font-semibold transition-all hover:brightness-95"
              style={{
                background: lang === "hi" ? "var(--blue-soft)" : "var(--bg)",
                color:      lang === "hi" ? "var(--blue)"      : "var(--ink-3)",
                border:     "1px solid var(--line)",
              }}
              title="Toggle Hindi / English"
            >
              <Languages size={12} />
              {lang === "hi" ? "हिं" : "EN"}
            </button>
          )}

          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-1 text-[10px]" style={{ color: "var(--ink-4)" }}>
            <span className="font-semibold" style={{ color: "var(--green)" }}>+4</span>
            <span>/</span>
            <span className="font-semibold" style={{ color: "var(--red)" }}>−1</span>
          </div>

          <div
            className="font-mono text-[14px] font-bold px-3 py-1 rounded-[8px] tabular-nums tracking-wide transition-all"
            style={{
              background: isLow ? "var(--red-soft)"  : "var(--bg)",
              color:      isLow ? "var(--red)"        : "var(--ink-1)",
              border:     isLow ? "1px solid var(--red)" : "1px solid var(--line)",
            }}
          >
            {fmtTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* ══════════════════ BODY ═════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── Question area ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto flex flex-col items-center py-10 px-4">
          <div key={animKey} className="w-full max-w-[760px] flex flex-col gap-7 slide-up">

            {/* Meta row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{ background: sub.color + "14", color: sub.color }}
                >
                  {sub.label}
                </span>
                {q.chapter && (
                  <span
                    className="text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{ background: "var(--line-soft)", color: "var(--ink-4)" }}
                  >
                    {q.chapter}
                  </span>
                )}
                {diff && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{ background: diff.bg, color: diff.fg }}
                  >
                    {diff.label}
                  </span>
                )}
                <span className="text-[11px] font-medium" style={{ color: "var(--ink-4)" }}>
                  Q {qi + 1}
                  <span style={{ color: "var(--ink-3)" }}> / {questions.length}</span>
                </span>
              </div>

              {/* Mini progress dots */}
              <div className="hidden sm:flex items-center gap-[3px]">
                {questions.map((_, i) => {
                  const st = qs[sub.id][i].status;
                  return (
                    <button
                      key={i}
                      onClick={() => setQi(i)}
                      className="w-[5px] h-[5px] rounded-full transition-all"
                      style={{
                        background: i === qi ? "var(--blue)"
                          : st === "answered"        ? "var(--green)"
                          : st === "answered-marked" ? "var(--blue-ink)"
                          : st === "marked"          ? "var(--amber)"
                          : st === "not-answered"    ? "var(--red)"
                          : "var(--line)",
                        transform: i === qi ? "scale(1.6)" : "scale(1)",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* ── Question text + images ── */}
            <div
              className="rounded-[12px] p-5"
              style={{ background: "var(--card)", border: "1px solid var(--line-soft)" }}
            >
              <p
                className="text-[15.5px] leading-[1.85] font-medium"
                style={{ color: "var(--ink-1)" }}
              >
                {qText}
              </p>
              <ImageRow urls={q.question_images} />
            </div>

            {/* ── Options ── */}
            <div className="flex flex-col gap-3">
              {OPTS.map((opt) => {
                const selected = cur.answer === opt;
                const hasImg   = optImages[opt].length > 0;
                return (
                  <button
                    key={opt}
                    onClick={() => selectAnswer(opt)}
                    className="group flex items-start gap-4 px-5 py-4 rounded-[12px] text-left w-full transition-all duration-150 hover:shadow-md"
                    style={
                      selected
                        ? { background: "var(--blue-soft)",  border: "1.5px solid var(--blue)", boxShadow: "0 0 0 3px rgba(37,99,235,.06)" }
                        : { background: "var(--card)",       border: "1.5px solid var(--line-soft)", boxShadow: "var(--shadow-xs)" }
                    }
                  >
                    {/* Letter badge */}
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 mt-0.5 transition-all"
                      style={
                        selected
                          ? { background: "var(--blue)",  color: "white" }
                          : { background: "var(--bg)", color: "var(--ink-4)", border: "1.5px solid var(--line)" }
                      }
                    >
                      {opt}
                    </span>

                    {/* Option content */}
                    <div
                      className="flex-1 min-w-0 transition-colors"
                      style={{ color: selected ? "var(--blue)" : "var(--ink-2)", fontWeight: selected ? 500 : 400 }}
                    >
                      <OptionContent
                        text={optTexts[opt]}
                        images={hasImg ? optImages[opt] : []}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Action bar ── */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--line-soft)" }}>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAndNext}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[11px] font-medium transition-all hover:brightness-90"
                  style={{ background: "var(--amber-soft)", color: "var(--amber)" }}
                >
                  <Bookmark size={11} strokeWidth={2} />
                  Mark &amp; Next
                </button>
                <button
                  onClick={clearResponse}
                  className="px-3 py-2 rounded-[8px] text-[11px] font-medium transition-all hover:bg-[var(--line-soft)]"
                  style={{ color: "var(--ink-4)" }}
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={retreat}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-[8px] text-[11px] font-medium transition-all hover:bg-[var(--line-soft)]"
                  style={{ color: "var(--ink-3)" }}
                >
                  <ChevronLeft size={13} />
                  Prev
                </button>
                <button
                  onClick={saveAndNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[8px] text-[12px] font-semibold text-white transition-all hover:brightness-105"
                  style={{ background: "var(--blue)", boxShadow: "0 2px 8px -2px rgba(37,99,235,.35)" }}
                >
                  Save &amp; Next
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

          </div>{/* /max-w container */}
        </main>

        {/* ─── Question Palette ───────────────────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col w-[240px] flex-shrink-0 overflow-y-auto"
          style={{ background: "var(--card)", borderLeft: "1px solid var(--line-soft)" }}
        >
          {/* Status legend */}
          <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--bg)" }}>
            <p className="text-[9px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--ink-4)" }}>
              Status Key
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {LEGEND.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-[3px] flex-shrink-0"
                    style={{ background: S[key].bg, border: S[key].ring ? `1px solid ${S[key].ring}` : "none" }}
                  />
                  <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject sections */}
          <div className="flex-1 overflow-y-auto">
            {SUBJECTS.map((s, idx) => {
              const c = allCounts[idx];
              return (
                <div key={s.id} className="px-4 py-3.5" style={{ borderBottom: "1px solid var(--bg)" }}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                      <span className="text-[11px] font-semibold" style={{ color: "var(--ink-2)" }}>{s.label}</span>
                    </div>
                    <span className="text-[10px] font-semibold tabular-nums" style={{ color: s.color }}>
                      {c.answered}/{QUESTIONS[s.id].length}
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {QUESTIONS[s.id].map((_, n) => {
                      const st        = qs[s.id][n];
                      const sc        = S[st.status];
                      const isCurrent = idx === si && n === qi;
                      return (
                        <button
                          key={n}
                          onClick={() => { setSi(idx); setQi(n); }}
                          className="w-7 h-7 rounded-[5px] text-[10px] font-semibold transition-all hover:opacity-80"
                          style={{
                            background: isCurrent ? "var(--blue)" : sc.bg,
                            color:      isCurrent ? "#fff"         : sc.fg,
                            boxShadow:  isCurrent ? "0 0 0 2px rgba(37,99,235,.25)" : "none",
                            border:     sc.ring && !isCurrent ? `1px solid ${sc.ring}` : "none",
                          }}
                        >
                          {n + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary + Submit */}
          <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--line-soft)" }}>
            <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
              {[
                { label: "Answered", val: totalAnswered,                   bg: "var(--green-soft)", fg: "var(--green)" },
                { label: "Marked",   val: totalMarked,                     bg: "var(--amber-soft)", fg: "var(--amber)" },
                { label: "Pending",  val: totalQ - totalAnswered - totalMarked, bg: "var(--red-soft)", fg: "var(--red)" },
              ].map((r) => (
                <div key={r.label} className="rounded-[8px] py-2" style={{ background: r.bg }}>
                  <div className="text-[15px] font-bold tabular-nums" style={{ color: r.fg }}>{r.val}</div>
                  <div className="text-[8px] font-medium mt-0.5" style={{ color: r.fg, opacity: 0.6 }}>{r.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2.5 rounded-[8px] text-[12px] font-semibold text-white transition-all hover:brightness-105"
              style={{ background: "var(--blue)" }}
            >
              Submit Test
            </button>
          </div>
        </aside>
      </div>

      {/* ══════════════════ SUBMIT MODAL ═════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in"
          style={{ background: "rgba(15,23,42,.4)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            className="w-full max-w-[340px] rounded-[14px] p-6 slide-up"
            style={{ background: "var(--card)", boxShadow: "var(--shadow-lg)" }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--amber-soft)" }}>
                  <AlertTriangle size={16} style={{ color: "var(--amber)" }} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: "var(--ink-1)" }}>Submit test?</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-4)" }}>This action cannot be undone.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)}
                className="p-1 rounded-[6px] transition-colors hover:bg-[var(--line-soft)]"
                style={{ color: "var(--ink-4)" }}>
                <X size={15} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 mb-5">
              {[
                { label: "Answered", val: totalAnswered,                   bg: "var(--green-soft)", fg: "var(--green)" },
                { label: "Marked",   val: totalMarked,                     bg: "var(--amber-soft)", fg: "var(--amber)" },
                { label: "Pending",  val: totalQ - totalAnswered - totalMarked, bg: "var(--red-soft)", fg: "var(--red)" },
              ].map((r) => (
                <div key={r.label} className="rounded-[10px] py-3 text-center" style={{ background: r.bg }}>
                  <div className="text-[20px] font-bold tabular-nums" style={{ color: r.fg }}>{r.val}</div>
                  <div className="text-[9px] font-medium mt-0.5" style={{ color: r.fg, opacity: 0.6 }}>{r.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-[8px] text-[12px] font-medium transition-all hover:bg-[var(--line-soft)]"
                style={{ border: "1.5px solid var(--line)", color: "var(--ink-3)" }}
              >
                Cancel
              </button>
              <Link
                href={`/results/${examId}`}
                className="flex-1 py-2.5 rounded-[8px] text-[12px] font-semibold text-white text-center transition-all hover:brightness-105"
                style={{ background: "var(--blue)" }}
              >
                Submit →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
