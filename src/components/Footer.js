import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { icon: 'f', name: 'Facebook', url: 'https://facebook.com' },
    { icon: 'twitter', name: 'Twitter', url: 'https://twitter.com' },
    { icon: 'instagram', name: 'Instagram', url: 'https://instagram.com' },
    { icon: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Treatments', path: '/our-treatments' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Contact', path: '/contact' },
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <footer className="bg-gradient-to-b from-blue-600 to-blue-700 dark:from-slate-900 dark:to-slate-950 text-white py-12 md:py-16 lg:py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12"
        >
          {/* About */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/images/logo.png"
                alt="MSM Dental Logo"
                className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover border border-white/30"
              />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">MSM Dental and Faciomaxillary Centre</h3>
                <p className="text-blue-100 text-sm md:text-base mt-1">
                  Excellence in dental care with modern technology and compassionate service.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-base md:text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-blue-100 hover:text-white smooth-underline transition-colors text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="text-base md:text-lg font-bold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-blue-100">
              <li className="flex items-start space-x-2">
                <span className="text-sm md:text-base">📞</span>
                <a href="tel:+918438436757" className="hover:text-white transition-colors text-sm md:text-base">
                  +91 843 843 6757
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sm md:text-base">✉️</span>
                <a href="mailto:info@msmdental.com" className="hover:text-white transition-colors text-sm md:text-base">
                  info@msmdental.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sm md:text-base">🕐</span>
                <span className="text-sm md:text-base">Mon-Sat: 9AM-6PM</span>
              </li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={itemVariants}>
            <h4 className="text-base md:text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-3 md:space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-8 md:w-10 h-8 md:h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
                  title={social.name}
                >
                  <span className="text-sm md:text-lg">
                    {social.name === 'Facebook' && '👍'}
                    {social.name === 'Twitter' && '𝕏'}
                    {social.name === 'Instagram' && '📷'}
                    {social.name === 'LinkedIn' && '🔗'}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/20 my-6 md:my-8"></div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-blue-100"
        >
          <p className="text-xs md:text-sm">
            © {new Date().getFullYear()} MSM Dental and Faciomaxillary Centre. All rights reserved.
          </p>
          <p className="text-xs mt-2">
            Designed with ❤️ for better dental health
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;