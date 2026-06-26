import { Award, ShieldAlert, Sparkles, TrendingUp, Cpu } from 'lucide-react';

export default function Achievements() {
  const achievements = [
    {
      title: 'Goldman Sachs India Hackathon 2025',
      status: 'Finalist (Top 50 out of 30,000+)',
      description: 'Solved a complex fintech problem in a 12-hour hackathon followed by a technical review interview. Shortlisted in the top 50 teams nationally.',
      glowColor: '#e5c158', // Gold
      icon: <Award size={24} style={{ color: '#e5c158' }} />,
    },
    {
      title: 'HP PowerLabs – IoT & AI Challenge 2024',
      status: 'Winner – Top 2% (out of 150,000+)',
      description: 'Designed and proposed a cloud-native AI + IoT solution evaluated on innovation, feasibility, and technical depth. Ranked top 2% globally.',
      glowColor: '#00d2fe', // HP Cyan
      icon: <Cpu size={24} style={{ color: '#00d2fe' }} />,
    },
    {
      title: 'Flipkart Grid 2025 Engineering Challenge',
      status: 'Semifinalist (National Level)',
      description: 'Advanced to the national semifinals in Flipkart\'s flagship engineering challenge, demonstrating full-stack engineering scalability and system design skills.',
      glowColor: '#0084ff', // Flipkart Blue
      icon: <TrendingUp size={24} style={{ color: '#0084ff' }} />,
    },
    {
      title: 'Adobe India Hackathon 2025',
      status: 'Semifinalist (National Level)',
      description: 'Shortlisted among top teams nationally. Conceptualized and developed a creative collaborative design tool demonstrating frontend excellence.',
      glowColor: '#ff0000', // Adobe Red
      icon: <Sparkles size={24} style={{ color: '#ff0000' }} />,
    },
    {
      title: 'Software Engineering Experience – Forage',
      status: 'Simulation Certification (2024)',
      description: 'Completed a simulated codebase engineering course covering full-stack debugging, Git operations, unit testing, and technical documentation reviews.',
      glowColor: 'var(--accent-violet)',
      icon: <ShieldAlert size={24} style={{ color: 'var(--accent-violet)' }} />,
    },
  ];

  return (
    <section id="achievements" className="section">
      <h2 className="section-title">Certifications & Achievements</h2>

      <div
        className="achievements-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {achievements.map((item, idx) => (
          <div
            key={idx}
            className="glass-card achievement-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '24px',
              borderTop: `4px solid ${item.glowColor}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Row: Icon + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: '1.3' }}>
                {item.title}
              </h3>
            </div>

            {/* Status / Highlight */}
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: item.glowColor,
                backgroundColor: `${item.glowColor}10`,
                border: `1px solid ${item.glowColor}30`,
                padding: '4px 10px',
                borderRadius: '6px',
                alignSelf: 'flex-start',
              }}
            >
              {item.status}
            </span>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .achievements-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
