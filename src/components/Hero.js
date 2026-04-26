import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 bg-gradient-to-br from-accent-100 to-white dark:from-slate-900 dark:to-slate-800 min-h-screen flex items-center">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.h1 variants={itemVariants} className="mb-4 md:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
              MSM DENTAL AND FACIOMAXILLARY CENTER
            </motion.h1>
            <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 md:mb-6 text-gray-700 dark:text-gray-300">
              with Expert Specialists
            </motion.h2>
            <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 md:mb-10 leading-relaxed">
              Providing high-quality dental and maxillofacial treatments with modern technology and compassionate care.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#appointment" className="bg-primary-500 hover:bg-primary-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/50 hover:scale-105 active:scale-95 text-base md:text-lg">
                Book Appointment
              </a>
              <Link
                to="/about"
                className="border-2 border-primary-500 text-primary-500 dark:text-primary-400 dark:border-primary-400 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all hover:bg-primary-500 hover:text-white dark:hover:bg-primary-400 dark:hover:text-slate-900 text-base md:text-lg text-center"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-2xl blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=600&fit=crop"
                alt="Dental Clinic"
                className="relative w-full max-w-md lg:max-w-lg h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;