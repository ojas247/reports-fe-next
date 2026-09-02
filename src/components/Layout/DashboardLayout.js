'use client';

import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import CollapsibleSidebar from '../Website/CollapsibleSidebar';
import NavBar_PostLogin from '@/components/Website/NavBar_PostLogin';
import Footer from '@/components/Website/Footer';

function DashboardContent({ children }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <CollapsibleSidebar />

      {/* Main content shifts correctly when sidebar collapses */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:ml-[72px]' : 'md:ml-60'
        }`}
      >
        <NavBar_PostLogin />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}