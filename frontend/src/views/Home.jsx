import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import About from './About';
import Education from './Education';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Achievements from './Achievements';
import Contact from './Contact';

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
      {/* Left padding on large screens to avoid sidebar overlap */}
      <div className="max-w-7xl mx-auto">
        {/* Each section wrapped with an id so sidebar links can scroll here */}
        <section id="about" className="relative z-10">
          <About />
        </section>

        <section id="education" className="relative z-10">
          <Education />
        </section>

        <section id="skills" className="relative z-10">
          <Skills />
        </section>

        <section id="projects" className="relative z-10">
          <Projects />
        </section>

        <section id="experience" className="relative z-10">
          <Experience />
        </section>

        <section id="achievements" className="relative z-10">
          <Achievements />
        </section>

        <section id="contact" className="relative z-10">
          <Contact />
        </section>
      </div>
    </main>
  );
};

export default Home;
