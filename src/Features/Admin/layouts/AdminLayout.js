import Sidebar from "../../../components/Admin/sidebar";
import { Outlet } from 'react-router-dom'; // Thêm import này

function AdminLayout() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <div className="h-8 w-px bg-gray-200"></div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet /> {/* Thêm Outlet ở đây để render các route con */}
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 p-4">
                    <div className="text-center text-sm text-gray-600">
                        © 2024 Restaurant Admin. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default AdminLayout;