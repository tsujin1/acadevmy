import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PiGraduationCapBold, PiEnvelopeSimpleBold, PiMapPinBold, PiPhoneBold } from 'react-icons/pi';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <PiGraduationCapBold className="h-6 w-6 text-white" />
              <span className="text-2xl font-bold text-white">acadevmy</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting learners with expert mentors to accelerate growth and career development through personalized guidance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'All Mentors', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item === 'Home' ? '' : item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <PiEnvelopeSimpleBold className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">myacadevmy@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <PiPhoneBold className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">+1 (234) 567-8910</span>
              </li>
              <li className="flex items-center space-x-3">
                <PiMapPinBold className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">Philippines</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          className="border-t border-gray-800 mt-8 pt-8 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-400 text-sm">
            © 2025 Acadevmy. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;