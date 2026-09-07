import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Bot, User, Cpu, Zap, RotateCcw,
  Globe, Brain, Terminal, Layers, ChevronRight,
  CheckCircle, Clock, Code2, Rocket
} from 'lucide-react';

const QUICK_STARTS = [
  { icon: <Globe size={15} />, label: 'Web App', prompt: 'Build a full-stack task management web app with user login, real-time updates, and a clean dashboard' },
  { icon: <Brain size={15} />, label: 'AI Tool', prompt: 'Build an AI-powered resume analyzer that scores resumes and gives improvement suggestions using Gemini API' },
  { icon: <Terminal size={15} />, label: 'API Service', prompt: 'Build a REST API for a social media platform with posts, likes, comments, and user authentication' },
  { icon: <Layers size={15} />, label: 'SaaS Platform', prompt: 'Build a SaaS subscription platform for team project management with roles, boards, and billing' },
];

function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Section headers with emoji (e.g. 🎯 **Title**)
    if (/^[🎯🛠️✨🗺️💡🔧📋🚀].+\*\*/.test(line)) {
      const clean = line.replace(/\*\*/g, '');
      elements.push(
        <div key={key++} style={{
          fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-accent)',
          marginTop: '1.25rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem'
        }}>
          {clean}
        </div>
      );
      continue;
    }

    // Bold headers **text**
    if (/^\*\*(.+)\*\*$/.test(line.trim())) {
      elements.push(
        <div key={key++} style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.75rem', fontSize: '0.9rem' }}>
          {line.replace(/\*\*/g, '')}
        </div>
      );
      continue;
    }

    // Numbered list items
    if (/^\d+\.\s/.test(line)) {
      elements.push(
        <div key={key++} style={{
          display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
          paddingLeft: '0.5rem', marginBottom: '0.2rem'
        }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 700, flexShrink: 0, fontSize: '0.82rem', marginTop: '1px' }}>
            {line.match(/^\d+/)[0]}.
          </span>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {line.replace(/^\d+\.\s/, '').replace(/\*\*/g, '')}
          </span>
        </div>
      );
      continue;
    }

    // Bullet list items
    if (/^[-•]\s/.test(line)) {
      const content = line.replace(/^[-•]\s/, '');
      const parts = content.split(':');
      elements.push(
        <div key={key++} style={{
          display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
          paddingLeft: '0.5rem', marginBottom: '0.2rem'
        }}>
          <span style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '6px', fontSize: '6px' }}>●</span>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {parts.length > 1 ? (
              <><strong style={{ color: 'var(--text-primary)' }}>{parts[0]}:</strong>{parts.slice(1).join(':')}</>
            ) : content}
          </span>
        </div>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      elements.push(<div key={key++} style={{ height: '0.3rem' }} />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={key++} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.2rem' }}>
        {line.replace(/\*\*/g, '')}
      </p>
    );
  }

  return elements;
}

const BUILD_STEPS = [
  { id: 'coding', icon: <Code2 size={14} />, label: 'Generating Project Plan' },
  { id: 'running', icon: <Cpu size={14} />, label: 'Analyzing Requirements' },
  { id: 'testing', icon: <CheckCircle size={14} />, label: 'Validating Architecture' },
  { id: 'done', icon: <Rocket size={14} />, label: 'Plan Ready!' },
];

export function AiBuilderWorkspace() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buildStatus, setBuildStatus] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const content = (text || inputText).trim();
    if (!content || isLoading) return;

    setHasStarted(true);
    setInputText('');
    setBuildStatus(null);

    const userMsg = { role: 'user', text: content };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content, isProblemStatement: content.length > 20 })
      });
      const data = await res.json();

      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.reply || 'Plan generated successfully!',
        showBuildButton: data.showBuildButton
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '⚠️ Could not connect to the AI. Make sure the server is running on port 5000.',
        showBuildButton: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBuild = () => {
    const steps = ['coding', 'running', 'testing', 'done'];
    let i = 0;
    const next = () => {
      setBuildStatus(steps[i]);
      i++;
      if (i < steps.length) setTimeout(next, 1800);
    };
    next();
  };

  const handleReset = () => {
    setMessages([]);
    setHasStarted(false);
    setBuildStatus(null);
    setInputText('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const stepIndex = BUILD_STEPS.findIndex(s => s.id === buildStatus);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: '960px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 0', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 'var(--radius-md)',
            background: 'var(--cyber-gradient)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', boxShadow: '0 4px 14px rgba(20,184,166,0.35)'
          }}>
            <Cpu size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>AI Project Builder</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Describe what you want to build → get a complete project plan
            </p>
          </div>
        </div>
        {hasStarted && (
          <button
            onClick={handleReset}
            className="btn btn-ghost btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
          >
            <RotateCcw size={13} /> Start Over
          </button>
        )}
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '1rem' }}>

        {/* Welcome / Quick Start (shown before any message) */}
        {!hasStarted && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', paddingBottom: '2rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '520px' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'var(--cyber-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem', color: '#fff', boxShadow: '0 8px 28px rgba(20,184,166,0.3)'
              }}>
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>What do you want to build?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Describe your idea and get a complete tech stack, feature list, and 4-week build plan in seconds.
              </p>
            </div>

            {/* Quick start chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', width: '100%', maxWidth: '580px' }}>
              {QUICK_STARTS.map((qs) => (
                <button
                  key={qs.label}
                  onClick={() => handleSend(qs.prompt)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: '0.6rem'
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  <span style={{ color: 'var(--accent-cyan)', flexShrink: 0 }}>{qs.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                      {qs.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {qs.prompt}
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {hasStarted && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingRight: '0.25rem' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.75rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                {/* Avatar */}
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: m.role === 'user' ? 'var(--secondary-gradient)' : 'var(--cyber-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                  boxShadow: m.role === 'user' ? '0 2px 8px rgba(59,130,246,0.3)' : '0 2px 8px rgba(20,184,166,0.3)'
                }}>
                  {m.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                </div>

                {/* Bubble */}
                <div style={{
                  maxWidth: '82%',
                  background: m.role === 'user' ? 'var(--secondary-gradient)' : 'var(--bg-card)',
                  color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                  borderRadius: m.role === 'user' ? 'var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)',
                  padding: m.role === 'user' ? '0.75rem 1rem' : '1.25rem 1.5rem',
                  border: m.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.9rem',
                }}>
                  {m.role === 'user' ? (
                    <span style={{ lineHeight: 1.5 }}>{m.text}</span>
                  ) : (
                    <div>{renderMarkdown(m.text)}</div>
                  )}

                  {/* Build button */}
                  {m.showBuildButton && !buildStatus && (
                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={simulateBuild}
                        className="btn btn-primary"
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: '0.5rem', padding: '0.75rem'
                        }}
                      >
                        <Rocket size={16} />
                        <span>Launch Build Process</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading state */}
            {isLoading && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--cyber-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                  <Bot size={15} />
                </div>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)',
                  padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                  <span className="pulse-dot" style={{ width: 8, height: 8 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Crafting your project plan...</span>
                </div>
              </div>
            )}

            {/* Build Status Panel */}
            {buildStatus && (
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem',
                maxWidth: '420px', margin: '0 auto', width: '100%'
              }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                  <Cpu size={16} color="var(--accent-cyan)" /> Build Orchestrator
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {BUILD_STEPS.map((step, i) => {
                    const isDone = i < stepIndex;
                    const isActive = i === stepIndex;
                    return (
                      <div key={step.id} style={{
                        display: 'flex', alignItems: 'center', gap: '0.65rem',
                        color: isDone ? 'var(--accent-emerald)' : isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: isActive ? 600 : 400,
                        fontSize: '0.85rem', transition: 'color 0.3s'
                      }}>
                        {isDone ? (
                          <CheckCircle size={15} color="var(--accent-emerald)" />
                        ) : isActive ? (
                          <span className="pulse-dot" style={{ width: 10, height: 10, flexShrink: 0 }} />
                        ) : (
                          <Clock size={14} style={{ opacity: 0.4 }} />
                        )}
                        {i + 1}. {step.label}
                      </div>
                    );
                  })}
                </div>
                {buildStatus === 'done' && (
                  <div style={{
                    marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem', color: 'var(--accent-emerald)', textAlign: 'center', fontWeight: 600
                  }}>
                    ✅ Build complete! Start coding with the plan above.
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem'
      }}>
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
        >
          <input
            ref={inputRef}
            type="text"
            className="input"
            style={{ flex: 1, borderRadius: 'var(--radius-full)', padding: '0.75rem 1.25rem' }}
            placeholder={hasStarted ? 'Ask a follow-up or describe another project...' : 'Describe what you want to build (e.g. "Build a recipe sharing app with AI suggestions")'}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={15} />
            <span>Build</span>
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Powered by Gemini AI · Works without an API key using smart fallback
        </p>
      </div>
    </div>
  );
}
