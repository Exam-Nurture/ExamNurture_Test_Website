import ResultsPage from "@/components/results/ResultsPage";

export const metadata = { title: "Results — ExamNurture" };

export function generateStaticParams() {
  return [{ id: 'mock-id' }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResultsPage resultId={id} />;
}
