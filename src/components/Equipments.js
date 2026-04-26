import React from 'react';
import { motion } from 'framer-motion';

const Equipments = () => {
  const equipments = [
    { name: 'Digital X-Ray', icon: '📸' },
    { name: 'Modern Sterilization Equipment', icon: '🧪' },
    { name: 'Advanced Dental Chairs', icon: '🪑' },
    { name: 'Precision Tools for Surgery', icon: '🔧' },
  ];

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
            Our Equipments
          </h2>
          <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 md:mt-6 text-base md:text-lg">
            We use advanced dental technology to ensure accurate diagnosis and effective treatment.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {equipments.map((equipment, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, rotateZ: 2 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-center cursor-pointer p-6"
            >
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">
                {equipment.icon}
              </div>
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white">
                {equipment.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Equipments;