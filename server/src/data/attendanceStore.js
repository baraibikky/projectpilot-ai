/**
 * Attendance Store — in-memory data store for the Attendance app.
 * All data is kept in-process (survives hot reloads within session).
 * Persists across client refreshes but resets when the server restarts.
 * (For demo / hackathon use; swap with a real DB layer trivially.)
 */

// Seed students
let students = [
  { id: 's1', name: 'Rahul Sharma',   rollNo: 'CS001', section: 'A', email: 'rahul@example.com',   avatar: 'RS' },
  { id: 's2', name: 'Priya Patel',    rollNo: 'CS002', section: 'A', email: 'priya@example.com',   avatar: 'PP' },
  { id: 's3', name: 'Arjun Mehta',    rollNo: 'CS003', section: 'B', email: 'arjun@example.com',   avatar: 'AM' },
  { id: 's4', name: 'Sneha Gupta',    rollNo: 'CS004', section: 'A', email: 'sneha@example.com',   avatar: 'SG' },
  { id: 's5', name: 'Vikram Singh',   rollNo: 'CS005', section: 'B', email: 'vikram@example.com',  avatar: 'VS' },
  { id: 's6', name: 'Anjali Rao',     rollNo: 'CS006', section: 'A', email: 'anjali@example.com',  avatar: 'AR' },
  { id: 's7', name: 'Ravi Kumar',     rollNo: 'CS007', section: 'B', email: 'ravi@example.com',    avatar: 'RK' },
  { id: 's8', name: 'Kavya Nair',     rollNo: 'CS008', section: 'A', email: 'kavya@example.com',   avatar: 'KN' },
];

// Attendance records: { id, studentId, date (YYYY-MM-DD), status ('present'|'absent'), markedBy, markedAt }
let records = [];
let _rid = 1;

// Seed some historical records (last 10 days)
const today = new Date();
function fmt(d) {
  return d.toISOString().split('T')[0];
}
for (let daysBack = 9; daysBack >= 1; daysBack--) {
  const date = new Date(today);
  date.setDate(today.getDate() - daysBack);
  const dateStr = fmt(date);
  students.forEach((s, i) => {
    // Rahul (s1) has ~60% attendance; others higher
    const present = s.id === 's1' ? Math.random() > 0.45 : Math.random() > 0.15;
    records.push({
      id: `r${_rid++}`,
      studentId: s.id,
      date: dateStr,
      status: present ? 'present' : 'absent',
      markedBy: 'admin',
      markedAt: dateStr + 'T09:00:00Z'
    });
  });
}

// ─── CRUD helpers ───────────────────────────────────────────────────────────

export function getStudents() {
  return students;
}

export function addStudent(data) {
  const id = 's' + (Date.now());
  const initials = data.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const student = {
    id,
    name: data.name.trim(),
    rollNo: data.rollNo?.trim() || `CS${String(students.length + 1).padStart(3, '0')}`,
    section: data.section?.trim() || 'A',
    email: data.email?.trim() || '',
    avatar: initials
  };
  students.push(student);
  return student;
}

export function removeStudent(id) {
  students = students.filter(s => s.id !== id);
  records = records.filter(r => r.studentId !== id);
}

export function getRecords(filters = {}) {
  let res = [...records];
  if (filters.studentId) res = res.filter(r => r.studentId === filters.studentId);
  if (filters.date) res = res.filter(r => r.date === filters.date);
  if (filters.dateFrom) res = res.filter(r => r.date >= filters.dateFrom);
  if (filters.dateTo) res = res.filter(r => r.date <= filters.dateTo);
  return res;
}

export function markAttendance(entries, markedBy = 'admin') {
  // entries: [{ studentId, date, status }]
  const now = new Date().toISOString();
  const results = [];
  for (const entry of entries) {
    const existing = records.find(r => r.studentId === entry.studentId && r.date === entry.date);
    if (existing) {
      existing.status = entry.status;
      existing.markedBy = markedBy;
      existing.markedAt = now;
      results.push(existing);
    } else {
      const rec = { id: `r${_rid++}`, studentId: entry.studentId, date: entry.date, status: entry.status, markedBy, markedAt: now };
      records.push(rec);
      results.push(rec);
    }
  }
  return results;
}

export function getAttendanceSummary() {
  const summary = students.map(s => {
    const total = records.filter(r => r.studentId === s.id).length;
    const present = records.filter(r => r.studentId === s.id && r.status === 'present').length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return { ...s, totalDays: total, presentDays: present, absentDays: total - present, percentage: pct };
  });
  return summary;
}

export function getTodayRecord(dateStr) {
  const dateRecords = records.filter(r => r.date === dateStr);
  return { date: dateStr, records: dateRecords, markedCount: dateRecords.length };
}
