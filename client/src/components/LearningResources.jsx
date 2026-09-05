import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ExternalLink,
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  HelpCircle,
  BarChart,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export function LearningResources({
  resources = [],
  activeProject,
  studentProfile,
  onFetchQuiz,
  quiz = [],
  analytics = null,
  isLoading
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const handleSelectOption = (questionId, optionIndex) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleQuizSubmit = () => {
    setIsQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
  };

  // Calculate score
  let score = 0;
  if (quiz.length > 0) {
    quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
  }
  const scorePercent = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Analytics Readiness Banner if available */}
      {analytics && (
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div className="flex items-center gap-2">
              <BarChart size={20} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Student Technical Readiness & Gap Analysis</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                {analytics.readinessScore}% Match Readiness
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {analytics.summary}
          </p>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <strong style={{ fontSize: '0.8rem', color: '#34d399', display: 'block', marginBottom: '0.35rem' }}>
                ✓ Matched Skills in Your Profile:
              </strong>
              <div className="flex items-center gap-1" style={{ flexWrap: 'wrap' }}>
                {(analytics.matchedSkills || []).map((s, idx) => (
                  <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              <strong style={{ fontSize: '0.8rem', color: '#fb7185', display: 'block', marginBottom: '0.35rem' }}>
                ⚠ Identified Skill Gaps to Ramp Up:
              </strong>
              <div className="flex items-center gap-1" style={{ flexWrap: 'wrap' }}>
                {(analytics.missingSkills || []).length > 0 ? (
                  analytics.missingSkills.map((s, idx) => (
                    <span key={idx} className="badge badge-rose" style={{ fontSize: '0.75rem' }}>{s}</span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No major skill gaps identified!</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Recommended Ramp-up Strategy:</strong> {analytics.recommendationAction} (Est. {analytics.estimatedHoursToLearnGaps || 0} hours)
          </div>
        </div>
      )}

      {/* Part 1: Verified IBM SkillsBuild & OER Educational Resources */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-purple">IBM SkillsBuild & OER</span>
              <span className="badge badge-cyan">Curated Learning</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
              Recommended Educational Curricula
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              Official credential tracks and open educational resources mapped to project technologies.
            </p>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {resources.map((res, idx) => (
            <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="flex items-center justify-between">
                <span className={`badge ${res.provider.includes('IBM') ? 'badge-cyan' : 'badge-purple'}`} style={{ fontWeight: 700 }}>
                  {res.provider}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.level}</span>
              </div>

              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{res.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {res.description}
              </p>

              <div className="flex items-center gap-1" style={{ flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.5rem' }}>
                {(res.tags || []).map((tag) => (
                  <span key={tag} className="badge" style={{ fontSize: '0.7rem' }}>#{tag}</span>
                ))}
              </div>

              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm flex items-center justify-center gap-2"
                  style={{ width: '100%' }}
                >
                  <span>Explore Course & Badge</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Interactive Automated Assessment Agent (Skill Checkpoint Quiz) */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald">Automated Assessment Agent</span>
              <span className="badge badge-amber">Pre-Flight Checkpoint</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
              Project Technology Diagnostic Quiz
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              Validate your foundational understanding of key technologies before embarking on Phase 1 development.
            </p>
          </div>

          <button
            type="button"
            onClick={onFetchQuiz}
            className="btn btn-secondary btn-sm flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw size={13} />
            <span>Generate New Questions</span>
          </button>
        </div>

        {/* Quiz Questions */}
        {quiz.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {quiz.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              const hasAnswered = selectedOpt !== undefined;

              return (
                <div key={q.id} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple" style={{ minWidth: '24px', justifyContent: 'center' }}>
                      Q{qIdx + 1}
                    </span>
                    <strong style={{ fontSize: '0.95rem' }}>{q.question}</strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '2rem' }}>
                    {(q.options || []).map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      let optBg = 'rgba(255, 255, 255, 0.03)';
                      let optBorder = 'var(--border-subtle)';

                      if (isQuizSubmitted) {
                        if (isCorrect) {
                          optBg = 'rgba(16, 185, 129, 0.15)';
                          optBorder = 'var(--accent-emerald)';
                        } else if (isSelected && !isCorrect) {
                          optBg = 'rgba(244, 63, 94, 0.15)';
                          optBorder = 'var(--accent-rose)';
                        }
                      } else if (isSelected) {
                        optBg = 'rgba(99, 102, 241, 0.15)';
                        optBorder = 'var(--accent-primary)';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          style={{
                            padding: '0.65rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            background: optBg,
                            border: `1px solid ${optBorder}`,
                            cursor: isQuizSubmitted ? 'default' : 'pointer',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{opt}</span>
                          {isQuizSubmitted && isCorrect && <CheckCircle size={15} color="#10b981" />}
                          {isQuizSubmitted && isSelected && !isCorrect && <XCircle size={15} color="#f43f5e" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {isQuizSubmitted && q.explanation && (
                    <div style={{ marginTop: '0.75rem', padding: '0.65rem 1rem', background: 'rgba(0, 0, 0, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                      <strong style={{ color: 'var(--text-accent)' }}>Explanation: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quiz Action / Results */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              {!isQuizSubmitted ? (
                <button
                  type="button"
                  onClick={handleQuizSubmit}
                  className="btn btn-primary"
                  disabled={Object.keys(selectedAnswers).length < quiz.length}
                >
                  <span>Submit Diagnostic Checkpoint ({Object.keys(selectedAnswers).length}/{quiz.length} Answered)</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="badge badge-emerald" style={{ fontSize: '0.9rem', padding: '0.45rem 0.85rem' }}>
                    Score: {score}/{quiz.length} ({scorePercent}%)
                  </div>
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="btn btn-secondary btn-sm"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Click 'Generate New Questions' to load technology checkpoint quiz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
