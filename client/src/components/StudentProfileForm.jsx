import React, { useState } from 'react';
import { Sparkles, Zap, Code2, Layers, Target, X, Plus } from 'lucide-react';

const SKILL_CHIPS = [
  'Python', 'JavaScript', 'Java', 'TypeScript', 'React', 'Node.js',
  'SQL', 'FastAPI', 'Docker', 'PyTorch', 'MongoDB', 'Flutter'
];

const DIFFICULTY_OPTIONS = [
  { value: 'Beginner', emoji: '🌱', desc: 'Solid fundamentals, low risk' },
  { value: 'Intermediate', emoji: '⚡', desc: 'Industry-standard project' },
  { value: 'Advanced', emoji: '🚀', desc: 'Complex AI / distributed systems' },
];

export function StudentProfileForm({
  profile,
  onChange,
  onApplyPreset,
  onSubmit,
  isLoading,
  presets,
  domains
}) {
  const [skillInput, setSkillInput] = useState('');
  const [activePresetId, setActivePresetId] = useState(null);

  const addSkill = (skill) => {
    const val = (skill || skillInput).trim();
    if (!val || (profile.skills || []).includes(val)) { setSkillInput(''); return; }
    onChange({ ...profile, skills: [...(profile.skills || []), val] });
    setSkillInput('');
  };

  const removeSkill = (s) => onChange({ ...profile, skills: (profile.skills || []).filter(x => x !== s) });

  const handlePreset = (preset) => {
    setActivePresetId(preset.id);
    onApplyPreset(preset.profile);
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-cyan">Step 1</span>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Tell us about yourself</h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              Fill in 4 quick fields and we'll generate 4 personalized project ideas tailored to you.
            </p>
          </div>

          {/* Quick Presets */}
          {presets?.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Presets:</span>
              {presets.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  className={`preset-chip ${activePresetId === preset.id ? 'active' : ''}`}
                  onClick={() => handlePreset(preset)}
                  title={preset.description}
                >
                  <Zap size={12} />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={e => { e.preventDefault(); if (!(profile.skills || []).length) addSkill('Python'); onSubmit(); }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Field 1: Skills */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="skill-input">
              <Code2 size={16} color="var(--accent-primary)" />
              <span>Your Skills & Technologies</span>
            </label>

            {/* Selected skills */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
              minHeight: '40px', marginBottom: '0.6rem', alignItems: 'center'
            }}>
              {(profile.skills || []).length === 0 && (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Add your skills below or click the chips
                </span>
              )}
              {(profile.skills || []).map(skill => (
                <span key={skill} className="badge badge-purple" style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.3rem 0.65rem', fontSize: '0.8rem'
                }}>
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: 0 }}
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {/* Input row */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <input
                id="skill-input"
                type="text"
                className="input"
                placeholder="Type a skill and press Enter (e.g. React, PyTorch, Go)"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              />
              <button type="button" className="btn btn-secondary" onClick={() => addSkill()} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Plus size={15} /> Add
              </button>
            </div>

            {/* Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Quick add:</span>
              {SKILL_CHIPS.filter(s => !(profile.skills || []).includes(s)).map(s => (
                <button
                  key={s}
                  type="button"
                  className="preset-chip"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                  onClick={() => addSkill(s)}
                >
                  +{s}
                </button>
              ))}
            </div>
          </div>

          {/* Fields 2 + 3: Domain & Career Goal — side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>

            {/* Domain */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="domain-select">
                <Layers size={16} color="var(--accent-cyan)" />
                <span>Project Domain</span>
              </label>
              <select
                id="domain-select"
                className="select"
                value={profile.domain || ''}
                onChange={e => onChange({ ...profile, domain: e.target.value })}
              >
                {(domains || []).map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Career Goal */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="career-input">
                <Target size={16} color="var(--accent-rose)" />
                <span>Career Goal / Target Role</span>
              </label>
              <input
                id="career-input"
                type="text"
                className="input"
                placeholder="e.g. ML Engineer, Full-Stack Dev, Security Analyst"
                value={profile.careerGoal || ''}
                onChange={e => onChange({ ...profile, careerGoal: e.target.value })}
              />
            </div>
          </div>

          {/* Field 4: Difficulty — visual radio buttons */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <Sparkles size={16} color="var(--accent-purple)" />
              <span>Project Difficulty Level</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {DIFFICULTY_OPTIONS.map(opt => {
                const isActive = (profile.difficulty || 'Intermediate') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...profile, difficulty: opt.value })}
                    style={{
                      padding: '0.85rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: isActive ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: isActive ? 'rgba(99,102,241,0.12)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                      boxShadow: isActive ? 'var(--shadow-glow)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{opt.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isActive ? 'var(--text-accent)' : 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {opt.value}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Submit */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '220px', justifyContent: 'center' }}
          >
            <Sparkles size={18} />
            <span>{isLoading ? 'Generating Ideas...' : '✨ Generate My Project Ideas'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
