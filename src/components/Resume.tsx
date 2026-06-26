import { Download, GraduationCap, Briefcase, Award, Cpu, FileText } from 'lucide-react';

export default function Resume() {
  const handleDownload = () => {
    // Links to the public/Kavita_Yadav_Resume.pdf file
    const link = document.createElement('a');
    link.href = '/Kavita_Yadav_Resume.pdf';
    link.download = 'Kavita_Yadav_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="resume" className="section">
      <h2 className="section-title">My Resume</h2>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <button
          onClick={handleDownload}
          className="glow-button primary"
          style={{
            fontSize: '1rem',
            padding: '14px 32px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Download size={20} /> Download PDF Resume
        </button>
      </div>

      {/* Styled Interactive Resume Sheet */}
      <div
        className="glass-card resume-sheet"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '40px',
          background: 'rgba(10, 10, 20, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          borderRadius: '16px',
        }}
      >
        {/* Top Resume Header */}
        <div
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '24px',
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <FileText size={32} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '2.2rem', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Kavita Yadav</h3>
          </div>
          <p style={{ color: 'var(--accent-cyan)', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Full Stack Developer | ECE Undergrad @ IIIT Guwahati
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
            Full Stack Developer with experience building scalable web applications using React.js, Next.js, Node.js, PostgreSQL, Redis, and AWS. Strong foundation in Data Structures & Algorithms, Object-Oriented Programming, REST API development, and software engineering principles. Experienced in open-source mentorship, performance optimization, and collaborative development.
          </p>
        </div>

        {/* Resume Content Body: Two columns */}
        <div className="resume-content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Left Column: Education & Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Education Block */}
            <div>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={20} style={{ color: 'var(--accent-cyan)' }} /> Education
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h5 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0 }}>IIIT Guwahati</h5>
                <p style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)', margin: 0 }}>Bachelor of Technology – ECE</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>August 2023 – May 2027 | CGPA: 7.1</p>
              </div>
            </div>

            {/* Technical Skills Block */}
            <div>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} style={{ color: 'var(--accent-violet)' }} /> Technical Skills
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <h5 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Languages</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>C, C++, Java, Python, JavaScript, SQL, MATLAB</p>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Frontend</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>React.js, Next.js, HTML5, CSS3, Bootstrap, Tailwind CSS, Responsive Design</p>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Backend & DB</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Node.js, Express.js, RESTful APIs, WebSockets, NumPy, Pandas, MySQL, PostgreSQL, Redis</p>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Cloud & Tools</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>AWS EC2, Docker, Git, GitHub, Linux, Postman, VS Code, Apps Script, Wix CMS, SwipePages</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Experience, Achievements, Leadership */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Experience Block */}
            <div>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={20} style={{ color: 'var(--accent-pink)' }} /> Experience
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h5 style={{ fontSize: '1.02rem', color: 'var(--text-primary)', margin: 0 }}>Web Development Intern</h5>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>2025</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', margin: '2px 0' }}>Labdox</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Developed and optimized 15+ interactive pages, improving engagement by 35% and scheduling workflows by 40%.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h5 style={{ fontSize: '1.02rem', color: 'var(--text-primary)', margin: 0 }}>Open Source Mentor</h5>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>2023</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', margin: '2px 0' }}>GirlScript Summer of Code</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Led EzyShop development, split code, reviewed 500+ PRs on GitHub, and mentored 100+ developers.
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements & Extracurriculars */}
            <div>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} style={{ color: '#ffb900' }} /> Achievements & Leadership
              </h4>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Goldman Sachs Hackathon 2025:</strong> National Finalist (Top 50 / 30,000+).</li>
                <li><strong>HP PowerLabs Challenge 2024:</strong> Top 2% (out of 150,000+).</li>
                <li><strong>Flipkart Grid & Adobe 2025:</strong> Semifinalist in both engineering challenges.</li>
                <li><strong>Sports Coordinator @ IIITG:</strong> Coordinated events for 500+ students.</li>
                <li><strong>Team Head @ YUVAAN:</strong> Secured sponsorships and managed 30+ team members.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .resume-sheet {
            padding: 24px !important;
          }
          .resume-content-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
