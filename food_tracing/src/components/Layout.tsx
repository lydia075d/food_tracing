import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, LayoutDashboard, Truck } from 'lucide-react';

function Layout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Food Supply Chain</h1>
        </div>
        <div className="mt-4">
          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive('/dashboard') ? 'bg-gray-100' : ''
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/producer-registration"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive('/producer-registration') ? 'bg-gray-100' : ''
            }`}
          >
            <Box className="w-5 h-5 mr-3" />
            Producer Registration
          </Link>
          <Link
            to="/border-crossing"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive('/border-crossing') ? 'bg-gray-100' : ''
            }`}
          >
            <Truck className="w-5 h-5 mr-3" />
            Border Crossing
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;