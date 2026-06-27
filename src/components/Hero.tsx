import { useEffect, useState } from 'react';
import { ArrowRight, Download, Award, GitMerge, Zap, Phone, Mail } from 'lucide-react';

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
  </svg>
);

const LeetcodeIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    style={{ display: 'inline-block' }}
  >
    <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.744.53a1.876 1.876 0 0 1-1.332-1.332 1.884 1.884 0 0 1 .53-1.744l2.697-2.607c.05-.05.074-.117.074-.188a.252.252 0 0 0-.074-.188l-.75-.728a.262.262 0 0 0-.387 0l-2.697 2.607c-.778.777-1.85 1.102-2.906.883a3.125 3.125 0 0 1-2.22-2.22c-.22-1.055.106-2.128.883-2.905l7.07-6.829a3.124 3.124 0 0 1 4.22 0l.75.727a.262.262 0 0 0 .387 0l2.697-2.607a.253.253 0 0 0 0-.376l-5.69-5.498a5.624 5.624 0 0 0-7.854 0L1.758 13.568a5.623 5.623 0 0 0 0 7.853l5.69 5.498a5.624 5.624 0 0 0 7.854 0l2.697-2.607a.253.253 0 0 0 0-.376l-.75-.728c-.05-.05-.117-.074-.188-.074a.252.252 0 0 0-.16.074z" />
  </svg>
);

export default function Hero() {
  const [typedText, setTypedText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const titles = [
    'Full Stack Developer',
    'ECE Undergrad @ IIIT Guwahati',
    'Open Source Mentor',
    'Solution Architect',
  ];

  // Typewriter effect
  useEffect(() => {
    if (subIndex === titles[index].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % titles.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypedText(titles[index].substring(0, subIndex));
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index]);

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '130px 24px 60px 24px',
        overflow: 'hidden',
      }}
    >


      {/* Hero Content Overlay */}
      <div className="hero-container animate-fadeInUp">
        <div className="hero-text-content">
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--accent-cyan)',
              background: 'rgba(16, 185, 129, 0.06)',
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.15)',
            }}
          >
            Welcome to my Space
          </span>

          <h1
            style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              lineHeight: 1.1,
              margin: 0,
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
            }}
          >
            Hi, I am{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-violet) 50%, var(--accent-pink) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Kavita Yadav
            </span>
          </h1>

          {/* Dynamic Typewriter */}
          <h2
            style={{
              fontSize: 'clamp(1.1rem, 3.5vw, 1.8rem)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              minHeight: '2rem',
              margin: 0,
            }}
          >
            I'm a <span style={{ color: 'var(--text-primary)', borderRight: '2px solid var(--accent-cyan)', paddingRight: '4px' }}>{typedText}</span>
          </h2>

          {/* --- Resume Contact Header (Contact Details on Top) --- */}
          <div className="hero-contact-row">
            <a href="tel:+917398865618" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="contact-link">
              <Phone size={15} style={{ color: 'var(--accent-cyan)' }} />
              <span>7398865618</span>
            </a>
            <span style={{ color: 'rgba(255,255,255,0.15)' }} className="divider">|</span>
            <a href="mailto:kavita.yadav23b@iiitg.ac.in" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="contact-link">
              <Mail size={15} style={{ color: 'var(--accent-cyan)' }} />
              <span>kavita.yadav23b@iiitg.ac.in</span>
            </a>
            <span style={{ color: 'rgba(255,255,255,0.15)' }} className="divider">|</span>
            <a href="https://www.linkedin.com/in/kavita-yadav-63276a289/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="contact-link">
              <LinkedinIcon size={15} />
              <span>LinkedIn</span>
            </a>
            <span style={{ color: 'rgba(255,255,255,0.15)' }} className="divider">|</span>
            <a href="https://github.com/Kavita1928" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="contact-link">
              <GithubIcon size={15} />
              <span>GitHub</span>
            </a>
            <span style={{ color: 'rgba(255,255,255,0.15)' }} className="divider">|</span>
            <a href="https://leetcode.com/u/Kavitayadav_123/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="contact-link">
              <LeetcodeIcon size={15} />
              <span>LeetCode</span>
            </a>
          </div>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
              color: 'var(--text-secondary)',
              maxWidth: '650px',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Building scalable, cloud-native web applications using MERN, Next.js, and AWS. Specializing in high-performance full-stack architectures and modern engineering solutions.
          </p>

          {/* Call to Actions */}
          <div className="hero-ctas">
            <a href="https://github.com/Kavita1928/BeatSync" target="_blank" rel="noreferrer">
              <button className="glow-button primary">
                View Featured Project (BeatSync) <ArrowRight size={18} />
              </button>
            </a>
            <a href="#resume">
              <button className="glow-button secondary">
                View & Download Resume <Download size={18} />
              </button>
            </a>
          </div>

          {/* Key Metrics Floating Grid */}
          <div
            className="metrics-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              width: '100%',
              marginTop: '24px',
            }}
          >
            <div className="glass-card metric-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
              <div className="icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <Award style={{ color: 'var(--accent-cyan)' }} size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>Top 2%</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>HP PowerLabs Challenge</p>
              </div>
            </div>

            <div className="glass-card metric-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
              <div className="icon-wrapper" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
                <Zap style={{ color: 'var(--accent-violet)' }} size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>Finalist</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>Goldman Sachs Hackathon</p>
              </div>
            </div>

            <div className="glass-card metric-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
              <div className="icon-wrapper" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                <GitMerge style={{ color: 'var(--accent-pink)' }} size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>500+ PRs</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>GirlScript Open Source</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty space placeholder for shifted Three.js globe on desktop */}
        <div className="hero-canvas-frame"></div>
      </div>

      <style>{`
        .hero-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 40px;
          align-items: center;
        }
        .hero-text-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          text-align: left;
          width: 100%;
        }
        .hero-canvas-frame {
          display: block;
          height: 100%;
          min-height: 400px;
        }
        .hero-contact-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: center;
          gap: 16px;
          margin: 8px 0 16px 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
          background-color: var(--bg-card);
          backdrop-filter: blur(12px);
          padding: 10px 20px;
          border-radius: 12px;
          border: 1px solid var(--input-border);
        }
        .hero-contact-row a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .hero-contact-row a:hover {
          color: var(--text-primary);
          transform: translateY(-1px);
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: flex-start;
          margin-top: 8px;
        }
        
        @media (max-width: 992px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            max-width: 800px;
            gap: 20px;
          }
          .hero-text-content {
            align-items: center;
            text-align: center;
          }
          .hero-canvas-frame {
            display: none;
          }
          .hero-contact-row {
            justify-content: center;
          }
          .hero-ctas {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .metric-card {
            padding: 16px !important;
          }
          .hero-contact-row {
            flex-direction: column !important;
            gap: 8px !important;
            padding: 12px 16px !important;
            width: 100% !important;
          }
          .hero-contact-row .divider {
            display: none !important;
          }
          .contact-link {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
