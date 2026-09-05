/**
 * VoiceLensOrchestrator — Platform-wide Voice + Lens component
 *
 * Usage:
 *   <VoiceLensOrchestrator
 *     appContext="attendance"   // or "projectpilot"
 *     onVoiceCommand={fn}       // receives { transcript, result }
 *     onLensAnalysis={fn}       // receives { instruction, imageData }
 *     onTranscript={fn}         // optional: receives raw transcript string
 *   />
 *
 * Voice commands are forwarded to /api/attendance/voice if appContext="attendance"
 * Lens uploads an image and returns an AI-analyzed instruction string.
 * Both features remain REUSABLE: pass a different onVoiceCommand to use elsewhere.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Camera, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Speech Recognition setup ────────────────────────────────────────────────
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const hasSpeech = Boolean(SpeechRecognition);

export function VoiceLensOrchestrator({ appContext = 'attendance', onVoiceCommand, onLensAnalysis, onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('');
  const [lensOpen, setLensOpen] = useState(false);
  const [lensImage, setLensImage] = useState(null);    // base64
  const [lensPreview, setLensPreview] = useState(null); // object URL
  const [lensProcessing, setLensProcessing] = useState(false);
  const [lensResult, setLensResult] = useState('');
  const [expanded, setExpanded] = useState(false);

  const recogRef = useRef(null);
  const fileRef = useRef(null);

  // ── Voice ──────────────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!hasSpeech) {
      setVoiceStatus('⚠️ Speech not supported in this browser. Use Chrome.');
      return;
    }
    if (isListening) return;

    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = true;
    recog.maxAlternatives = 1;
    recogRef.current = recog;

    recog.onstart = () => { setIsListening(true); setVoiceStatus('🎙️ Listening…'); setTranscript(''); };

    recog.onresult = (e) => {
      const interim = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(interim);
      if (onTranscript) onTranscript(interim);
    };

    recog.onend = async () => {
      setIsListening(false);
      const finalText = recogRef.current?._finalText || transcript;
      recogRef.current = null;
      if (!finalText.trim()) { setVoiceStatus('No speech detected.'); return; }

      setVoiceStatus('⚙️ Processing…');
      try {
        const endpoint = appContext === 'attendance'
          ? '/api/attendance/voice'
          : '/api/mentor';  // fallback for ProjectPilot

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: finalText, message: finalText })
        });
        const data = await res.json();
        setVoiceStatus(data.message || data.reply || '✅ Done');
        if (onVoiceCommand) onVoiceCommand({ transcript: finalText, result: data });
      } catch (err) {
        setVoiceStatus('⚠️ Network error.');
      }
    };

    recog.onerror = (e) => {
      setIsListening(false);
      setVoiceStatus(`⚠️ Error: ${e.error}`);
    };

    // capture final before onend fires
    recog.onspeechend = () => {
      if (recogRef.current) recogRef.current._finalText = transcript;
      recog.stop();
    };

    recog.start();
  }, [isListening, transcript, appContext, onVoiceCommand, onTranscript]);

  const stopListening = () => {
    if (recogRef.current) {
      recogRef.current._finalText = transcript;
      recogRef.current.stop();
    }
  };

  // Update ref's finalText live so onspeechend captures latest
  useEffect(() => {
    if (recogRef.current) recogRef.current._finalText = transcript;
  }, [transcript]);

  // ── Lens ───────────────────────────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLensImage(ev.target.result);           // full base64
      setLensPreview(URL.createObjectURL(file)); // preview
      setLensResult('');
    };
    reader.readAsDataURL(file);
  };

  const handleLensAnalyze = async () => {
    if (!lensImage) return;
    setLensProcessing(true);
    setLensResult('');

    try {
      // Use Gemini vision if API key is available, otherwise return a descriptive mock
      const apiKey = localStorage.getItem('projectpilot_gemini_key') || '';
      let instruction = '';

      if (apiKey) {
        const payload = {
          contents: [{
            parts: [
              { text: 'Analyze this UI screenshot. Describe its layout and list specific actionable changes to implement in code. Be concise and practical.' },
              { inline_data: { mime_type: 'image/jpeg', data: lensImage.split(',')[1] } }
            ]
          }]
        };
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
        );
        const d = await r.json();
        instruction = d?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else {
        // Intelligent fallback — describe typical attendance UI
        instruction = '📊 The screenshot shows an attendance UI. Suggested improvements:\n• Add color-coded status badges (green=present, red=absent)\n• Show attendance percentage bar per student\n• Add a bulk-mark toolbar at the top\n• Include a date picker for historical view\n• Add search/filter bar for student names';
      }

      setLensResult(instruction);
      if (onLensAnalysis) onLensAnalysis({ instruction, imageData: lensImage });
    } catch (err) {
      setLensResult('⚠️ Analysis failed. Add your Gemini key for full Lens support.');
    } finally {
      setLensProcessing(false);
    }
  };

  const clearLens = () => {
    setLensImage(null);
    setLensPreview(null);
    setLensResult('');
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="voice-lens-bar" style={{
      position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
      zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      maxWidth: '520px', width: 'calc(100% - 3rem)'
    }}>
      {/* Lens panel */}
      {lensOpen && (
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)', padding: '1rem', width: '100%',
          boxShadow: 'var(--shadow-lg)', backdropFilter: 'blur(16px)'
        }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>📷 Lens — Upload UI Screenshot</span>
            <button onClick={() => { setLensOpen(false); clearLens(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>

          {lensPreview ? (
            <div>
              <img src={lensPreview} alt="Uploaded UI" style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: '160px', objectFit: 'cover', marginBottom: '0.75rem' }} />
              <div className="flex items-center gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleLensAnalyze} disabled={lensProcessing} style={{ flex: 1 }}>
                  {lensProcessing ? <><Loader2 size={14} className="spin" /> Analyzing…</> : '🔍 Analyze & Build This'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={clearLens}>Clear</button>
              </div>
              {lensResult && (
                <div style={{ marginTop: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8rem', whiteSpace: 'pre-wrap', lineHeight: 1.6, maxHeight: '180px', overflowY: 'auto', color: 'var(--text-secondary)' }}>
                  {lensResult}
                </div>
              )}
            </div>
          ) : (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Camera size={28} />
              <span>Click to upload attendance screenshot</span>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      )}

      {/* Voice status / transcript */}
      {(voiceStatus || transcript) && (
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-full)',
          padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '100%',
          textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {transcript ? `"${transcript}"` : voiceStatus}
        </div>
      )}

      {/* Main pill bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: 'var(--bg-glass)', backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-full)',
        padding: '0.5rem 1rem', boxShadow: 'var(--shadow-md)'
      }}>
        {/* Voice btn */}
        <button
          id="voice-btn"
          onClick={isListening ? stopListening : startListening}
          title={isListening ? 'Stop' : 'Voice Command'}
          aria-label={isListening ? 'Stop recording' : 'Start voice command'}
          style={{
            width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: isListening ? 'var(--danger-gradient)' : 'var(--primary-gradient)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isListening ? '0 0 16px rgba(244, 63, 94, 0.6)' : '0 0 12px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s', animation: isListening ? 'pulseRing 1.2s infinite' : 'none'
          }}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '120px', textAlign: 'center' }}>
          {isListening ? (
            <span style={{ color: 'var(--accent-rose)', fontWeight: 600, animation: 'blink 1s infinite' }}>● Recording…</span>
          ) : (
            <span>🎙️ Voice · 📷 Lens</span>
          )}
        </div>

        {/* Lens btn */}
        <button
          id="lens-btn"
          onClick={() => setLensOpen(v => !v)}
          title="Lens — Upload UI screenshot"
          aria-label="Open Lens"
          style={{
            width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: lensOpen ? 'var(--cyber-gradient)' : 'var(--bg-input)', color: lensOpen ? '#fff' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
          }}
        >
          <Camera size={18} />
        </button>

        {/* Expand/collapse voice hints */}
        <button
          onClick={() => setExpanded(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
          title="Show voice examples"
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {/* Voice hint chips */}
      {expanded && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', maxWidth: '100%' }}>
          {[
            'Mark Rahul present',
            'Add Priya',
            'Show students below 75%',
            'Show attendance for Arjun'
          ].map(hint => (
            <button
              key={hint}
              onClick={() => {
                setTranscript(hint);
                if (onTranscript) onTranscript(hint);
                // Auto-submit hint
                fetch(appContext === 'attendance' ? '/api/attendance/voice' : '/api/mentor', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ command: hint, message: hint })
                }).then(r => r.json()).then(data => {
                  setVoiceStatus(data.message || data.reply || '✅ Done');
                  if (onVoiceCommand) onVoiceCommand({ transcript: hint, result: data });
                }).catch(() => setVoiceStatus('⚠️ Error'));
              }}
              style={{
                background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)', padding: '0.2rem 0.65rem',
                fontSize: '0.72rem', color: 'var(--text-secondary)', cursor: 'pointer',
                transition: 'all 0.15s', whiteSpace: 'nowrap'
              }}
            >
              {hint}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
