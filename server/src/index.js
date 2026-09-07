import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { DOMAINS, SKILL_PRESETS, EDUCATIONAL_RESOURCES } from './data/seedData.js';
import { dispatchAgentRoute } from './services/router.js';
import {
  getStudents, addStudent, removeStudent,
  getRecords, markAttendance,
  getAttendanceSummary, getTodayRecord
} from './data/attendanceStore.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-api-key']
}));
app.use(express.json({ limit: '10mb' }));

// Helper to extract API key from headers or request body
function getApiKey(req) {
  return req.headers['x-gemini-api-key'] || req.body?.apiKey || null;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasEnvKey = Boolean(config.geminiApiKey);
  res.json({
    status: 'online',
    platform: 'ProjectPilot AI Server',
    version: '1.0.0',
    aiProvider: hasEnvKey ? 'Gemini (Connected via ENV)' : 'Intelligent Dynamic Fallback (Active)',
    hasEnvKey,
    model: config.aiModel
  });
});

// Seed data endpoints
app.get('/api/domains', (req, res) => {
  res.json({
    domains: DOMAINS,
    presets: SKILL_PRESETS
  });
});

app.get('/api/learning', (req, res) => {
  res.json({
    resources: EDUCATIONAL_RESOURCES
  });
});

// Unified route dispatcher
app.post('/api/route', async (req, res) => {
  try {
    const { intent, payload } = req.body;
    const apiKey = getApiKey(req);
    const result = await dispatchAgentRoute({ intent, payload, apiKey });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Route dispatch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Recommendation Agent endpoint
app.post('/api/recommend', async (req, res) => {
  try {
    const profile = req.body.profile || req.body;
    const apiKey = getApiKey(req);
    const result = await dispatchAgentRoute({
      intent: 'RECOMMENDATION',
      payload: { profile },
      apiKey
    });
    res.json({ success: true, projects: result.data });
  } catch (error) {
    console.error('Recommendation API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Project Planning / 20-Aspect Blueprint endpoint
app.post('/api/blueprint', async (req, res) => {
  try {
    const { project, profile } = req.body;
    const apiKey = getApiKey(req);
    const result = await dispatchAgentRoute({
      intent: 'BLUEPRINT',
      payload: { project, profile },
      apiKey
    });
    res.json({ success: true, blueprint: result.data });
  } catch (error) {
    console.error('Blueprint API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Development Roadmap endpoint
app.post('/api/roadmap', async (req, res) => {
  try {
    const { project } = req.body;
    const apiKey = getApiKey(req);
    const result = await dispatchAgentRoute({
      intent: 'ROADMAP',
      payload: { project },
      apiKey
    });
    res.json({ success: true, roadmap: result.data });
  } catch (error) {
    console.error('Roadmap API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Improvement Agent endpoint
app.post('/api/improve', async (req, res) => {
  try {
    const payload = req.body;
    const apiKey = getApiKey(req);
    const result = await dispatchAgentRoute({
      intent: 'IMPROVEMENT',
      payload,
      apiKey
    });
    res.json({ success: true, improvements: result.data });
  } catch (error) {
    console.error('Improvement API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mentor Chat endpoint
app.post('/api/mentor', async (req, res) => {
  try {
    const payload = req.body;
    const apiKey = getApiKey(req);
    const result = await dispatchAgentRoute({
      intent: 'MENTOR',
      payload,
      apiKey
    });
    res.json({ success: true, reply: result.data });
  } catch (error) {
    console.error('Mentor API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Readiness & Skill Gap Analytics endpoint
app.post('/api/analytics', async (req, res) => {
  try {
    const { profile, project } = req.body;
    const apiKey = getApiKey(req);
    const result = await dispatchAgentRoute({
      intent: 'ANALYTICS',
      payload: { profile, project },
      apiKey
    });
    res.json({ success: true, analytics: result.data });
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Checkpoint Quiz endpoint
app.post('/api/quiz', async (req, res) => {
  try {
    const { technologies } = req.body;
    const apiKey = getApiKey(req);
    const result = await dispatchAgentRoute({
      intent: 'QUIZ',
      payload: { technologies: technologies || ['Python', 'React'] },
      apiKey
    });
    res.json({ success: true, quiz: result.data });
  } catch (error) {
    console.error('Quiz API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Builder API endpoint — dedicated AI Builder agent
app.post('/api/builder', async (req, res) => {
  try {
    const { prompt, isProblemStatement } = req.body;
    const apiKey = getApiKey(req);

    const builderPrompt = `You are an expert software architect and senior developer.
A user wants to build: "${prompt}"

Provide a concise, practical project plan in this exact format:

🎯 **What We're Building**
[1-2 sentence summary of the product]

🛠️ **Recommended Tech Stack**
- Frontend: [framework]
- Backend: [framework/language]
- Database: [database]
- AI/Extra: [optional AI or libraries]

✨ **Core Features (MVP)**
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]
4. [Feature 4]

🗺️ **Quick Build Plan (4 Weeks)**
- Week 1: [Setup + Database schema]
- Week 2: [Core backend API]
- Week 3: [Frontend UI + API connection]
- Week 4: [Polish, test, deploy]

💡 **Pro Tip**
[One specific actionable tip to make this project stand out]

Keep the response concise, practical and encouraging. No fluff.`;

    const result = await dispatchAgentRoute({
      intent: 'MENTOR',
      payload: {
        message: builderPrompt,
        history: [],
        activeProject: null,
        studentProfile: {}
      },
      apiKey
    });

    const isActionable = (prompt || '').length > 15;

    res.json({
      success: true,
      reply: result.data,
      showBuildButton: isActionable
    });
  } catch (error) {
    console.error('Builder API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Attendance App API ─────────────────────────────────────────────────────

// GET /api/attendance/students
app.get('/api/attendance/students', (req, res) => {
  res.json({ success: true, students: getStudents() });
});

// POST /api/attendance/students  — add student
app.post('/api/attendance/students', (req, res) => {
  try {
    const student = addStudent(req.body);
    res.json({ success: true, student });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// DELETE /api/attendance/students/:id
app.delete('/api/attendance/students/:id', (req, res) => {
  removeStudent(req.params.id);
  res.json({ success: true });
});

// GET /api/attendance/summary  — per-student percentage
app.get('/api/attendance/summary', (req, res) => {
  res.json({ success: true, summary: getAttendanceSummary() });
});

// GET /api/attendance/today?date=YYYY-MM-DD
app.get('/api/attendance/today', (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  res.json({ success: true, ...getTodayRecord(date) });
});

// GET /api/attendance/records?studentId=&date=&dateFrom=&dateTo=
app.get('/api/attendance/records', (req, res) => {
  const records = getRecords(req.query);
  res.json({ success: true, records });
});

// POST /api/attendance/mark  — mark one or many students
// body: { entries: [{studentId, date, status}], markedBy }
app.post('/api/attendance/mark', (req, res) => {
  try {
    const { entries, markedBy } = req.body;
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ success: false, error: 'entries array required' });
    }
    const results = markAttendance(entries, markedBy || 'admin');
    res.json({ success: true, marked: results.length, records: results });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/attendance/voice  — NLP voice command handler
app.post('/api/attendance/voice', (req, res) => {
  try {
    const { command } = req.body;
    const cmd = (command || '').toLowerCase().trim();
    const students = getStudents();
    const today = new Date().toISOString().split('T')[0];

    // Pattern: "mark <name> present/absent"
    const markMatch = cmd.match(/mark\s+(.+?)\s+(present|absent)/);
    if (markMatch) {
      const namePart = markMatch[1].trim();
      const status = markMatch[2];
      const found = students.find(s => s.name.toLowerCase().includes(namePart));
      if (found) {
        markAttendance([{ studentId: found.id, date: today, status }], 'voice');
        return res.json({ success: true, action: 'mark', student: found, status, message: `Marked ${found.name} as ${status}.` });
      }
      return res.json({ success: false, action: 'mark', message: `Student "${namePart}" not found.` });
    }

    // Pattern: "add <name>"
    const addMatch = cmd.match(/add\s+(.+)/);
    if (addMatch) {
      const name = addMatch[1].trim().replace(/[^a-zA-Z ]/g, '');
      if (name.length > 1) {
        const student = addStudent({ name });
        return res.json({ success: true, action: 'add', student, message: `Added student ${student.name}.` });
      }
    }

    // Pattern: "show students below <N>%"
    const belowMatch = cmd.match(/below\s+(\d+)/);
    if (belowMatch) {
      const threshold = parseInt(belowMatch[1], 10);
      const summary = getAttendanceSummary().filter(s => s.percentage < threshold);
      return res.json({ success: true, action: 'filter', threshold, students: summary, message: `${summary.length} student(s) below ${threshold}%.` });
    }

    // Pattern: "show attendance for <name>"
    const showMatch = cmd.match(/show\s+(?:attendance\s+(?:for|of)\s+)?(.+)/);
    if (showMatch) {
      const namePart = showMatch[1].trim();
      const found = students.find(s => s.name.toLowerCase().includes(namePart));
      if (found) {
        const summary = getAttendanceSummary().find(s => s.id === found.id);
        return res.json({ success: true, action: 'show', student: summary, message: `${found.name}: ${summary.percentage}% attendance.` });
      }
    }

    res.json({ success: false, action: 'unknown', message: 'Command not recognized. Try: "Mark Rahul present", "Add Priya", "Show students below 75%".' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ─── Start listening ─────────────────────────────────────────────────────────
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 ProjectPilot AI Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 AI Provider: ${config.geminiApiKey ? 'Gemini API' : 'Dynamic Intelligent Fallback'}`);
  console.log(`📋 Attendance API: http://localhost:${PORT}/api/attendance/students`);
  console.log(`=======================================================`);
});
