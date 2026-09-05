/**
 * AttendanceApp — Full self-contained Student Attendance management module.
 * Integrates with the existing ProjectPilot AI platform and its VoiceLensOrchestrator.
 * Backend: Express /api/attendance/* routes (in-memory store).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users, CheckSquare, BarChart3, History, Plus, Search,
  Trash2, ChevronDown, ChevronUp, CheckCircle2, XCircle,
  AlertTriangle, Calendar, TrendingUp, LogIn, LogOut,
  Download, RefreshCw, UserPlus, Filter, Loader2
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const API = '/api/attendance';
const TODAY = () => new Date().toISOString().split('T')[0];
const FMT_DATE = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

async function apiCall(path, opts = {}) {
  const r = await fetch(API + path, { headers: { 'Content-Type': 'application/json' }, ...opts });
  return r.json();
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pass === 'admin123' || pass === 'demo') {
        onLogin(user || 'Admin');
      } else {
        setError('Invalid password. Use "admin123" or "demo".');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-app)', padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', padding: '2.5rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: 'var(--radius-lg)', margin: '0 auto 1rem',
            background: 'var(--secondary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.35)'
          }}>
            <CheckSquare size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Attendance Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sign in to manage student attendance</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Username</label>
            <input
              className="input"
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="admin"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <input
              className="input"
              type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setError(''); }}
              placeholder="admin123 or demo"
              style={{ width: '100%' }}
              autoFocus
            />
          </div>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)', fontSize: '0.8rem' }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? <Loader2 size={16} className="spin" /> : <LogIn size={16} />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Hint: password is <code style={{ background: 'var(--bg-input)', padding: '0 4px', borderRadius: 3 }}>admin123</code>
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <div style={{
        width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0,
        background: color || 'var(--primary-gradient)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Percentage Bar ───────────────────────────────────────────────────────────
function PctBar({ pct }) {
  const color = pct >= 75 ? 'var(--accent-emerald)' : pct >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)';
  return (
    <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', height: 6, width: '100%', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }} />
    </div>
  );
}

// ─── Add Student Modal ────────────────────────────────────────────────────────
function AddStudentModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', rollNo: '', section: 'A', email: '' });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const data = await apiCall('/students', { method: 'POST', body: JSON.stringify(form) });
    setSaving(false);
    if (data.success) { onAdded(data.student); onClose(); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }} onClick={onClose}>
      <div className="card" style={{ maxWidth: 400, width: '100%', padding: '2rem' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={20} /> Add Student
        </h2>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'name', label: 'Full Name *', placeholder: 'e.g. Rahul Sharma' },
            { key: 'rollNo', label: 'Roll Number', placeholder: 'e.g. CS009' },
            { key: 'email', label: 'Email', placeholder: 'student@example.com' }
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
              <input
                className="input"
                style={{ width: '100%' }}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                required={key === 'name'}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Section</label>
            <select className="input" style={{ width: '100%' }} value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}>
              {['A', 'B', 'C', 'D'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2" style={{ marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
              {saving ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
              {saving ? 'Adding…' : 'Add Student'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab({ summary, todayRecords, students, onRefresh }) {
  const totalStudents = students.length;
  const presentToday = todayRecords.filter(r => r.status === 'present').length;
  const absentToday = todayRecords.filter(r => r.status === 'absent').length;
  const markedToday = todayRecords.length;
  const avgPct = summary.length ? Math.round(summary.reduce((a, s) => a + s.percentage, 0) / summary.length) : 0;
  const below75 = summary.filter(s => s.percentage < 75).length;

  const recent = [...summary].sort((a, b) => a.percentage - b.percentage).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <StatCard icon={<Users size={20} />} label="Total Students" value={totalStudents} color="var(--primary-gradient)" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Present Today" value={presentToday} color="var(--success-gradient)" sub={`of ${markedToday} marked`} />
        <StatCard icon={<XCircle size={20} />} label="Absent Today" value={absentToday} color="var(--danger-gradient)" />
        <StatCard icon={<TrendingUp size={20} />} label="Avg Attendance" value={`${avgPct}%`} color="var(--secondary-gradient)" />
        <StatCard icon={<AlertTriangle size={20} />} label="Below 75%" value={below75} color="var(--warning-gradient)" sub="need attention" />
      </div>

      {/* Today snapshot + low attendance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {/* Today's Attendance Ring */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>📅 Today — {FMT_DATE(TODAY())}</h3>
          {markedToday === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <Calendar size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
              <div>No attendance marked yet today.</div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-emerald)', lineHeight: 1 }}>{presentToday}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Present</div>
                </div>
                <div style={{ width: 1, height: 40, background: 'var(--border-subtle)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-rose)', lineHeight: 1 }}>{absentToday}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Absent</div>
                </div>
              </div>
              <PctBar pct={markedToday > 0 ? Math.round((presentToday / totalStudents) * 100) : 0} />
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {markedToday}/{totalStudents} students marked
              </div>
            </div>
          )}
        </div>

        {/* At-Risk Students */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>⚠️ At-Risk Students (&lt;75%)</h3>
          {recent.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>All students above 75% — excellent!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recent.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'var(--danger-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    fontSize: '0.7rem', fontWeight: 700, flexShrink: 0
                  }}>{s.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    <PctBar pct={s.percentage} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                    color: s.percentage < 75 ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                  }}>{s.percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Students Tab ─────────────────────────────────────────────────────────────
function StudentsTab({ students, summary, onAddStudent, onDeleteStudent }) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const summaryMap = Object.fromEntries(summary.map(s => [s.id, s]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            style={{ width: '100%', paddingLeft: '2rem' }}
            placeholder="Search students…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button id="add-student-btn" className="btn btn-primary btn-sm flex items-center gap-2" onClick={() => setShowAdd(true)}>
          <Plus size={14} /> Add Student
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Student', 'Roll No', 'Section', 'Present', 'Absent', 'Attendance', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const sm = summaryMap[s.id] || { presentDays: 0, absentDays: 0, percentage: 0 };
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div className="flex items-center gap-2">
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', background: `hsl(${(i * 47) % 360}, 60%, 45%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                          fontSize: '0.7rem', fontWeight: 700, flexShrink: 0
                        }}>{s.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.name}</div>
                          {s.email && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{s.rollNo}</span></td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{s.section}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>{sm.presentDays}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--accent-rose)', fontWeight: 600 }}>{sm.absentDays}</td>
                    <td style={{ padding: '0.75rem 1rem', minWidth: 120 }}>
                      <div className="flex items-center gap-2">
                        <PctBar pct={sm.percentage} />
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, minWidth: 36,
                          color: sm.percentage >= 75 ? 'var(--accent-emerald)' : sm.percentage >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                        }}>{sm.percentage}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button
                        onClick={() => { if (window.confirm(`Remove ${s.name}?`)) onDeleteStudent(s.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                        title="Delete student"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} onAdded={onAddStudent} />}
    </div>
  );
}

// ─── Mark Attendance Tab ──────────────────────────────────────────────────────
function MarkAttendanceTab({ students, onMarkDone }) {
  const [date, setDate] = useState(TODAY());
  const [statuses, setStatuses] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [todayLoaded, setTodayLoaded] = useState(false);

  // Load existing records for chosen date
  useEffect(() => {
    apiCall(`/today?date=${date}`).then(data => {
      const map = {};
      (data.records || []).forEach(r => { map[r.studentId] = r.status; });
      setStatuses(map);
      setTodayLoaded(true);
      setSaved(false);
    });
  }, [date]);

  const toggle = (id, status) => setStatuses(prev => ({ ...prev, [id]: prev[id] === status ? undefined : status }));

  const markAll = (status) => {
    const map = {};
    students.forEach(s => { map[s.id] = status; });
    setStatuses(map);
  };

  const saveAttendance = async () => {
    const entries = students
      .filter(s => statuses[s.id])
      .map(s => ({ studentId: s.id, date, status: statuses[s.id] }));
    if (entries.length === 0) return;
    setSaving(true);
    const data = await apiCall('/mark', { method: 'POST', body: JSON.stringify({ entries, markedBy: 'admin' }) });
    setSaving(false);
    if (data.success) { setSaved(true); onMarkDone(); }
  };

  const presentCount = Object.values(statuses).filter(v => v === 'present').length;
  const absentCount = Object.values(statuses).filter(v => v === 'absent').length;
  const unmarked = students.length - presentCount - absentCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Date picker + bulk actions */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          <div className="flex items-center gap-2">
            <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="date"
              className="input"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ width: 'auto' }}
            />
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-sm" style={{ background: 'var(--success-gradient)', color: '#fff', border: 'none' }} onClick={() => markAll('present')}>
            <CheckCircle2 size={13} /> Mark All Present
          </button>
          <button className="btn btn-sm" style={{ background: 'var(--danger-gradient)', color: '#fff', border: 'none' }} onClick={() => markAll('absent')}>
            <XCircle size={13} /> Mark All Absent
          </button>
        </div>

        {/* Progress summary */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>✓ {presentCount} Present</span>
          <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>✗ {absentCount} Absent</span>
          <span style={{ color: 'var(--text-muted)' }}>○ {unmarked} Unmarked</span>
        </div>
      </div>

      {/* Student grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
        {students.map((s, i) => {
          const st = statuses[s.id];
          return (
            <div key={s.id} className="card" style={{
              padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
              border: st === 'present' ? '1.5px solid var(--accent-emerald)' : st === 'absent' ? '1.5px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
              transition: 'all 0.15s'
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: `hsl(${(i * 47) % 360}, 60%, 45%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                fontSize: '0.72rem', fontWeight: 700, flexShrink: 0
              }}>{s.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.rollNo} · {s.section}</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggle(s.id, 'present')}
                  title="Present"
                  style={{
                    width: 32, height: 32, borderRadius: '50%', border: `2px solid ${st === 'present' ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
                    background: st === 'present' ? 'var(--accent-emerald)' : 'transparent',
                    color: st === 'present' ? '#fff' : 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                  }}
                ><CheckCircle2 size={15} /></button>
                <button
                  onClick={() => toggle(s.id, 'absent')}
                  title="Absent"
                  style={{
                    width: 32, height: 32, borderRadius: '50%', border: `2px solid ${st === 'absent' ? 'var(--accent-rose)' : 'var(--border-subtle)'}`,
                    background: st === 'absent' ? 'var(--accent-rose)' : 'transparent',
                    color: st === 'absent' ? '#fff' : 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                  }}
                ><XCircle size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save button */}
      <button
        id="save-attendance-btn"
        className="btn btn-primary"
        onClick={saveAttendance}
        disabled={saving || Object.values(statuses).every(v => !v)}
        style={{ alignSelf: 'flex-end', minWidth: 160 }}
      >
        {saving ? <><Loader2 size={15} className="spin" /> Saving…</> : saved ? <><CheckCircle2 size={15} /> Saved!</> : '💾 Save Attendance'}
      </button>
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────
function HistoryTab({ students }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(TODAY());
  const [filterStudent, setFilterStudent] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ dateFrom, dateTo });
    if (filterStudent) params.set('studentId', filterStudent);
    const data = await apiCall(`/records?${params}`);
    setRecords(data.records || []);
    setLoading(false);
  }, [dateFrom, dateTo, filterStudent]);

  useEffect(() => { load(); }, [load]);

  const studentMap = Object.fromEntries(students.map(s => [s.id, s]));

  // Group by date
  const byDate = {};
  records.forEach(r => {
    if (!byDate[r.date]) byDate[r.date] = [];
    byDate[r.date].push(r);
  });
  const dates = Object.keys(byDate).sort().reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Filters */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          <div className="flex items-center gap-2">
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From</label>
            <input type="date" className="input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: 'auto' }} />
          </div>
          <div className="flex items-center gap-2">
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>To</label>
            <input type="date" className="input" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: 'auto' }} />
          </div>
          <select className="input" style={{ width: 'auto' }} value={filterStudent} onChange={e => setFilterStudent(e.target.value)}>
            <option value="">All Students</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={13} /> Apply</button>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={24} className="spin" style={{ marginBottom: '0.5rem' }} />
          <div>Loading records…</div>
        </div>
      ) : dates.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <History size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
          <div>No records in selected range.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {dates.map(date => {
            const dayRecs = byDate[date];
            const presentCount = dayRecs.filter(r => r.status === 'present').length;
            const pct = Math.round((presentCount / students.length) * 100);
            return (
              <div key={date} className="card" style={{ padding: '1rem', overflow: 'hidden' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                  <div className="flex items-center gap-2">
                    <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{FMT_DATE(date)}</span>
                  </div>
                  <div className="flex items-center gap-3" style={{ fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{presentCount}P</span>
                    <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>{dayRecs.length - presentCount}A</span>
                    <span style={{
                      fontWeight: 700,
                      color: pct >= 75 ? 'var(--accent-emerald)' : pct >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                    }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {dayRecs.map(r => {
                    const s = studentMap[r.studentId];
                    return s ? (
                      <span key={r.id} style={{
                        padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600,
                        background: r.status === 'present' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                        color: r.status === 'present' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                        border: `1px solid ${r.status === 'present' ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`
                      }}>
                        {s.name.split(' ')[0]} {r.status === 'present' ? '✓' : '✗'}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Attendance Percentage Tab ─────────────────────────────────────────────────
function PercentageTab({ summary }) {
  const [filter, setFilter] = useState('all'); // all | low | ok
  const [search, setSearch] = useState('');

  const filtered = summary
    .filter(s => {
      if (filter === 'low') return s.percentage < 75;
      if (filter === 'ok') return s.percentage >= 75;
      return true;
    })
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => a.percentage - b.percentage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Filter bar */}
      <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" style={{ width: '100%', paddingLeft: '2rem' }} placeholder="Search student…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {[['all', 'All'], ['low', '< 75%'], ['ok', '≥ 75%']].map(([val, label]) => (
          <button key={val} className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      {/* Sorted list */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {sorted.map((s, i) => (
          <div key={s.id} style={{
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1.25rem',
            borderBottom: i < sorted.length - 1 ? '1px solid var(--border-subtle)' : 'none'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: `hsl(${(i * 47) % 360}, 60%, 45%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              fontSize: '0.72rem', fontWeight: 700, flexShrink: 0
            }}>{s.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{s.name}</div>
              <div className="flex items-center gap-2">
                <PctBar pct={s.percentage} />
                <span style={{
                  fontWeight: 800, fontSize: '0.8rem', flexShrink: 0, minWidth: 38,
                  color: s.percentage >= 75 ? 'var(--accent-emerald)' : s.percentage >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                }}>{s.percentage}%</span>
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right', flexShrink: 0 }}>
              <div>{s.presentDays}P / {s.absentDays}A</div>
              <div>{s.totalDays} days</div>
            </div>
            {s.percentage < 75 && (
              <span style={{
                padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700,
                background: 'rgba(244,63,94,0.15)', color: 'var(--accent-rose)', border: '1px solid rgba(244,63,94,0.3)', flexShrink: 0
              }}>⚠ Low</span>
            )}
          </div>
        ))}
        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No students match the filter.</div>
        )}
      </div>
    </div>
  );
}

// ─── Main AttendanceApp ────────────────────────────────────────────────────────
export function AttendanceApp({ user, onLogout, voiceResult }) {
  const [tab, setTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState([]);
  const [todayRecords, setTodayRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [sRes, smRes, tdRes] = await Promise.all([
      apiCall('/students'),
      apiCall('/summary'),
      apiCall(`/today?date=${TODAY()}`)
    ]);
    if (sRes.success) setStudents(sRes.students);
    if (smRes.success) setSummary(smRes.summary);
    if (tdRes.success) setTodayRecords(tdRes.records || []);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // React to voice commands from VoiceLensOrchestrator
  useEffect(() => {
    if (!voiceResult) return;
    const { action, student, students: filteredStudents } = voiceResult;
    if (action === 'mark' || action === 'add') { reload(); }
    if (action === 'filter' && filteredStudents) { setTab('percentage'); }
    if (action === 'show' && student) { setTab('percentage'); }
  }, [voiceResult, reload]);

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={15} /> },
    { id: 'students', label: 'Students', icon: <Users size={15} /> },
    { id: 'mark', label: 'Mark Attendance', icon: <CheckSquare size={15} /> },
    { id: 'history', label: 'History', icon: <History size={15} /> },
    { id: 'percentage', label: 'Percentages', icon: <TrendingUp size={15} /> },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={32} className="spin" style={{ color: 'var(--accent-primary)' }} />
        <span style={{ color: 'var(--text-muted)' }}>Loading attendance data…</span>
      </div>
    );
  }

  return (
    <div>
      {/* Attendance sub-header */}
      <div style={{
        background: 'var(--bg-glass)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)', padding: '0.75rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem'
      }}>
        <div className="flex items-center gap-2">
          <CheckSquare size={18} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Student Attendance</span>
          <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Live</span>
        </div>
        <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>👤 {user}</span>
          <button className="btn btn-ghost btn-sm flex items-center gap-1" onClick={onLogout}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* Sub-tab nav */}
      <div style={{
        display: 'flex', gap: '0.25rem', padding: '0.75rem 1.5rem',
        borderBottom: '1px solid var(--border-subtle)', overflowX: 'auto',
        background: 'var(--bg-surface)'
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            id={`att-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2"
            style={{
              padding: '0.45rem 1rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.15s',
              background: tab === t.id ? 'var(--accent-primary)' : 'transparent',
              color: tab === t.id ? '#fff' : 'var(--text-muted)'
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '1.5rem', paddingBottom: '8rem' }}>
        {tab === 'dashboard' && (
          <DashboardTab summary={summary} todayRecords={todayRecords} students={students} onRefresh={reload} />
        )}
        {tab === 'students' && (
          <StudentsTab
            students={students}
            summary={summary}
            onAddStudent={s => { setStudents(prev => [...prev, s]); reload(); }}
            onDeleteStudent={async id => {
              await apiCall(`/students/${id}`, { method: 'DELETE' });
              reload();
            }}
          />
        )}
        {tab === 'mark' && (
          <MarkAttendanceTab students={students} onMarkDone={reload} />
        )}
        {tab === 'history' && <HistoryTab students={students} />}
        {tab === 'percentage' && <PercentageTab summary={summary} />}
      </div>
    </div>
  );
}
