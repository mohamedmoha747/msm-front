import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Treatment = () => {
  const treatmentCategories = [
    {
      category: 'Dental Services',
      treatments: [
        { name: 'General Dentistry', image: process.env.PUBLIC_URL + '/images/general-dentistry.png', description: 'Routine care and preventive treatments for optimal oral health' },
        { name: 'Root Canal Treatment', image: process.env.PUBLIC_URL + '/images/root-canal-treatment.png', description: 'Relief from tooth pain and infection' },
        { name: 'Crown and Bridges', image: process.env.PUBLIC_URL + '/images/crown-bridges.png', description: 'Restore damaged teeth and fill gaps with natural-looking solutions' },
        { name: 'Dental Implants', image: process.env.PUBLIC_URL + '/images/dental-implants.png', description: 'Permanent tooth replacement with a stable foundation' },
        { name: 'Orthodontic Braces', image: process.env.PUBLIC_URL + '/images/orthodontic-braces.png', description: 'Align teeth and correct bite issues' },
        { name: 'Aligners', image: process.env.PUBLIC_URL + '/images/aligners.png', description: 'Discrete and comfortable teeth straightening solution' },
      ]
    },
    {
      category: 'Maxillofacial Surgeries',
      treatments: [
        { name: 'Facial Bone Fractures', image: process.env.PUBLIC_URL + '/images/facial-bone-fractures.png', description: 'Expert surgical repair of jaw and facial bone injuries' },
        { name: 'Orthognathic Surgeries', image: process.env.PUBLIC_URL + '/images/orthognathic-surgeries.png', description: 'Corrective jaw surgery for proper alignment and function' },
        { name: 'Oral and Facial Cyst & Tumors', image: process.env.PUBLIC_URL + '/images/cyst-tumors.png', description: 'Safe removal of oral cysts and facial tumors' },
      ]
    }
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

  const cardHoverVariants = {
    hover: {
      y: -12,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const slugify = (name) => name.toLowerCase().replace(/\s+/g, '-');

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 bg-accent-50 dark:bg-slate-800">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            Our Treatments
          </h2>
          <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 md:mt-6 text-base md:text-lg max-w-2xl mx-auto">
            Comprehensive dental and surgical solutions designed for comfort and lasting results.
          </p>
        </motion.div>

        {/* Treatment Categories */}
        <div className="space-y-16 md:space-y-20">
          {treatmentCategories.map((categoryData, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={categoryVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Category Title */}
              <div className="text-center mb-10 md:mb-14">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 dark:text-blue-400">
                  {categoryData.category}
                </h3>
                <div className="h-0.5 w-12 bg-primary-500 mx-auto mt-3 rounded-full"></div>
              </div>

              {/* Treatment Cards Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
              >
                {categoryData.treatments.map((treatment, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover="hover"
                    className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center overflow-hidden h-full flex flex-col"
                  >
                    <motion.div variants={cardHoverVariants} className="flex flex-col h-full">
                      {/* Image Placeholder */}
                      <div className="w-full h-48 md:h-56 mx-auto mb-4 rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-primary-100 to-primary-200 dark:from-slate-600 dark:to-slate-500 flex items-center justify-center">
                        <img
                          src={treatment.image}
                          alt={treatment.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute text-center hidden">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Image placeholder</span>
                        </div>
                      </div>

                      {/* Treatment Title */}
                      <h4 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                        {treatment.name}
                      </h4>

                      {/* Description */}
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-6 flex-grow">
                        {treatment.description}
                      </p>

                      {/* Read More Button */}
                      <Link
                        to={`/treatment/${slugify(treatment.name)}`}
                        className="mt-5 inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-600 shadow-md hover:shadow-lg"
                      >
                        Read More
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Treatment;