/**
 * Exam layout — bare full-screen shell.
 * No sidebar, no header, no footer. The exam interface owns the whole viewport.
 */
export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
