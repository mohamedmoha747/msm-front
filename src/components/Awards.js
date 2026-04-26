import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Awards = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const awards = [
    {
      id: 1,
      title: 'CME PROGRAM CERTIFICATE',
      description: 'Recognized for excellence in patient care',
      year: 2023,
      image: process.env.PUBLIC_URL + '/images/cme-award.png',
    },
    {
      id: 2,
      title: 'Excellence Doctor Award',
      description: 'Awarded for advanced implant treatments',
      year: 2022,
      image: process.env.PUBLIC_URL +'/images/ECA-AWARD.png',
    },
    {
      id: 3,
      title: 'Top Cosmetic Dentistry Clinic',
      description: 'For outstanding smile makeover results',
      year: 2024,
      image: 'https://via.placeholder.com/300x200?text=Cosmetic+Dentistry',
    },
    {
      id: 4,
      title: 'Patient Choice Award',
      description: 'Based on patient satisfaction and reviews',
      year: 2023,
      image: 'https://via.placeholder.com/300x200?text=Patient+Choice+Award',
    },
    {
      id: 5,
      title: 'Dental Excellence Award',
      description: 'Outstanding performance in dental services',
      year: 2022,
      image: 'https://via.placeholder.com/300x200?text=Dental+Excellence',
    },
    {
      id: 6,
      title: 'Quality Care Certification',
      description: 'Certified for quality patient care standards',
      year: 2024,
      image: 'https://via.placeholder.com/300x200?text=Quality+Care',
    },
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
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Fixed scroll amount for consistent behavior
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-accent-50 to-white dark:from-slate-800 dark:to-slate-900">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            Our Awards & Achievements
          </h2>
          <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 md:mt-6 text-base md:text-lg max-w-2xl mx-auto">
            Recognized for our commitment to excellence and patient satisfaction in dental care.
          </p>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <motion.button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 z-10 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex flex-nowrap gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {awards.map((award) => (
              <motion.div
                key={award.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex-shrink-0 w-4/5 md:w-96 snap-start"
              >
                <motion.div
                  whileHover="hover"
                  variants={cardHoverVariants}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col"
                >
                  {/* Award Image Container */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 p-6 flex items-center justify-center min-h-56">
                    <div className="w-full h-48 rounded-xl overflow-hidden shadow-md bg-white dark:bg-slate-800">
                      <img
                        src={award.image}
                        alt={award.title}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Award Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Year Badge */}
                    {award.year && (
                      <div className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                        {award.year}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                      {award.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-6 flex-grow">
                      {award.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <motion.button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 z-10 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        {/* Scroll Indicator (Mobile) */}
        <div className="md:hidden mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ← Swipe to explore →
        </div>

        {/* Info Text */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Click the arrows to browse our collection of awards and recognitions
          </p>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Awards;
