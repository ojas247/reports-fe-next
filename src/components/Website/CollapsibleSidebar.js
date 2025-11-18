'use client'; // Required for client-side interactivity in Next.js App Router

import { useState } from 'react';
// No lucide-react import needed - using Bootstrap Icons (assume bi CSS is loaded)

const sampleServices = [
  { id: 1, name: 'Web Development', icon: '🌐', href: '/services/web-dev' },
  { id: 2, name: 'Mobile Apps', icon: '📱', href: '/services/mobile' },
  { id: 3, name: 'Cloud Services', icon: '☁️', href: '/services/cloud' },
  { id: 4, name: 'Consulting', icon: '💼', href: '/services/consulting' },
  { id: 5, name: 'Support', icon: '🛠️', href: '/services/support' },
];

export default function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Menu Overlay (full screen on open) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMobile}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
            style={{ transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
          >
            {/* Mobile Sidebar Content */}
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Services</h2>
                <button
                  onClick={toggleMobile}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>

              {/* Mobile Service List */}
              <nav className="flex-1 p-2 overflow-y-auto">
                <ul className="space-y-2">
                  {sampleServices.map((service) => (
                    <li key={service.id}>
                      <a
                        href={service.href}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                        onClick={toggleMobile} // Close on select
                      >
                        <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                          {service.icon}
                        </span>
                        <span className="text-gray-700 font-medium whitespace-nowrap">
                          {service.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out transform hidden md:block ${
          isCollapsed ? 'w-16' : 'w-64'
        } overflow-hidden`}
      >
        {/* Desktop Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-gray-800">Services</h2>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <i className="bi bi-list"></i> : <i className="bi bi-x"></i>}
          </button>
        </div>

        {/* Desktop Service List */}
        <nav className="p-2">
          <ul className="space-y-2">
            {sampleServices.map((service) => (
              <li key={service.id}>
                <a
                  href={service.href}
                  className={`flex items-center w-full p-3 rounded-lg hover:bg-blue-50 transition-colors group ${
                    isCollapsed ? 'justify-center' : 'justify-start'
                  }`}
                >
                  <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-gray-700 font-medium whitespace-nowrap">
                      {service.name}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobile}
          className="md:hidden mb-4 p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-list"></i>
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Product Services Dashboard
        </h1>
        <p className="text-gray-600">
          Select a service from the left pane to view details. The sidebar is collapsible on desktop and a drawer on mobile.
        </p>
        {/* Add your main content here */}
      </main>
    </div>
  );
}