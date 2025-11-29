// components/Layout/DashboardLayout.js
import CollapsibleSidebar from "../Website/CollapsibleSidebar";
import NavBar_PostLogin from "@/components/Website/NavBar_PostLogin"
import  Footer from "@/components/Website/Footer"

export default function DashboardLayout({ children }) {
  return (
    <>

    <div className="flex">
      <CollapsibleSidebar />

      <div className="flex flex-col w-full">

        <NavBar_PostLogin />

        {/* Page content */}
        <main className="p-4">
          {children}
        </main>

      </div>
    
    </div>
    <Footer />
    </>
  );
}
