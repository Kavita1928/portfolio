import { Briefcase, Users, Calendar, Trophy } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
      role: 'Web Development Intern',
      company: 'Labdox',
      location: 'Remote',
      period: 'May 2025 – July 2025',
      type: 'work',
      icon: <Briefcase size={18} style={{ color: 'var(--accent-cyan)' }} />,
      points: [
        'Developed 15+ responsive, end-to-end web pages using React.js, JavaScript (ES6+), and Wix CMS following MVC architecture, improving user engagement by 35% and cutting page load times by 20% via lazy loading and asset minification.',
        'Automated business workflows with Google Sheets, Apps Script, and a Landbot chatbot integrated via REST APIs, reducing manual scheduling overhead by 40% and saving 10+ hours/week.',
        'Conducted unit testing and debugging across the full stack, ensuring code quality and cross-browser compatibility across Chrome, Firefox, and Safari in active Agile sprints.',
      ],
    },
    {
      role: 'Open Source Mentor',
      company: 'GirlScript Summer of Code (GSSoC)',
      location: 'Remote',
      period: 'May 2023 – August 2023',
      type: 'mentor',
      icon: <Users size={18} style={{ color: 'var(--accent-violet)' }} />,
      points: [
        'Led Agile/Scrum development of EzyShop, a MERN-stack e-commerce platform, reducing page load times by 25% through modular MVC architecture, code splitting, and React Hooks.',
        'Reviewed and merged 500+ pull requests on GitHub, enforcing version control best practices, CI/CD pipelines, Jest unit testing, and secure RESTful API design.',
        'Mentored 100+ developers in frontend (React.js, HTML5, CSS3) and backend (Node.js, Express.js, RESTful APIs) technologies, growing community engagement by 30% over the 3-month program.',
      ],
    },
    {
      role: 'Sports Coordinator',
      company: 'IIIT Guwahati',
      location: 'Guwahati, Assam',
      period: '2024 - Present',
      type: 'leadership',
      icon: <Trophy size={18} style={{ color: 'var(--accent-pink)' }} />,
      points: [
        'Managed institute-wide sports events for 500+ students with a team of 20+ volunteers, successfully increasing student participation by 40%.',
        'Coordinated event logistics, equipment budgeting, and scheduling for multiple competitive leagues.',
      ],
    },
    {
      role: 'Team Head – YUVAAN & ENTROPY',
      company: 'Cultural & Technical Fests, IIIT Guwahati',
      location: 'Guwahati, Assam',
      period: '2024 - 2025',
      type: 'leadership',
      icon: <Users size={18} style={{ color: '#ffb900' }} />,
      points: [
        'Led sponsorship and coordination for two major institute festivals, managing a 30+ member cross-functional team.',
        'Secured 5+ industry sponsorships and partnerships, coordinating external public relations and student engagements.',
      ],
    },
  ];

  return (
    <section id="experience" className="section">
      <h2 className="section-title">Experience & Leadership</h2>

      <div className="timeline">
        {experiences.map((exp, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div key={index} className={`timeline-item ${isLeft ? 'left' : 'right'}`}>
              <div className="timeline-dot" />
              
              <div className="glass-card" style={{ padding: '24px' }}>
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                      {exp.role}
                    </h3>
                    <h4
                      style={{
                        fontSize: '1rem',
                        color: 'var(--accent-cyan)',
                        fontWeight: 600,
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {exp.company}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>| {exp.location}</span>
                    </h4>
                  </div>

                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <Calendar size={14} />
                    {exp.period}
                  </span>
                </div>

                {/* Points List */}
                <ul
                  style={{
                    listStyleType: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {exp.points.map((point, pIdx) => (
                    <li
                      key={pIdx}
                      style={{
                        position: 'relative',
                        paddingLeft: '20px',
                        fontSize: '0.92rem',
                        lineHeight: '1.5',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '8px',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: exp.type === 'work' ? 'var(--accent-cyan)' : exp.type === 'mentor' ? 'var(--accent-violet)' : 'var(--accent-pink)',
                        }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
