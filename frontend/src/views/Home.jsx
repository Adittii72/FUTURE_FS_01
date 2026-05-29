import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Achievements from './Achievements';
import Contact from './Contact';

const Home = () => {
  return (
    <main className="relative lg:pl-32">
      {/* Left padding on large screens to avoid sidebar overlap */}
      <div className="max-w-7xl mx-auto">
        {/* Each section wrapped with an id so sidebar links can scroll here */}
        <section id="about" className="relative z-10">
          <About />
        </section>

        <section id="skills" className="relative z-10">
          <Skills />
        </section>

        <section id="projects" className="relative z-10">
          <Projects />
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
