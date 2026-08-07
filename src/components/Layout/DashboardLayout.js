import CollapsibleSidebar from "../Website/CollapsibleSidebar";
import NavBar_PostLogin from "@/components/Website/NavBar_PostLogin";
import Footer from "@/components/Website/Footer";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-sans antialiased">
      {/* Upper Workspace Layer */}
      <div className="flex flex-1 relative overflow-x-hidden">
        {/* Left Collapsible Sidebar */}
        <CollapsibleSidebar />

        {/* Right Main Flow */}
        <div className="flex flex-col flex-1 min-w-0">
          <NavBar_PostLogin />

          {/* Primary View Area */}
          <main className="flex-1 p-3 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}