import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const RobotMascot = ({ size = 60, playing = true }: { size?: number; playing?: boolean }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    style={{ overflow: 'visible' }}
    className={playing ? 'robot-mascot' : ''}
  >
    {/* Antenna */}
    <rect x="47" y="12" width="6" height="15" fill="#475569" rx="1" />
    <circle cx="50" cy="10" r="7" className="antenna-glow" fill="var(--accent-cyan)" />
    
    {/* Headphone band */}
    <path d="M22 45 A 28 28 0 0 1 78 45" stroke="#334155" strokeWidth="4" fill="none" />
    
    {/* Ears/Headphones */}
    <rect x="12" y="38" width="10" height="24" rx="4" fill="var(--accent-cyan)" />
    <rect x="78" y="38" width="10" height="24" rx="4" fill="var(--accent-cyan)" />

    {/* Head */}
    <rect x="20" y="24" width="60" height="52" rx="14" fill="#1e293b" stroke="#475569" strokeWidth="3" />
    
    {/* Face Screen */}
    <rect x="28" y="32" width="44" height="32" rx="8" fill="#090d16" />
    
    {/* Eyes */}
    <ellipse cx="40" cy="46" rx="5" ry="5" fill="#10b981" className="robot-eye" style={{ transformOrigin: '40px 46px' }} />
    <ellipse cx="60" cy="46" rx="5" ry="5" fill="#10b981" className="robot-eye" style={{ transformOrigin: '60px 46px' }} />
    
    {/* Cheeks */}
    <circle cx="34" cy="55" r="2.5" fill="rgba(244, 63, 94, 0.4)" />
    <circle cx="66" cy="55" r="2.5" fill="rgba(244, 63, 94, 0.4)" />

    {/* Mouth */}
    <path d="M44 54 Q 50 60 56 54" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Neck & body */}
    <rect x="42" y="76" width="16" height="8" fill="#475569" />
    <path d="M30 84 L 70 84 L 62 94 L 38 94 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
  </svg>
);

const RobotLeftArm = ({ isTyping }: { isTyping: boolean }) => (
  <svg
    viewBox="0 0 40 60"
    width="32"
    height="48"
    style={{
      position: 'absolute',
      left: '-28px',
      top: '160px',
      transformOrigin: 'top right',
      animation: isTyping ? 'armTypeLeft 0.15s infinite alternate' : 'armIdleLeft 2.5s infinite ease-in-out',
      pointerEvents: 'none',
      zIndex: 10,
    }}
  >
    <circle cx="30" cy="10" r="6" fill="#475569" />
    <rect x="26" y="10" width="8" height="24" rx="4" fill="#334155" />
    <circle cx="30" cy="34" r="5" fill="var(--accent-cyan)" />
    <rect x="26" y="34" width="8" height="20" rx="3" fill="#475569" />
    <path d="M22 54 Q 30 62 38 54" stroke="var(--accent-cyan)" strokeWidth="3" fill="none" />
  </svg>
);

const RobotRightArm = ({ isTyping }: { isTyping: boolean }) => (
  <svg
    viewBox="0 0 40 60"
    width="32"
    height="48"
    style={{
      position: 'absolute',
      right: '-28px',
      top: '160px',
      transformOrigin: 'top left',
      animation: isTyping ? 'armTypeRight 0.15s infinite alternate' : 'armIdleRight 2.5s infinite ease-in-out',
      pointerEvents: 'none',
      zIndex: 10,
    }}
  >
    <circle cx="10" cy="10" r="6" fill="#475569" />
    <rect x="6" y="10" width="8" height="24" rx="4" fill="#334155" />
    <circle cx="10" cy="34" r="5" fill="var(--accent-cyan)" />
    <rect x="6" y="34" width="8" height="20" rx="3" fill="#475569" />
    <path d="M2 54 Q 10 62 18 54" stroke="var(--accent-cyan)" strokeWidth="3" fill="none" />
  </svg>
);

const RobotLegs = () => (
  <div
    style={{
      position: 'absolute',
      bottom: '-32px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '130px',
      display: 'flex',
      justifyContent: 'space-between',
      pointerEvents: 'none',
      zIndex: 10,
    }}
  >
    {/* Left Leg */}
    <svg
      viewBox="0 0 30 50"
      width="22"
      height="38"
      style={{
        transformOrigin: 'top center',
        animation: 'legSwingLeft 2.2s infinite ease-in-out alternate',
      }}
    >
      <rect x="11" y="0" width="8" height="30" rx="3" fill="#334155" />
      <circle cx="15" cy="30" r="5" fill="var(--accent-cyan)" />
      <rect x="7" y="30" width="16" height="12" rx="4" fill="#475569" />
      <path d="M7 42 L 23 42 L 23 48 C 23 48 15 49 7 48 Z" fill="#1e293b" />
    </svg>

    {/* Right Leg */}
    <svg
      viewBox="0 0 30 50"
      width="22"
      height="38"
      style={{
        transformOrigin: 'top center',
        animation: 'legSwingRight 2.2s infinite ease-in-out alternate-reverse',
      }}
    >
      <rect x="11" y="0" width="8" height="30" rx="3" fill="#334155" />
      <circle cx="15" cy="30" r="5" fill="var(--accent-cyan)" />
      <rect x="7" y="30" width="16" height="12" rx="4" fill="#475569" />
      <path d="M7 42 L 23 42 L 23 48 C 23 48 15 49 7 48 Z" fill="#1e293b" />
    </svg>
  </div>
);

const RobotHead = ({ isTyping }: { isTyping: boolean }) => (
  <div
    style={{
      position: 'absolute',
      top: '-68px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100px',
      height: '75px',
      zIndex: 12,
      pointerEvents: 'none',
      animation: 'headBob 4s infinite ease-in-out',
    }}
  >
    <svg viewBox="0 0 100 75" width="100" height="75" style={{ overflow: 'visible' }}>
      {/* Antenna */}
      <rect x="47" y="5" width="6" height="15" fill="#475569" rx="1" />
      <circle cx="50" cy="3" r="5" fill="var(--accent-cyan)" className="antenna-glow" style={{ animation: 'antennaPulse 1.5s infinite' }} />

      {/* Headphone band */}
      <path d="M12 40 A 38 38 0 0 1 88 40" stroke="#334155" strokeWidth="4" fill="none" />

      {/* Ears/Headphones */}
      <rect x="2" y="30" width="10" height="24" rx="4" fill="var(--accent-cyan)" />
      <rect x="88" y="30" width="10" height="24" rx="4" fill="var(--accent-cyan)" />

      {/* Head */}
      <rect x="10" y="16" width="80" height="54" rx="14" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />

      {/* Face Screen */}
      <rect x="18" y="24" width="64" height="38" rx="8" fill="#090d16" />

      {/* Eyes */}
      <ellipse cx="36" cy="38" rx="5" ry="5" fill="#10b981" className="robot-eye" style={{ transformOrigin: '36px 38px' }} />
      <ellipse cx="64" cy="38" rx="5" ry="5" fill="#10b981" className="robot-eye" style={{ transformOrigin: '64px 38px' }} />

      {/* Mouth */}
      {isTyping ? (
        <circle cx="50" cy="48" r="4.5" fill="#10b981" />
      ) : (
        <path d="M42 46 Q 50 52 58 46" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
    </svg>
  </div>
);

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hi! 👋 I'm Kavita's virtual assistant. Ask me anything about her education, experience, projects, or how to contact her!",
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'What is her tech stack?',
    'Tell me about BeatSync',
    'Where does she study?',
    'What are her hackathon results?',
    'How can I get in touch?',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponseText = getBotResponse(text);
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponseText }]);
      setIsTyping(false);
    }, 600);
  };

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (
      q.includes('tech stack') ||
      q.includes('skills') ||
      q.includes('languages') ||
      q.includes('frontend') ||
      q.includes('backend') ||
      q.includes('program')
    ) {
      return "Kavita is a Full Stack Developer. Her core skills include:\n• Languages: JavaScript, TypeScript, Python, Java, C, C++, SQL\n• Frontend: React.js, Next.js, Redux, HTML5, CSS3, Tailwind CSS\n• Backend & Database: Node.js, Express.js, RESTful APIs, WebSockets, PostgreSQL, MongoDB, Redis\n• Cloud: AWS EC2, Docker, CI/CD, Git";
    }

    if (
      q.includes('beatsync') ||
      q.includes('project') ||
      q.includes('musync') ||
      q.includes('streaming') ||
      q.includes('music')
    ) {
      return "Her primary project is BeatSync (Dec 2025 – Jan 2026), a collaborative music streaming platform. It supports synchronized playback and real-time voting for 200+ concurrent users, utilizing Next.js, Node.js, PostgreSQL, Redis, and WebSockets. She deployed it on AWS EC2 with Docker.";
    }

    if (
      q.includes('study') ||
      q.includes('education') ||
      q.includes('college') ||
      q.includes('iiit') ||
      q.includes('university') ||
      q.includes('cgpa') ||
      q.includes('degree')
    ) {
      return "Kavita is pursuing her Bachelor of Technology (B.Tech) in Electronics and Communication Engineering (ECE) at IIIT Guwahati, Assam, India. She is in the Class of 2027 (August 2023 – May 2027) and has a CGPA of 7.1.";
    }

    if (
      q.includes('experience') ||
      q.includes('intern') ||
      q.includes('labdox') ||
      q.includes('job') ||
      q.includes('mentor') ||
      q.includes('girlscript') ||
      q.includes('gssoc')
    ) {
      return "Kavita's experience includes:\n1. Web Development Intern at Labdox (May 2025 – July 2025): Developed 15+ pages using React, optimized workflows with Apps Script, saving 10+ hours/week.\n2. Open Source Mentor at GSSoC (May 2023 – August 2023): Led development of the EzyShop MERN platform, reviewed 500+ PRs on GitHub, and mentored 100+ developers.";
    }

    if (
      q.includes('achievement') ||
      q.includes('hackathon') ||
      q.includes('goldman') ||
      q.includes('hp') ||
      q.includes('flipkart') ||
      q.includes('adobe') ||
      q.includes('finalist')
    ) {
      return "Kavita has achieved outstanding results at national challenges:\n• Goldman Sachs India Hackathon 2025: National Finalist (Top 50 of 30,000+ candidates).\n• HP PowerLabs AI & IoT Challenge 2024: Top 2% (out of 150,000+ teams).\n• Flipkart Grid 2025 & Adobe India Hackathon 2025: National Semifinalist in both.";
    }

    if (
      q.includes('contact') ||
      q.includes('reach') ||
      q.includes('email') ||
      q.includes('phone') ||
      q.includes('number') ||
      q.includes('linkedin') ||
      q.includes('github') ||
      q.includes('hire')
    ) {
      return "You can get in touch with Kavita directly:\n• Email: kavita.yadav23b@iiitg.ac.in\n• Phone: +91 7398865618\n• LinkedIn: www.linkedin.com/in/kavita-yadav-63276a289/\n• GitHub: github.com/Kavita1928\n\nYou can also download her resume or send a message via the form at the bottom of the page!";
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('hola') || q.includes('help')) {
      return "Hello! I am ready to answer your questions. Feel free to ask about her projects, education, technical skills, or internships!";
    }

    return "I'm not sure I understand that question. However, you can read more details in the respective sections of this site or download her resume directly. You can also send her a direct message using the form below!";
  };

  return (
    <>
      {/* Animated Robot Mascot Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ask Kavita's Robot Assistant"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'var(--transition-smooth)',
          padding: 0,
        }}
      >
        <RobotMascot size={74} playing={!isOpen} />
      </button>

      {/* Robot Wrapper Container (makes elements stick out) */}
      <div
        style={{
          position: 'fixed',
          bottom: '110px',
          right: '24px',
          zIndex: 999,
          width: '360px',
          maxWidth: 'calc(100vw - 48px)',
          height: '480px',
          display: isOpen ? 'block' : 'none',
          overflow: 'visible',
          transition: 'var(--transition-smooth)',
        }}
      >
        {/* Robot Head */}
        <RobotHead isTyping={isTyping} />

        {/* Robot Arms */}
        <RobotLeftArm isTyping={isTyping} />
        <RobotRightArm isTyping={isTyping} />

        {/* Robot Legs */}
        <RobotLegs />

        {/* Actual Chat Screen (Robot Torso) */}
        <div
          className="chat-window-screen"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--chat-bg)',
            border: '2.5px solid var(--chat-border)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-neon), 0 12px 40px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 5,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              borderBottom: '1.5px solid var(--chat-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>KY-Bot Torso-Screen</h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)', display: 'inline-block' }} />
                Online & Playing
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chatbot"
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Message Feed */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
            className="chat-feed"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? 'var(--chat-bubble-user)' : 'var(--chat-bubble-bot)',
                  color: msg.sender === 'user' ? 'var(--chat-text-user)' : 'var(--chat-text-bot)',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  maxWidth: '85%',
                  fontSize: '0.88rem',
                  lineHeight: '1.45',
                  whiteSpace: 'pre-line',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--chat-border)',
                }}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'var(--chat-bubble-bot)',
                  color: 'var(--chat-text-bot)',
                  padding: '10px 14px',
                  borderRadius: '14px 14px 14px 2px',
                  fontSize: '0.88rem',
                  border: '1px solid var(--chat-border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span className="dot-typing" style={{ animationDelay: '0s' }}>.</span>
                <span className="dot-typing" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="dot-typing" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div
            style={{
              padding: '0 20px 10px 20px',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
            }}
            className="quick-chips"
          >
            {quickQuestions.map((qq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qq)}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--input-border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'var(--input-bg)';
                }}
              >
                {qq}
              </button>
            ))}
          </div>

          {/* Chat Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--chat-border)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.005)',
            }}
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'var(--transition-fast)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-cyan)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--input-border)')}
            />
            <button
              type="submit"
              aria-label="Send message"
              style={{
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--accent-cyan)',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-cyan)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--input-bg)';
                e.currentTarget.style.color = 'var(--accent-cyan)';
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Mascot Specific Styling Rules */}
      <style>{`
        .chat-feed::-webkit-scrollbar {
          width: 4px;
        }
        .chat-feed::-webkit-scrollbar-thumb {
          background: var(--input-border);
          border-radius: 2px;
        }
        .quick-chips::-webkit-scrollbar {
          display: none;
        }
        
        /* Robot mascot floating animations */
        @keyframes robotPlay {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-7px) rotate(3deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-4px) rotate(-3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes eyeBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        
        @keyframes antennaPulse {
          0%, 100% { fill: var(--accent-pink); filter: drop-shadow(0 0 2px var(--accent-pink)); }
          50% { fill: var(--accent-cyan); filter: drop-shadow(0 0 8px var(--accent-cyan)); }
        }
        
        @keyframes dotTyping {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        .dot-typing {
          animation: dotTyping 1.2s infinite;
          font-weight: bold;
          font-size: 1.2rem;
          line-height: 0.5;
        }

        .robot-mascot {
          animation: robotPlay 3.6s ease-in-out infinite;
          filter: drop-shadow(0 8px 16px rgba(16, 185, 129, 0.25));
        }
        
        .robot-eye {
          animation: eyeBlink 4.2s infinite;
        }
        
        /* Torso robot arm & leg animations */
        @keyframes headBob {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -4px); }
        }
        @keyframes armIdleLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg); }
        }
        @keyframes armIdleRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes armTypeLeft {
          0% { transform: rotate(-10deg) translateY(0); }
          100% { transform: rotate(15deg) translateY(-2px); }
        }
        @keyframes armTypeRight {
          0% { transform: rotate(10deg) translateY(0); }
          100% { transform: rotate(-15deg) translateY(-2px); }
        }
        @keyframes legSwingLeft {
          0% { transform: rotate(-10deg); }
          100% { transform: rotate(10deg); }
        }
        @keyframes legSwingRight {
          0% { transform: rotate(10deg); }
          100% { transform: rotate(-10deg); }
        }
      `}</style>
    </>
  );
}
