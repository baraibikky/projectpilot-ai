import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Cpu, Hammer, Play, CheckCircle } from 'lucide-react';
import { VoiceLensOrchestrator } from './VoiceLensOrchestrator';

export function AiBuilderWorkspace() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Welcome to the Global AI Builder! 🚀\n\nTell me what you want to build, paste a problem statement, use the Voice command, or upload a screenshot (Lens) to get started.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buildStatus, setBuildStatus] = useState(null); // 'coding', 'running', 'testing', 'done'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, buildStatus, isLoading]);

  const handleSendMessage = async (text, isProblemStatement = false) => {
    const content = text || inputText;
    if (!content.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', text: content }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const isProbStmt = isProblemStatement || content.toLowerCase().includes('problem statement') || content.length > 200;
      
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content, isProblemStatement: isProbStmt })
      });
      const data = await res.json();
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'bot', 
          text: data.reply || 'Analysis complete.', 
          showBuildButton: data.showBuildButton 
        }
      ]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBuildProcess = () => {
    setBuildStatus('coding');
    
    setTimeout(() => {
      setBuildStatus('running');
      setTimeout(() => {
        setBuildStatus('testing');
        setTimeout(() => {
          setBuildStatus('done');
          setMessages(prev => [...prev, { role: 'bot', text: '✅ **BUILD COMPLETE**\n\nThe project was successfully generated, run, and tested. No errors found. Preview is ready!' }]);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', 
      maxWidth: '900px', margin: '0 auto', width: '100%',
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', gap: '0.75rem'
      }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cyber-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Cpu size={18} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Global AI Builder</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Problem Statement → Build & Run</span>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
        paddingBottom: '80px' // Space for VoiceLensOrchestrator
      }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{
            display: 'flex', gap: '1rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row'
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: m.role === 'user' ? 'var(--secondary-gradient)' : 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div style={{
              maxWidth: '80%', padding: '1rem', borderRadius: 'var(--radius-lg)',
              background: m.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
              border: m.role === 'user' ? 'none' : '1px solid var(--border-strong)',
              boxShadow: m.role === 'user' ? 'none' : 'var(--shadow-sm)',
              fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap'
            }}>
              {m.text}
              {m.showBuildButton && !buildStatus && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button onClick={simulateBuildProcess} className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <Hammer size={16} /> BUILD PROJECT
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span className="pulse-dot" style={{ width: '8px', height: '8px' }} />
            <span>AI Builder is analyzing...</span>
          </div>
        )}

        {buildStatus && (
          <div style={{
            background: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-accent)', maxWidth: '400px', margin: '0 auto'
          }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="var(--accent-primary)" /> Orchestrator Status
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div className="flex items-center gap-2" style={{ color: buildStatus === 'coding' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {buildStatus === 'coding' ? <span className="spin">⏳</span> : <CheckCircle size={14} color="var(--accent-emerald)" />}
                1. Code Generation
              </div>
              <div className="flex items-center gap-2" style={{ color: buildStatus === 'running' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {buildStatus === 'running' ? <span className="spin">⏳</span> : (buildStatus === 'coding' ? <Play size={14} /> : <CheckCircle size={14} color="var(--accent-emerald)" />)}
                2. Running Application
              </div>
              <div className="flex items-center gap-2" style={{ color: buildStatus === 'testing' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {buildStatus === 'testing' ? <span className="spin">⏳</span> : (['coding', 'running'].includes(buildStatus) ? <Play size={14} /> : <CheckCircle size={14} color="var(--accent-emerald)" />)}
                3. Automated Testing & Auto-Fix
              </div>
              <div className="flex items-center gap-2" style={{ color: buildStatus === 'done' ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: buildStatus === 'done' ? 700 : 400 }}>
                {buildStatus === 'done' ? <CheckCircle size={16} /> : <Play size={14} />}
                4. Preview Ready
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)'
      }}>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
        >
          <input
            type="text"
            className="input"
            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-full)' }}
            placeholder="Type 'Build a project', paste a problem statement, or use Voice/Lens..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading || buildStatus === 'coding' || buildStatus === 'running' || buildStatus === 'testing'}
          />
          <button
            type="submit"
            className="btn btn-primary flex items-center justify-center"
            style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-full)' }}
            disabled={!inputText.trim() || isLoading}
            title="Send (Chat)"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* VoiceLensOrchestrator injected at the bottom */}
      <div style={{ position: 'absolute', bottom: '5rem', left: 0, right: 0, pointerEvents: 'none', zIndex: 10 }}>
        <div style={{ pointerEvents: 'auto' }}>
          <VoiceLensOrchestrator 
            appContext="builder"
            onVoiceCommand={({ transcript }) => handleSendMessage(transcript)}
            onLensAnalysis={({ instruction }) => handleSendMessage(`Analyze this UI requirement and build it: \n\n${instruction}`)}
            onTranscript={(text) => setInputText(text)}
          />
        </div>
      </div>
    </div>
  );
}
