import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const GithubIcon = ({ size = 20 }: { size?: number }) => (
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

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
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

const LeetcodeIcon = ({ size = 20 }: { size?: number }) => (
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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Let's Collaborate</h2>

      <div
        className="contact-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: '40px',
          alignItems: 'start',
        }}
      >
        {/* Left: Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Contact Information</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '30px' }}>
              I am open to summer internships, full-time opportunities, open-source projects, and collaborative research. Drop a message, and I'll get back to you within 24 hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: 'rgba(0, 242, 254, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0, 242, 254, 0.15)', display: 'flex' }}>
                  <Mail size={20} style={{ color: 'var(--accent-cyan)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</h4>
                  <a href="mailto:kavita.yadav23b@iiitg.ac.in" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    kavita.yadav23b@iiitg.ac.in
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: 'rgba(138, 43, 226, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(138, 43, 226, 0.15)', display: 'flex' }}>
                  <Phone size={20} style={{ color: 'var(--accent-violet)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Phone</h4>
                  <a href="tel:+917398865618" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    +91 7398865618
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: 'rgba(255, 0, 127, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 0, 127, 0.15)', display: 'flex' }}>
                  <MapPin size={20} style={{ color: 'var(--accent-pink)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Location</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500, margin: 0 }}>
                    IIIT Guwahati, Assam, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Panel */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.1rem' }}>Find Me Online</h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a
                href="https://www.linkedin.com/in/kavita-yadav-63276a289/"
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 242, 254, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <LinkedinIcon size={20} />
              </a>

              <a
                href="https://github.com/Kavita1928"
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-violet)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(138, 43, 226, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <GithubIcon size={20} />
              </a>

              <a
                href="https://leetcode.com/u/Kavitayadav_123/"
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  transition: 'var(--transition-fast)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-pink)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 127, 0.2)';
                  e.currentTarget.style.color = 'var(--accent-pink)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <LeetcodeIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '24px' }}>Send a Message</h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="form-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'var(--transition-fast)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-cyan)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'var(--transition-fast)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-cyan)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'var(--transition-fast)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-cyan)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Message Body</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'var(--transition-fast)',
                  resize: 'vertical',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-cyan)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
              />
            </div>

            <button
              type="submit"
              className="glow-button primary"
              disabled={submitted}
              style={{
                marginTop: '10px',
                width: '100%',
                justifyContent: 'center',
                opacity: submitted ? 0.7 : 1,
              }}
            >
              {submitted ? (
                <span>Message Sent Successfully!</span>
              ) : (
                <>
                  Send Message <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
