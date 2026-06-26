import { Download, FileText } from 'lucide-react';

export default function Resume() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Kavita_Yadav_Resume.pdf';
    link.download = 'Kavita_Yadav_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="resume" className="section" style={{ padding: '80px 24px 60px 24px' }}>
      <h2 className="section-title">My Resume</h2>

      <div
        className="glass-card"
        style={{
          maxWidth: '650px',
          margin: '0 auto',
          padding: '40px',
          textAlign: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-neon), 0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
          <FileText size={36} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0 }}>
            Curriculum Vitae
          </h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '30px' }}>
          Get a comprehensive, printer-friendly copy of my professional resume detailing my full stack credentials, B.Tech ECE engineering coursework, GSSoC open-source mentoring, and hackathon achievements.
        </p>

        <button
          onClick={handleDownload}
          className="glow-button primary"
          style={{
            fontSize: '1rem',
            padding: '14px 32px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto',
          }}
        >
          <Download size={20} /> Download PDF Resume
        </button>
      </div>
    </section>
  );
}
