import { GraduationCap, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Web Pages Built', value: '15+' },
    { label: 'PRs Merged/Reviewed', value: '500+' },
    { label: 'Developers Mentored', value: '100+' },
    { label: 'HP PowerLabs Rank', value: 'Top 2%' },
  ];

  return (
    <section id="about" className="section">
      <h2 className="section-title">About Me</h2>

      <div
        className="about-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'start',
        }}
      >
        {/* Left: Professional Summary & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-cyan)' }}>Who is Kavita Yadav?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
              I am a passionate Full Stack Developer and Electronics and Communication Engineering undergraduate at IIIT Guwahati. I specialize in building end-to-end cloud-native web applications using modern technology stacks like React, Next.js, Node.js, PostgreSQL, and AWS.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
              With hands-on experience in performance optimization, containerized deployments, and agile development, I bridge the gap between design aesthetic, raw performance, and infrastructure logic.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Proficient in Agile/Scrum & CI/CD workflow automation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Strong foundation in Data Structures, Algorithms, and OOP</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Experienced in Open-Source mentorship and code review</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div
            className="stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
            }}
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  background: 'rgba(13, 12, 29, 0.3)',
                }}
              >
                <div
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '4px',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Education Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-violet)' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GraduationCap style={{ color: 'var(--accent-violet)' }} size={28} />
              <span>Education</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Indian Institute of Information Technology (IIIT Guwahati)</h4>
              <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.95rem' }}>B.Tech in Electronics and Communication Engineering</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <MapPin size={18} style={{ color: 'var(--text-muted)' }} />
                  <span>Guwahati, Assam</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                  <span>August 2023 – May 2027</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  <span
                    style={{
                      background: 'rgba(138, 43, 226, 0.1)',
                      border: '1px solid rgba(138, 43, 226, 0.25)',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      color: 'var(--accent-violet)',
                      fontWeight: 700,
                    }}
                  >
                    CGPA: 7.1 / 10
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(13, 148, 136, 0.05) 100%)',
            }}
          >
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Academic Rigor & Core Focus</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              My engineering coursework bridges computational logic with hardware systems. Focused on building strong foundations in Data Structures & Algorithms, Computer Networks, Database Management Systems, and Operating Systems.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </section>
  );
}
