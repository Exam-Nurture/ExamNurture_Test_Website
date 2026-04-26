import Topbar from "@/components/layout/Topbar";
import MobileNav from "@/components/layout/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Topbar />

      {/* Main content area — offset for topbar (56px) */}
      <main
        className="pt-14 pb-20 md:pb-10"
        style={{ minHeight: "100vh" }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
