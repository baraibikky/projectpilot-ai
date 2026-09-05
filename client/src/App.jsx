import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  FileText,
  Clock,
  Zap,
  Scale,
  GraduationCap,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { StudentProfileForm } from './components/StudentProfileForm';
import { ProjectCard } from './components/ProjectCard';
import { BlueprintViewer } from './components/BlueprintViewer';
import { RoadmapTracker } from './components/RoadmapTracker';
import { ImprovementStudio } from './components/ImprovementStudio';
import { ComparisonView } from './components/ComparisonView';
import { LearningResources } from './components/LearningResources';
import { MentorChat } from './components/MentorChat';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AttendanceApp } from './components/AttendanceApp';
import { VoiceLensOrchestrator } from './components/VoiceLensOrchestrator';
import { AiBuilderWorkspace } from './components/AiBuilderWorkspace';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('projectpilot_theme') || 'dark');
  
  // Custom API Key in browser
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem('projectpilot_gemini_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState('AI Engine Ready');

  // Top-level app: 'projectpilot' | 'attendance'
  const [activeApp, setActiveApp] = useState('projectpilot');

  // Attendance auth
  const [attendanceUser, setAttendanceUser] = useState(() => sessionStorage.getItem('att_user') || null);
  const [voiceResult, setVoiceResult] = useState(null);

  // Navigation tab
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'blueprint' | 'roadmap' | 'improve' | 'compare' | 'learning'

  // Student Profile state
  const [profile, setProfile] = useState({
    skills: ['Python', 'SQL', 'FastAPI', 'PyTorch'],
    languages: ['Python', 'SQL'],
    technologies: ['FastAPI', 'Docker', 'PostgreSQL'],
    interests: ['Artificial Intelligence', 'Healthcare', 'Computer Vision'],
    domain: 'Healthcare & Medical Tech',
    difficulty: 'Intermediate',
    projectType: 'Individual',
    duration: '3 months',
    preferredType: 'Machine Learning / Data Science',
    careerGoal: 'ML Engineer',
    description: 'An AI-assisted diagnostic assistant that flags early signs of retinal disease from scans with patient management.'
  });

  const [presets, setPresets] = useState([]);
  const [domains, setDomains] = useState([]);

  // Projects & Blueprints
  const [recommendations, setRecommendations] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [blueprint, setBlueprint] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [comparedProjects, setComparedProjects] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Mentor Chat state
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [mentorMessages, setMentorMessages] = useState([]);

  // Loading indicators
  const [loadingState, setLoadingState] = useState({
    recommendations: false,
    blueprint: false,
    roadmap: false,
    improvements: false,
    mentor: false,
    learning: false
  });

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('projectpilot_theme', theme);
  }, [theme]);

  // Initial load: Fetch seed data & health check
  useEffect(() => {
    // Health check
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'online') {
          setAiStatus(data.aiProvider);
        }
      })
      .catch(() => setAiStatus('Offline / Fallback Active'));

    // Domains & Presets
    fetch('/api/domains')
      .then((r) => r.json())
      .then((data) => {
        if (data.domains) setDomains(data.domains);
        if (data.presets) setPresets(data.presets);
      })
      .catch((e) => console.error('Failed to load domains:', e));

    // Learning resources
    fetch('/api/learning')
      .then((r) => r.json())
      .then((data) => {
        if (data.resources) setLearningResources(data.resources);
      })
      .catch((e) => console.error('Failed to load learning resources:', e));
  }, []);

  // Helper for authenticated API calls
  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    if (userApiKey) {
      headers['x-gemini-api-key'] = userApiKey;
    }
    return headers;
  };

  // 1. Generate Recommendations
  const handleGenerateRecommendations = async () => {
    setLoadingState((prev) => ({ ...prev, recommendations: true }));
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ profile })
      });
      const data = await res.json();
      if (data.success && data.projects) {
        setRecommendations(data.projects);
        showToast(`Generated ${data.projects.length} personalized project ideas!`, 'success');
        
        // Auto-select first project for seamless journey
        if (!selectedProject && data.projects.length > 0) {
          handleSelectProject(data.projects[0], false);
        }
      } else {
        showToast('Could not generate projects. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while generating recommendations.', 'error');
    } finally {
      setLoadingState((prev) => ({ ...prev, recommendations: false }));
    }
  };

  // 2. Select Project & Load Full 20-Aspect Blueprint + Roadmap
  const handleSelectProject = async (proj, switchTab = true) => {
    setSelectedProject(proj);
    setLoadingState((prev) => ({ ...prev, blueprint: true, roadmap: true }));

    if (switchTab) {
      setActiveTab('blueprint');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    try {
      // Parallel requests for Blueprint, Roadmap, and Analytics
      const [bpRes, rmRes, anRes] = await Promise.all([
        fetch('/api/blueprint', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ project: proj, profile })
        }),
        fetch('/api/roadmap', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ project: proj })
        }),
        fetch('/api/analytics', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ project: proj, profile })
        })
      ]);

      const bpData = await bpRes.json();
      const rmData = await rmRes.json();
      const anData = await anRes.json();

      if (bpData.blueprint) setBlueprint(bpData.blueprint);
      if (rmData.roadmap) setRoadmap(rmData.roadmap);
      if (anData.analytics) setAnalytics(anData.analytics);

      // Initialize mentor welcome message with context
      setMentorMessages([
        {
          role: 'mentor',
          text: `👋 Hello! I am your AI Project Mentor for **${proj.title}**.\n\nI have loaded your complete architectural blueprint and technical roadmap into my active memory. How can I help you today? You can use the quick chips below or ask me anything!`
        }
      ]);

      // Preload diagnostic quiz
      handleFetchQuiz(proj);

      if (switchTab) {
        showToast(`Loaded full 20-aspect blueprint for "${proj.title}"!`, 'success');
      }
    } catch (err) {
      console.error('Error loading blueprint:', err);
      showToast('Failed to load blueprint details.', 'error');
    } finally {
      setLoadingState((prev) => ({ ...prev, blueprint: false, roadmap: false }));
    }
  };

  // 3. Compare Toggle
  const handleCompareToggle = (proj) => {
    setComparedProjects((prev) => {
      const exists = prev.some((p) => p.id === proj.id);
      if (exists) {
        showToast(`Removed "${proj.title}" from comparison.`, 'info');
        return prev.filter((p) => p.id !== proj.id);
      } else {
        if (prev.length >= 3) {
          showToast('You can compare up to 3 projects at once.', 'warning');
          return prev;
        }
        showToast(`Added "${proj.title}" to comparison matrix.`, 'success');
        return [...prev, proj];
      }
    });
  };

  // 4. Run Improvement Agent
  const handleRunImprovement = async (payload) => {
    setLoadingState((prev) => ({ ...prev, improvements: true }));
    try {
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.improvements) {
        setImprovements(data.improvements);
        showToast(`Synthesized ${data.improvements.length} prioritized improvements!`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to generate improvements.', 'error');
    } finally {
      setLoadingState((prev) => ({ ...prev, improvements: false }));
    }
  };

  // 5. Apply Improvement to Blueprint
  const handleApplyImprovement = (imp) => {
    if (!blueprint) return;
    setBlueprint((prev) => ({
      ...prev,
      advancedFeatures: [
        ...(prev.advancedFeatures || []),
        {
          title: imp.title,
          description: imp.impactExplanation,
          priority: imp.priority === 'HIGH' ? 'P1' : 'P2'
        }
      ]
    }));
    showToast(`Injected "${imp.title}" into active project blueprint!`, 'success');
  };

  // 6. Mentor Chat Send Message
  const handleMentorSendMessage = async (text) => {
    const userMsg = { role: 'user', text };
    setMentorMessages((prev) => [...prev, userMsg]);
    setLoadingState((prev) => ({ ...prev, mentor: true }));

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          message: text,
          history: mentorMessages,
          activeProject: selectedProject,
          studentProfile: profile
        })
      });
      const data = await res.json();
      if (data.reply) {
        setMentorMessages((prev) => [...prev, { role: 'mentor', text: data.reply }]);
      }
    } catch (err) {
      console.error('Mentor chat error:', err);
      setMentorMessages((prev) => [
        ...prev,
        { role: 'mentor', text: 'Sorry, I encountered an issue generating a response. Please try again!' }
      ]);
    } finally {
      setLoadingState((prev) => ({ ...prev, mentor: false }));
    }
  };

  // 7. Diagnostic Quiz Fetch
  const handleFetchQuiz = async (proj = selectedProject) => {
    try {
      const techs = [
        profile.skills?.[0] || 'Python',
        profile.languages?.[0] || 'SQL',
        'AI/ML',
        'React'
      ];
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ technologies: techs })
      });
      const data = await res.json();
      if (data.quiz) {
        setQuizQuestions(data.quiz);
      }
    } catch (e) {
      console.error('Failed to load quiz:', e);
    }
  };

  // Initial trigger of recommendations on first mount
  useEffect(() => {
    handleGenerateRecommendations();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        aiStatus={aiStatus}
        hasUserApiKey={Boolean(userApiKey)}
      />

      {/* Platform App Switcher */}
      <div style={{
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)',
        padding: '0.4rem 1.5rem', display: 'flex', gap: '0.25rem', alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Apps:</span>
        <button
          id="app-switch-projectpilot"
          onClick={() => setActiveApp('projectpilot')}
          style={{
            padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
            fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s',
            background: activeApp === 'projectpilot' ? 'var(--primary-gradient)' : 'transparent',
            color: activeApp === 'projectpilot' ? '#fff' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <Sparkles size={13} /> ProjectPilot AI
        </button>
        <button
          id="app-switch-attendance"
          onClick={() => setActiveApp('attendance')}
          style={{
            padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
            fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s',
            background: activeApp === 'attendance' ? 'var(--secondary-gradient)' : 'transparent',
            color: activeApp === 'attendance' ? '#fff' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <CheckSquare size={13} /> Attendance
        </button>
        <button
          id="app-switch-builder"
          onClick={() => setActiveApp('builder')}
          style={{
            padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
            fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s',
            background: activeApp === 'builder' ? 'var(--cyber-gradient)' : 'transparent',
            color: activeApp === 'builder' ? '#fff' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <Layers size={13} /> AI Builder
        </button>
      </div>

      {/* ── ATTENDANCE APP ─────────────────────────────────────────────────── */}
      {activeApp === 'attendance' && (
        attendanceUser ? (
          <div style={{ flex: 1 }}>
            <AttendanceApp
              user={attendanceUser}
              onLogout={() => { sessionStorage.removeItem('att_user'); setAttendanceUser(null); }}
              voiceResult={voiceResult}
            />
            {/* Platform-wide VoiceLensOrchestrator in attendance context */}
            <VoiceLensOrchestrator
              appContext="attendance"
              onVoiceCommand={({ result }) => setVoiceResult(result)}
              onLensAnalysis={({ instruction }) => {
                // Display in a toast-like alert
                alert('📷 Lens Analysis:\n\n' + instruction);
              }}
            />
          </div>
        ) : (
          // Inline login
          (() => {
            const { LoginScreen } = (() => {
              // Inline mini login since LoginScreen is not exported separately
              function LS({ onLogin }) {
                const [pw, setPw] = React.useState('');
                const [err, setErr] = React.useState('');
                const submit = (e) => {
                  e.preventDefault();
                  if (pw === 'admin123' || pw === 'demo') {
                    sessionStorage.setItem('att_user', 'Admin');
                    onLogin('Admin');
                  } else {
                    setErr('Use "admin123" or "demo"');
                  }
                };
                return (
                  <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ maxWidth: 380, width: '100%', padding: '2.5rem', margin: '2rem auto' }}>
                      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--secondary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(6,182,212,0.3)' }}>
                          <CheckSquare size={26} color="#fff" />
                        </div>
                        <h2>Attendance Portal</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Sign in to manage student attendance</p>
                      </div>
                      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input className="input" type="password" placeholder='Password: admin123 or demo' value={pw} onChange={e => { setPw(e.target.value); setErr(''); }} autoFocus />
                        {err && <div style={{ color: 'var(--accent-rose)', fontSize: '0.8rem' }}>⚠ {err}</div>}
                        <button type="submit" className="btn btn-primary">Sign In</button>
                        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hint: <code>admin123</code></p>
                      </form>
                    </div>
                  </div>
                );
              }
              return { LoginScreen: LS };
            })();
            return <LoginScreen onLogin={(u) => setAttendanceUser(u)} />;
          })()
        )
      )}

      {/* ── PROJECTPILOT APP ───────────────────────────────────────────────── */}
      {activeApp === 'projectpilot' && (
      <main className="container" style={{ flex: 1, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
          <div className="flex items-center justify-center gap-2" style={{ marginBottom: '0.75rem' }}>
            <span className="badge badge-purple flex items-center gap-1">
              <Sparkles size={13} />
              <span>AI Project Mentor & Architecture Architect</span>
            </span>
          </div>
          <h1 style={{ marginBottom: '0.85rem' }}>
            Transform Your Skills Into An Outstanding{' '}
            <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Final-Year Project
            </span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Personalized project recommendations, comprehensive 20-aspect blueprints, interactive development roadmaps, and continuous AI mentorship to guide you from idea to defense-ready software.
          </p>
        </section>

        {/* End-to-End Guided Journey Flow Banner */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.8rem'
        }}>
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>STEP-BY-STEP FLOW:</span>
            <button
              type="button"
              onClick={() => setActiveTab('generator')}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.2rem 0.5rem', color: activeTab === 'generator' ? 'var(--text-accent)' : 'var(--text-secondary)', fontWeight: activeTab === 'generator' ? 700 : 500 }}
            >
              1. Profile & Skills
            </button>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <button
              type="button"
              onClick={() => setActiveTab('generator')}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.2rem 0.5rem', color: 'var(--text-secondary)' }}
            >
              2. AI Recommendations ({recommendations.length})
            </button>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <button
              type="button"
              onClick={() => setActiveTab('blueprint')}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.2rem 0.5rem', color: activeTab === 'blueprint' ? 'var(--text-accent)' : 'var(--text-secondary)', fontWeight: activeTab === 'blueprint' ? 700 : 500 }}
            >
              3. 20-Aspect Blueprint
            </button>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <button
              type="button"
              onClick={() => setActiveTab('roadmap')}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.2rem 0.5rem', color: activeTab === 'roadmap' ? 'var(--text-accent)' : 'var(--text-secondary)', fontWeight: activeTab === 'roadmap' ? 700 : 500 }}
            >
              4. Dev Roadmap
            </button>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <button
              type="button"
              onClick={() => setActiveTab('improve')}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.2rem 0.5rem', color: activeTab === 'improve' ? 'var(--text-accent)' : 'var(--text-secondary)', fontWeight: activeTab === 'improve' ? 700 : 500 }}
            >
              5. Improvements
            </button>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <button
              type="button"
              onClick={() => setActiveTab('learning')}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.2rem 0.5rem', color: activeTab === 'learning' ? 'var(--text-accent)' : 'var(--text-secondary)', fontWeight: activeTab === 'learning' ? 700 : 500 }}
            >
              6. Viva & Defense
            </button>
          </div>

          {selectedProject && (
            <div className="badge badge-emerald flex items-center gap-1" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
              <CheckCircle2 size={13} />
              <span>Active: {selectedProject.title.slice(0, 26)}...</span>
            </div>
          )}
        </div>

        {/* Primary Tabs Navigation */}
        <nav className="tabs-nav" style={{ maxWidth: '980px', margin: '0 auto', width: '100%' }} aria-label="Main Navigation">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            <Sparkles size={16} />
            <span>1. Ideas Generator ({recommendations.length})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'blueprint' ? 'active' : ''}`}
            onClick={() => setActiveTab('blueprint')}
          >
            <FileText size={16} />
            <span>2. 20-Aspect Blueprint</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('roadmap')}
          >
            <Clock size={16} />
            <span>3. Dev Roadmap (8 Phases)</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'improve' ? 'active' : ''}`}
            onClick={() => setActiveTab('improve')}
          >
            <Zap size={16} />
            <span>4. Improve Studio</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            <Scale size={16} />
            <span>5. Compare Matrix ({comparedProjects.length})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'learning' ? 'active' : ''}`}
            onClick={() => setActiveTab('learning')}
          >
            <GraduationCap size={16} />
            <span>6. Resources & Quiz</span>
          </button>
        </nav>

        {/* TAB 1: Recommendations & Profile Form */}
        {activeTab === 'generator' && (
          <div>
            <StudentProfileForm
              profile={profile}
              onChange={setProfile}
              onApplyPreset={(presetProfile) => {
                setProfile(presetProfile);
                showToast('Applied profile preset! Click "Generate" to refresh recommendations.', 'info');
              }}
              onSubmit={handleGenerateRecommendations}
              isLoading={loadingState.recommendations}
              presets={presets}
              domains={domains}
            />

            {/* Recommendations List */}
            <div style={{ marginTop: '2.5rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem' }}>Personalized Project Recommendations</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Ranked by multi-factor suitability scoring against your declared skills and career goals.
                  </p>
                </div>

                {recommendations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('compare')}
                    className="btn btn-secondary btn-sm flex items-center gap-2"
                  >
                    <Scale size={14} />
                    <span>Compare Selected ({comparedProjects.length})</span>
                  </button>
                )}
              </div>

              {loadingState.recommendations ? (
                <div className="card text-center" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                  <div className="pulse-dot" style={{ width: '20px', height: '20px', margin: '0 auto 1.25rem' }} />
                  <h3>Recommendation Agent is Crafting Tailored Ideas...</h3>
                  <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0.5rem auto' }}>
                    Matching your technical skills with high-demand industry problems and calculating transparent feasibility scores.
                  </p>
                </div>
              ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                  {recommendations.map((proj) => (
                    <ProjectCard
                      key={proj.id}
                      project={proj}
                      isSelected={selectedProject?.id === proj.id}
                      onSelect={(p) => handleSelectProject(p, true)}
                      onCompareToggle={handleCompareToggle}
                      isCompared={comparedProjects.some((p) => p.id === proj.id)}
                      onAskMentor={(p) => {
                        setSelectedProject(p);
                        setIsMentorOpen(true);
                        handleMentorSendMessage(`Can you explain why "${p.title}" is a great project for my portfolio?`);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Blueprint Viewer */}
        {activeTab === 'blueprint' && (
          <BlueprintViewer
            project={selectedProject}
            blueprint={blueprint}
            onOpenRoadmap={() => setActiveTab('roadmap')}
            onOpenImprovement={() => setActiveTab('improve')}
          />
        )}

        {/* TAB 3: Interactive Development Roadmap */}
        {activeTab === 'roadmap' && (
          <RoadmapTracker
            roadmap={roadmap}
            onUpdateRoadmap={setRoadmap}
            projectTitle={selectedProject?.title}
          />
        )}

        {/* TAB 4: Improvement Studio */}
        {activeTab === 'improve' && (
          <ImprovementStudio
            activeProject={selectedProject}
            onRunImprovement={handleRunImprovement}
            improvements={improvements}
            isLoading={loadingState.improvements}
            onApplyImprovement={handleApplyImprovement}
          />
        )}

        {/* TAB 5: Comparison Matrix */}
        {activeTab === 'compare' && (
          <ComparisonView
            comparedProjects={comparedProjects.length > 0 ? comparedProjects : recommendations.slice(0, 3)}
            onRemoveFromCompare={(id) => setComparedProjects((p) => p.filter((x) => x.id !== id))}
            onSelectProject={(p) => handleSelectProject(p, true)}
            onClearCompare={() => setComparedProjects([])}
            studentProfile={profile}
          />
        )}

        {/* TAB 6: Learning Resources & Diagnostic Quiz */}
        {activeTab === 'learning' && (
          <LearningResources
            resources={learningResources}
            activeProject={selectedProject}
            studentProfile={profile}
            onFetchQuiz={() => handleFetchQuiz(selectedProject)}
            quiz={quizQuestions}
            analytics={analytics}
            isLoading={loadingState.learning}
          />
        )}
      </main>
      )}

      {/* ── AI BUILDER APP ─────────────────────────────────────────────────── */}
      {activeApp === 'builder' && (
        <main className="container" style={{ flex: 1, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <AiBuilderWorkspace />
        </main>
      )}

      {/* Platform-wide VoiceLensOrchestrator for ProjectPilot context */}
      {activeApp === 'projectpilot' && (
        <VoiceLensOrchestrator
          appContext="projectpilot"
          onVoiceCommand={({ transcript, result }) => {
            if (result && result.reply) {
              setMentorMessages(prev => [
                ...prev,
                { role: 'user', text: transcript },
                { role: 'mentor', text: result.reply }
              ]);
              setIsMentorOpen(true);
            }
          }}
          onLensAnalysis={({ instruction }) => {
            alert('📷 Lens Analysis:\n\n' + instruction);
          }}
        />
      )}

      {/* Floating AI Mentor Drawer & Toggle Button */}
      <MentorChat
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        activeProject={selectedProject}
        studentProfile={profile}
        onSendMessage={handleMentorSendMessage}
        messages={mentorMessages}
        isLoading={loadingState.mentor}
      />

      {!isMentorOpen && (
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

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={userApiKey}
        onSaveKey={(newKey) => {
          setUserApiKey(newKey);
          if (newKey) {
            localStorage.setItem('projectpilot_gemini_key', newKey);
            showToast('Gemini API Key saved! Direct Gemini mode activated.', 'success');
          } else {
            localStorage.removeItem('projectpilot_gemini_key');
            showToast('Reset to High-Fidelity Demo Engine.', 'info');
          }
        }}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '1.5rem',
            zIndex: 300,
            background: toast.type === 'error' ? 'var(--accent-rose)' : toast.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-primary)',
            color: '#fff',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'slideUp 0.25s ease'
          }}
        >
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(15, 23, 42, 0.4)',
        padding: '1.5rem 0',
        marginTop: 'auto'
      }}>
        <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ProjectPilot AI</span>
            <span>• Empowering university engineers with intelligent project architecture</span>
          </div>
          <div>
            Built with React, Vite, Node.js & Google Gemini API
          </div>
        </div>
      </footer>
    </div>
  );
}
