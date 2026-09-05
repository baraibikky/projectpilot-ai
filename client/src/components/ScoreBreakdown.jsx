import React from 'react';
import { Award, CheckCircle2, TrendingUp, Compass, Activity, Brain } from 'lucide-react';

export function ScoreBreakdown({ suitabilityScore, title }) {
  if (!suitabilityScore) return null;

  const {
    overall = 88,
    skillMatch = 85,
    interestMatch = 90,
    feasibility = 86,
    innovation = 92,
    careerRelevance = 94,
    complexity = 70
  } = suitabilityScore;

  const metrics = [
    { label: 'Technical Skill Match', val: skillMatch, color: '#6366f1', icon: CheckCircle2, desc: 'Alignment with your current languages and frameworks' },
    { label: 'Interest & Domain Fit', val: interestMatch, color: '#06b6d4', icon: Compass, desc: 'Alignment with your selected problem spaces' },
    { label: 'Feasibility in Timeline', val: feasibility, color: '#10b981', icon: Activity, desc: 'Likelihood of completing within designated duration' },
    { label: 'Innovation & Differentiation', val: innovation, color: '#a855f7', icon: Brain, desc: 'Uniqueness compared to standard university submissions' },
    { label: 'Resume & Career Value', val: careerRelevance, color: '#f59e0b', icon: TrendingUp, desc: 'Portfolio impact for target tech company interviews' },
    { label: 'Implementation Complexity', val: complexity, color: '#f43f5e', icon: Award, desc: 'Architectural depth and integration rigor' }
  ];

  return (
    <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.25)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
        <div className="flex items-center gap-2">
          <Award size={18} color="var(--accent-amber)" />
          <span style={{ fontWeight: 700, fontSize: '0.925rem' }}>AI Project Suitability Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {overall}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span>
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
        * Transparent multi-factor AI estimate calculated against your profile and stated project timeline.
      </p>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{m.label}</span>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: m.color }}>{m.val}%</span>
            </div>
            <div className="score-meter">
              <div className="score-fill" style={{ width: `${m.val}%`, background: m.color }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
              {m.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
