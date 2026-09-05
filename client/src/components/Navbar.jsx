import React from 'react';
import { Sparkles, Key, Sun, Moon, ShieldCheck, Compass } from 'lucide-react';

export function Navbar({ theme, onToggleTheme, onOpenApiKeyModal, aiStatus, hasUserApiKey }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container flex items-center justify-between" style={{ padding: '0.85rem 1.5rem' }}>
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ProjectPilot AI
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                MVP
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              AI-Powered Final-Year Project Architect & Mentor
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* AI Status Badge */}
          <div className="badge badge-emerald flex items-center gap-2" style={{ padding: '0.35rem 0.75rem' }} title={aiStatus}>
            <span className="pulse-dot" />
            <span style={{ fontSize: '0.775rem', fontWeight: 600 }}>
              {hasUserApiKey ? 'Custom Gemini Key Active' : aiStatus || 'AI Engine Ready'}
            </span>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className="btn btn-secondary btn-sm flex items-center gap-2"
            title="Configure Gemini API Key"
            aria-label="Configure Gemini API Key"
          >
            <Key size={14} />
            <span style={{ fontSize: '0.8rem' }}>{hasUserApiKey ? 'Key Set' : 'Add Gemini Key'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="btn btn-ghost btn-sm"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ padding: '0.45rem', borderRadius: 'var(--radius-md)' }}
          >
            {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />}
          </button>
        </div>
      </div>
    </header>
  );
}
