import React from 'react';
import { Sparkles, Key, Sun, Moon, Cpu } from 'lucide-react';

export function Navbar({ theme, onToggleTheme, onOpenApiKeyModal, aiStatus, hasUserApiKey, activeApp, onSwitchApp }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container flex items-center justify-between" style={{ padding: '0.75rem 1.5rem', gap: '1rem' }}>

        {/* Brand + App Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
            }}>
              <Sparkles size={18} />
            </div>
            <span style={{
              fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em',
              background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              whiteSpace: 'nowrap'
            }}>
              ProjectPilot AI
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />

          {/* App switcher pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <button
              id="nav-main"
              onClick={() => onSwitchApp?.('main')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)',
                border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                transition: 'all 0.15s',
                background: (!activeApp || activeApp === 'main') ? 'var(--primary-gradient)' : 'transparent',
                color: (!activeApp || activeApp === 'main') ? '#fff' : 'var(--text-muted)',
              }}
            >
              <Sparkles size={13} />
              Project Mentor
            </button>
            <button
              id="nav-builder"
              onClick={() => onSwitchApp?.('builder')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)',
                border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                transition: 'all 0.15s',
                background: activeApp === 'builder' ? 'var(--cyber-gradient)' : 'transparent',
                color: activeApp === 'builder' ? '#fff' : 'var(--text-muted)',
              }}
            >
              <Cpu size={13} />
              AI Builder
            </button>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* AI Status */}
          <div
            className="badge badge-emerald"
            style={{ padding: '0.3rem 0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title={aiStatus}
          >
            <span className="pulse-dot" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {hasUserApiKey ? 'Gemini Key Active' : 'AI Ready'}
            </span>
          </div>

          {/* API Key Button */}
          <button
            onClick={onOpenApiKeyModal}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem' }}
            title="Configure Gemini API Key"
            aria-label="Configure Gemini API Key"
          >
            <Key size={13} />
            <span style={{ fontSize: '0.78rem' }}>{hasUserApiKey ? 'Key Set ✓' : 'Add Key'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn btn-ghost btn-sm"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)' }}
          >
            {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
          </button>
        </div>
      </div>
    </header>
  );
}
