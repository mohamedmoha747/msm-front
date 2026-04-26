import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
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
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 bg-accent-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6 md:space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
              About Us
            </h2>
            <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            MSM Dental and Faciomaxillary Centre is dedicated to delivering comprehensive dental care with a focus on patient comfort and advanced treatment methods.
          </motion.p>

          <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            With experienced specialists and modern equipment, we ensure safe, effective, and painless dental solutions for all age groups.
          </motion.p>

          <motion.p variants={itemVariants} className="text-center text-primary-500 dark:text-blue-400 font-semibold text-base md:text-lg">
            🏥 Dental Clinic in Pattukkottai | Dentist in Adirampattinam
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;