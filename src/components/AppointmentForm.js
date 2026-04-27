import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

// Doctor availability configuration (constant outside component)
const doctorAvailability = {
  sameer: {
    branches: ['Adirampattinam', 'Pattukottai'],
    schedule: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
        branches: [ 'Pattukottai'],
        intervals: [{ start: '09:30', end: '13:00' }],
      },
      {
        days: ['Friday', 'Sunday'],
        branches: ['Adirampattinam'],
        intervals: [{ start: '09:30', end: '13:00' }],
      },
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday'],
        branches: ['Adirampattinam'],
        intervals: [{ start: '17:00', end: '20:15' }],
      },
    ],
  },
  fahmitha: {
    branches: ['Adirampattinam'],
    schedule: [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        branches: ['Adirampattinam'],
        intervals: [{ start: '10:00', end: '13:00' }],
      },
    ],
  },
};

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branch: 'Adirampattinam',
    doctor: 'sameer',
    date: '',
    time: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  // Reset branch if not available when date or doctor changes
  const getAvailableBranches = useCallback(() => {
    const doctor = formData.doctor;
    const docConfig = doctorAvailability[doctor];

    if (!formData.date) {
      // If no date selected, show all branches for the doctor
      return docConfig?.branches || [];
    }

    // Check which branches have availability on the selected date
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);
    const weekday = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

    const availableBranches = new Set();
    docConfig?.schedule?.forEach((entry) => {
      if (entry.days.includes(weekday)) {
        entry.branches.forEach((branch) => availableBranches.add(branch));
      }
    });

    return Array.from(availableBranches);
  }, [formData.doctor, formData.date]);

  useEffect(() => {
    const availableBranches = getAvailableBranches();
    if (formData.branch && !availableBranches.includes(formData.branch)) {
      setFormData(prev => ({ ...prev, branch: '', time: '' }));
      setValidationErrors(prev => ({ ...prev, branch: '', time: '' }));
    }
  }, [formData.branch, getAvailableBranches]);





  const getWeekDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getAvailabilityIntervals = (doctor, branch, date) => {
    const docConfig = doctorAvailability[doctor];
    if (!docConfig?.schedule?.length) return [];

    const weekday = getWeekDayName(date);
    return docConfig.schedule
      .filter((entry) => entry.branches.includes(branch) && entry.days.includes(weekday))
      .flatMap((entry) => entry.intervals || []);
  };

  const generateTimeSlots = (interval, intervalMinutes = 15) => {
    if (!interval) return [];

    const [startHours, startMins] = interval.start.split(':').map(Number);
    const [endHours, endMins] = interval.end.split(':').map(Number);
    const start = startHours * 60 + startMins;
    const end = endHours * 60 + endMins;

    const slots = [];
    for (let minutes = start; minutes <= end; minutes += intervalMinutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }

    return slots;
  };

  const getAllScheduleSlots = () => {
    if (!formData.date || !formData.branch || !formData.doctor) return [];
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);

    const intervals = getAvailabilityIntervals(formData.doctor, formData.branch, selectedDate);
    if (!intervals.length) return [];

    const slots = [];
    intervals.forEach((interval) => {
      slots.push(...generateTimeSlots(interval, 20));
    });

    return slots;
  };

  // Format time for display
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, mins] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${mins} ${period}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset dependent fields when doctor, branch, or date changes
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'doctor' && { branch: '', time: '' }),
      ...(name === 'date' && { branch: '', time: '' }),
      ...(name === 'branch' && { time: '' }),
    }));
    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  const fetchAvailableSlots = async () => {
    if (!formData.date || !formData.branch || !formData.doctor) {
      setBookedSlots([]);
      setSlotsError('');
      return;
    }

    setSlotsLoading(true);
    setSlotsError('');

    try {
      const response = await axios.get('http://localhost:5000/api/available-slots', {
        params: {
          date: formData.date,
          branch: formData.branch,
          doctor: formData.doctor,
        },
      });

      const bookeds = response.data.bookedSlots || [];
      setBookedSlots(bookeds);

      if (formData.time && bookeds.includes(formData.time)) {
        setFormData((prev) => ({ ...prev, time: '' }));
      }
    } catch (error) {
      setBookedSlots([]);
      setSlotsError(error.response?.data?.message || 'Unable to load available slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    const branches = getAvailableBranches();
    if (branches.length === 1 && formData.branch !== branches[0]) {
      setFormData((prev) => ({ ...prev, branch: branches[0], time: '' }));
    } else if (formData.branch && !branches.includes(formData.branch)) {
      setFormData((prev) => ({ ...prev, branch: '', time: '' }));
    }

    fetchAvailableSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.date, formData.branch, formData.doctor]);

  const validateForm = () => {
    const errors = {};

    // Basic field validation
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.branch) errors.branch = 'Branch is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.message.trim()) errors.message = 'Message is required';

    // Validate selected time against current booked slots
    if (formData.time && bookedSlots.includes(formData.time)) {
      errors.time = 'Selected time slot is already booked. Please choose a different time.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessageType('error');
      setMessage('❌ Please fix the errors above');
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/appointments', {
        ...formData,
        date: new Date(formData.date),
      });

      setMessageType('success');
      setMessage('✅ Appointment booked successfully!');
      setFormData({
        name: '',
        phone: '',
        email: '',
        branch: 'Adirampattinam',
        doctor: 'sameer',
        date: '',
        time: '',
        message: '',
      });
      setValidationErrors({});
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('error');
      const errorMessage =
        error.response?.data?.message || 'Error booking appointment. Please try again.';
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    }
    setLoading(false);
  };

  const allScheduleSlots = getAllScheduleSlots();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section id="appointment" className="py-16 md:py-20 lg:py-24 px-4 bg-accent-100 dark:bg-slate-900">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            Book Appointment
          </h2>
          <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.form
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 space-y-4 md:space-y-6"
        >
          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base dark:bg-slate-700 dark:text-white ${
                validationErrors.name
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-slate-600 focus:border-primary-500 dark:focus:border-primary-400'
              }`}
              required
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base dark:bg-slate-700 dark:text-white ${
                validationErrors.phone
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-slate-600 focus:border-primary-500 dark:focus:border-primary-400'
              }`}
              required
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base dark:bg-slate-700 dark:text-white ${
                validationErrors.email
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-slate-600 focus:border-primary-500 dark:focus:border-primary-400'
              }`}
              required
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Select Doctor <span className="text-red-500">*</span>
            </label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors text-sm md:text-base"
            >
              <option value="sameer">Dr. Sameer</option>
              <option value="fahmitha">Dr. Fahmitha</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.doctor === 'fahmitha'
                ? '⚕️ Available at Adirampattinam only (10:00 AM - 1:00 PM)'
                : '⚕️ Select date to see available branches'}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Appointment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base dark:bg-slate-700 dark:text-white ${
                validationErrors.date
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-slate-600 focus:border-primary-500 dark:focus:border-primary-400'
              }`}
              required
            />
            {validationErrors.date && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.date}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Select Branch <span className="text-red-500">*</span>
            </label>
            {getAvailableBranches().length === 0 && formData.date ? (
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 text-sm">
                Doctor not available on this date
              </div>
            ) : (
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base dark:bg-slate-700 dark:text-white ${
                  validationErrors.branch
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-slate-600 focus:border-primary-500 dark:focus:border-primary-400'
                }`}
              >
                <option value="">Select Branch</option>
                {getAvailableBranches().map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            )}
            {validationErrors.branch && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.branch}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Appointment Time <span className="text-red-500">*</span>
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base dark:bg-slate-700 dark:text-white ${
                validationErrors.time
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-slate-600 focus:border-primary-500 dark:focus:border-primary-400'
              }`}
              required
            >
              <option value="">Select Time</option>
              {allScheduleSlots.map((slot) => (
                <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                  {formatTime(slot)}{bookedSlots.includes(slot) ? ' (Booked)' : ''}
                </option>
              ))}
            </select>
            {slotsLoading && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading slots…</p>
            )}
            {!slotsLoading && formData.date && formData.branch && allScheduleSlots.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Doctor is not available on this date for the selected branch</p>
            )}
            {!slotsLoading && formData.date && formData.branch && allScheduleSlots.length > 0 && allScheduleSlots.every((slot) => bookedSlots.includes(slot)) && (
              <p className="text-xs text-red-500 mt-1">No available appointments for this date</p>
            )}
            {slotsError && (
              <p className="text-xs text-red-500 mt-1">{slotsError}</p>
            )}
            {validationErrors.time && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.time}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm md:text-base">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              placeholder="Tell us your problem (tooth pain, cleaning, braces, or any other concern)"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors resize-none text-sm md:text-base dark:bg-slate-700 dark:text-white ${
                validationErrors.message
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-slate-600 focus:border-primary-500 dark:focus:border-primary-400'
              }`}
              required
            ></textarea>
            {validationErrors.message && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.message}</p>
            )}
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {loading ? '⏳ Booking...' : '📅 Book Appointment'}
          </motion.button>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg text-center font-semibold ${
                messageType === 'success'
                  ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
              }`}
            >
              {message}
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default AppointmentForm;