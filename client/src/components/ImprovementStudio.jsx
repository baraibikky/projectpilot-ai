import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  Minimize2,
  Send,
  CheckCircle2,
  Flame,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

const PRESET_QUERIES = [
  { id: 'innovative', label: 'How can I make this more innovative?', icon: Sparkles },
  { id: 'easier', label: 'How can I make it easier?', icon: Minimize2 },
  { id: 'ai', label: 'How can I add AI?', icon: Cpu },
  { id: 'learn', label: 'What should I learn?', icon: Lightbulb },
  { id: 'missing', label: 'What features are missing?', icon: Zap },
  { id: 'resume', label: 'How can I improve my resume value?', icon: TrendingUp },
  { id: '30days', label: 'What can I build in 30 days?', icon: Flame },
  { id: 'scalable', label: 'How to make it more scalable?', icon: Layers }
];

export function ImprovementStudio({
  activeProject,
  onRunImprovement,
  improvements = [],
  isLoading,
  onApplyImprovement
}) {
  const [projectTitle, setProjectTitle] = useState(activeProject?.title || '');
  const [projectDesc, setProjectDesc] = useState(activeProject?.shortDescription || '');
  const [selectedQueryType, setSelectedQueryType] = useState('innovative');
  const [customQuestion, setCustomQuestion] = useState('');
  const [appliedIds, setAppliedIds] = useState([]);

  // Sync with activeProject if changed
  React.useEffect(() => {
    if (activeProject) {
      setProjectTitle(activeProject.title || '');
      setProjectDesc(activeProject.shortDescription || activeProject.problemStatement || '');
    }
  }, [activeProject]);

  const handleSubmit = (queryType = selectedQueryType) => {
    setSelectedQueryType(queryType);
    onRunImprovement({
      projectTitle: projectTitle || 'My Capstone Project',
      projectDescription: projectDesc || 'Full-stack application with web interface and database',
      queryType,
      customQuery: customQuestion.trim() || undefined
    });
  };

  const handleApply = (imp) => {
    setAppliedIds((prev) => [...prev, imp.id]);
    if (onApplyImprovement) {
      onApplyImprovement(imp);
    }
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toUpperCase();
    if (p.includes('HIGH')) {
      return <span className="badge badge-rose" style={{ fontWeight: 800 }}>HIGH IMPACT</span>;
    }
    if (p.includes('MED')) {
      return <span className="badge badge-amber" style={{ fontWeight: 800 }}>MEDIUM IMPACT</span>;
    }
    return <span className="badge badge-cyan" style={{ fontWeight: 800 }}>OPTIONAL</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Studio Header & Query Selector */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-amber">AI Project Improvement Studio</span>
              <span className="badge badge-purple">Multi-Priority Engine</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
              Elevate, Differentiate & Optimize Your Project
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              Get prioritized recommendations (High, Medium, Low) to turn an ordinary student assignment into a portfolio-defining capstone.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input
              type="text"
              className="input"
              value={projectTitle}
              placeholder="e.g. Smart Hospital Patient Monitor"
              onChange={(e) => setProjectTitle(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Project Summary / Current Features</label>
            <textarea
              className="textarea"
              style={{ minHeight: '60px' }}
              value={projectDesc}
              placeholder="Brief description of what your application currently does..."
              onChange={(e) => setProjectDesc(e.target.value)}
            />
          </div>
        </div>

        {/* Query Focus Selection Chips */}
        <div>
          <label className="form-label" style={{ marginBottom: '0.5rem' }}>
            Select Improvement Focus:
          </label>
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            {PRESET_QUERIES.map((q) => {
              const Icon = q.icon;
              const isSelected = selectedQueryType === q.id && !customQuestion;
              return (
                <button
                  key={q.id}
                  type="button"
                  className={`preset-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setCustomQuestion('');
                    handleSubmit(q.id);
                  }}
                  disabled={isLoading}
                >
                  <Icon size={14} />
                  <span>{q.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Question Input */}
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="input"
            placeholder="Or ask a custom question (e.g. 'How can I replace MongoDB with PostgreSQL and add caching?')"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit('custom');
              }
            }}
          />
          <button
            type="button"
            className="btn btn-primary flex items-center gap-2"
            onClick={() => handleSubmit('custom')}
            disabled={isLoading}
          >
            <Send size={15} />
            <span>{isLoading ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="pulse-dot" style={{ width: '16px', height: '16px', margin: '0 auto 1rem' }} />
          <h3>Project Improvement Agent is Analyzing...</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Evaluating architectural patterns, industry interview rubrics, and competitive differentiation.
          </p>
        </div>
      )}

      {/* Results List */}
      {!isLoading && improvements.length > 0 && (
        <div className="grid" style={{ gap: '1.25rem' }}>
          {improvements.map((imp) => {
            const isApplied = appliedIds.includes(imp.id);
            return (
              <div key={imp.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(imp.priority)}
                    <span className="badge badge-purple">{imp.category}</span>
                    <span className="badge" style={{ fontSize: '0.725rem' }}>Effort: {imp.difficultyToImplement}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApply(imp)}
                    className={`btn btn-sm ${isApplied ? 'btn-secondary' : 'btn-outline'}`}
                    disabled={isApplied}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 size={13} color="#10b981" />
                        <span>Applied to Plan</span>
                      </>
                    ) : (
                      <>
                        <Zap size={13} />
                        <span>Apply to Blueprint</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>{imp.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {imp.impactExplanation}
                  </p>
                </div>

                {/* Implementation Steps */}
                {imp.implementationSteps && imp.implementationSteps.length > 0 && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>
                      Recommended Action Steps:
                    </strong>
                    <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: 0 }}>
                      {imp.implementationSteps.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>›</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Code or Tech */}
                {imp.codeOrTechSuggestion && (
                  <div style={{ fontSize: '0.8rem', background: 'rgba(0, 0, 0, 0.25)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Recommended Tool/Pattern: </span>
                    <code style={{ color: '#38bdf8' }}>{imp.codeOrTechSuggestion}</code>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && improvements.length === 0 && (
        <div className="card text-center" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <Sparkles size={48} color="var(--accent-amber)" style={{ margin: '0 auto 1rem' }} />
          <h3>Ready to Polish Your Project</h3>
          <p style={{ maxWidth: '520px', margin: '0.5rem auto' }}>
            Choose one of the focus chips above (such as "Make this Unique" or "Add 5 High-Impact Features") to receive prioritized engineering upgrades.
          </p>
        </div>
      )}
    </div>
  );
}
