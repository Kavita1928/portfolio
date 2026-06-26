import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
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

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // User message
    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Generate response
    setTimeout(() => {
      const botResponseText = getBotResponse(text);
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponseText }]);
    }, 600);
  };

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();

    // Technical skills
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

    // Project BeatSync
    if (
      q.includes('beatsync') ||
      q.includes('project') ||
      q.includes('musync') ||
      q.includes('streaming') ||
      q.includes('music')
    ) {
      return "Her primary project is BeatSync (Dec 2025 – Jan 2026), a collaborative music streaming platform. It supports synchronized playback and real-time voting for 200+ concurrent users, utilizing Next.js, Node.js, PostgreSQL, Redis, and WebSockets. She deployed it on AWS EC2 with Docker.";
    }

    // Education
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

    // Work experience
    if (
      q.includes('experience') ||
      q.includes('intern') ||
      q.includes('labdox') ||
      q.includes('job') ||
      q.includes('mentor') ||
      q.includes('girlscript') ||
      q.includes('gssoc')
    ) {
      return "Kavita's experience includes:\n1. Web Development Intern at Labdox (May 2025 – July 2025): Developed 15+ pages using React, optimized workflows with Apps Script, saving 10+ hours/week.\n2. Open Source Mentor at GSSoC (May 2023 – August 2023): Led development of the EzyShop MERN platform, reviewed 500+ pull requests on GitHub, and mentored 100+ developers.";
    }

    // Achievements
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

    // Contact details
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

    // General greetings
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('hola') || q.includes('help')) {
      return "Hello! I am ready to answer your questions. Feel free to ask about her projects, education, technical skills, or internships!";
    }

    // Fallback
    return "I'm not sure I understand that question. However, you can read more details in the respective sections of this site or download her resume directly. You can also send her a direct message using the form below!";
  };

  return (
    <>
      {/* Chat Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-cyan)',
          color: 'var(--text-primary)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'var(--transition-smooth)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08) rotate(5deg)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.4)';
        }}
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

      {/* Chat Window */}
      <div
        className="chat-window"
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          zIndex: 999,
          width: '360px',
          maxWidth: 'calc(100vw - 48px)',
          height: '480px',
          backgroundColor: 'rgba(10, 10, 18, 0.95)',
          border: '1px solid var(--border-glow)',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'var(--transition-smooth)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderBottom: '1px solid var(--border-glow)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Kavita's Assistant</h4>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
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
                backgroundColor: msg.sender === 'user' ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                maxWidth: '85%',
                fontSize: '0.88rem',
                lineHeight: '1.45',
                whiteSpace: 'pre-line',
                border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {msg.text}
            </div>
          ))}
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
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
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
            borderTop: '1px solid var(--border-glow)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
          }}
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask a question..."
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'var(--transition-fast)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-cyan)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
          />
          <button
            type="submit"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
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
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.color = 'var(--accent-cyan)';
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
        .chat-feed::-webkit-scrollbar {
          width: 4px;
        }
        .chat-feed::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
        }
        .quick-chips::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
