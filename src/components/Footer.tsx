import { ArrowUp } from 'lucide-react';
import FooterCanvas from './FooterCanvas';

interface FooterProps {
  theme: 'dark' | 'light';
}

export default function Footer({ theme }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLight = theme === 'light';

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-glow)',
        backgroundColor: isLight ? 'rgba(243, 245, 244, 0.96)' : 'rgba(8, 8, 12, 0.96)',
        padding: '60px 24px',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
        minHeight: '180px',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.4s ease',
      }}
    >
      {/* 3D Wave Canvas backdrop */}
      <FooterCanvas theme={theme} />

      {/* Foreground Content */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left Side: Copyright */}
        <div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} Kavita Yadav. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Built with React, TypeScript, Three.js, and Custom Vanilla CSS.
          </p>
        </div>

        {/* Right Side: Scroll to Top */}
        <button
          onClick={scrollToTop}
          style={{
            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)',
            border: isLight ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255, 255, 255, 0.06)',
            color: 'var(--text-primary)',
            padding: '12px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(13, 148, 136, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </footer>
  );
}
