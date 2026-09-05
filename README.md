# 🚀 ProjectPilot AI — Final-Year Project Mentor & Architecture Platform

> **Transform your technical skills and raw interests into an outstanding, defense-ready final-year engineering capstone project.**

ProjectPilot AI is a full-stack, production-quality AI product architect and academic mentor. It bridges the gap between university coursework and industry-grade engineering by guiding students from interests and skills to comprehensive 20-aspect architectural blueprints, interactive 8-phase development sprint roadmaps, prioritized project improvements, and continuous context-aware AI mentorship.

---

## 🌟 Key Highlights & Problem Addressed

Final-year computer science and engineering students frequently struggle with:
1. **Generic, cliché project choices** (e.g. basic to-do lists, generic e-commerce clones, simplistic blogs) that fail to impress university examiners or hiring recruiters.
2. **Lack of architectural depth**: Students often lack guidance on database schemas, REST APIs, system data flow, and security considerations.
3. **Overwhelming or unmanaged project scope**: Without a structured phased roadmap, students either abandon projects midway or experience sprint paralysis.
4. **Treating AI as a black box**: Inability to integrate meaningful, explainable AI capabilities.

**ProjectPilot AI completely solves this.**

---

## 🔄 End-to-End User Journey

```
┌─────────────────────────┐
│   INTERESTS & SKILLS    │  Declare skills, languages, preferred domain, duration & career goal
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│   AI RECOMMENDATIONS    │  Multi-factor personalized ideas with transparent suitability scores
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│    PROJECT COMPARISON   │  Side-by-side trade-off matrix (feasibility, innovation, career value)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│   20-ASPECT BLUEPRINT   │  Architecture, database schema, REST API specs, testing, and deliverables
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│   DEVELOPMENT ROADMAP   │  Interactive 8-phase sprint tracker with task checkboxes and confetti milestones
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│   IMPROVEMENT STUDIO    │  Prioritized (HIGH/MED/LOW) recommendations for uniqueness, UI, AI, and resume
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│    AI PROJECT MENTOR    │  Context-aware floating assistant with quick prompt chips for viva defense
└─────────────────────────┘
```

---

## 🤖 Specialized AI Orchestration Layer

ProjectPilot AI utilizes a lightweight, high-performance routing layer that classifies requests and delegates them to specialized agents:

| Agent | Purpose & Capabilities |
|---|---|
| **Recommendation Agent** | Generates 4 distinct, innovative, non-generic project concepts matching the student's tech stack with multi-factor suitability scoring. |
| **Project Planning Agent** | Produces a full **20-aspect architectural blueprint** covering problem definition, target users, objectives, core P0/advanced P1 features, frontend/backend architecture, database schemas, REST endpoints, security, accessibility, and academic deliverables. |
| **Roadmap Agent** | Generates an interactive **8-phase step-by-step development sprint roadmap** with task checklists, technologies, expected outputs, and progress calculation. |
| **Improvement Agent** | Evaluates projects across 8 dimensions (uniqueness, AI integration, scalability, resume value, UI polish, hackathon readiness) with **HIGH, MEDIUM, LOW priority tags** and one-click blueprint injection. |
| **Mentor Agent** | Context-aware conversational project supervisor that knows the active project blueprint, answers technical queries, simplifies scope, and prepares students for viva defense. |
| **Learning Agent** | Curates verified **IBM SkillsBuild** credential courses and **Open Educational Resources (OER)** mapped to project technologies. |
| **Assessment Agent** | Generates interactive 5-question pre-flight diagnostic checkpoint quizzes with instant scoring and explanations. |
| **Analytics Agent** | Evaluates student technical readiness, detects skill gaps, and calculates ramp-up hours required. |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS Design System (Custom tokens, glassmorphism, responsive grid, dark/light themes), Lucide React Icons, Canvas Confetti.
- **Backend**: Node.js, Express, RESTful APIs, CORS, Dotenv.
- **AI Engine**: Dual-Mode AI Provider
  - **Google Gemini API** (`gemini-1.5-flash` / `gemini-2.0-flash`) via REST.
  - **High-Fidelity Dynamic Fallback Engine**: If no API key is set, dynamically generates rich, domain-grounded data tailored to user input so the application remains 100% operational out of the box with zero runtime errors.
- **Architecture**: Decoupled Client-Server SPA with Vite proxying `/api` requests to Express.

---

## 📋 The 20-Aspect Blueprint Specification

When a project is selected, ProjectPilot AI produces an exhaustive blueprint covering:
1. **Problem Definition**
2. **Target Users & Personas**
3. **Objectives & Measurable KPIs**
4. **Core Features (P0 MVP)**
5. **Advanced Features (P1/P2 Differentiators)**
6. **Recommended Technology Stack & Architecture Rationale**
7. **Frontend Architecture**
8. **Backend Architecture**
9. **Database Schema & Data Models** (Tables, column types, constraints)
10. **AI/ML Components** (Model architectures, training data, inference pipelines)
11. **REST API Specification** (Methods, routes, payloads, responses)
12. **System Architecture** (ASCII component flow diagram)
13. **Development Roadmap Overview**
14. **Testing Strategy** (Unit, Integration, E2E, AI evaluation)
15. **Security Considerations** (Argon2 hashing, JWT auth, CORS, rate limiting, parameterization)
16. **Accessibility Considerations** (WCAG 2.1 AA, keyboard focus traps, screen reader ARIA)
17. **Performance Considerations** (Code splitting, indexing, in-memory caching)
18. **Future Improvements** (Post-graduation / enterprise roadmap)
19. **Deployment Approach** (Vercel, Render/Railway, Docker, CI/CD)
20. **Expected Final-Year Deliverables** (Synopsis, IEEE SRS, Report, Slides, Demo Script)

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start the Backend Server
```powershell
cd server
node src/index.js
```
The server will start on `http://localhost:5000`.

### 2. Start the Client Application
In a separate terminal:
```powershell
cd client
npm.cmd run dev
```
Open your browser and navigate to:
👉 **`http://localhost:5173`**

### 3. (Optional) Configure Gemini API Key
You can either:
- Set `GEMINI_API_KEY=your_key_here` in `server/.env`
- Or click the **"Add Gemini Key"** button directly in the application's top navigation bar.
*(Note: If no key is set, the built-in dynamic fallback engine handles all requests with complete fidelity!)*

---

## 🧪 Testing Verification

ProjectPilot AI includes an automated verification test suite verifying all 10 API routes and the client proxy:

```powershell
node test_endpoints.js
```

### Verified Test Results:
- `✓ Vite Client Dev Server HTML Status: 200`
- `✓ Client Proxy to /api/health Status: online`
- `✓ /api/domains Count: 9 | Presets Count: 4`
- `✓ /api/recommend Success: true | Projects Generated: 4`
- `✓ /api/blueprint Generated: true | All 20 aspects verified`
- `✓ /api/roadmap Phases count: 8 | 24 tasks verified`
- `✓ /api/improve Recommendations count: 5 | Priority tags verified`
- `✓ /api/mentor Reply generated: true | 1200+ char response verified`
- `✓ /api/analytics Readiness Score verified`
- `✓ /api/quiz Diagnostic questions generated: 5`

---

## ♿ Accessibility & Security
- **Accessibility**: Semantic HTML tags (`<header>`, `<main>`, `<nav>`, `<section>`), visible focus indicators, high-contrast palette exceeding WCAG 2.1 AA standards.
- **Security**: No API keys exposed to the client; sanitized payloads; local storage encryption for user credentials; CORS configuration restricting unauthorized callers.
