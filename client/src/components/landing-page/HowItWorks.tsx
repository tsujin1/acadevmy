import { PiMagnifyingGlassBold, PiCalendarBold, PiLightbulbBold } from 'react-icons/pi';
import { motion } from 'framer-motion';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Search mentors',
    description: 'Browse profiles and specialties to find your perfect match.',
    icon: PiMagnifyingGlassBold,
  },
  {
    number: 2,
    title: 'Book a session',
    description: 'Pick a time that fits your schedule with instant confirmation.',
    icon: PiCalendarBold,
  },
  {
    number: 3,
    title: 'Learn & apply',
    description: 'Get practical guidance and actionable next steps.',
    icon: PiLightbulbBold,
  },
];

const HowItWorks = () => {
  return (
    <section className="relative bg-gray py-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p 
            className="inline-block bg-gray-100 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Simple Process
          </motion.p>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Three simple steps to connect with an expert mentor and accelerate your growth.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-gray-300 to-transparent" />
          
          {steps.map((step, index) => (
            <motion.div 
              key={step.number} 
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-900 hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="absolute -top-4 left-8"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.5 + (index * 0.1),
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {step.number}
                  </div>
                </motion.div>

                <motion.div 
                  className="mb-6 mt-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="inline-flex p-4 bg-gray-100 rounded-xl border-2 border-gray-200 group-hover:bg-black group-hover:border-black transition-all">
                    <step.icon className="w-7 h-7 text-black group-hover:text-white transition-colors" />
                  </div>
                </motion.div>

                <h3 className="text-2xl font-bold text-black mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden md:block absolute top-16 -right-4 z-20"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;