import { ArrowUp } from 'lucide-react';
import FooterCanvas from './FooterCanvas';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-glow)',
        backgroundColor: 'rgba(8, 8, 12, 0.96)',
        padding: '60px 24px',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
        minHeight: '180px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* 3D Wave Canvas backdrop */}
      <FooterCanvas />

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
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            color: 'var(--text-primary)',
            padding: '12px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
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
