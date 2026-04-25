import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Topbar />
      <Sidebar />

      {/* Main content area — offset for topbar + sidebar */}
      <main
        className="pt-16 md:pl-[248px] pb-20 md:pb-10"
        style={{ minHeight: "100vh" }}
      >
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 py-7">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
