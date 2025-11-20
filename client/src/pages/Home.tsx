import Hero from '@/components/landing-page/Hero';
import HowItWorks from '@/components/landing-page/HowItWorks';
import MentorShowcase from '@/components/landing-page/MentorShowcase';
import CallToAction from '@/components/landing-page/CallToAction';

const Home = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <MentorShowcase />
      <CallToAction />
    </>
  );
};

export default Home;