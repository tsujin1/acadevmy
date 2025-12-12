import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Code2, Bug, Terminal } from 'lucide-react';

const painPoints = [
  {
    id: 1,
    icon: Code2,
    title: 'Stuck in "Tutorial Hell"?',
    quote: '"I can follow a YouTube video, but I freeze when I try to build a project from scratch."',
    solution: 'Solution: Code Reviews & Projects',
    bgColor: 'bg-[#FFF9C4]',
    iconColor: 'text-yellow-700',
    borderColor: 'border-yellow-200/50',
    checkColor: 'text-yellow-700',
  },
  {
    id: 2,
    icon: Bug,
    title: 'Blocked by Bugs?',
    quote: '"I spent 5 hours on a simple error. StackOverflow isn\'t helping and I\'m losing motivation."',
    solution: 'Solution: Instant Unblocking',
    bgColor: 'bg-[#E1F5FE]',
    iconColor: 'text-sky-700',
    borderColor: 'border-sky-200/50',
    checkColor: 'text-sky-700',
  },
  {
    id: 3,
    icon: Terminal,
    title: 'Failing Interviews?',
    quote: '"I can build apps, but I blank out during LeetCode challenges and System Design rounds."',
    solution: 'Solution: Mock Technical Interviews',
    bgColor: 'bg-[#FCE4EC]',
    iconColor: 'text-pink-700',
    borderColor: 'border-pink-200/50',
    checkColor: 'text-pink-700',
  },
];

export const TechPainPoints = () => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            If you're a new developer, <span className="text-blue-600 relative inline-block">
              this probably sounds familiar...
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            The real roadblocks stopping you from getting hired.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className={`relative border-none ${point.bgColor} shadow-none overflow-visible hover:-translate-y-1 transition-transform duration-300`}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-[-2deg] backdrop-blur-sm shadow-sm z-10" />
                  <CardHeader className="pt-8 pb-4">
                    <div className={`h-12 w-12 rounded-full bg-white/60 flex items-center justify-center mb-4 ${point.iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{point.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium text-slate-800 leading-snug">
                      {point.quote}
                    </p>
                    <div className={`mt-4 pt-4 border-t ${point.borderColor}`}>
                      <p className="text-sm text-slate-600 flex items-center font-medium">
                        <CheckCircle2 className={`h-4 w-4 mr-2 ${point.checkColor}`} />
                        {point.solution}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

