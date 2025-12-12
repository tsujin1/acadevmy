import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const CallToAction = () => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <section className="py-16 sm:py-24 bg-blue-600 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/40 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Ready to grow with expert mentorship?
            </h2>
            <p className="text-lg text-blue-100 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Join our community of learners and mentors today. Start your journey towards achieving your goals with guidance from the best.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base border-blue-400 text-white hover:bg-blue-700 hover:text-white hover:border-blue-300 bg-transparent"
            >
              <Link to="/login">Log In</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-base font-bold text-blue-600 bg-white hover:bg-blue-50 shadow-lg shadow-blue-900/20"
            >
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

