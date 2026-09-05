import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Trophy,
  Filter,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function RoadmapTracker({ roadmap, onUpdateRoadmap, projectTitle }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="card text-center" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <Clock size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
        <h3>No Roadmap Loaded</h3>
        <p style={{ maxWidth: '500px', margin: '0.5rem auto' }}>
          Select a project blueprint to automatically generate your 8-phase step-by-step development sprint roadmap.
        </p>
      </div>
    );
  }

  // Calculate statistics
  let totalTasks = 0;
  let completedTasks = 0;

  roadmap.forEach((phase) => {
    (phase.tasks || []).forEach((t) => {
      totalTasks += 1;
      if (t.completed) completedTasks += 1;
    });
  });

  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleTask = (phaseIdx, taskId) => {
    const updated = roadmap.map((phase, pIdx) => {
      if (pIdx !== phaseIdx) return phase;
      return {
        ...phase,
        tasks: phase.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const nextState = !t.completed;
          if (nextState) {
            // Trigger micro confetti
            confetti({
              particleCount: 25,
              spread: 60,
              origin: { y: 0.8 }
            });
          }
          return { ...t, completed: nextState };
        })
      };
    });

    onUpdateRoadmap(updated);

    // If reaches 100% complete
    const newCompleted = updated.reduce(
      (acc, p) => acc + p.tasks.filter((t) => t.completed).length,
      0
    );
    if (newCompleted === totalTasks && totalTasks > 0) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const handleMarkAllInPhase = (phaseIdx, completed) => {
    const updated = roadmap.map((phase, pIdx) => {
      if (pIdx !== phaseIdx) return phase;
      return {
        ...phase,
        tasks: phase.tasks.map((t) => ({ ...t, completed }))
      };
    });
    onUpdateRoadmap(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Roadmap Progress Summary Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald">8-Phase Development Roadmap</span>
              <span className="badge badge-cyan">{projectTitle || 'Capstone Project'}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
              Execution Roadmap & Sprint Milestones
            </h2>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: percentComplete === 100 ? '#10b981' : 'var(--accent-primary)' }}>
                {percentComplete}% Complete
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {completedTasks} of {totalTasks} tasks finished
              </span>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              background: percentComplete === 100 ? 'var(--success-gradient)' : 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
            }}>
              {percentComplete === 100 ? <Trophy size={24} /> : <Clock size={24} />}
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div style={{ marginTop: '1.25rem' }}>
          <div className="score-meter" style={{ height: '10px' }}>
            <div
              className="score-fill"
              style={{
                width: `${percentComplete}%`,
                background: percentComplete === 100 ? 'var(--success-gradient)' : 'var(--primary-gradient)'
              }}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="flex items-center gap-2">
            <Filter size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filter tasks:</span>
            <button
              type="button"
              className={`preset-chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({totalTasks})
            </button>
            <button
              type="button"
              className={`preset-chip ${filter === 'mvp' ? 'active' : ''}`}
              onClick={() => setFilter('mvp')}
            >
              Core MVP Only
            </button>
            <button
              type="button"
              className={`preset-chip ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({totalTasks - completedTasks})
            </button>
            <button
              type="button"
              className={`preset-chip ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({completedTasks})
            </button>
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            💡 Core MVP (Phases 1-4) should be completed and validated before expanding into advanced features.
          </span>
        </div>
      </div>

      {/* 8 Phases List */}
      <div className="grid" style={{ gap: '1.25rem' }}>
        {roadmap.map((phase, pIdx) => {
          if (filter === 'mvp' && phase.isCoreMvp === false) return null;

          const phaseTasks = (phase.tasks || []).filter((t) => {
            if (filter === 'pending') return !t.completed;
            if (filter === 'completed') return t.completed;
            return true;
          });

          if (phaseTasks.length === 0 && filter !== 'all' && filter !== 'mvp') return null;

          const phaseCompletedCount = (phase.tasks || []).filter((t) => t.completed).length;
          const isPhaseDone = phaseCompletedCount === (phase.tasks || []).length;
          const isCore = phase.isCoreMvp !== false && (phase.phaseNumber <= 4 || pIdx < 4);

          return (
            <div key={phase.phaseNumber || pIdx} className={`card ${isPhaseDone ? 'border-accent' : ''}`} style={{ padding: '1.5rem' }}>
              {/* Phase Header */}
              <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-full)',
                    background: isPhaseDone ? 'var(--accent-emerald)' : isCore ? 'var(--primary-gradient)' : 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#fff'
                  }}>
                    {isPhaseDone ? '✓' : phase.phaseNumber || pIdx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{phase.title}</h3>
                      {isCore ? (
                        <span className="badge badge-emerald" style={{ fontSize: '0.675rem', fontWeight: 800 }}>CORE MVP</span>
                      ) : (
                        <span className="badge badge-purple" style={{ fontSize: '0.675rem' }}>ADVANCED / POLISH</span>
                      )}
                      {phase.estimatedEffort && (
                        <span className="badge" style={{ fontSize: '0.675rem' }}>Effort: {phase.estimatedEffort}</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                      {phase.description}
                      {phase.dependencies && <span style={{ color: 'var(--text-accent)', marginLeft: '0.5rem' }}>• Prereq: {phase.dependencies}</span>}
                    </p>
                  </div>
                </div>

                {/* Phase completion button */}
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    {phaseCompletedCount}/{(phase.tasks || []).length} done
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMarkAllInPhase(pIdx, !isPhaseDone)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    {isPhaseDone ? 'Unmark Phase' : 'Complete Phase'}
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {phaseTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`task-item ${t.completed ? 'completed' : ''}`}
                    onClick={() => handleToggleTask(pIdx, t.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => {}} // handled by parent onClick
                      className="task-checkbox"
                    />

                    <div style={{ flex: 1 }}>
                      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <strong style={{
                          fontSize: '0.925rem',
                          color: t.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: t.completed ? 'line-through' : 'none'
                        }}>
                          {t.task}
                        </strong>
                        <div className="flex items-center gap-1">
                          {t.estimatedEffort && (
                            <span className="badge" style={{ fontSize: '0.675rem' }}>{t.estimatedEffort}</span>
                          )}
                          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                            {t.technology}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0 0 0.35rem 0' }}>
                        <strong>What to build:</strong> {t.whatToBuild}
                      </p>

                      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-muted)', background: 'rgba(0, 0, 0, 0.2)', padding: '0.35rem 0.65rem', borderRadius: '4px' }}>
                        <div>
                          <strong>Expected Output:</strong> {t.expectedOutput}
                        </div>
                        {t.dependencies && t.dependencies !== 'None' && (
                          <span style={{ color: 'var(--accent-amber)' }}>
                            Depends on: {t.dependencies}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
