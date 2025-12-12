import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Users, CheckCircle2 } from 'lucide-react';

export const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <section className="pt-12 pb-16 lg:pt-32 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl space-y-6 text-center lg:text-left mx-auto lg:mx-0"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Master Coding. <br />
              Build <span className="text-blue-600">Real Software.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Escape tutorial hell. Accelerate your path from Junior to Senior Engineer with 1-on-1 mentorship from veterans at top tech companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                <Link to="/signup">
                  Get Started <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base text-slate-900 border-slate-200 hover:bg-slate-50">
                <Link to="/mentors">
                  View Mentors <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none perspective-1000 mt-8 lg:mt-0"
          >
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className="hidden sm:block h-2 w-20 rounded-full bg-slate-200" />
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Welcome, Dev!</h3>
                    <p className="text-xs sm:text-sm text-slate-500">Next code review in 10 mins.</p>
                  </div>
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4 flex gap-3 sm:gap-4 items-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <span className="font-bold text-sm sm:text-base">JS</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 text-sm sm:text-base truncate">React Performance</div>
                    <div className="text-xs text-slate-500 truncate">Mentor: Sarah (ex-Meta)</div>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded whitespace-nowrap">
                    4:00 PM
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-3 sm:p-4 flex gap-3 sm:gap-4 items-center shadow-sm">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0">
                    <span className="font-bold text-sm sm:text-base">Py</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 text-sm sm:text-base truncate">System Design</div>
                    <div className="text-xs text-slate-500 truncate">Mentor: Mike (Netflix)</div>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">
                    Tmrrw
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-5 left-4 md:-left-8 bg-white p-3 sm:p-4 rounded-xl shadow-xl border border-slate-100 z-20 max-w-[85%] sm:max-w-none"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-1.5 sm:p-2 rounded-full text-green-600 shrink-0">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">PR Merged!</div>
                  <div className="text-[10px] sm:text-xs text-slate-500">Your mentor approved the fix</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

