import { HeroSection } from '@/components/landing/HeroSection';
import { TechPainPoints } from '@/components/landing/TechPainPoints';
import { MeetMentors } from '@/components/landing/MeetMentors';
import { CallToAction } from '@/components/landing/CallToAction';

export const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <TechPainPoints />
      <MeetMentors />
      <CallToAction />
    </div>
  );
};
