import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    { name: 'John Doe', review: 'Excellent service and professional staff. Highly recommend MSM Dental!', rating: 5 },
    { name: 'Sarah Smith', review: 'Very clean facility and painless treatment. Best dental clinic!', rating: 5 },
    { name: 'Raj Kumar', review: 'Great experience with Dr. Sameerudeen. Very skilled and caring.', rating: 5 },
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 bg-accent-50 dark:bg-slate-800">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            Testimonials
          </h2>
          <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6"
            >
              <div className="mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg md:text-xl">⭐</span>
                ))}
              </div>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 md:mb-4 italic leading-relaxed">
                "{testimonial.review}"
              </p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                - {testimonial.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;