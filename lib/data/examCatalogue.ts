/**
 * examCatalogue.ts — State → Board → Exam hierarchy
 *
 * Separate from examData.ts (which handles subscription/plan logic).
 * This file drives the /exams discovery hub and /exams/[slug] exam pages.
 *
 * Exam IDs cross-reference examData.ts where they overlap.
 */

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */

export type CatalogueState = {
  id: string;
  name: string;
  abbr: string;
  emoji: string;
  color: string;
  colorSoft: string;
  description: string;
};

export type CatalogueBoard = {
  id: string;
  stateId: string;
  name: string;       // "JPSC"
  fullName: string;   // "Jharkhand Public Service Commission"
  color: string;
  colorSoft: string;
  exams: CatalogueExam[];
};

export type CatalogueExam = {
  id: string;         // unique slug, used in /exams/[slug]
  boardId: string;
  stateId: string;
  name: string;       // "JPSC Prelims 2025"
  shortName: string;  // "JPSC Prelims"
  eligibility: string;
  pattern: string;
  subjects: string[];
  nextDate?: string;
  applicants?: string;
  testCount: number;
  pyqCount: number;
  notesCount: number;
  courseCount: number;
  popular?: boolean;
  syllabusUrl?: string;
  /** matching boardId in examData.ts for cross-referencing content */
  legacyBoardId?: string;
};

/* ═══════════════════════════════════════════════
   STATES
═══════════════════════════════════════════════ */

export const STATES: CatalogueState[] = [
  {
    id: "central",
    name: "Central Government",
    abbr: "CG",
    emoji: "🏛",
    color: "#3B82F6",
    colorSoft: "rgba(59,130,246,0.10)",
    description: "SSC, IBPS, RRB, UPSC, Defence — all central govt exams",
  },
  {
    id: "jharkhand",
    name: "Jharkhand",
    abbr: "JH",
    emoji: "🌿",
    color: "#10B981",
    colorSoft: "rgba(16,185,129,0.10)",
    description: "JPSC, JSSC, JH Police, JTET and more",
  },
  {
    id: "bihar",
    name: "Bihar",
    abbr: "BR",
    emoji: "🏺",
    color: "#F59E0B",
    colorSoft: "rgba(245,158,11,0.10)",
    description: "BPSC, BSSC, Bihar Police and state-level exams",
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    abbr: "UP",
    emoji: "⚡",
    color: "#8B5CF6",
    colorSoft: "rgba(139,92,246,0.10)",
    description: "UPPSC, UPSSSC, UP Police and state-level exams",
  },
];

/* ═══════════════════════════════════════════════
   BOARDS + EXAMS
═══════════════════════════════════════════════ */

export const BOARDS: CatalogueBoard[] = [

  /* ══ CENTRAL ══════════════════════════════════ */

  {
    id: "ssc",
    stateId: "central",
    name: "SSC",
    fullName: "Staff Selection Commission",
    color: "#3B82F6",
    colorSoft: "rgba(59,130,246,0.10)",
    exams: [
      {
        id: "ssc-cgl",
        boardId: "ssc",
        stateId: "central",
        name: "SSC CGL 2025",
        shortName: "SSC CGL",
        eligibility: "Graduation",
        pattern: "100 Qs · 1 hr · Tier I",
        subjects: ["Reasoning", "General Awareness", "Maths", "English"],
        nextDate: "Aug 2025",
        applicants: "30 Lakh+",
        testCount: 18,
        pyqCount: 12,
        notesCount: 14,
        courseCount: 1,
        popular: true,
        legacyBoardId: "ssc-upper",
      },
      {
        id: "ssc-chsl",
        boardId: "ssc",
        stateId: "central",
        name: "SSC CHSL 2025",
        shortName: "SSC CHSL",
        eligibility: "12th Pass",
        pattern: "100 Qs · 1 hr · Tier I",
        subjects: ["Reasoning", "General Awareness", "Maths", "English"],
        nextDate: "Sep 2025",
        applicants: "20 Lakh+",
        testCount: 12,
        pyqCount: 8,
        notesCount: 10,
        courseCount: 0,
        legacyBoardId: "ssc-upper",
      },
      {
        id: "ssc-mts",
        boardId: "ssc",
        stateId: "central",
        name: "SSC MTS 2025",
        shortName: "SSC MTS",
        eligibility: "10th Pass",
        pattern: "90 Qs · 1.5 hrs · Objective",
        subjects: ["Reasoning", "Maths", "English", "General Awareness"],
        nextDate: "Sep 2025",
        testCount: 8,
        pyqCount: 6,
        notesCount: 6,
        courseCount: 0,
        legacyBoardId: "ssc-lower",
      },
      {
        id: "ssc-cpo",
        boardId: "ssc",
        stateId: "central",
        name: "SSC CPO (SI) 2025",
        shortName: "SSC CPO",
        eligibility: "Graduation",
        pattern: "200 Qs · 2 hrs · Paper I",
        subjects: ["Reasoning", "General Awareness", "Maths", "English"],
        testCount: 8,
        pyqCount: 6,
        notesCount: 5,
        courseCount: 0,
        legacyBoardId: "ssc-upper",
      },
    ],
  },

  {
    id: "rrb",
    stateId: "central",
    name: "RRB",
    fullName: "Railway Recruitment Board",
    color: "#F59E0B",
    colorSoft: "rgba(245,158,11,0.10)",
    exams: [
      {
        id: "rrb-ntpc",
        boardId: "rrb",
        stateId: "central",
        name: "RRB NTPC 2025 (Graduate)",
        shortName: "RRB NTPC",
        eligibility: "Graduation",
        pattern: "100 Qs · 1.5 hrs · CBT 1",
        subjects: ["Maths", "General Intelligence", "General Awareness"],
        nextDate: "Oct 2025",
        applicants: "50 Lakh+",
        testCount: 14,
        pyqCount: 10,
        notesCount: 8,
        courseCount: 0,
        popular: true,
        legacyBoardId: "railway-ntpc",
      },
      {
        id: "rrb-group-d",
        boardId: "rrb",
        stateId: "central",
        name: "RRB Group D 2025",
        shortName: "RRB Group D",
        eligibility: "10th Pass",
        pattern: "100 Qs · 1.5 hrs · CBT",
        subjects: ["General Science", "Maths", "General Intelligence", "General Awareness"],
        nextDate: "Nov 2025",
        applicants: "1 Crore+",
        testCount: 10,
        pyqCount: 8,
        notesCount: 6,
        courseCount: 0,
        legacyBoardId: "railway-group-d",
      },
    ],
  },

  {
    id: "ibps-sbi",
    stateId: "central",
    name: "IBPS / SBI",
    fullName: "Banking — IBPS & SBI",
    color: "#10B981",
    colorSoft: "rgba(16,185,129,0.10)",
    exams: [
      {
        id: "ibps-po",
        boardId: "ibps-sbi",
        stateId: "central",
        name: "IBPS PO Prelims 2025",
        shortName: "IBPS PO",
        eligibility: "Graduation",
        pattern: "100 Qs · 1 hr · Prelims",
        subjects: ["English", "Reasoning", "Quantitative Aptitude"],
        nextDate: "Oct 2025",
        applicants: "12 Lakh+",
        testCount: 16,
        pyqCount: 10,
        notesCount: 12,
        courseCount: 1,
        popular: true,
        legacyBoardId: "banking-po",
      },
      {
        id: "sbi-po",
        boardId: "ibps-sbi",
        stateId: "central",
        name: "SBI PO Prelims 2025",
        shortName: "SBI PO",
        eligibility: "Graduation",
        pattern: "100 Qs · 1 hr · Prelims",
        subjects: ["English", "Reasoning", "Quantitative Aptitude"],
        nextDate: "Dec 2025",
        testCount: 14,
        pyqCount: 8,
        notesCount: 10,
        courseCount: 1,
        legacyBoardId: "banking-po",
      },
      {
        id: "ibps-clerk",
        boardId: "ibps-sbi",
        stateId: "central",
        name: "IBPS Clerk Prelims 2025",
        shortName: "IBPS Clerk",
        eligibility: "Graduation",
        pattern: "100 Qs · 1 hr · Prelims",
        subjects: ["English", "Reasoning", "Quantitative Aptitude"],
        nextDate: "Nov 2025",
        testCount: 12,
        pyqCount: 8,
        notesCount: 8,
        courseCount: 0,
        legacyBoardId: "banking-clerk",
      },
      {
        id: "rbi-grade-b",
        boardId: "ibps-sbi",
        stateId: "central",
        name: "RBI Grade B 2025",
        shortName: "RBI Grade B",
        eligibility: "Graduation",
        pattern: "200 Qs · 2 hrs · Phase I",
        subjects: ["General Awareness", "English", "Reasoning", "Quantitative Aptitude"],
        testCount: 8,
        pyqCount: 6,
        notesCount: 6,
        courseCount: 1,
        legacyBoardId: "banking-po",
      },
    ],
  },

  {
    id: "defence",
    stateId: "central",
    name: "Defence",
    fullName: "Defence & Paramilitary",
    color: "#6366F1",
    colorSoft: "rgba(99,102,241,0.10)",
    exams: [
      {
        id: "army-gd",
        boardId: "defence",
        stateId: "central",
        name: "Army GD (Agnipath) 2025",
        shortName: "Army GD",
        eligibility: "10th Pass",
        pattern: "50 Qs · 1 hr · Written",
        subjects: ["General Knowledge", "Maths", "Science"],
        testCount: 8,
        pyqCount: 4,
        notesCount: 4,
        courseCount: 0,
        legacyBoardId: "defence",
      },
      {
        id: "rpf-constable",
        boardId: "defence",
        stateId: "central",
        name: "RPF Constable 2025",
        shortName: "RPF Constable",
        eligibility: "10th Pass",
        pattern: "120 Qs · 1.5 hrs · CBT",
        subjects: ["General Awareness", "Arithmetic", "General Intelligence"],
        testCount: 6,
        pyqCount: 4,
        notesCount: 3,
        courseCount: 0,
        legacyBoardId: "defence",
      },
    ],
  },

  /* ══ JHARKHAND ════════════════════════════════ */

  {
    id: "jpsc",
    stateId: "jharkhand",
    name: "JPSC",
    fullName: "Jharkhand Public Service Commission",
    color: "#10B981",
    colorSoft: "rgba(16,185,129,0.10)",
    exams: [
      {
        id: "jpsc-prelims",
        boardId: "jpsc",
        stateId: "jharkhand",
        name: "JPSC Prelims 2025",
        shortName: "JPSC Prelims",
        eligibility: "Graduation",
        pattern: "200 Qs · 2 hrs · Paper I & II",
        subjects: ["General Studies", "General Science", "History", "Geography", "Polity", "Economy"],
        nextDate: "Jun 2025",
        applicants: "3.5 Lakh",
        testCount: 12,
        pyqCount: 8,
        notesCount: 24,
        courseCount: 2,
        popular: true,
        legacyBoardId: "state-psc",
      },
      {
        id: "jpsc-mains",
        boardId: "jpsc",
        stateId: "jharkhand",
        name: "JPSC Mains 2025",
        shortName: "JPSC Mains",
        eligibility: "Graduation",
        pattern: "6 Papers · Descriptive · 1800 Marks",
        subjects: ["General Studies I–IV", "Hindi/Urdu", "Optional"],
        testCount: 6,
        pyqCount: 5,
        notesCount: 16,
        courseCount: 1,
        legacyBoardId: "state-psc",
      },
    ],
  },

  {
    id: "jssc",
    stateId: "jharkhand",
    name: "JSSC",
    fullName: "Jharkhand Staff Selection Commission",
    color: "#06B6D4",
    colorSoft: "rgba(6,182,212,0.10)",
    exams: [
      {
        id: "jssc-cgl",
        boardId: "jssc",
        stateId: "jharkhand",
        name: "JSSC CGL 2025",
        shortName: "JSSC CGL",
        eligibility: "Graduation",
        pattern: "120 Qs · 2 hrs · Objective",
        subjects: ["Reasoning", "General Knowledge", "Maths", "Hindi", "English"],
        testCount: 8,
        pyqCount: 5,
        notesCount: 10,
        courseCount: 0,
      },
      {
        id: "jssc-inter",
        boardId: "jssc",
        stateId: "jharkhand",
        name: "JSSC Inter Level 2025",
        shortName: "JSSC Inter Level",
        eligibility: "12th Pass",
        pattern: "120 Qs · 2 hrs · Objective",
        subjects: ["Reasoning", "General Knowledge", "Maths", "Hindi"],
        testCount: 6,
        pyqCount: 4,
        notesCount: 6,
        courseCount: 0,
      },
    ],
  },

  {
    id: "jh-police",
    stateId: "jharkhand",
    name: "JH Police",
    fullName: "Jharkhand Police",
    color: "#EF4444",
    colorSoft: "rgba(239,68,68,0.10)",
    exams: [
      {
        id: "jh-police-si",
        boardId: "jh-police",
        stateId: "jharkhand",
        name: "JH Police SI 2025",
        shortName: "JH Police SI",
        eligibility: "Graduation",
        pattern: "100 Qs · 2 hrs · Written",
        subjects: ["General Knowledge", "Reasoning", "Hindi", "General Science"],
        testCount: 6,
        pyqCount: 4,
        notesCount: 5,
        courseCount: 0,
        legacyBoardId: "police-si",
      },
      {
        id: "jh-police-constable",
        boardId: "jh-police",
        stateId: "jharkhand",
        name: "JH Police Constable 2025",
        shortName: "JH Constable",
        eligibility: "10th Pass",
        pattern: "100 Qs · 2 hrs · Written",
        subjects: ["General Knowledge", "Reasoning", "Hindi", "Maths"],
        testCount: 4,
        pyqCount: 3,
        notesCount: 4,
        courseCount: 0,
        legacyBoardId: "police-constable",
      },
    ],
  },

  /* ══ BIHAR ════════════════════════════════════ */

  {
    id: "bpsc",
    stateId: "bihar",
    name: "BPSC",
    fullName: "Bihar Public Service Commission",
    color: "#F59E0B",
    colorSoft: "rgba(245,158,11,0.10)",
    exams: [
      {
        id: "bpsc-prelims",
        boardId: "bpsc",
        stateId: "bihar",
        name: "BPSC 70th Prelims 2025",
        shortName: "BPSC 70th",
        eligibility: "Graduation",
        pattern: "150 Qs · 2 hrs · Objective",
        subjects: ["General Studies", "General Hindi", "Polity", "History", "Geography"],
        nextDate: "Jul 2025",
        applicants: "6 Lakh+",
        testCount: 10,
        pyqCount: 8,
        notesCount: 18,
        courseCount: 1,
        popular: true,
        legacyBoardId: "state-psc",
      },
      {
        id: "bpsc-tre",
        boardId: "bpsc",
        stateId: "bihar",
        name: "BPSC TRE 4.0 2025",
        shortName: "BPSC TRE",
        eligibility: "B.Ed / Graduation",
        pattern: "150 Qs · 2.5 hrs · Objective",
        subjects: ["Child Development", "Language", "Subject Specific"],
        testCount: 6,
        pyqCount: 4,
        notesCount: 8,
        courseCount: 0,
        legacyBoardId: "state-psc",
      },
    ],
  },

  {
    id: "bssc",
    stateId: "bihar",
    name: "BSSC",
    fullName: "Bihar Staff Selection Commission",
    color: "#EC4899",
    colorSoft: "rgba(236,72,153,0.10)",
    exams: [
      {
        id: "bssc-inter",
        boardId: "bssc",
        stateId: "bihar",
        name: "BSSC Inter Level 2025",
        shortName: "BSSC Inter Level",
        eligibility: "12th Pass",
        pattern: "150 Qs · 2 hrs · Objective",
        subjects: ["General Awareness", "Reasoning", "Maths", "Hindi"],
        testCount: 6,
        pyqCount: 4,
        notesCount: 6,
        courseCount: 0,
      },
      {
        id: "bssc-graduation",
        boardId: "bssc",
        stateId: "bihar",
        name: "BSSC Graduation Level 2025",
        shortName: "BSSC Grad Level",
        eligibility: "Graduation",
        pattern: "150 Qs · 2 hrs · Objective",
        subjects: ["General Awareness", "Reasoning", "Maths", "Hindi", "English"],
        testCount: 4,
        pyqCount: 3,
        notesCount: 4,
        courseCount: 0,
      },
    ],
  },

  {
    id: "bihar-police",
    stateId: "bihar",
    name: "Bihar Police",
    fullName: "Bihar Police",
    color: "#EF4444",
    colorSoft: "rgba(239,68,68,0.10)",
    exams: [
      {
        id: "bihar-si",
        boardId: "bihar-police",
        stateId: "bihar",
        name: "Bihar SI (BPSSC) 2025",
        shortName: "Bihar SI",
        eligibility: "Graduation",
        pattern: "100 Qs · 2 hrs · Written",
        subjects: ["General Awareness", "Hindi", "Reasoning", "Maths"],
        testCount: 6,
        pyqCount: 4,
        notesCount: 5,
        courseCount: 0,
        legacyBoardId: "police-si",
      },
    ],
  },

  /* ══ UTTAR PRADESH ════════════════════════════ */

  {
    id: "uppsc",
    stateId: "uttar-pradesh",
    name: "UPPSC",
    fullName: "Uttar Pradesh Public Service Commission",
    color: "#8B5CF6",
    colorSoft: "rgba(139,92,246,0.10)",
    exams: [
      {
        id: "uppsc-pcs",
        boardId: "uppsc",
        stateId: "uttar-pradesh",
        name: "UPPSC PCS Prelims 2025",
        shortName: "UPPSC PCS",
        eligibility: "Graduation",
        pattern: "150 Qs · 2 hrs · Paper I & II",
        subjects: ["General Studies", "CSAT"],
        nextDate: "Aug 2025",
        applicants: "5 Lakh+",
        testCount: 10,
        pyqCount: 8,
        notesCount: 14,
        courseCount: 1,
        popular: true,
        legacyBoardId: "state-psc",
      },
    ],
  },

  {
    id: "upsssc",
    stateId: "uttar-pradesh",
    name: "UPSSSC",
    fullName: "Uttar Pradesh Subordinate Service Selection Commission",
    color: "#06B6D4",
    colorSoft: "rgba(6,182,212,0.10)",
    exams: [
      {
        id: "upsssc-pet",
        boardId: "upsssc",
        stateId: "uttar-pradesh",
        name: "UPSSSC PET 2025",
        shortName: "UPSSSC PET",
        eligibility: "10th Pass",
        pattern: "100 Qs · 2 hrs · Objective",
        subjects: ["Indian History", "Geography", "Economy", "Maths", "Hindi", "English", "Reasoning"],
        nextDate: "Sep 2025",
        testCount: 8,
        pyqCount: 4,
        notesCount: 8,
        courseCount: 0,
      },
    ],
  },

  {
    id: "up-police",
    stateId: "uttar-pradesh",
    name: "UP Police",
    fullName: "Uttar Pradesh Police",
    color: "#EF4444",
    colorSoft: "rgba(239,68,68,0.10)",
    exams: [
      {
        id: "up-si",
        boardId: "up-police",
        stateId: "uttar-pradesh",
        name: "UP SI / Daroga 2025",
        shortName: "UP SI",
        eligibility: "Graduation",
        pattern: "400 Qs · 2 hrs each · 4 Papers",
        subjects: ["General Hindi", "Law & Constitution", "Maths", "Reasoning", "General Knowledge"],
        testCount: 8,
        pyqCount: 6,
        notesCount: 8,
        courseCount: 0,
        legacyBoardId: "police-si",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */

/** Get all exams (flat) */
export function getAllExams(): CatalogueExam[] {
  return BOARDS.flatMap((b) => b.exams);
}

/** Find a single exam by its id/slug */
export function findExam(id: string): CatalogueExam | undefined {
  return getAllExams().find((e) => e.id === id);
}

/** Get boards for a given state */
export function getBoardsByState(stateId: string): CatalogueBoard[] {
  return BOARDS.filter((b) => b.stateId === stateId);
}

/** Get the board for an exam */
export function getBoardForExam(exam: CatalogueExam): CatalogueBoard | undefined {
  return BOARDS.find((b) => b.id === exam.boardId);
}

/** Get the state for an exam */
export function getStateForExam(exam: CatalogueExam): CatalogueState | undefined {
  return STATES.find((s) => s.id === exam.stateId);
}

/** Popular exams (cross-state) */
export const POPULAR_EXAMS = getAllExams()
  .filter((e) => e.popular)
  .slice(0, 6);
