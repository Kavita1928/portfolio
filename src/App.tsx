import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Resume from './components/Resume';
import Chatbot from './components/Chatbot';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sleek top-navigation header */}
      <Header />

      {/* Main content sections */}
      <main style={{ flex: 1 }}>
        <Hero />
        <About />
        <Resume />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Contact />
      </main>

      {/* Interactive Chatbot widget */}
      <Chatbot />

      {/* Elegant footer */}
      <Footer />
    </div>
  );
}
