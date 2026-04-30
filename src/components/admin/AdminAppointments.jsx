import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Phone, MessageCircle, Edit, Trash2 } from 'lucide-react';

const statusOptions = ['booked', 'cancelled'];
const branchOptions = ['Adirampattinam', 'Pattukottai'];
const doctorOptions = ['sameer', 'fahmitha'];

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Notes modal states
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [notesText, setNotesText] = useState('');

  // Appointment form states
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentFormData, setAppointmentFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branch: 'Adirampattinam',
    doctor: 'sameer',
    date: '',
    time: '',
    message: '',
  });
  const [appointmentSuccess, setAppointmentSuccess] = useState('');

  const buildQueryParams = (page = 1) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    if (searchQuery.trim()) {
      params.append('search', searchQuery);
    }

    if (statusFilter !== 'All') {
      params.append('status', statusFilter);
    }

    if (branchFilter !== 'All') {
      params.append('branch', branchFilter);
    }

    if (doctorFilter !== 'All') {
      params.append('doctor', doctorFilter);
    }

    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      params.append('startDate', today);
      params.append('endDate', today);
    } else if (dateFilter === 'week') {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      params.append('startDate', weekStart.toISOString().split('T')[0]);
      params.append('endDate', new Date().toISOString().split('T')[0]);
    } else if (dateFilter === 'custom') {
      if (customStartDate) params.append('startDate', customStartDate);
      if (customEndDate) params.append('endDate', customEndDate);
    }

    return params.toString();
  };

  const fetchAppointments = async (page = 1) => {
    setLoading(true);
    try {
      const queryString = buildQueryParams(page);
      const response = await axios.get(`/api/appointments?${queryString}`);
      setAppointments(Array.isArray(response.data.appointments) ? response.data.appointments : []);
      setTotalPages(response.data.pagination?.pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Fetch appointments failed:', error);
      setMessage('Unable to load appointments at this time.');
    }
    setLoading(false);
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await axios.delete(`/api/appointments/${id}`);
      setMessage('Appointment deleted successfully.');
      fetchAppointments(1);
    } catch (error) {
      console.error('Delete appointment failed:', error);
      setMessage('Unable to delete appointment.');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/appointments/${id}/status`, { status: newStatus });
      setMessage(`Status updated to ${newStatus}`);
      fetchAppointments(currentPage);
    } catch (error) {
      console.error('Status update failed:', error);
      setMessage('Unable to update status.');
    }
  };

  const openNotesModal = (appointment) => {
    setSelectedAppointmentId(appointment._id);
    setNotesText(appointment.notes || '');
    setShowNotesModal(true);
  };

  const saveNotes = async () => {
    try {
      await axios.put(`/api/appointments/${selectedAppointmentId}/notes`, { notes: notesText });
      setMessage('Notes saved successfully.');
      setShowNotesModal(false);
      fetchAppointments(currentPage);
    } catch (error) {
      console.error('Save notes failed:', error);
      setMessage('Unable to save notes.');
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchAppointments(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setBranchFilter('All');
    setDoctorFilter('All');
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setCurrentPage(1);
    fetchAppointments(1);
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/appointments', appointmentFormData);
      setAppointmentSuccess('✅ Appointment created successfully!');
      setAppointmentFormData({
        name: '',
        phone: '',
        email: '',
        branch: 'Adirampattinam',
        doctor: 'sameer',
        date: '',
        time: '',
        message: '',
      });
      setShowAppointmentForm(false);
      fetchAppointments(1);
      setTimeout(() => setAppointmentSuccess(''), 5000);
    } catch (error) {
      console.error('Appointment creation error:', error);
      setAppointmentSuccess('❌ Error creating appointment.');
      setTimeout(() => setAppointmentSuccess(''), 5000);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    if (appointments.length === 0) {
      alert('No appointments to export');
      return;
    }

    const headers = ['Name', 'Phone', 'Email', 'Doctor', 'Branch', 'Date', 'Time', 'Status', 'Notes', 'Message'];
    const rows = appointments.map((apt) => [
      apt.name,
      apt.phone,
      apt.email,
      apt.doctor || '',
      apt.branch || '',
      new Date(apt.date).toLocaleDateString(),
      apt.time || 'N/A',
      apt.status,
      apt.notes || '',
      apt.message,
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach((row) => {
      csvContent += row.map((cell) => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="space-y-6 box-border">
      {/* Header - Proper Alignment */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold">Appointments</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Review incoming requests</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowAppointmentForm(!showAppointmentForm)}
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 whitespace-nowrap flex items-center justify-center"
            >
              {showAppointmentForm ? 'Hide Form' : 'Create Appointment'}
            </button>
            <button
              type="button"
              onClick={exportToCSV}
              className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 whitespace-nowrap flex items-center justify-center"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => fetchAppointments(1)}
              className="rounded-2xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-300 whitespace-nowrap flex items-center justify-center"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Success Message */}
      {appointmentSuccess && (
        <div className="rounded-3xl border border-green-200 bg-green-50 p-4 text-green-700">
          {appointmentSuccess}
        </div>
      )}

      {/* Create Appointment Form */}
      {showAppointmentForm && (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Create New Appointment</h2>
          <form onSubmit={handleAppointmentSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Patient name"
              value={appointmentFormData.name}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, name: e.target.value })}
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={appointmentFormData.phone}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, phone: e.target.value })}
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={appointmentFormData.email}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, email: e.target.value })}
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
            <select
              value={appointmentFormData.branch}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, branch: e.target.value })}
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {branchOptions.map((b) => (
                <option key={b} value={b} className="bg-white">
                  {b}
                </option>
              ))}
            </select>
            <select
              value={appointmentFormData.doctor}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, doctor: e.target.value })}
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {doctorOptions.map((d) => (
                <option key={d} value={d} className="bg-white">
                  {d}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={appointmentFormData.date}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, date: e.target.value })}
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
            <input
              type="time"
              value={appointmentFormData.time}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, time: e.target.value })}
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
            <textarea
              placeholder="Message"
              value={appointmentFormData.message}
              onChange={(e) => setAppointmentFormData({ ...appointmentFormData, message: e.target.value })}
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:col-span-2"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              Create Appointment
            </button>
          </form>
        </div>
      )}

      {/* Filters & Search - Pixel Perfect Alignment */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">🔍 Filters & Search</h2>
        
        {/* Main Filters Row */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search by name or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex-1 min-w-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All" className="bg-white">All Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s} className="bg-white">{s}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-0">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All" className="bg-white">All Branches</option>
              {branchOptions.map((b) => (
                <option key={b} value={b} className="bg-white">{b}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-0">
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All" className="bg-white">All Doctors</option>
              {doctorOptions.map((d) => (
                <option key={d} value={d} className="bg-white">{d}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-0">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all" className="bg-white">All Dates</option>
              <option value="today" className="bg-white">Today</option>
              <option value="week" className="bg-white">This Week</option>
              <option value="custom" className="bg-white">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range */}
        {dateFilter === 'custom' && (
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex-1 min-w-0">
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 whitespace-nowrap flex items-center justify-center"
          >
            ✓ Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 whitespace-nowrap flex items-center justify-center"
          >
            ✕ Clear All
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 text-blue-700">
          {message}
        </div>
      )}

      {/* Appointments Table */}
      <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-4 text-left font-semibold">Patient</th>
              <th className="px-4 py-4 text-left font-semibold">Contact</th>
              <th className="px-4 py-4 text-left font-semibold">Doctor</th>
              <th className="px-4 py-4 text-left font-semibold">Branch</th>
              <th className="px-4 py-4 text-left font-semibold">Date</th>
              <th className="px-4 py-4 text-left font-semibold">Status</th>
              <th className="px-4 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  Loading appointments...
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  ℹ️ No appointments found
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-blue-50 transition-colors border-b border-gray-200">
                  <td className="px-4 py-4 text-gray-900">
                    <div className="font-semibold">{appointment.name}</div>
                    <div className="text-gray-500 text-xs">{appointment.message || 'No message'}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    <div>{appointment.phone}</div>
                    <div className="text-gray-500 text-xs">{appointment.email}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{appointment.doctor}</td>
                  <td className="px-4 py-4 text-gray-700">{appointment.branch}</td>
                  <td className="px-4 py-4 text-gray-700">
                    {new Date(appointment.date).toLocaleDateString()} {appointment.time || ''}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={appointment.status}
                      onChange={(e) => updateStatus(appointment._id, e.target.value)}
                      className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option} className="bg-white">
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 space-x-2">
                    <button
                      type="button"
                      title="Call patient"
                      onClick={() => (window.location.href = `tel:${appointment.phone}`)}
                      className="inline-flex items-center gap-1 rounded-2xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-500"
                    >
                      <Phone className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      title="Message on WhatsApp"
                      onClick={() => {
                        const msg = `Hi ${appointment.name}, your appointment is confirmed.`;
                        window.open(
                          `https://wa.me/${appointment.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`,
                          '_blank'
                        );
                      }}
                      className="inline-flex items-center gap-1 rounded-2xl bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500"
                    >
                      <MessageCircle className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      title="Add notes"
                      onClick={() => openNotesModal(appointment)}
                      className="inline-flex items-center gap-1 rounded-2xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      title="Delete appointment"
                      onClick={() => deleteAppointment(appointment._id)}
                      className="inline-flex items-center gap-1 rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchAppointments(page)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                currentPage === page
                  ? 'bg-sky-500 text-white'
                  : 'border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-w-md w-full">
            <h2 className="mb-4 text-xl font-semibold text-white">Edit Notes</h2>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              rows="6"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
              placeholder="Add notes about this appointment..."
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={saveNotes}
                className="flex-1 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Save Notes
              </button>
              <button
                type="button"
                onClick={() => setShowNotesModal(false)}
                className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;

