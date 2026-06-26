import { useState, useEffect } from 'react';
import { Menu, X, Code } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Resume', href: '#resume' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        transition: 'var(--transition-smooth)',
        backgroundColor: scrolled ? 'var(--bg-nav)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-glow)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        padding: scrolled ? '12px 24px' : '20px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <a
          href="#home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1.4rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-violet) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          <Code size={24} style={{ color: 'var(--accent-cyan)' }} />
          <span>Kavita.dev</span>
        </a>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                fontSize: '0.95rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-cyan)';
                e.currentTarget.style.textShadow = '0 0 8px rgba(0, 242, 254, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              {link.name}
            </a>
          ))}
          <a href="#contact">
            <button className="glow-button primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Hire Me
            </button>
          </a>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: 'pointer',
            color: 'var(--text-primary)',
            display: 'none', // Managed by responsive CSS styles (below)
          }}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-100%',
          width: '280px',
          height: '100vh',
          backgroundColor: 'rgba(5, 5, 8, 0.98)',
          borderLeft: '1px solid var(--border-glow)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '80px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          transition: 'var(--transition-smooth)',
          zIndex: 99,
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={() => setIsOpen(false)}
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              paddingBottom: '8px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {link.name}
          </a>
        ))}
        <a href="#contact" onClick={() => setIsOpen(false)} style={{ marginTop: '20px' }}>
          <button className="glow-button primary" style={{ width: '100%', justifyContent: 'center' }}>
            Hire Me
          </button>
        </a>
      </div>

      {/* Add styling override directly in head for media queries */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
