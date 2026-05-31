import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import About from './About';
import LazySection from '../components/LazySection';

const Education = lazy(() => import('./Education'));
const Skills = lazy(() => import('./Skills'));
const Experience = lazy(() => import('./Experience'));
const Projects = lazy(() => import('./Projects'));
const Achievements = lazy(() => import('./Achievements'));
const Contact = lazy(() => import('./Contact'));

const SectionFallback = () => (
  <div className="container mx-auto px-4 py-16 flex justify-center" aria-hidden>
    <div className="h-8 w-8 rounded-full border-2 border-[#00d4ff]/30 border-t-[#00d4ff] animate-spin" />
  </div>
);

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <main className="relative lg:pl-32">
      <div className="max-w-7xl mx-auto">
        <section id="about" className="relative z-10">
          <About />
        </section>

        <LazySection id="education" minHeight="40vh">
          <Suspense fallback={<SectionFallback />}>
            <Education />
          </Suspense>
        </LazySection>

        <LazySection id="skills" minHeight="50vh">
          <Suspense fallback={<SectionFallback />}>
            <Skills />
          </Suspense>
        </LazySection>

        <LazySection id="experience" minHeight="40vh">
          <Suspense fallback={<SectionFallback />}>
            <Experience />
          </Suspense>
        </LazySection>

        <LazySection id="projects" minHeight="50vh">
          <Suspense fallback={<SectionFallback />}>
            <Projects />
          </Suspense>
        </LazySection>

        <LazySection id="achievements" minHeight="40vh">
          <Suspense fallback={<SectionFallback />}>
            <Achievements />
          </Suspense>
        </LazySection>

        <LazySection id="contact" minHeight="35vh">
          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </LazySection>
      </div>
    </main>
  );
};

export default Home;
