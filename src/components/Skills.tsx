import { Code2, Monitor, Server, Database, Cloud, Terminal, Cpu } from 'lucide-react';

export default function Skills() {
  const skillCategories = [
    {
      title: 'Languages',
      icon: <Code2 size={24} style={{ color: 'var(--accent-cyan)' }} />,
      glowColor: 'var(--accent-cyan)',
      skills: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'SQL', 'MATLAB'],
    },
    {
      title: 'Frontend Development',
      icon: <Monitor size={24} style={{ color: '#00d2ff' }} />,
      glowColor: '#00d2ff',
      skills: ['React.js', 'React Hooks', 'Redux', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Responsive Design'],
    },
    {
      title: 'Backend Development',
      icon: <Server size={24} style={{ color: 'var(--accent-violet)' }} />,
      glowColor: 'var(--accent-violet)',
      skills: ['Node.js', 'Express.js', 'RESTful APIs', 'GraphQL', 'WebSockets', 'JWT', 'OAuth', 'MVC Architecture'],
    },
    {
      title: 'Databases & Cache',
      icon: <Database size={24} style={{ color: '#00ffaa' }} />,
      glowColor: '#00ffaa',
      skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Database Design', 'Query Optimization'],
    },
    {
      title: 'Cloud & DevOps',
      icon: <Cloud size={24} style={{ color: 'var(--accent-pink)' }} />,
      glowColor: 'var(--accent-pink)',
      skills: ['AWS EC2', 'Docker', 'Kubernetes', 'Vercel', 'GitHub Actions', 'CI/CD Pipelines', 'Git', 'Linux', 'Postman'],
    },
    {
      title: 'Testing & Tools',
      icon: <Terminal size={24} style={{ color: '#ffb900' }} />,
      glowColor: '#ffb900',
      skills: ['Jest', 'React Testing Library', 'Unit Testing', 'VS Code', 'Google Apps Script', 'Wix CMS'],
    },
    {
      title: 'Core CS Concepts',
      icon: <Cpu size={24} style={{ color: '#ff4c4c' }} />,
      glowColor: '#ff4c4c',
      skills: ['Data Structures & Algorithms', 'System Design', 'OOP', 'Agile/Scrum', 'Microservices', 'Cloud-Native', 'DBMS', 'OS', 'Computer Networks'],
    },
  ];

  return (
    <section id="skills" className="section">
      <h2 className="section-title">Technical Expertise</h2>
      
      <div
        className="skills-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {skillCategories.map((category, idx) => (
          <div
            key={idx}
            className="glass-card skill-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '28px',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            {/* Top Glow Accent Bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${category.glowColor}, transparent)`,
              }}
            />

            {/* Category Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {category.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{category.title}</h3>
            </div>

            {/* Badges Grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {category.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="skill-badge"
                  style={{
                    fontSize: '0.85rem',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-secondary)',
                    transition: 'var(--transition-fast)',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = category.glowColor;
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.boxShadow = `0 0 10px ${category.glowColor}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
