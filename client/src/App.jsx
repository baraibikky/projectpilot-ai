import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Clock,
  Zap,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { StudentProfileForm } from './components/StudentProfileForm';
import { ProjectCard } from './components/ProjectCard';
import { BlueprintViewer } from './components/BlueprintViewer';
import { RoadmapTracker } from './components/RoadmapTracker';
import { ImprovementStudio } from './components/ImprovementStudio';
import { LearningResources } from './components/LearningResources';
import { MentorChat } from './components/MentorChat';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AiBuilderWorkspace } from './components/AiBuilderWorkspace';

// The 4 steps of the wizard
const WIZARD_STEPS = [
  { id: 'ideas', icon: <Sparkles size={15} />, label: 'Ideas' },
  { id: 'blueprint', icon: <FileText size={15} />, label: 'Blueprint' },
  { id: 'roadmap', icon: <Clock size={15} />, label: 'Roadmap' },
  { id: 'improve', icon: <Zap size={15} />, label: 'Improve' },
];

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('projectpilot_theme') || 'dark');
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem('projectpilot_gemini_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState('AI Engine Ready');

  // Top-level: 'main' | 'builder' | 'learning'
  const [activeApp, setActiveApp] = useState('main');

  // Wizard step: 'ideas' | 'blueprint' | 'roadmap' | 'improve'
  const [activeStep, setActiveStep] = useState('ideas');

  // Profile
  const [profile, setProfile] = useState({
    skills: ['Python', 'React', 'SQL'],
    languages: ['Python'],
    technologies: ['FastAPI', 'Docker', 'PostgreSQL'],
    interests: ['Artificial Intelligence', 'Web Development'],
    domain: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    projectType: 'Individual',
    duration: '3 months',
    preferredType: 'Machine Learning / Data Science',
    careerGoal: 'Software Engineer',
    description: ''
  });

  const [presets, setPresets] = useState([]);
  const [domains, setDomains] = useState([]);

  // Data
  const [recommendations, setRecommendations] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [blueprint, setBlueprint] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Mentor
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [mentorMessages, setMentorMessages] = useState([]);

  // Loading
  const [loadingState, setLoadingState] = useState({
    recommendations: false,
    blueprint: false,
    roadmap: false,
    improvements: false,
    mentor: false,
  });

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('projectpilot_theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => { if (d.status === 'online') setAiStatus(d.aiProvider); })
      .catch(() => setAiStatus('Fallback Active'));

    fetch('/api/domains')
      .then(r => r.json())
      .then(d => {
        if (d.domains) setDomains(d.domains);
        if (d.presets) setPresets(d.presets);
      });

    fetch('/api/learning')
      .then(r => r.json())
      .then(d => { if (d.resources) setLearningResources(d.resources); });
  }, []);

  const getHeaders = () => {
    const h = { 'Content-Type': 'application/json' };
    if (userApiKey) h['x-gemini-api-key'] = userApiKey;
    return h;
  };

  // Generate recommendations
  const handleGenerateRecommendations = async () => {
    setLoadingState(p => ({ ...p, recommendations: true }));
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST', headers: getHeaders(), body: JSON.stringify({ profile })
      });
      const data = await res.json();
      if (data.success && data.projects) {
        setRecommendations(data.projects);
        showToast(`Generated ${data.projects.length} personalized project ideas!`, 'success');
      }
    } catch {
      showToast('Network error while generating recommendations.', 'error');
    } finally {
      setLoadingState(p => ({ ...p, recommendations: false }));
    }
  };

  // Select project and load blueprint + roadmap
  const handleSelectProject = async (proj) => {
    setSelectedProject(proj);
    setActiveStep('blueprint');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoadingState(p => ({ ...p, blueprint: true, roadmap: true }));

    try {
      const [bpRes, rmRes, anRes] = await Promise.all([
        fetch('/api/blueprint', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ project: proj, profile }) }),
        fetch('/api/roadmap', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ project: proj }) }),
        fetch('/api/analytics', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ project: proj, profile }) }),
      ]);
      const [bpData, rmData, anData] = await Promise.all([bpRes.json(), rmRes.json(), anRes.json()]);

      if (bpData.blueprint) setBlueprint(bpData.blueprint);
      if (rmData.roadmap) setRoadmap(rmData.roadmap);
      if (anData.analytics) setAnalytics(anData.analytics);

      setMentorMessages([{
        role: 'mentor',
        text: `👋 Hi! I'm your AI mentor for **${proj.title}**.\n\nI've loaded your blueprint and roadmap. Ask me anything — architecture questions, viva prep, how to simplify the scope, etc.`
      }]);

      handleFetchQuiz(proj);
      showToast(`Blueprint loaded for "${proj.title}"!`, 'success');
    } catch {
      showToast('Failed to load blueprint. Please try again.', 'error');
    } finally {
      setLoadingState(p => ({ ...p, blueprint: false, roadmap: false }));
    }
  };

  // Improvements
  const handleRunImprovement = async (payload) => {
    setLoadingState(p => ({ ...p, improvements: true }));
    try {
      const res = await fetch('/api/improve', { method: 'POST', headers: getHeaders(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.improvements) {
        setImprovements(data.improvements);
        showToast(`Generated ${data.improvements.length} improvement suggestions!`, 'success');
      }
    } catch {
      showToast('Failed to generate improvements.', 'error');
    } finally {
      setLoadingState(p => ({ ...p, improvements: false }));
    }
  };

  const handleApplyImprovement = (imp) => {
    if (!blueprint) return;
    setBlueprint(prev => ({
      ...prev,
      advancedFeatures: [...(prev.advancedFeatures || []), {
        title: imp.title,
        description: imp.impactExplanation,
        priority: imp.priority === 'HIGH IMPACT' ? 'P1' : 'P2'
      }]
    }));
    showToast(`Injected "${imp.title}" into your blueprint!`, 'success');
  };

  // Mentor chat
  const handleMentorSendMessage = async (text) => {
    setMentorMessages(p => [...p, { role: 'user', text }]);
    setLoadingState(p => ({ ...p, mentor: true }));
    try {
      const res = await fetch('/api/mentor', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ message: text, history: mentorMessages, activeProject: selectedProject, studentProfile: profile })
      });
      const data = await res.json();
      if (data.reply) setMentorMessages(p => [...p, { role: 'mentor', text: data.reply }]);
    } catch {
      setMentorMessages(p => [...p, { role: 'mentor', text: 'Sorry, there was an error. Please try again!' }]);
    } finally {
      setLoadingState(p => ({ ...p, mentor: false }));
    }
  };

  const handleFetchQuiz = async (proj = selectedProject) => {
    try {
      const techs = [profile.skills?.[0] || 'Python', profile.skills?.[1] || 'React', 'AI/ML'];
      const res = await fetch('/api/quiz', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ technologies: techs }) });
      const data = await res.json();
      if (data.quiz) setQuizQuestions(data.quiz);
    } catch { /* quiz is optional */ }
  };

  // Load recommendations on mount
  useEffect(() => { handleGenerateRecommendations(); }, []);

  const stepIndex = WIZARD_STEPS.findIndex(s => s.id === activeStep);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        aiStatus={aiStatus}
        hasUserApiKey={Boolean(userApiKey)}
        activeApp={activeApp}
        onSwitchApp={setActiveApp}
      />

      {/* ── MAIN PROJECT PILOT ──────────────────────────────────────────────── */}
      {activeApp === 'main' && (
        <main className="container" style={{ flex: 1, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* Hero */}
          <section style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={13} /> AI Project Mentor
            </span>
            <h1 style={{ marginBottom: '0.75rem', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>
              Build Your Perfect{' '}
              <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Final-Year Project
              </span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Fill in 4 fields → get personalized project ideas → receive a full blueprint, roadmap & AI mentorship.
            </p>
          </section>

          {/* Wizard step progress bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0', maxWidth: '600px', margin: '0 auto', width: '100%'
          }}>
            {WIZARD_STEPS.map((step, i) => {
              const isCompleted = i < stepIndex;
              const isActive = i === stepIndex;
              const isLocked = i > stepIndex && !selectedProject && i > 1;
              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isLocked) setActiveStep(step.id);
                    }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                      background: 'none', border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer',
                      padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)',
                      opacity: isLocked ? 0.4 : 1,
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isCompleted ? 'var(--accent-emerald)' : isActive ? 'var(--primary-gradient)' : 'var(--bg-card)',
                      border: isActive ? '2px solid var(--accent-primary)' : isCompleted ? 'none' : '1px solid var(--border-subtle)',
                      color: isCompleted || isActive ? '#fff' : 'var(--text-muted)',
                      boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                      transition: 'all 0.2s'
                    }}>
                      {isCompleted ? <CheckCircle2 size={16} /> : step.icon}
                    </div>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--text-accent)' : isCompleted ? 'var(--accent-emerald)' : 'var(--text-muted)'
                    }}>
                      {step.label}
                    </span>
                  </button>
                  {i < WIZARD_STEPS.length - 1 && (
                    <div style={{
                      flex: 1, height: '2px', maxWidth: '60px',
                      background: i < stepIndex ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                      transition: 'background 0.3s'
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Selected project pill */}
          {selectedProject && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              width: 'fit-content', margin: '0 auto', fontSize: '0.8rem'
            }}>
              <CheckCircle2 size={14} color="var(--accent-emerald)" />
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Active:</span>
              <span style={{ color: 'var(--text-secondary)' }}>{selectedProject.title}</span>
            </div>
          )}

          {/* ─ Step 1: Ideas ─────────────────────────────────────────────────── */}
          {activeStep === 'ideas' && (
            <div>
              <StudentProfileForm
                profile={profile}
                onChange={setProfile}
                onApplyPreset={p => { setProfile(p); showToast('Preset applied! Click Generate to refresh.', 'info'); }}
                onSubmit={handleGenerateRecommendations}
                isLoading={loadingState.recommendations}
                presets={presets}
                domains={domains}
              />

              {/* Project Cards */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>
                      {recommendations.length > 0 ? 'Your Personalized Project Ideas' : 'Project Ideas'}
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Click a card to select it and unlock the Blueprint & Roadmap
                    </p>
                  </div>
                </div>

                {loadingState.recommendations ? (
                  <div className="card text-center" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                    <div className="pulse-dot" style={{ width: '20px', height: '20px', margin: '0 auto 1.25rem' }} />
                    <h3>Crafting personalized ideas for you...</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '380px', margin: '0.5rem auto 0' }}>
                      Matching your skills with high-impact project domains
                    </p>
                  </div>
                ) : (
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {recommendations.map(proj => (
                      <ProjectCard
                        key={proj.id}
                        project={proj}
                        isSelected={selectedProject?.id === proj.id}
                        onSelect={p => handleSelectProject(p)}
                        onCompareToggle={() => {}}
                        isCompared={false}
                        onAskMentor={p => {
                          setSelectedProject(p);
                          setIsMentorOpen(true);
                          handleMentorSendMessage(`Tell me why "${p.title}" is a great project choice for my portfolio`);
                        }}
                      />
                    ))}
                  </div>
                )}

                {recommendations.length > 0 && !selectedProject && (
                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      👆 Click any project card to select it and get the full Blueprint + Roadmap
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─ Step 2: Blueprint ────────────────────────────────────────────── */}
          {activeStep === 'blueprint' && (
            <div>
              {!selectedProject ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <h3 style={{ marginBottom: '0.75rem' }}>No project selected</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Go back to Ideas and click a project card to generate its blueprint.</p>
                  <button className="btn btn-primary" onClick={() => setActiveStep('ideas')}>← Back to Ideas</button>
                </div>
              ) : (
                <BlueprintViewer
                  project={selectedProject}
                  blueprint={blueprint}
                  onOpenRoadmap={() => setActiveStep('roadmap')}
                  onOpenImprovement={() => setActiveStep('improve')}
                />
              )}
            </div>
          )}

          {/* ─ Step 3: Roadmap ──────────────────────────────────────────────── */}
          {activeStep === 'roadmap' && (
            <div>
              {!selectedProject ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <h3 style={{ marginBottom: '0.75rem' }}>No project selected</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select a project idea first to see its development roadmap.</p>
                  <button className="btn btn-primary" onClick={() => setActiveStep('ideas')}>← Back to Ideas</button>
                </div>
              ) : (
                <RoadmapTracker
                  roadmap={roadmap}
                  onUpdateRoadmap={setRoadmap}
                  projectTitle={selectedProject?.title}
                />
              )}
            </div>
          )}

          {/* ─ Step 4: Improve ──────────────────────────────────────────────── */}
          {activeStep === 'improve' && (
            <div>
              <ImprovementStudio
                activeProject={selectedProject}
                onRunImprovement={handleRunImprovement}
                improvements={improvements}
                isLoading={loadingState.improvements}
                onApplyImprovement={handleApplyImprovement}
              />

              {/* Bonus: Learning Resources + Quiz inline */}
              {selectedProject && (
                <div style={{ marginTop: '2rem' }}>
                  <LearningResources
                    resources={learningResources}
                    activeProject={selectedProject}
                    studentProfile={profile}
                    onFetchQuiz={() => handleFetchQuiz(selectedProject)}
                    quiz={quizQuestions}
                    analytics={analytics}
                    isLoading={false}
                  />
                </div>
              )}
            </div>
          )}

        </main>
      )}

      {/* ── AI BUILDER ──────────────────────────────────────────────────────── */}
      {activeApp === 'builder' && (
        <main className="container" style={{ flex: 1, padding: '1.5rem 1.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
          <AiBuilderWorkspace />
        </main>
      )}

      {/* Floating Mentor Button */}
      {!isMentorOpen && activeApp === 'main' && (
        <button
          type="button"
          className="mentor-toggle-btn"
          onClick={() => setIsMentorOpen(true)}
          aria-label="Open AI Project Mentor"
          title="Open AI Project Mentor Chat"
        >
          <MessageSquare size={26} />
        </button>
      )}

      {/* Mentor Chat Drawer */}
      <MentorChat
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        activeProject={selectedProject}
        studentProfile={profile}
        onSendMessage={handleMentorSendMessage}
        messages={mentorMessages}
        isLoading={loadingState.mentor}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={userApiKey}
        onSaveKey={newKey => {
          setUserApiKey(newKey);
          if (newKey) {
            localStorage.setItem('projectpilot_gemini_key', newKey);
            showToast('Gemini API Key saved!', 'success');
          } else {
            localStorage.removeItem('projectpilot_gemini_key');
            showToast('Reset to Fallback Engine.', 'info');
          }
        }}
      />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 300,
          background: toast.type === 'error' ? 'var(--accent-rose)' : toast.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-primary)',
          color: '#fff', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)', fontSize: '0.875rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideUp 0.25s ease'
        }}>
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.4)', padding: '1.25rem 0', marginTop: 'auto' }}>
        <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ProjectPilot AI</span>
            <span>• Empowering final-year engineers with AI-powered project architecture</span>
          </div>
          <span>React · Vite · Node.js · Google Gemini</span>
        </div>
      </footer>
    </div>
  );
}
