import React from 'react';
import { Scale, Check, X, Award, ArrowRight, Sparkles, Clock, Target } from 'lucide-react';

export function ComparisonView({
  comparedProjects = [],
  onRemoveFromCompare,
  onSelectProject,
  onClearCompare,
  studentProfile = {}
}) {
  if (comparedProjects.length === 0) {
    return (
      <div className="card text-center" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <Scale size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
        <h3>No Projects Selected for Comparison</h3>
        <p style={{ maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
          Go to the <strong>Recommendations</strong> tab and click the <strong>Compare</strong> button on 2 or more projects to evaluate them side-by-side.
        </p>
      </div>
    );
  }

  // Determine "Top Recommendation" (highest overall score)
  let topProject = comparedProjects[0];
  comparedProjects.forEach((p) => {
    if ((p.suitabilityScore?.overall || 0) > (topProject.suitabilityScore?.overall || 0)) {
      topProject = p;
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-purple">Decision Matrix</span>
              <span className="badge badge-cyan">{comparedProjects.length} Projects Selected</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
              Side-by-Side Project Comparison
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              Weigh trade-offs in difficulty, innovation, tech stack complexity, and alignment with your target role of <strong>{studentProfile.careerGoal || 'Software Engineer'}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onClearCompare}
            className="btn btn-secondary btn-sm"
          >
            Clear Comparison
          </button>
        </div>
      </div>

      {/* Side-by-Side Table / Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${comparedProjects.length}, minmax(320px, 1fr))`,
          gap: '1.5rem'
        }}>
          {comparedProjects.map((p) => {
            const isWinner = p.id === topProject.id;
            const score = p.suitabilityScore || {};
            const tech = p.recommendedTech || {};

            return (
              <div
                key={p.id}
                className={`card ${isWinner ? 'card-glowing' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderTop: isWinner ? '3px solid var(--accent-primary)' : '1px solid var(--border-subtle)'
                }}
              >
                {/* Winner Badge */}
                {isWinner && (
                  <div className="badge badge-purple flex items-center gap-1" style={{ alignSelf: 'flex-start' }}>
                    <Award size={13} />
                    <span>Top Career Match</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{p.title}</h3>
                  <button
                    type="button"
                    onClick={() => onRemoveFromCompare(p.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.2rem 0.4rem' }}
                    title="Remove from comparison"
                  >
                    <X size={15} />
                  </button>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '45px' }}>
                  {p.shortDescription}
                </p>

                {/* Score Summary */}
                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Suitability Match:</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--accent-emerald)' }}>
                      {score.overall || 88}%
                    </strong>
                  </div>
                  <div className="score-meter">
                    <div className="score-fill" style={{ width: `${score.overall || 88}%`, background: 'var(--primary-gradient)' }} />
                  </div>
                </div>

                {/* Attribute Comparison List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Difficulty:</span>
                    <span className="badge badge-amber">{p.difficulty}</span>
                  </div>

                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Estimated Time:</span>
                    <strong>{p.estimatedTime || '3 months'}</strong>
                  </div>

                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Team Mode:</span>
                    <span>{p.teamRecommendation || 'Individual'}</span>
                  </div>

                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Skill Match:</span>
                    <strong style={{ color: 'var(--accent-cyan)' }}>{score.skillMatch || 85}%</strong>
                  </div>

                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Innovation Score:</span>
                    <strong style={{ color: '#a855f7' }}>{score.innovation || 90}%</strong>
                  </div>

                  <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Feasibility:</span>
                    <strong style={{ color: '#10b981' }}>{score.feasibility || 88}%</strong>
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Recommended Stack:
                  </span>
                  <div className="flex items-center gap-1" style={{ flexWrap: 'wrap' }}>
                    {tech.frontend && <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{tech.frontend}</span>}
                    {tech.backend && <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{tech.backend}</span>}
                    {tech.database && <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>{tech.database}</span>}
                    {tech.aiMl && <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{tech.aiMl}</span>}
                  </div>
                </div>

                {/* Select CTA */}
                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => onSelectProject(p)}
                    className="btn btn-primary btn-sm flex items-center justify-center gap-2"
                    style={{ width: '100%' }}
                  >
                    <span>Choose This Project</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
