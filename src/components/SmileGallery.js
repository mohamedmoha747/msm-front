import React from 'react';
import { motion } from 'framer-motion';

const SmileGallery = () => {
  const galleryItems = [
    {
      treatment: "Teeth Whitening",
      description: "Improved brightness and smile appearance in one session",
      beforeImage: process.env.PUBLIC_URL + "/images/Teeth-Whitening.jpeg",
      afterImage: process.env.PUBLIC_URL + "/images/Costemic-dentistry.jpeg"
    },
    {
      treatment: "Dental Implants",
      description: "Restored full functionality and natural appearance",
      beforeImage: process.env.PUBLIC_URL + "/images/Dental-implants.jpeg",
      afterImage: process.env.PUBLIC_URL + "/images/Dental-Crown.jpeg"
    },
    {
      treatment: "Orthodontic Treatment",
      description: "Achieved perfect alignment and confident smile",
      beforeImage: process.env.PUBLIC_URL + "/images/Orthodontic.jpeg",
      afterImage: process.env.PUBLIC_URL + "/images/Costemic-dentistry.jpeg"
    },
    {
      treatment: "Cosmetic Dentistry",
      description: "Enhanced aesthetics with porcelain veneers",
      beforeImage: process.env.PUBLIC_URL + "/images/Costemic-dentistry.jpeg",
      afterImage: process.env.PUBLIC_URL + "/images/Dental-Crown.jpeg"
    },
    {
      treatment: "Root Canal Treatment",
      description: "Saved natural tooth with advanced endodontic care",
      beforeImage: process.env.PUBLIC_URL + "/images/ROOT-CANEL.jpeg",
      afterImage: process.env.PUBLIC_URL + "/images/Dental-implants.jpeg"
    },
    {
      treatment: "Dental Crowns",
      description: "Restored strength and natural appearance",
      beforeImage: process.env.PUBLIC_URL + "/images/Dental-Crown.jpeg",
      afterImage: process.env.PUBLIC_URL + "/images/Orthodontic.jpeg"
    }
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
    hidden: { opacity: 0, y: 30 },
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
            Smile Gallery
          </h2>
          <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 md:mt-6 text-base md:text-lg">
            Real Results from Our Treatments
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              {/* Before/After Images */}
              <div className="grid grid-cols-2 gap-1 p-4">
                <div className="relative">
                  <img
                    src={item.beforeImage}
                    alt={`${item.treatment} - Before`}
                    className="w-full h-32 md:h-40 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Before
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={item.afterImage}
                    alt={`${item.treatment} - After`}
                    className="w-full h-32 md:h-40 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    After
                  </div>
                </div>
              </div>

              {/* Treatment Info */}
              <div className="p-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.treatment}
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SmileGallery;