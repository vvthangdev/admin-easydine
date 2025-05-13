import Sidebar from "../../../components/Admin/sidebar";
import { Outlet } from 'react-router-dom';
import Header from "../../../components/HomePage/header";
import { useState } from 'react';

function AdminLayout() {
  const navLinks = [{ path: "/", label: "Trang chủ" }];
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm h-16">
        <Header logo="/Assets/Header/logo2.png" navLinks={navLinks} />
      </header>

      <div className="flex flex-1">
        {/* Fixed Sidebar */}
        <div className="fixed top-16 left-0 bottom-0 z-10">
          <Sidebar onCollapseChange={setIsSidebarCollapsed} />
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <main className="p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 p-4">
            <div className="text-center text-sm text-gray-600">
              © 2024 Restaurant Admin. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;