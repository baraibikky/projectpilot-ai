import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  Cpu,
  Layers,
  CheckCircle,
  HelpCircle,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Scale
} from 'lucide-react';
import { ScoreBreakdown } from './ScoreBreakdown';

export function ProjectCard({
  project,
  isSelected,
  onSelect,
  onCompareToggle,
  isCompared,
  onAskMentor
}) {
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  const getDifficultyBadgeClass = (diff) => {
    switch ((diff || '').toLowerCase()) {
      case 'beginner': return 'badge-emerald';
      case 'advanced': return 'badge-rose';
      default: return 'badge-amber';
    }
  };

  const tech = project.recommendedTech || {};

  return (
    <div className={`card ${isSelected ? 'card-glowing' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.65rem' }}>
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            <span className={`badge ${getDifficultyBadgeClass(project.difficulty)}`}>
              {project.difficulty || 'Intermediate'}
            </span>
            <span className="badge badge-cyan flex items-center gap-1">
              <Clock size={12} />
              <span>{project.estimatedTime || '10-12 weeks'}</span>
            </span>
            {project.teamRecommendation && (
              <span className="badge badge-purple">
                {project.teamRecommendation}
              </span>
            )}
          </div>

          {/* Suitability Badge / Score trigger */}
          {project.suitabilityScore && (
            <button
              type="button"
              onClick={() => setShowScoreDetails(!showScoreDetails)}
              className="badge badge-emerald flex items-center gap-1"
              style={{ cursor: 'pointer', padding: '0.3rem 0.65rem', border: '1px solid var(--accent-emerald)' }}
              title="Click to toggle detailed suitability score breakdown"
            >
              <BarChart2 size={13} />
              <span>Match: {project.suitabilityScore.overall || 90}%</span>
              {showScoreDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
          {project.title}
        </h3>

        <p style={{ fontSize: '0.925rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
          {project.shortDescription}
        </p>
      </div>

      {/* Problem Statement Callout */}
      <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderLeft: '3px solid var(--accent-cyan)', padding: '0.75rem 1rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.2rem' }}>
          Problem Being Solved:
        </span>
        <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-primary)' }}>
          {project.problemStatement}
        </p>
      </div>

      {/* Why this matches you */}
      <div style={{ background: 'rgba(99, 102, 241, 0.06)', borderLeft: '3px solid var(--accent-primary)', padding: '0.75rem 1rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)', display: 'block', marginBottom: '0.2rem' }}>
          Why This Idea Matches Your Profile:
        </span>
        <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-primary)' }}>
          {project.whyMatch}
        </p>
      </div>

      {/* Innovation & Scalability pills */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--accent-purple)', fontWeight: 700, display: 'block' }}>
            ★ Key Innovation:
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {project.innovation}
          </span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--accent-amber)', fontWeight: 700, display: 'block' }}>
            💼 Career Impact:
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {project.careerRelevance}
          </span>
        </div>
      </div>

      {/* Recommended Tech Stack Badges */}
      <div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>
          Recommended Architecture Stack:
        </span>
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          {tech.frontend && <span className="badge badge-cyan" title="Frontend">{tech.frontend}</span>}
          {tech.backend && <span className="badge badge-purple" title="Backend">{tech.backend}</span>}
          {tech.database && <span className="badge badge-amber" title="Database">{tech.database}</span>}
          {tech.aiMl && <span className="badge badge-emerald" title="AI / ML">{tech.aiMl}</span>}
          {tech.devops && <span className="badge" title="DevOps">{tech.devops}</span>}
        </div>
      </div>

      {/* Collapsible Score Breakdown */}
      {showScoreDetails && (
        <ScoreBreakdown suitabilityScore={project.suitabilityScore} title={project.title} />
      )}

      {/* Action Buttons Footer */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="flex items-center gap-2">
          {/* Add to Compare */}
          <button
            type="button"
            onClick={() => onCompareToggle(project)}
            className={`btn btn-sm ${isCompared ? 'btn-accent' : 'btn-secondary'}`}
            title={isCompared ? 'Remove from comparison' : 'Compare with other projects'}
          >
            <Scale size={14} />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          {/* Ask Mentor */}
          <button
            type="button"
            onClick={() => onAskMentor(project)}
            className="btn btn-ghost btn-sm flex items-center gap-1"
            title="Ask AI Mentor about this project"
          >
            <Sparkles size={14} color="var(--accent-primary)" />
            <span>Ask Mentor</span>
          </button>
        </div>

        {/* Explore Blueprint CTA */}
        <button
          type="button"
          onClick={() => onSelect(project)}
          className={`btn btn-sm ${isSelected ? 'btn-secondary' : 'btn-primary'} flex items-center gap-2`}
        >
          <span>{isSelected ? 'Viewing Blueprint' : 'Generate Full Blueprint'}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
