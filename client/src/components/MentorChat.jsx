import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Minimize2,
  Maximize2,
  HelpCircle,
  Cpu,
  Layers,
  Zap,
  Clock
} from 'lucide-react';

const QUICK_PROMPTS = [
  'Prepare me for viva defense',
  '3-minute project presentation script',
  'How to debug errors systematically',
  'Make this project easier',
  'Add 5 innovative features',
  'Explain the architecture in simple terms',
  'What should I learn first?',
  'Create a 30-day sprint roadmap',
  'Suggest datasets & APIs for this project'
];

export function MentorChat({
  isOpen,
  onClose,
  activeProject,
  studentProfile,
  onSendMessage,
  messages = [],
  isLoading
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;
    onSendMessage(text);
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="mentor-drawer" role="dialog" aria-label="AI Project Mentor Chat">
      {/* Drawer Header */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-2">
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <strong style={{ fontSize: '0.95rem' }}>ProjectPilot Mentor</strong>
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
            </div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {activeProject ? `Context: ${activeProject.title.slice(0, 24)}...` : 'General Project Guidance'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost btn-sm"
          style={{ padding: '0.35rem' }}
          aria-label="Close Mentor Chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: 'var(--text-muted)' }}>
            <Bot size={36} color="var(--accent-primary)" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Ask your AI Project Mentor anything
            </h4>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
              I can help simplify project scope, brainstorm cutting-edge features, explain database architecture, or draft a 30-day timeline.
            </p>
          </div>
        )}

        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: 'var(--radius-full)',
                background: isUser ? 'var(--secondary-gradient)' : 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0,
                marginTop: '0.2rem'
              }}>
                {isUser ? <User size={13} /> : <Bot size={13} />}
              </div>

              <div
                style={{
                  maxWidth: '85%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: isUser ? 'var(--accent-primary)' : 'var(--bg-glass)',
                  color: isUser ? '#fff' : 'var(--text-primary)',
                  border: isUser ? 'none' : '1px solid var(--border-strong)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  boxShadow: isUser ? 'none' : 'var(--shadow-sm)'
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.5rem' }}>
            <span className="pulse-dot" style={{ width: '8px', height: '8px' }} />
            <span>Project Mentor is drafting advice...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div style={{
        padding: '0.5rem 0.85rem',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(0, 0, 0, 0.2)',
        overflowX: 'auto',
        display: 'flex',
        gap: '0.35rem'
      }}>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="prompt-chip"
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div style={{
        padding: '0.75rem',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)'
      }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ display: 'flex', gap: '0.5rem' }}
        >
          <input
            type="text"
            className="input"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}
            placeholder="Ask mentor (e.g. 'How do I connect React to FastAPI?')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm flex items-center justify-center"
            style={{ padding: '0.55rem 0.85rem' }}
            disabled={!inputText.trim() || isLoading}
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
