import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Code2,
  Cpu,
  Layers,
  Clock,
  Users,
  Target,
  FileText,
  Plus,
  X
} from 'lucide-react';

const COMMON_SKILLS = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'Go', 'SQL',
  'React', 'Node.js', 'FastAPI', 'Docker', 'PyTorch', 'TensorFlow',
  'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Flutter', 'Linux'
];

const COMMON_INTERESTS = [
  'Artificial Intelligence', 'Machine Learning', 'Healthcare', 'FinTech',
  'Cybersecurity', 'IoT / Smart Systems', 'Web Development', 'Sustainability',
  'Computer Vision', 'NLP & LLMs', 'Cloud Computing', 'EdTech'
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

  const handleAddSkill = (skillToAdd) => {
    const val = (skillToAdd || skillInput).trim();
    if (!val) return;
    if (!(profile.skills || []).includes(val)) {
      onChange({
        ...profile,
        skills: [...(profile.skills || []), val]
      });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange({
      ...profile,
      skills: (profile.skills || []).filter(s => s !== skillToRemove)
    });
  };

  const toggleInterest = (interest) => {
    const current = profile.interests || [];
    if (current.includes(interest)) {
      onChange({ ...profile, interests: current.filter(i => i !== interest) });
    } else {
      onChange({ ...profile, interests: [...current, interest] });
    }
  };

  const handlePresetClick = (preset) => {
    setActivePresetId(preset.id);
    onApplyPreset(preset.profile);
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      {/* Header & Preset Selector */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-cyan">Step 1: Your Profile</span>
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Configure Skills & Interests</h2>
            </div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Select a quick preset or customize your technical background to generate personalized project blueprints.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>Presets:</span>
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`preset-chip ${activePresetId === preset.id ? 'active' : ''}`}
                onClick={() => handlePresetClick(preset)}
                title={preset.description}
              >
                <Zap size={13} />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        if ((profile.skills || []).length === 0) {
          handleAddSkill('Python'); // safe fallback
        }
        onSubmit();
      }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Skills & Technologies */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '0.25rem' }}>
              <label className="form-label" htmlFor="skill-tag-input">
                <Code2 size={16} color="var(--accent-primary)" />
                <span>Technical Skills & Programming Languages</span>
              </label>
              {(profile.skills || []).length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange({ ...profile, skills: [] })}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.725rem', padding: '0.15rem 0.4rem' }}
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Tag List */}
            <div className="flex items-center gap-2" style={{ flexWrap: 'wrap', marginBottom: '0.5rem', minHeight: '38px' }}>
              {(profile.skills || []).map((skill) => (
                <span key={skill} className="badge badge-purple flex items-center gap-1" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {(profile.skills || []).length === 0 && (
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>No skills added yet. Select from suggestions below or type your own.</span>
              )}
            </div>

            {/* Input to add custom skill */}
            <div className="flex gap-2">
              <input
                type="text"
                className="input"
                placeholder="Type language or tech (e.g. PyTorch, Rust, GraphQL) and hit Enter or Add"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleAddSkill()}
                style={{ padding: '0.5rem 1rem' }}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Skill Suggestion Chips */}
            <div className="flex items-center gap-1" style={{ flexWrap: 'wrap', marginTop: '0.4rem' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Quick add:</span>
              {COMMON_SKILLS.slice(0, 10).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="preset-chip"
                  style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
                >
                  +{skill}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Domain */}
          <div className="form-group">
            <label className="form-label">
              <Layers size={16} color="var(--accent-cyan)" />
              <span>Preferred Domain</span>
            </label>
            <select
              className="select"
              value={profile.domain || ''}
              onChange={(e) => onChange({ ...profile, domain: e.target.value })}
            >
              {domains.map((dom) => (
                <option key={dom.id} value={dom.name}>
                  {dom.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Level */}
          <div className="form-group">
            <label className="form-label">
              <Target size={16} color="var(--accent-purple)" />
              <span>Project Difficulty</span>
            </label>
            <select
              className="select"
              value={profile.difficulty || 'Intermediate'}
              onChange={(e) => onChange({ ...profile, difficulty: e.target.value })}
            >
              <option value="Beginner">Beginner (Solid fundamentals, low risk)</option>
              <option value="Intermediate">Intermediate (Industry-standard architecture)</option>
              <option value="Advanced">Advanced (Complex distributed / deep AI research)</option>
            </select>
          </div>

          {/* Project Duration */}
          <div className="form-group">
            <label className="form-label">
              <Clock size={16} color="var(--accent-amber)" />
              <span>Timeline / Duration</span>
            </label>
            <select
              className="select"
              value={profile.duration || '3 months'}
              onChange={(e) => onChange({ ...profile, duration: e.target.value })}
            >
              <option value="1 month">1 Month (Sprint / Rapid Prototype)</option>
              <option value="3 months">3 Months (Standard Semester Capstone)</option>
              <option value="6 months">6 Months (Major Final-Year Project)</option>
              <option value="1 year">1 Year (Honors Thesis / Deep Research)</option>
            </select>
          </div>

          {/* Team or Individual */}
          <div className="form-group">
            <label className="form-label">
              <Users size={16} color="var(--accent-emerald)" />
              <span>Project Mode</span>
            </label>
            <select
              className="select"
              value={profile.projectType || 'Individual'}
              onChange={(e) => onChange({ ...profile, projectType: e.target.value })}
            >
              <option value="Individual">Individual (Single Student)</option>
              <option value="Team of 2">Team of 2</option>
              <option value="Team of 3-4">Team of 3-4</option>
            </select>
          </div>

          {/* Career Goal */}
          <div className="form-group">
            <label className="form-label">
              <Target size={16} color="var(--accent-rose)" />
              <span>Career Goal / Target Role</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. ML Engineer, Full-Stack Dev, Security Analyst"
              value={profile.careerGoal || ''}
              onChange={(e) => onChange({ ...profile, careerGoal: e.target.value })}
            />
          </div>

          {/* Preferred Project Type */}
          <div className="form-group">
            <label className="form-label">
              <Cpu size={16} color="var(--accent-primary)" />
              <span>Preferred Architecture Type</span>
            </label>
            <select
              className="select"
              value={profile.preferredType || 'Full-Stack Web'}
              onChange={(e) => onChange({ ...profile, preferredType: e.target.value })}
            >
              <option value="Full-Stack Web">Full-Stack Web Application</option>
              <option value="Machine Learning / Data Science">Machine Learning & Data Intelligence</option>
              <option value="Cloud/DevOps">Cloud-Native & Distributed Systems</option>
              <option value="Embedded/IoT">Embedded Systems & Smart IoT</option>
              <option value="Mobile App">Mobile Application (iOS/Android/PWA)</option>
            </select>
          </div>

          {/* Areas of Interest (Multi-select Chips) */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">
              <Sparkles size={16} color="var(--accent-primary)" />
              <span>Areas of Interest (Select all that excite you)</span>
            </label>
            <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
              {COMMON_INTERESTS.map((interest) => {
                const isSelected = (profile.interests || []).includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`preset-chip ${isSelected ? 'active' : ''}`}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Idea Description / Specific Notes */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">
              <FileText size={16} color="var(--text-secondary)" />
              <span>Have an initial idea or specific preference? (Optional)</span>
            </label>
            <textarea
              className="textarea"
              placeholder="e.g., 'I want to build something that helps doctors spot lung abnormalities from X-rays using vision models with a simple web dashboard.'"
              value={profile.description || ''}
              onChange={(e) => onChange({ ...profile, description: e.target.value })}
            />
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg flex items-center gap-2"
            disabled={isLoading}
          >
            <Sparkles size={20} />
            <span>{isLoading ? 'Synthesizing Tailored Projects...' : 'Generate AI Project Recommendations'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
