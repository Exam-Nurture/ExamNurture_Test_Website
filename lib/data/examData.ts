/**
 * examData.ts — Single Source of Truth
 *
 * All exam boards, exams within them, subscription tiers, and tier-exam mappings
 * live here. API routes import from this file.
 *
 * When a real backend is ready:
 *   - Replace the static arrays with DB queries inside the API routes
 *   - Keep the TypeScript types — they are your DTO contract
 */

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */

export type TierLevel = 1 | 2 | 3;

export type Exam = {
  id: string;
  boardId: string;
  name: string;           // "JPSC Prelims 2025"
  shortName: string;      // "Prelims"
  tier: TierLevel;        // minimum tier required
  eligibility: string;    // human-readable: "Graduation"
  pattern: string;        // "100 Qs · 2 hrs · Paper I"
  subjects: string[];
  hasTests: boolean;
  hasPYQ: boolean;
  hasGuide: boolean;
  upcomingDate?: string;  // e.g. "Jun 2025"
  daysLeft?: number;
};

export type ExamBoard = {
  id: string;
  name: string;           // "JPSC — Jharkhand Public Service Commission"
  shortName: string;      // "JPSC"
  tint: string;           // brand color
  colorSoft: string;      // soft bg variant
  description: string;    // one-liner about the board
  minTier: TierLevel;     // lowest tier that has any exam in this board
  exams: Exam[];
};

export type Tier = {
  id: TierLevel;
  name: string;           // "Tier 2"
  badge: string;          // "12th Pass"
  qualification: string;  // "Passed Class XII / Intermediate"
  tagline: string;        // short headline for the plan card
  description: string;    // one paragraph explaining who this is for
  monthlyPrice: number;   // INR
  yearlyPrice: number;    // INR (total per year)
  highlight: boolean;     // most popular — show bigger card
  color: string;
  colorSoft: string;
  perks: string[];        // bullet list of plan benefits
  /** Board IDs *exclusively* unlocked by this tier (not lower tiers). */
  exclusiveBoardIds: string[];
  /** All board IDs accessible (cumulative: this + all lower tiers). */
  allBoardIds: string[];
};

/* ═══════════════════════════════════════════════
   EXAM BOARDS  (ordered by tier ascending)
═══════════════════════════════════════════════ */

export const EXAM_BOARDS: ExamBoard[] = [

  /* ── TIER 1 boards ── */
  {
    id: "railway-group-d",
    name: "Railway Group D",
    shortName: "Railway Gr D",
    tint: "var(--amber)",
    colorSoft: "var(--amber-soft)",
    description: "RRB Group D — Track Maintainer, Helper, Porter · 10th pass eligible",
    minTier: 1,
    exams: [
      {
        id: "rrb-group-d-2025",
        boardId: "railway-group-d",
        name: "RRB Group D 2025",
        shortName: "Group D",
        tier: 1,
        eligibility: "10th Pass",
        pattern: "100 Qs · 1.5 hrs · CBT",
        subjects: ["General Science", "Maths", "General Intelligence", "General Awareness"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Nov 2025", daysLeft: 210,
      },
    ],
  },

  {
    id: "ssc-lower",
    name: "SSC MTS & Hawaldar",
    shortName: "SSC MTS",
    tint: "var(--green)",
    colorSoft: "var(--green-soft)",
    description: "SSC MTS, SSC Hawaldar (CBIC/CBN) · 10th pass eligible",
    minTier: 1,
    exams: [
      {
        id: "ssc-mts-2025",
        boardId: "ssc-lower",
        name: "SSC MTS 2025",
        shortName: "MTS",
        tier: 1,
        eligibility: "10th Pass",
        pattern: "90 Qs · 1.5 hrs · Objective",
        subjects: ["Reasoning", "Quantitative Aptitude", "General English", "General Awareness"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Sep 2025",
      },
      {
        id: "ssc-hawaldar-2025",
        boardId: "ssc-lower",
        name: "SSC Hawaldar 2025",
        shortName: "Hawaldar",
        tier: 1,
        eligibility: "10th Pass",
        pattern: "100 Qs · 1.5 hrs · CBIC/CBN",
        subjects: ["Reasoning", "Quantitative Aptitude", "General English", "General Awareness"],
        hasTests: true, hasPYQ: false, hasGuide: true,
      },
    ],
  },

  {
    id: "police-constable",
    name: "Police Constable",
    shortName: "Constable",
    tint: "var(--indigo)",
    colorSoft: "var(--indigo-soft)",
    description: "State-level Constable recruitment · Physical + Written · 10th pass",
    minTier: 1,
    exams: [
      {
        id: "jharkhand-constable-2025",
        boardId: "police-constable",
        name: "Jharkhand Police Constable",
        shortName: "JH Constable",
        tier: 1,
        eligibility: "10th Pass",
        pattern: "100 Qs · 2 hrs · OMR",
        subjects: ["General Knowledge", "Reasoning", "Hindi", "Maths"],
        hasTests: true, hasPYQ: true, hasGuide: true,
      },
      {
        id: "up-constable-2025",
        boardId: "police-constable",
        name: "UP Police Constable",
        shortName: "UP Constable",
        tier: 1,
        eligibility: "10th Pass",
        pattern: "150 Qs · 2 hrs",
        subjects: ["General Knowledge", "Reasoning", "Hindi", "Numerical Ability"],
        hasTests: true, hasPYQ: true, hasGuide: false,
      },
    ],
  },

  {
    id: "defence",
    name: "Defence & Army",
    shortName: "Army / NDA",
    tint: "var(--cyan)",
    colorSoft: "var(--cyan-soft)",
    description: "Army GD, Army Clerk, RPF Constable, BSF, CRPF · 10th pass",
    minTier: 1,
    exams: [
      {
        id: "army-gd-2025",
        boardId: "defence",
        name: "Army GD (Agnipath) 2025",
        shortName: "Army GD",
        tier: 1,
        eligibility: "10th Pass",
        pattern: "50 Qs · 1 hr · Written CEE",
        subjects: ["General Knowledge", "General Science", "Maths"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Aug 2025",
      },
      {
        id: "rpf-constable-2025",
        boardId: "defence",
        name: "RPF Constable 2025",
        shortName: "RPF Constable",
        tier: 1,
        eligibility: "10th Pass",
        pattern: "120 Qs · 1.5 hrs · CBT",
        subjects: ["General Awareness", "Arithmetic", "General Intelligence"],
        hasTests: true, hasPYQ: false, hasGuide: true,
      },
    ],
  },

  /* ── TIER 2 boards ── */
  {
    id: "ssc-upper",
    name: "SSC CGL / CHSL / CPO",
    shortName: "SSC Upper",
    tint: "var(--green)",
    colorSoft: "var(--green-soft)",
    description: "SSC CGL, CHSL, CPO — Tier I & II · 12th pass eligible",
    minTier: 2,
    exams: [
      {
        id: "ssc-cgl-2025",
        boardId: "ssc-upper",
        name: "SSC CGL Tier I 2025",
        shortName: "CGL Tier I",
        tier: 2,
        eligibility: "12th Pass / Graduation",
        pattern: "100 Qs · 1 hr · CBE",
        subjects: ["General Knowledge", "Reasoning", "Quantitative Aptitude", "English"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Jul 2025", daysLeft: 87,
      },
      {
        id: "ssc-chsl-2025",
        boardId: "ssc-upper",
        name: "SSC CHSL Tier I 2025",
        shortName: "CHSL",
        tier: 2,
        eligibility: "12th Pass",
        pattern: "100 Qs · 1 hr · CBE",
        subjects: ["General Knowledge", "Reasoning", "Quantitative Aptitude", "English"],
        hasTests: true, hasPYQ: true, hasGuide: true,
      },
      {
        id: "ssc-cpo-2025",
        boardId: "ssc-upper",
        name: "SSC CPO (SI) 2025",
        shortName: "CPO / SI",
        tier: 2,
        eligibility: "12th Pass + Graduation (some posts)",
        pattern: "200 Qs · 2 hrs · Paper I + II",
        subjects: ["General Knowledge", "Reasoning", "Quantitative Aptitude", "English"],
        hasTests: true, hasPYQ: false, hasGuide: false,
      },
    ],
  },

  {
    id: "railway-ntpc",
    name: "RRB NTPC / JE",
    shortName: "Railway NTPC",
    tint: "var(--amber)",
    colorSoft: "var(--amber-soft)",
    description: "RRB NTPC CBT 1 & 2, RRB JE — Graduate & 12th pass posts",
    minTier: 2,
    exams: [
      {
        id: "rrb-ntpc-grad-2025",
        boardId: "railway-ntpc",
        name: "RRB NTPC Graduate Posts 2025",
        shortName: "NTPC Graduate",
        tier: 2,
        eligibility: "Graduation",
        pattern: "100 Qs · 1.5 hrs · CBT 1 + CBT 2",
        subjects: ["General Awareness", "Reasoning", "Mathematics"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Oct 2025",
      },
      {
        id: "rrb-ntpc-12th-2025",
        boardId: "railway-ntpc",
        name: "RRB NTPC 12th Pass Posts 2025",
        shortName: "NTPC 12th Pass",
        tier: 2,
        eligibility: "12th Pass",
        pattern: "100 Qs · 1.5 hrs · CBT 1",
        subjects: ["General Awareness", "Reasoning", "Mathematics"],
        hasTests: true, hasPYQ: true, hasGuide: false,
      },
    ],
  },

  {
    id: "banking-clerk",
    name: "Banking Clerk",
    shortName: "Bank Clerk",
    tint: "var(--blue)",
    colorSoft: "var(--blue-soft)",
    description: "IBPS Clerk, SBI Clerk — Office Assistant level · 12th pass eligible",
    minTier: 2,
    exams: [
      {
        id: "ibps-clerk-2025",
        boardId: "banking-clerk",
        name: "IBPS Clerk Prelims 2025",
        shortName: "IBPS Clerk",
        tier: 2,
        eligibility: "12th Pass + Graduation (preferred)",
        pattern: "100 Qs · 1 hr · Prelims + Mains",
        subjects: ["Reasoning", "Quantitative Aptitude", "English"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Aug 2025",
      },
      {
        id: "sbi-clerk-2025",
        boardId: "banking-clerk",
        name: "SBI Clerk (JA) 2025",
        shortName: "SBI Clerk",
        tier: 2,
        eligibility: "12th Pass",
        pattern: "100 Qs · 1 hr · Prelims + Mains",
        subjects: ["Reasoning", "Quantitative Aptitude", "English"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Sep 2025",
      },
    ],
  },

  {
    id: "police-si",
    name: "Police SI / Daroga",
    shortName: "Police SI",
    tint: "var(--red)",
    colorSoft: "var(--red-soft)",
    description: "UP SI, Bihar SI, Jharkhand SI, Daroga — 12th pass eligible",
    minTier: 2,
    exams: [
      {
        id: "up-si-2025",
        boardId: "police-si",
        name: "UP SI / Daroga 2025",
        shortName: "UP SI",
        tier: 2,
        eligibility: "12th Pass + Graduation (preferred)",
        pattern: "160 Qs · 2 hrs · Written + Physical",
        subjects: ["General Knowledge", "Reasoning", "Hindi", "Numerical Ability"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Dec 2025", daysLeft: 240,
      },
      {
        id: "bihar-si-2025",
        boardId: "police-si",
        name: "Bihar SI (BPSSC) 2025",
        shortName: "Bihar SI",
        tier: 2,
        eligibility: "12th Pass",
        pattern: "200 Qs · 2 hrs",
        subjects: ["General Knowledge", "General Science", "Reasoning", "Hindi"],
        hasTests: true, hasPYQ: false, hasGuide: false,
      },
      {
        id: "jh-si-2025",
        boardId: "police-si",
        name: "Jharkhand Police SI 2025",
        shortName: "JH SI",
        tier: 2,
        eligibility: "12th Pass",
        pattern: "120 Qs · 2 hrs",
        subjects: ["General Knowledge", "Reasoning", "Hindi", "Maths"],
        hasTests: true, hasPYQ: false, hasGuide: false,
      },
    ],
  },

  /* ── TIER 3 boards ── */
  {
    id: "state-psc",
    name: "State PSC (JPSC / BPSC / UPPSC)",
    shortName: "State PSC",
    tint: "var(--violet)",
    colorSoft: "var(--violet-soft)",
    description: "JPSC, BPSC, UPPSC Prelims & Mains · Graduation required",
    minTier: 3,
    exams: [
      {
        id: "jpsc-prelims-2025",
        boardId: "state-psc",
        name: "JPSC Prelims 2025",
        shortName: "JPSC Prelims",
        tier: 3,
        eligibility: "Graduation",
        pattern: "100 Qs · 2 hrs · Paper I",
        subjects: ["General Knowledge", "Reasoning", "Jharkhand GK"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Jun 2025", daysLeft: 63,
      },
      {
        id: "jpsc-mains-2025",
        boardId: "state-psc",
        name: "JPSC Mains 2025",
        shortName: "JPSC Mains",
        tier: 3,
        eligibility: "Graduation + Prelims cleared",
        pattern: "6 Papers · Descriptive · 3 hrs each",
        subjects: ["General Studies I–IV", "Optional Paper", "Language"],
        hasTests: false, hasPYQ: true, hasGuide: false,
      },
      {
        id: "bpsc-prelims-2025",
        boardId: "state-psc",
        name: "BPSC Prelims 2025",
        shortName: "BPSC",
        tier: 3,
        eligibility: "Graduation",
        pattern: "150 Qs · 2 hrs · Paper I",
        subjects: ["General Studies", "Current Affairs"],
        hasTests: true, hasPYQ: true, hasGuide: false,
      },
    ],
  },

  {
    id: "banking-po",
    name: "Banking PO / RBI",
    shortName: "Banking PO",
    tint: "var(--blue)",
    colorSoft: "var(--blue-soft)",
    description: "SBI PO, IBPS PO, RBI Grade B — Probationary Officer level · Graduation required",
    minTier: 3,
    exams: [
      {
        id: "ibps-po-2025",
        boardId: "banking-po",
        name: "IBPS PO Prelims 2025",
        shortName: "IBPS PO",
        tier: 3,
        eligibility: "Graduation (any discipline)",
        pattern: "100 Qs · 1 hr · Prelims + Mains + Interview",
        subjects: ["Reasoning", "Quantitative Aptitude", "English"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Oct 2025", daysLeft: 118,
      },
      {
        id: "sbi-po-2025",
        boardId: "banking-po",
        name: "SBI PO Prelims 2025",
        shortName: "SBI PO",
        tier: 3,
        eligibility: "Graduation (any discipline)",
        pattern: "100 Qs · 1 hr · Prelims + Mains + GD/Interview",
        subjects: ["Reasoning", "Quantitative Aptitude", "English"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Apr 2025",
      },
      {
        id: "rbi-grade-b-2025",
        boardId: "banking-po",
        name: "RBI Grade B 2025",
        shortName: "RBI Gr B",
        tier: 3,
        eligibility: "Graduation with 60% marks",
        pattern: "Phase I (200 Qs · 2 hrs) + Phase II + Interview",
        subjects: ["General Awareness", "Reasoning", "Quantitative Aptitude", "English"],
        hasTests: true, hasPYQ: false, hasGuide: false,
      },
    ],
  },

  {
    id: "uet",
    name: "University Entrance (UET)",
    shortName: "UET",
    tint: "var(--cyan)",
    colorSoft: "var(--cyan-soft)",
    description: "UET Jharkhand, BHU PET, DU Entrance — Graduation-based entrance exams",
    minTier: 3,
    exams: [
      {
        id: "uet-jharkhand-2025",
        boardId: "uet",
        name: "UET Jharkhand 2025",
        shortName: "UET JH",
        tier: 3,
        eligibility: "12th Pass / Graduation",
        pattern: "120 Qs · 2 hrs · Science / Arts streams",
        subjects: ["Reasoning", "Quantitative Aptitude", "Subject-specific"],
        hasTests: true, hasPYQ: true, hasGuide: true,
        upcomingDate: "Jun 2025",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════
   TIER DEFINITIONS
   Tiers are CUMULATIVE — higher tier includes all lower tier boards.
═══════════════════════════════════════════════ */

export const TIERS: Tier[] = [
  {
    id: 1,
    name: "Tier 1",
    badge: "10th Pass",
    qualification: "Passed Class X (Matriculation)",
    tagline: "Start your govt. job journey",
    description:
      "Built for students who have completed Class 10. Covers all central and state government exams that require only Matriculation as minimum qualification — Railway Group D, SSC MTS, Police Constable, Army GD, and more.",
    monthlyPrice: 149,
    yearlyPrice: 999,
    highlight: false,
    color: "var(--green)",
    colorSoft: "var(--green-soft)",
    perks: [
      "Railway Group D — full mock series + PYQs",
      "SSC MTS & Hawaldar — tests + study notes",
      "Police Constable (UP, JH) — full mocks",
      "Army GD & RPF Constable",
      "Unlimited PYQ practice with solutions",
      "AI weak area detection",
    ],
    exclusiveBoardIds: ["railway-group-d", "ssc-lower", "police-constable", "defence"],
    allBoardIds:       ["railway-group-d", "ssc-lower", "police-constable", "defence"],
  },
  {
    id: 2,
    name: "Tier 2",
    badge: "12th Pass",
    qualification: "Passed Class XII (Intermediate)",
    tagline: "Compete for the best 12th-pass posts",
    description:
      "Designed for students who have completed Class 12 and aspire for high-value government posts like SSC CGL, RRB NTPC, Banking Clerk, and Police SI. Includes everything in Tier 1 plus all 12th-pass level exams.",
    monthlyPrice: 249,
    yearlyPrice: 1699,
    highlight: true,
    color: "var(--blue)",
    colorSoft: "var(--blue-soft)",
    perks: [
      "Everything in Tier 1",
      "SSC CGL, CHSL & CPO — full Tier I + II prep",
      "RRB NTPC — CBT 1 & CBT 2 mocks",
      "IBPS Clerk & SBI Clerk — complete pack",
      "UP SI / Daroga, Bihar SI, JH SI",
      "Live class access — expert faculty",
      "Sectional cutoff analysis for banking",
    ],
    exclusiveBoardIds: ["ssc-upper", "railway-ntpc", "banking-clerk", "police-si"],
    allBoardIds:       [
      "railway-group-d", "ssc-lower", "police-constable", "defence",
      "ssc-upper", "railway-ntpc", "banking-clerk", "police-si",
    ],
  },
  {
    id: 3,
    name: "Tier 3",
    badge: "Graduation",
    qualification: "Bachelor's Degree (any discipline)",
    tagline: "Crack the most prestigious govt. exams",
    description:
      "The ultimate plan for graduates targeting State PSC officers (JPSC, BPSC, UPPSC), Bank PO (SBI PO, IBPS PO, RBI Grade B), and university entrances. Includes all Tier 1 & 2 exams plus all graduation-level boards.",
    monthlyPrice: 349,
    yearlyPrice: 2499,
    highlight: false,
    color: "var(--violet)",
    colorSoft: "var(--violet-soft)",
    perks: [
      "Everything in Tier 1 & Tier 2",
      "JPSC, BPSC, UPPSC Prelims — full mocks + PYQs",
      "SBI PO & IBPS PO — complete prelims + mains",
      "RBI Grade B Phase I & II",
      "UET Jharkhand and other university entrances",
      "State rank + All India percentile",
      "Topper mentorship webinars",
      "1-on-1 doubt sessions (2/month)",
      "Certificate on mock series completion",
    ],
    exclusiveBoardIds: ["state-psc", "banking-po", "uet"],
    allBoardIds: [
      "railway-group-d", "ssc-lower", "police-constable", "defence",
      "ssc-upper", "railway-ntpc", "banking-clerk", "police-si",
      "state-psc", "banking-po", "uet",
    ],
  },
];

/* ═══════════════════════════════════════════════
   HELPER UTILITIES
═══════════════════════════════════════════════ */

/** Returns all exams accessible for a given tier (cumulative). */
export function getExamsForTier(tierLevel: TierLevel): Exam[] {
  return EXAM_BOARDS.filter((b) => b.minTier <= tierLevel).flatMap((b) => b.exams);
}

/** Returns all boards accessible for a given tier (cumulative). */
export function getBoardsForTier(tierLevel: TierLevel): ExamBoard[] {
  return EXAM_BOARDS.filter((b) => b.minTier <= tierLevel);
}

/** Returns the tier definition by id. */
export function getTier(id: TierLevel): Tier {
  return TIERS.find((t) => t.id === id)!;
}

/** Returns a board by id. */
export function getBoard(id: string): ExamBoard | undefined {
  return EXAM_BOARDS.find((b) => b.id === id);
}

/** Returns an exam by id (searches all boards). */
export function getExam(id: string): Exam | undefined {
  return EXAM_BOARDS.flatMap((b) => b.exams).find((e) => e.id === id);
}

/** All exam boards — flat list for filter tabs. */
export const ALL_BOARDS = EXAM_BOARDS;

/** All exams — flat list. */
export const ALL_EXAMS = EXAM_BOARDS.flatMap((b) => b.exams);
