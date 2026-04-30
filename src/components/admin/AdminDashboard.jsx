import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminAppointments from './AdminAppointments';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    cancelledAppointments: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/appointments/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Dashboard stats error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const pendingAppointments = stats.totalAppointments - stats.cancelledAppointments;

  return (
    <div className="space-y-6 box-border">
      {/* Stats Cards - Perfect Grid Alignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl border-l-4 border-blue-500 border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-gray-700 mb-6">Total Appointments</p>
          <div className="text-4xl font-bold text-blue-600">
            {loading ? '...' : stats.totalAppointments}
          </div>
        </div>

        <div className="rounded-3xl border-l-4 border-green-500 border border-gray-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-gray-700 mb-6">Today's Appointments</p>
          <div className="text-4xl font-bold text-green-600">
            {loading ? '...' : stats.todayAppointments}
          </div>
        </div>

        <div className="rounded-3xl border-l-4 border-yellow-500 border border-gray-200 bg-gradient-to-br from-yellow-50 to-white p-6 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-gray-700 mb-6">Pending Appointments</p>
          <div className="text-4xl font-bold text-yellow-600">
            {loading ? '...' : pendingAppointments}
          </div>
        </div>

        <div className="rounded-3xl border-l-4 border-purple-500 border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-semibold text-gray-700 mb-6">Completed Appointments</p>
          <div className="text-4xl font-bold text-purple-600">
            {loading ? '...' : stats.cancelledAppointments}
          </div>
        </div>
      </div>

      {/* Appointments Management */}
      <AdminAppointments />
    </div>
  );
};

export default AdminDashboard;
