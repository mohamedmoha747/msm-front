import React from 'react';
import { LogOut } from 'lucide-react';

const AdminLayout = ({ children, onLogout }) => (
  <div className="min-h-screen bg-gray-50 text-gray-900 box-border">
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-600 font-semibold">Admin Panel</p>
            <h1 className="text-4xl font-bold text-gray-900 mt-3">ADMIN DASHBOARD</h1>
            <p className="text-sm text-gray-600 mt-3">Manage appointments from one page.</p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={onLogout}
              className="rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 inline-flex items-center justify-center gap-2 transition whitespace-nowrap"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
  </div>
);

export default AdminLayout;
