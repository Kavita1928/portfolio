import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Resume from './components/Resume';
import Chatbot from './components/Chatbot';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // default theme
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sleek top-navigation header with Theme Toggle */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Main content sections */}
      <main style={{ flex: 1 }}>
        <Hero theme={theme} />
        <About />
        <Experience />
        <Projects />
        <Achievements />
        <Resume />
        <Contact />
      </main>

      {/* Interactive Chatbot widget */}
      <Chatbot />

      {/* Elegant footer with Theme context */}
      <Footer theme={theme} />
    </div>
  );
}
