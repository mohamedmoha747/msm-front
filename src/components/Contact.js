import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const branches = [
    {
      name: 'Pattukkottai Branch',
      address: 'No. 95, S.R.V Complex, Nadimuthu Nagar, Pattukkottai',
      phone: '+91 843 843 6757',
      email: 'pattukkottai@msmdental.com',
      hours: 'Mon-Sat: 9.30AM-1.00PM',
      icon: '📍',
      mapLink: 'https://maps.app.goo.gl/mH9dGibMesatvwnq8?g_st=ac'
    },
    {
      name: 'Adirampattinam Branch',
      address: 'No. 25B/70, Old Post Office Road, Adirampattinam',
      phone: '+91 900 333 2337',
      email: 'adirampattinam@msmdental.com',
      hours: 'Mon-Sat: 5.00PM-8.15PM',
      icon: '🏥',
      mapLink: 'https://maps.app.goo.gl/Pk9r6CrcnZPnvnYu5'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 bg-white dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            Contact Us
          </h2>
          <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 md:mt-6 text-base md:text-lg">
            Feel free to contact us or visit our clinics.
          </p>
        </motion.div>

        {/* Branches */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12"
        >
          {branches.map((branch, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 space-y-3 md:space-y-4 p-6"
            >
              <div className="flex items-start space-x-3">
                <span className="text-3xl md:text-4xl">{branch.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {branch.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
                    {branch.address}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-3 md:pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <span className="text-primary-500 dark:text-blue-400 font-semibold text-sm md:text-base">📞</span>
                  <a href={`tel:${branch.phone}`} className="text-sm md:text-base text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-blue-400">
                    {branch.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-primary-500 dark:text-blue-400 font-semibold text-sm md:text-base">✉️</span>
                  <a href={`mailto:${branch.email}`} className="text-sm md:text-base text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-blue-400">
                    {branch.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm md:text-base">🕐</span>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    {branch.hours}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-slate-700">
                  <a 
                    href={branch.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600 shadow-md hover:shadow-lg"
                  >
                    📍 View on Google Maps
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Maps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-slate-800">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pattukkottai Branch Map</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">No. 95, S.R.V Complex, Nadimuthu Nagar, Pattukkottai</p>
            </div>
            <iframe
              title="Pattukkottai Branch Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.8577893436857!2d79.3207549!3d10.417573299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0001005b66152d%3A0x26be275f096bc726!2sMSM%20Dental%20Clinic%2C%20Pattukkottai!5e0!3m2!1sen!2sin!4v1234567890123"
              width="100%"
              height="220"
              className="border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-slate-800">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Adirampattinam Branch Map</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">No. 25B/70, Old Post Office Road, Adirampattinam</p>
            </div>
            <iframe
              title="Adirampattinam Branch Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.8577893436857!2d79.3794!3d10.3319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afffde036a1b53b%3A0x631f51395bbced89!2sMSM%20Dental%20Clinic%2C%20Thilagar%20Street%2C%20Adirampattinam!5e0!3m2!1sen!2sin!4v1234567890123"
              width="100%"
              height="220"
              className="border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>

        {/* Main Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-hover text-center max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            General Inquiries
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-2xl mb-2">📞</p>
              <p className="text-gray-600 dark:text-gray-400">Primary</p>
              <a href="tel:+918438436757" className="text-gray-900 dark:text-white font-semibold">
                +91 843 843 6757
              </a>
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-2xl mb-2">✉️</p>
              <p className="text-gray-600 dark:text-gray-400">Email</p>
              <a href="mailto:info@msmdental.com" className="text-gray-900 dark:text-white font-semibold">
                info@msmdental.com
              </a>
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-2xl mb-2">🕐</p>
              <p className="text-gray-600 dark:text-gray-400">Working Hours</p>
              <p className="text-gray-900 dark:text-white font-semibold">
                MON-SUN 9.30AM-1.00PM AND 5.00PM-8.15PM

                
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;