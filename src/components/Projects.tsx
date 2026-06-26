import { ExternalLink, Music } from 'lucide-react';

const GithubIcon = ({ size = 16 }: { size?: number }) => (
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

export default function Projects() {
  const projects = [
    {
      title: 'BeatSync',
      subtitle: 'Collaborative Music Streaming Platform',
      icon: <Music size={24} style={{ color: 'var(--accent-cyan)' }} />,
      glowColor: 'var(--accent-cyan)',
      period: 'Dec 2025 – Jan 2026',
      tech: ['Next.js', 'Node.js', 'Redis', 'PostgreSQL', 'AWS EC2', 'WebSockets', 'JWT', 'OAuth'],
      points: [
        'Built a collaborative music streaming platform using Next.js, Node.js, PostgreSQL, Redis, and WebSockets supporting real-time voting and synchronized playback for 200+ concurrent users.',
        'Designed normalized PostgreSQL schemas and integrated Redis caching to optimize database queries, reducing query latency by 35%.',
        'Deployed the cloud-native application on AWS EC2 instances, achieving 99.5% uptime and supporting seamless multi-user playback synchronization.',
      ],
      github: 'https://github.com/Kavita1928/BeatSync',
      live: 'https://beatsync.example.com',
    },
  ];

  return (
    <section id="projects" className="section">
      <h2 className="section-title">Featured Projects</h2>

      <div
        className="projects-grid"
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="glass-card project-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              padding: '35px',
              maxWidth: '650px',
              width: '100%',
            }}
          >
            {/* Hover Side Accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: project.glowColor,
              }}
            />

            <div>
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {project.icon}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{project.period}</span>
              </div>

              {/* Title & Subtitle */}
              <h3 style={{ fontSize: '1.7rem', color: 'var(--text-primary)', fontWeight: 700, margin: '8px 0 4px 0' }}>
                {project.title}
              </h3>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '24px' }}>
                {project.subtitle}
              </h4>

              {/* Project Feature Bullets */}
              <ul style={{ padding: 0, margin: '0 0 28px 0', listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {project.points.map((point, pIdx) => (
                  <li
                    key={pIdx}
                    style={{
                      position: 'relative',
                      paddingLeft: '20px',
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '8px',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: project.glowColor,
                      }}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer containing Tech Tags and Links */}
            <div>
              {/* Tech Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {project.tech.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontSize: '0.8rem',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: '20px',
                }}
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = project.glowColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <GithubIcon size={18} /> Code Repository
                </a>
                
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = project.glowColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <ExternalLink size={18} /> Live Demo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
