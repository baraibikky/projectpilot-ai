import React, { useState } from 'react';
import { Key, X, Check, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export function ApiKeyModal({ isOpen, onClose, onSaveKey, currentKey }) {
  const [apiKeyInput, setApiKeyInput] = useState(currentKey || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveKey(apiKeyInput.trim());
    onClose();
  };

  const handleClear = () => {
    setApiKeyInput('');
    onSaveKey('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
          <div className="flex items-center gap-2">
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Configure Gemini AI Engine</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Optional Google Gemini 1.5/2.0 API Key</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.35rem' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Informational Callout */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          borderLeft: '3px solid var(--accent-primary)',
          padding: '0.85rem 1rem',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          fontSize: '0.85rem',
          lineHeight: 1.5,
          marginBottom: '1.25rem'
        }}>
          <strong>Zero Friction Setup:</strong> ProjectPilot AI is equipped with an intelligent, dynamic fallback architecture. Even without an API key, the platform synthesizes real-time personalized projects, 20-aspect blueprints, roadmaps, and mentoring responses!
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Google Gemini API Key</span>
            </label>
            <input
              type="password"
              className="input"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              autoFocus
            />
            <span className="form-hint">
              Keys are kept securely in browser local storage and never logged or exposed to the public.
            </span>
          </div>

          <div className="flex items-center justify-between" style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-ghost btn-sm"
              disabled={!currentKey && !apiKeyInput}
            >
              Reset to Demo Engine
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm flex items-center gap-1"
              >
                <Check size={14} />
                <span>Save Key</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
