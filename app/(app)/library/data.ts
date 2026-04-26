/* ─────────────────────────────────────────────
   Library — Mock Article Data
   Tags reference boardIds from examData.ts
───────────────────────────────────────────── */
import { EXAM_BOARDS } from "@/lib/data/examData";

export type Article = {
  id: string;
  title: string;
  description: string;
  boardIds: string[];       // references EXAM_BOARDS[].id
  subject_tags: string[];
  topic_tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  type: "Concept" | "Formula" | "Revision" | "Strategy";
  readTime: string;
  publishedAt: string;
  progress?: number;
  isBookmarked?: boolean;
};

// Derive filter options from central data
export const BOARD_OPTIONS = EXAM_BOARDS.map((b) => ({ id: b.id, label: b.shortName }));
export const SUBJECT_OPTIONS = ["General Knowledge", "Reasoning", "Quantitative Aptitude", "English", "Hindi", "Computer"];
export const DIFFICULTY_OPTIONS: Article["difficulty"][] = ["Easy", "Medium", "Hard"];
export const TYPE_OPTIONS: Article["type"][] = ["Concept", "Formula", "Revision", "Strategy"];

export const ARTICLES: Article[] = [
  {
    id: "current-affairs-jan-mar-2025",
    title: "Current Affairs — January to March 2025",
    description: "National and international events, appointments, awards, sports, and defence updates compiled for quick revision.",
    boardIds: ["state-psc", "banking-po", "banking-clerk", "ssc-upper", "railway-ntpc", "police-si"],
    subject_tags: ["General Knowledge"],
    topic_tags: ["Current Affairs"],
    difficulty: "Easy",
    type: "Revision",
    readTime: "20 min",
    publishedAt: "2025-04-20",
    progress: 50,
  },
  {
    id: "indian-economy-budget",
    title: "Indian Economy — Union Budget 2025 Key Highlights",
    description: "Tax changes, sector-wise allocation, and fiscal policy decisions relevant for all competitive exams.",
    boardIds: ["state-psc", "banking-po", "ssc-upper", "railway-ntpc"],
    subject_tags: ["General Knowledge"],
    topic_tags: ["Indian Economy"],
    difficulty: "Medium",
    type: "Revision",
    readTime: "7 min",
    publishedAt: "2025-04-18",
  },
  {
    id: "jpsc-prelims-strategy",
    title: "JPSC Prelims 2025 — 90-Day Strategy",
    description: "A day-by-day study plan covering GK, Reasoning, and current affairs with weekly mock targets and revision checkpoints.",
    boardIds: ["state-psc"],
    subject_tags: ["General Knowledge", "Reasoning"],
    topic_tags: ["Current Affairs"],
    difficulty: "Easy",
    type: "Strategy",
    readTime: "12 min",
    publishedAt: "2025-04-15",
    progress: 15,
  },
  {
    id: "di-shortcuts",
    title: "Data Interpretation — 10 Shortcuts for Speed",
    description: "Master pie charts, bar graphs, and caselets with mental-math techniques used by toppers. Includes 15 solved examples.",
    boardIds: ["banking-po", "banking-clerk", "ssc-upper"],
    subject_tags: ["Quantitative Aptitude"],
    topic_tags: ["Data Interpretation"],
    difficulty: "Medium",
    type: "Formula",
    readTime: "6 min",
    publishedAt: "2025-04-12",
    progress: 35,
  },
  {
    id: "hindi-passage-solving",
    title: "Hindi Language — गद्यांश हल करने की विधि",
    description: "हिंदी गद्यांश को तेज़ी से हल करने की तकनीक, मुख्य बिंदु पहचानना, और उत्तर चुनने की रणनीति।",
    boardIds: ["state-psc", "police-si"],
    subject_tags: ["Hindi"],
    topic_tags: ["Comprehension"],
    difficulty: "Medium",
    type: "Strategy",
    readTime: "5 min",
    publishedAt: "2025-04-10",
  },
  {
    id: "number-series-advanced",
    title: "Number Series — Advanced Patterns for Bank PO",
    description: "Square-based, cube-based, alternating, and hybrid series with step-by-step solving approach.",
    boardIds: ["banking-po"],
    subject_tags: ["Quantitative Aptitude"],
    topic_tags: ["Number Series"],
    difficulty: "Hard",
    type: "Concept",
    readTime: "8 min",
    publishedAt: "2025-04-08",
  },
  {
    id: "indian-polity-basics",
    title: "Indian Polity — Fundamental Rights & DPSP",
    description: "A comprehensive overview of Fundamental Rights (Part III) and Directive Principles of State Policy (Part IV) with comparison tables and PYQ patterns.",
    boardIds: ["state-psc", "ssc-upper"],
    subject_tags: ["General Knowledge"],
    topic_tags: ["Indian Polity"],
    difficulty: "Easy",
    type: "Concept",
    readTime: "8 min",
    publishedAt: "2025-04-05",
    progress: 72,
  },
  {
    id: "english-comprehension",
    title: "Reading Comprehension — How to Solve in 4 Minutes",
    description: "Paragraph skimming, inference detection, and tone identification techniques for Banking and SSC English sections.",
    boardIds: ["banking-po", "banking-clerk", "ssc-upper"],
    subject_tags: ["English"],
    topic_tags: ["Comprehension"],
    difficulty: "Medium",
    type: "Strategy",
    readTime: "6 min",
    publishedAt: "2025-04-02",
  },
  {
    id: "coding-decoding-patterns",
    title: "Coding-Decoding — All Pattern Types Explained",
    description: "Letter shifting, number coding, condition-based coding, and new-pattern questions for competitive exams.",
    boardIds: ["banking-po", "banking-clerk", "ssc-upper", "railway-ntpc"],
    subject_tags: ["Reasoning"],
    topic_tags: ["Coding-Decoding"],
    difficulty: "Easy",
    type: "Concept",
    readTime: "5 min",
    publishedAt: "2025-03-28",
  },
  {
    id: "syllogism-rules",
    title: "Syllogisms — Complete Rule Set & Venn Diagrams",
    description: "Learn all the valid syllogism conclusions using the definite + possibility approach. Covers all question types asked in IBPS/SBI.",
    boardIds: ["banking-po", "banking-clerk", "railway-ntpc"],
    subject_tags: ["Reasoning"],
    topic_tags: ["Syllogisms"],
    difficulty: "Medium",
    type: "Concept",
    readTime: "10 min",
    publishedAt: "2025-03-22",
    progress: 100,
  },
  {
    id: "simplification-tricks",
    title: "Simplification & Approximation — Fast Tricks",
    description: "BODMAS shortcuts, percentage-fraction conversion table, and estimation techniques for Bank PO exams.",
    boardIds: ["banking-po", "banking-clerk", "ssc-upper"],
    subject_tags: ["Quantitative Aptitude"],
    topic_tags: ["Simplification"],
    difficulty: "Easy",
    type: "Formula",
    readTime: "4 min",
    publishedAt: "2025-03-15",
  },
  {
    id: "history-freedom-movement",
    title: "Modern India — Freedom Movement Timeline",
    description: "From 1857 Revolt to Independence: key events, acts, leaders, and movements in chronological order with PYQ analysis.",
    boardIds: ["state-psc", "ssc-upper", "railway-ntpc"],
    subject_tags: ["General Knowledge"],
    topic_tags: ["History"],
    difficulty: "Medium",
    type: "Revision",
    readTime: "15 min",
    publishedAt: "2025-03-10",
  },
  {
    id: "geography-indian-rivers",
    title: "Indian Geography — River Systems & Drainage",
    description: "Himalayan vs peninsular rivers, tributaries, dams, and projects. Includes map-based questions practice.",
    boardIds: ["state-psc", "ssc-upper", "railway-ntpc"],
    subject_tags: ["General Knowledge"],
    topic_tags: ["Geography"],
    difficulty: "Easy",
    type: "Concept",
    readTime: "9 min",
    publishedAt: "2025-03-05",
  },
  {
    id: "grammar-error-spotting",
    title: "English Grammar — Error Spotting Rules",
    description: "Subject-verb agreement, tense consistency, article usage, and preposition errors. 50+ practice sentences included.",
    boardIds: ["banking-po", "banking-clerk", "ssc-upper"],
    subject_tags: ["English"],
    topic_tags: ["Grammar"],
    difficulty: "Easy",
    type: "Formula",
    readTime: "5 min",
    publishedAt: "2025-02-28",
  },
  {
    id: "science-physics-mechanics",
    title: "Science — Newton's Laws & Applications",
    description: "Force, momentum, friction, and circular motion explained with real-world examples for Railway and SSC Science sections.",
    boardIds: ["railway-ntpc", "railway-group-d", "ssc-upper"],
    subject_tags: ["General Knowledge"],
    topic_tags: ["Science"],
    difficulty: "Medium",
    type: "Concept",
    readTime: "7 min",
    publishedAt: "2025-02-20",
  },
  {
    id: "computer-basics-os",
    title: "Computer Awareness — Operating Systems & Networking",
    description: "Types of OS, memory management, LAN/WAN, protocols, and cyber security basics for Bank PO and Clerk exams.",
    boardIds: ["banking-po", "banking-clerk"],
    subject_tags: ["Computer"],
    topic_tags: ["Computer Basics"],
    difficulty: "Easy",
    type: "Revision",
    readTime: "6 min",
    publishedAt: "2025-02-12",
  },
];
