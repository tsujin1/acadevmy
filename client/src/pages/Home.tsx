import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Calendar, Users, Star, ArrowUpRight, ArrowRight } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* ================= HERO SECTION ================= */}
      <section className="pt-12 pb-16 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT COLUMN: Text Content */}
            <div className="max-w-2xl space-y-6 text-center lg:text-left mx-auto lg:mx-0">

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Connect. <br />
                Learn. <span className="text-blue-600">Succeed.</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Stop struggling alone. Build your own personal board of advisors with verified industry professionals, scheduled courses, and 1-on-1 guidance.
              </p>

              {/* CTA Buttons - UPDATED: Stacked on mobile (flex-col), Row on desktop (sm:flex-row) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                  <Link to="/signup">
                    {/* Icon is now always visible */}
                    Start Free Today <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base text-slate-900 border-slate-200 hover:bg-slate-50">
                  <Link to="/mentors">
                    Browse Mentors <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT COLUMN: Floating UI Mockup */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none perspective-1000 mt-8 lg:mt-0">

              {/* Main "Dashboard" Card */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">

                {/* Header Mockup */}
                <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="hidden sm:block h-2 w-20 rounded-full bg-slate-200" />
                </div>

                {/* Body Content Mockup */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Welcome Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">Welcome back, Alex!</h3>
                      <p className="text-xs sm:text-sm text-slate-500">You have 2 upcoming sessions.</p>
                    </div>
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>

                  {/* Course Card 1 */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4 flex gap-3 sm:gap-4 items-center">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                      <span className="font-bold text-sm sm:text-base">JS</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 text-sm sm:text-base truncate">Advanced React</div>
                      <div className="text-xs text-slate-500 truncate">Mentor: Sarah Jenkins</div>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded whitespace-nowrap">
                      4:00 PM
                    </div>
                  </div>

                  {/* Course Card 2 */}
                  <div className="rounded-xl border border-slate-100 bg-white p-3 sm:p-4 flex gap-3 sm:gap-4 items-center shadow-sm">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0">
                      <span className="font-bold text-sm sm:text-base">UX</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 text-sm sm:text-base truncate">Design Systems</div>
                      <div className="text-xs text-slate-500 truncate">Mentor: Mike Chen</div>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">
                      Tmrrw
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating "Notification" Card */}
              <div className="absolute -bottom-5 left-4 md:-left-8 bg-white p-3 sm:p-4 rounded-xl shadow-xl border border-slate-100 z-20 max-w-[85%] sm:max-w-none">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-full text-green-600 shrink-0">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">Session Confirmed</div>
                    <div className="text-[10px] sm:text-xs text-slate-500">Your mentor accepted the request</div>
                  </div>
                </div>
              </div>

              {/* Floating "Rating" Card */}
              <div className="absolute top-12 -right-2 md:-right-8 bg-white p-3 rounded-xl shadow-xl border border-slate-100 z-20 hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden`}>
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="pl-2">
                    <div className="flex text-yellow-400 h-3">
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                    <div className="text-[10px] font-bold text-slate-600 mt-1">5.0 Mentor Rating</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Acadevmy?
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to succeed in your academic and professional journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Expert Mentors</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect with verified industry professionals who have walked the path you're on now.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Real-time Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get instant answers to your questions through our integrated secure messaging system.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Session Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Seamlessly schedule one-on-one video mentorship sessions at times that work for you.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};