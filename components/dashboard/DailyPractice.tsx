"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Flame } from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    subject: "GK",
    subjectColor: "var(--violet)",
    subjectBg: "var(--violet-soft)",
    q: "Which Article of the Indian Constitution provides free and compulsory education to children aged 6–14?",
    options: ["Article 19", "Article 21A", "Article 29", "Article 45"],
    correct: 1,
    explanation: "The 86th Amendment Act (2002) inserted Article 21A, making education a fundamental right for children aged 6-14.",
  },
  {
    id: 2,
    subject: "Reasoning",
    subjectColor: "var(--blue)",
    subjectBg: "var(--blue-soft)",
    q: "If A is the brother of B, B is the sister of C, and C is the father of D — what is A to D?",
    options: ["Uncle", "Father", "Brother", "Grandfather"],
    correct: 0,
    explanation: "A and C are brothers/siblings. Since C is the father of D, C's brother A is the uncle of D.",
  },
  {
    id: 3,
    subject: "Quant",
    subjectColor: "var(--red)",
    subjectBg: "var(--red-soft)",
    q: "A train travels 360 km in 4 hours. What is its speed in m/s?",
    options: ["20 m/s", "25 m/s", "28 m/s", "30 m/s"],
    correct: 1,
    explanation: "Speed = 360/4 = 90 km/h. To convert to m/s, multiply by 5/18: 90 * (5/18) = 25 m/s.",
  },
];

export default function DailyPractice() {
  const [answered, setAnswered]   = useState<Record<number, number>>({});
  const [current, setCurrent]     = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const streakDays = 12;

  const q = QUESTIONS[current];
  const isAnswered = answered[q.id] !== undefined;
  const isCorrect  = answered[q.id] === q.correct;
  const doneCount  = Object.keys(answered).length;

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setAnswered((prev) => ({ ...prev, [q.id]: idx }));
    setShowSolution(true);
  };

  const handleNext = () => {
    setShowSolution(false);
    setCurrent((c) => c + 1);
  };

  return (
    <div className="card p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>
              Daily Practice
            </span>
            <span
              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: "var(--amber-soft)", color: "var(--amber)" }}
            >
              <Flame size={12} />
              {streakDays}d streak
            </span>
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--ink-4)" }}>
            {doneCount}/{QUESTIONS.length} done today · from your weak topics
          </div>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (answered[QUESTIONS[i].id] !== undefined) {
                  setCurrent(i);
                  setShowSolution(true);
                }
              }}
              className="w-2 h-2 rounded-full transition-all duration-150"
              style={{
                background: answered[QUESTIONS[i].id] !== undefined
                  ? (answered[QUESTIONS[i].id] === QUESTIONS[i].correct ? "var(--green)" : "var(--red)")
                  : i === current ? "var(--blue)" : "var(--line)",
                cursor: answered[QUESTIONS[i].id] !== undefined ? "pointer" : "default",
              }}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div
        className="rounded-lg px-4 py-3 mb-4 text-xs font-semibold tracking-wider"
        style={{ background: q.subjectBg, color: q.subjectColor }}
      >
        {q.subject} — Question {current + 1}
      </div>
      <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--ink-1)" }}>
        {q.q}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {q.options.map((opt, idx) => {
          let bg   = "var(--bg)";
          let color = "var(--ink-2)";
          let border = "1px solid var(--line-soft)";

          if (isAnswered) {
            if (idx === q.correct) { bg = "var(--green-soft)"; color = "var(--green)"; border = "1px solid var(--green)"; }
            else if (idx === answered[q.id]) { bg = "var(--red-soft)"; color = "var(--red)"; border = "1px solid var(--red)"; }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={isAnswered}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-all duration-150 ${!isAnswered && 'hover:bg-[var(--line-soft)]'}`}
              style={{ background: bg, color, border }}
            >
              <span className="flex-shrink-0">
                {isAnswered && idx === q.correct ? (
                  <CheckCircle2 size={16} style={{ color: "var(--green)" }} />
                ) : (
                  <Circle size={16} style={{ color: "var(--line)" }} />
                )}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* Next / result */}
      {isAnswered && (
        <div className="mt-6 flex flex-col gap-4">
          {showSolution && (
            <div className="p-4 rounded-xl text-xs leading-relaxed" style={{ background: "var(--bg)", border: "1px solid var(--line-soft)", color: "var(--ink-2)" }}>
              <strong style={{ color: "var(--ink-1)" }}>Explanation: </strong>
              {q.explanation}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-semibold"
              style={{ color: isCorrect ? "var(--green)" : "var(--red)" }}
            >
              {isCorrect ? "✓ Correct!" : `✗ Correct answer: ${q.options[q.correct]}`}
            </span>
            {current < QUESTIONS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ background: "var(--blue)" }}
              >
                Next Question →
              </button>
            ) : (
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--green)" }}
              >
                All done today! 🎉
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
