import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

/**
 * Format time from 24-hour format to 12-hour format with AM/PM
 * @param {string} timeString - Time in HH:mm format
 * @returns {string} Time in h:mm AM/PM format
 */
const formatTime12Hour = (timeString) => {
  if (!timeString || typeof timeString !== 'string') {
    return 'N/A';
  }

  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return 'N/A';
    }

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${displayHour}:${paddedMinutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'N/A';
  }
};

const Admin = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });

  // Generate time options in 12-hour format
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        options.push({ value: time24, label: displayTime });
      }
    }
    return options;
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter states
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
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false);
  const [lastCreatedAppointment, setLastCreatedAppointment] = useState(null);

  const handleLogin = () => {
    const validEmail = 'admin@example.com';
    const validPassword = 'admin123';

    if (email.trim().toLowerCase() === validEmail && password === validPassword) {
      setAuthenticated(true);
      setErrorMessage('');
      fetchAppointments(1);
      fetchDashboardStats();
    } else {
      setErrorMessage('Invalid email or password.');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/appointments/stats/dashboard'
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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
      const response = await axios.get(
        `http://localhost:5000/api/appointments?${queryString}`
      );
      setAppointments(response.data.appointments);
      setTotalPages(response.data.pagination.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Error fetching appointments');
    }
    setLoading(false);
  };

  const deleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${id}`);
        alert('✅ Appointment deleted');
        fetchAppointments(1);
        fetchDashboardStats();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('❌ Error deleting appointment');
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${id}/status`,
        { status: newStatus }
      );
      fetchAppointments(currentPage);
      fetchDashboardStats();
      alert(`✅ Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Error updating status');
    }
  };

  const openNotesModal = (appointment) => {
    setSelectedAppointmentId(appointment._id);
    setNotesText(appointment.notes || '');
    setShowNotesModal(true);
  };

  const saveNotes = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${selectedAppointmentId}/notes`,
        { notes: notesText }
      );
      alert('✅ Notes saved');
      setShowNotesModal(false);
      fetchAppointments(currentPage);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('❌ Error saving notes');
    }
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
      formatTime12Hour(apt.time) || 'N/A',
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

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchAppointments(1);
    fetchDashboardStats();
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

  const handleAppointmentFormChange = (e) => {
    setAppointmentFormData({ ...appointmentFormData, [e.target.name]: e.target.value });
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/appointments', appointmentFormData);
      setAppointmentSuccess('✅ Appointment created successfully! Confirmation email sent to patient.');
      setLastCreatedAppointment(response.data);
      setShowWhatsAppButton(true);
      setAppointmentFormData({ name: '', phone: '', email: '', branch: 'Pattukkottai', date: '', message: '' });
      fetchAppointments(currentPage);
      fetchDashboardStats();
      setTimeout(() => {
        setAppointmentSuccess('');
        setShowWhatsAppButton(false);
      }, 15000); // Extended to 15 seconds for better UX
    } catch (error) {
      console.error('Appointment creation error:', error);
      if (error.response?.status === 400) {
        setAppointmentSuccess('❌ Invalid data. Please check all fields and try again.');
      } else if (error.response?.status === 500) {
        setAppointmentSuccess('❌ Server error. Appointment may have been created but email failed. Please check manually.');
      } else {
        setAppointmentSuccess('❌ Network error. Please check your connection and try again.');
      }
      setTimeout(() => setAppointmentSuccess(''), 8000);
    }
    setLoading(false);
  };

  const handleWhatsAppSend = () => {
    if (lastCreatedAppointment) {
      const { name, phone, date, time, doctor, branch } = lastCreatedAppointment;
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const formattedTime = formatTime12Hour(time);
      const message = `Hi ${name},\n\nYour appointment has been confirmed.\n\nDoctor: ${doctor}\nDate: ${formattedDate}\nTime: ${formattedTime}\nBranch: ${branch}\n\nPlease arrive 10 minutes early.\n\nThank you for choosing MSM Dental Clinic 😊`;
      const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="hidden md:block bg-gradient-to-br from-sky-500 via-indigo-600 to-violet-700 p-10 text-white">
              <div className="flex h-full flex-col justify-center gap-6">
                <div>
                  <h2 className="text-4xl font-semibold">Admin Portal</h2>
                  <p className="mt-4 text-sm text-slate-200 leading-7">
                    Secure access for staff only. Use your admin email and password to manage appointments and dashboard insights.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Dashboard</p>
                    <p className="mt-2 text-xl font-semibold">Appointments</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Reports</p>
                    <p className="mt-2 text-xl font-semibold">Export & Manage</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12 bg-white">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-500">Admin Login</p>
                <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">Welcome back</h1>
                <p className="mt-3 text-sm text-slate-500">
                  Sign in with your admin credentials to continue.
                </p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition"
                  />
                </div>
                {errorMessage && (
                  <p className="text-sm text-rose-400">{errorMessage}</p>
                )}
                <button
                  onClick={handleLogin}
                  className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:scale-[1.01]"
                >
                  Sign in securely
                </button>
                <p className="text-xs text-slate-500">
                  For demo use: admin@example.com / admin123
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-white pb-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            🏥 Admin Dashboard
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                fetchAppointments(1);
                fetchDashboardStats();
              }}
              className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-slate-900 transition-all text-sm md:text-base"
            >
              🔄 Refresh
            </button>
            <button
              onClick={exportToCSV}
              className="border-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-green-600 hover:text-white dark:hover:bg-green-400 dark:hover:text-slate-900 transition-all text-sm md:text-base"
            >
              📥 Export CSV
            </button>
            <button
              onClick={() => {
                setAuthenticated(false);
                setPassword('');
                setAppointments([]);
              }}
              className="border-2 border-red-600 text-red-600 dark:border-red-400 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:hover:text-slate-900 transition-all text-sm md:text-base"
            >
              🚪 Logout
            </button>
          </div>
        </motion.div>

        {/* Appointment Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">📝 Create New Appointment</h3>
            <button
              onClick={() => setShowAppointmentForm(!showAppointmentForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showAppointmentForm ? 'Hide Form' : 'Show Form'}
            </button>
          </div>

          {showAppointmentForm && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <form onSubmit={handleAppointmentSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Patient Name</label>
                  <input
                    type="text"
                    name="name"
                    value={appointmentFormData.name}
                    onChange={handleAppointmentFormChange}
                    className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={appointmentFormData.phone}
                    onChange={handleAppointmentFormChange}
                    className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={appointmentFormData.email}
                    onChange={handleAppointmentFormChange}
                    className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Select Doctor</label>
                  <select
                    name="doctor"
                    value={appointmentFormData.doctor}
                    onChange={handleAppointmentFormChange}
                    className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="sameer">Dr. Sameer</option>
                    <option value="fahmitha">Dr. Fahmitha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Branch</label>
                  <select
                    name="branch"
                    value={appointmentFormData.branch}
                    onChange={handleAppointmentFormChange}
                    className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Adirampattinam">Adirampattinam</option>
                    {appointmentFormData.doctor === 'sameer' && (
                      <option value="Pattukottai">Pattukottai</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Appointment Date</label>
                  <input
                    type="date"
                    name="date"
                    value={appointmentFormData.date}
                    onChange={handleAppointmentFormChange}
                    className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Appointment Time</label>
                  <select
                    name="time"
                    value={appointmentFormData.time}
                    onChange={handleAppointmentFormChange}
                    className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Select Time</option>
                    {generateTimeOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Message/Notes</label>
                  <textarea
                    name="message"
                    value={appointmentFormData.message}
                    onChange={handleAppointmentFormChange}
                    rows="3"
                    className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex gap-4 items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[180px] justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        📅 Create Appointment
                      </>
                    )}
                  </button>

                  {showWhatsAppButton && (
                    <button
                      type="button"
                      onClick={handleWhatsAppSend}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      📱 Send via WhatsApp
                    </button>
                  )}
                </div>

                {showWhatsAppButton && lastCreatedAppointment && (
                  <div className="md:col-span-2 mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>WhatsApp Preview:</strong><br />
                      <em>"Hi {lastCreatedAppointment.name}, your appointment is confirmed at {new Date(lastCreatedAppointment.date).toLocaleString()}."</em>
                    </div>
                  </div>
                )}
              </form>

              {appointmentSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-4 p-4 rounded-lg border-l-4 shadow-md ${
                    appointmentSuccess.includes('✅')
                      ? 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {appointmentSuccess.includes('✅') ? '✅' : '❌'}
                    </span>
                    <span className="font-medium">{appointmentSuccess.replace(/[✅❌]/g, '').trim()}</span>
                  </div>
                  {appointmentSuccess.includes('email sent') && (
                    <div className="mt-2 text-sm opacity-75">
                      💡 Tip: Use the WhatsApp button to send additional confirmation
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
              Total Appointments
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {stats.totalAppointments}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6 border-l-4 border-green-600">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
              Today's Appointments
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {stats.todayAppointments}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-lg p-6 border-l-4 border-yellow-600">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
              Pending Appointments
            </p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
              {stats.pendingAppointments}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
              Completed Appointments
            </p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {stats.completedAppointments}
            </p>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-hover p-6 mb-6"
        >
          <h3 className="text-xl font-bold mb-4 dark:text-white">🔍 Filters & Search</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-300">
                Search (Name/Phone)
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-300">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-300">
                Branch
              </label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
              >
                <option value="All">All Branches</option>
                <option value="Adirampattinam">Adirampattinam</option>
                <option value="Pattukottai">Pattukottai</option>
              </select>
            </div>

            {/* Doctor Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-300">
                Doctor
              </label>
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
              >
                <option value="All">All Doctors</option>
                <option value="sameer">Dr. Sameer</option>
                <option value="fahmitha">Dr. Fahmitha</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-300">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Limit */}
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-300">
                Records Per Page
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="w-full p-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateFilter === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full p-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full p-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                />
              </div>
            </div>
          )}

          {/* Filter Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleApplyFilters}
              className="gradient-btn px-6 py-2 text-sm font-semibold"
            >
              ✅ Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="border-2 border-gray-400 text-gray-600 dark:text-gray-300 dark:border-gray-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition-all text-sm"
            >
              🔄 Clear All
            </button>
          </div>
        </motion.div>

        {/* Content Area */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-hover text-center py-12"
          >
            <p className="text-xl font-semibold">⏳ Loading appointments...</p>
          </motion.div>
        ) : appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-hover text-center py-12"
          >
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              ℹ️ No appointments found
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-hover overflow-x-auto"
          >
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-900 dark:to-blue-800 text-white">
                  <th className="py-4 px-4 text-left font-semibold">Name</th>
                  <th className="py-4 px-4 text-left font-semibold">Phone</th>
                  <th className="py-4 px-4 text-left font-semibold">Email</th>
                  <th className="py-4 px-4 text-left font-semibold">Doctor</th>
                  <th className="py-4 px-4 text-left font-semibold">Branch</th>
                  <th className="py-4 px-4 text-left font-semibold">Date</th>
                  <th className="py-4 px-4 text-left font-semibold">Time</th>
                  <th className="py-4 px-4 text-left font-semibold">Status</th>
                  <th className="py-4 px-4 text-left font-semibold">Message</th>
                  <th className="py-4 px-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <motion.tr
                    key={appointment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-sm md:text-base dark:text-gray-100">
                      {appointment.name}
                    </td>
                    <td className="py-4 px-4 text-sm md:text-base">
                      <a
                        href={`tel:${appointment.phone}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        {appointment.phone}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-sm md:text-base">
                      <a
                        href={`mailto:${appointment.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {appointment.email}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-sm md:text-base dark:text-gray-100">
                      <span className="px-2 py-1 rounded-full text-white text-xs md:text-sm bg-indigo-500 font-semibold">
                        {appointment.doctor}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm md:text-base dark:text-gray-100">
                      <span className={`px-3 py-1 rounded-full font-semibold text-white text-xs md:text-sm ${
                        appointment.branch === 'Adirampattinam'
                          ? 'bg-purple-500'
                          : 'bg-blue-500'
                      }`}>
                        {appointment.branch}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm md:text-base dark:text-gray-100">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm md:text-base dark:text-gray-100 font-semibold">
                      {formatTime12Hour(appointment.time)}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateStatus(appointment._id, e.target.value)}
                        className={`px-3 py-1 rounded-full font-semibold text-white cursor-pointer text-xs md:text-sm ${
                          appointment.status === 'Pending'
                            ? 'bg-yellow-500'
                            : appointment.status === 'Confirmed'
                            ? 'bg-blue-500'
                            : appointment.status === 'Completed'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-sm max-w-xs truncate dark:text-gray-100">
                      {appointment.message}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col gap-2 justify-center items-center">
                        <div className="flex gap-2 flex-wrap justify-center">
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            href={`tel:${appointment.phone}`}
                            className="bg-green-600 text-white px-2 md:px-3 py-1 rounded-lg hover:bg-green-700 transition-colors font-semibold text-xs"
                            title="Call"
                          >
                            📞
                          </motion.a>
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            href={`https://wa.me/${appointment.phone.replace(/\D/g, '')}?text=Hello%20${appointment.name}%2C%20regarding%20your%20appointment...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white px-2 md:px-3 py-1 rounded-lg hover:bg-green-600 transition-colors font-semibold text-xs"
                            title="WhatsApp"
                          >
                            💬
                          </motion.a>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openNotesModal(appointment)}
                            className="bg-blue-600 text-white px-2 md:px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-xs"
                            title="Notes"
                          >
                            📝
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteAppointment(appointment._id)}
                            className="bg-red-600 text-white px-2 md:px-3 py-1 rounded-lg hover:bg-red-700 transition-colors font-semibold text-xs"
                            title="Delete"
                          >
                            🗑️
                          </motion.button>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && appointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-2 mt-8 flex-wrap"
          >
            <button
              onClick={() => fetchAppointments(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              ⬅️ Previous
            </button>
            <span className="text-sm font-semibold dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => fetchAppointments(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              Next ➡️
            </button>
          </motion.div>
        )}
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold mb-4 dark:text-white">📝 Edit Notes</h3>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add your notes here..."
              rows="6"
              className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveNotes}
                className="gradient-btn flex-1 py-2 font-semibold"
              >
                ✅ Save
              </button>
              <button
                onClick={() => setShowNotesModal(false)}
                className="border-2 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 flex-1 py-2 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
              >
                ❌ Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Admin;