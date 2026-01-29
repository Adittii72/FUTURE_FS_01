import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Achievements from './Achievements';
import Contact from './Contact';

const Home = () => {
  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Each section wrapped with an id so header links can scroll here */}
      <section id="about">
        <About />
      </section>

      <section id="skills">
        <Skills />
      </section>

      <section id="projects">
        <Projects />
      </section>

      <section id="achievements">
        <Achievements />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>
  );
};

export default Home;


