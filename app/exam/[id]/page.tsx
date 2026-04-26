import ExamInterface from "@/components/exam/ExamInterface";

export const metadata = { title: "Exam — ExamNurture" };

export function generateStaticParams() {
  return [{ id: 'mock-id' }];
}

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExamInterface examId={id} />;
}
