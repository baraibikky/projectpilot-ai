import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Cpu,
  Layers,
  Shield,
  Eye,
  Zap,
  GraduationCap,
  Server,
  Database,
  Terminal,
  Activity,
  ArrowRight
} from 'lucide-react';

export function BlueprintViewer({ project, blueprint, onOpenRoadmap, onOpenImprovement }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [copied, setCopied] = useState(false);

  if (!blueprint) {
    return (
      <div className="card text-center" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <FileText size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
        <h3>No Blueprint Selected Yet</h3>
        <p style={{ maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
          Select a project idea from the Recommendations tab or configure your student profile to generate a complete 20-aspect architectural blueprint.
        </p>
      </div>
    );
  }

  // Export as formatted Markdown
  const exportAsMarkdown = () => {
    let md = `# Project Blueprint: ${project?.title || 'Final-Year Project'}\n\n`;
    md += `**Difficulty:** ${project?.difficulty || 'Intermediate'} | **Timeline:** ${project?.estimatedTime || '10-12 weeks'}\n\n`;
    md += `## 1. Problem Definition\n${blueprint.problemDefinition}\n\n`;
    
    md += `## 2. Target Users\n`;
    (blueprint.targetUsers || []).forEach(u => { md += `- ${u}\n`; });
    md += `\n`;

    md += `## 3. Objectives & KPIs\n`;
    (blueprint.objectives || []).forEach(o => { md += `- ${o}\n`; });
    md += `\n`;

    md += `## 4. Core Features (MVP)\n`;
    (blueprint.coreFeatures || []).forEach(f => {
      md += `- **[${f.priority || 'P0'}] ${f.title}**: ${f.description}\n`;
    });
    md += `\n`;

    md += `## 5. Advanced Features\n`;
    (blueprint.advancedFeatures || []).forEach(f => {
      md += `- **[${f.priority || 'P1'}] ${f.title}**: ${f.description}\n`;
    });
    md += `\n`;

    md += `## 6. Recommended Technology Stack\n`;
    const tech = blueprint.recommendedTechStack || {};
    md += `- **Frontend:** ${tech.frontend}\n`;
    md += `- **Backend:** ${tech.backend}\n`;
    md += `- **Database:** ${tech.database}\n`;
    md += `- **AI/ML:** ${tech.aiMl}\n`;
    md += `- **DevOps:** ${tech.devops}\n`;
    md += `- **Rationale:** ${tech.rationale}\n\n`;

    md += `## 7. Frontend Architecture\n${blueprint.frontendArchitecture}\n\n`;
    md += `## 8. Backend Architecture\n${blueprint.backendArchitecture}\n\n`;

    md += `## 9. Database Schema & Data Models\n`;
    (blueprint.databaseSchema || []).forEach(table => {
      md += `### Table: \`${table.tableName}\` (${table.purpose})\n`;
      md += `| Column | Type | Constraints |\n|---|---|---|\n`;
      (table.columns || []).forEach(col => {
        md += `| \`${col.name}\` | ${col.type} | ${col.constraints} |\n`;
      });
      md += `\n`;
    });

    md += `## 10. AI / ML Components\n`;
    (blueprint.aiMlComponents || []).forEach(comp => {
      md += `### ${comp.name}\n`;
      md += `- **Architecture:** ${comp.modelArchitecture}\n`;
      md += `- **Training Data:** ${comp.trainingData}\n`;
      md += `- **Inference Pipeline:** ${comp.inferencePipeline}\n\n`;
    });

    md += `## 11. API Requirements & Endpoints\n`;
    md += `| Method | Route | Purpose | Sample Request |\n|---|---|---|---|\n`;
    (blueprint.apiEndpoints || []).forEach(api => {
      md += `| **${api.method}** | \`${api.route}\` | ${api.purpose} | \`${api.requestPayload}\` |\n`;
    });
    md += `\n`;

    md += `## 12. System Architecture\n\`\`\`\n${blueprint.systemArchitecture?.diagramAscii || ''}\n\`\`\`\n\n`;
    md += `${blueprint.systemArchitecture?.dataFlowExplanation || ''}\n\n`;

    md += `## 13. Development Roadmap Overview\n${blueprint.developmentRoadmapOverview}\n\n`;

    md += `## 14. Testing Strategy\n`;
    const test = blueprint.testingStrategy || {};
    md += `- **Unit Testing:** ${test.unitTesting}\n`;
    md += `- **Integration Testing:** ${test.integrationTesting}\n`;
    md += `- **E2E Testing:** ${test.e2eTesting}\n`;
    md += `- **AI Evaluation:** ${test.aiEvaluation}\n\n`;

    md += `## 15. Security Considerations\n`;
    (blueprint.securityConsiderations || []).forEach(s => { md += `- ${s}\n`; });
    md += `\n`;

    md += `## 16. Accessibility Considerations\n`;
    (blueprint.accessibilityConsiderations || []).forEach(a => { md += `- ${a}\n`; });
    md += `\n`;

    md += `## 17. Performance Considerations\n`;
    (blueprint.performanceConsiderations || []).forEach(p => { md += `- ${p}\n`; });
    md += `\n`;

    md += `## 18. Future Improvements\n`;
    (blueprint.futureImprovements || []).forEach(f => { md += `- ${f}\n`; });
    md += `\n`;

    md += `## 19. Deployment Approach\n`;
    const dep = blueprint.deploymentApproach || {};
    md += `- **Hosting:** ${dep.hosting}\n`;
    md += `- **CI/CD:** ${dep.ciCd}\n`;
    md += `- **Monitoring:** ${dep.monitoring}\n\n`;

    md += `## 20. Expected Final-Year Project Deliverables\n`;
    (blueprint.finalYearDeliverables || []).forEach(d => { md += `- [ ] ${d}\n`; });

    return md;
  };

  const handleCopyMarkdown = () => {
    const md = exportAsMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const md = exportAsMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(project?.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-blueprint.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: 'overview', label: '1. Problem & Objectives', icon: FileText },
    { id: 'features', label: '2. Core & Advanced Features', icon: Zap },
    { id: 'tech-arch', label: '3. Architecture & Tech Stack', icon: Cpu },
    { id: 'schema-apis', label: '4. Database & REST APIs', icon: Database },
    { id: 'testing-sec', label: '5. Security, Tests & A11y', icon: Shield },
    { id: 'deliverables', label: '6. Academic Deliverables', icon: GraduationCap }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Action Header */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald">20-Aspect Architectural Blueprint</span>
              <span className="badge badge-purple">{project?.difficulty || 'Intermediate'}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{project?.title}</h2>
          </div>

          {/* Export & Next Step Buttons */}
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="btn btn-secondary btn-sm flex items-center gap-1"
              title="Copy full blueprint as Markdown"
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied MD!' : 'Copy Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="btn btn-secondary btn-sm flex items-center gap-1"
              title="Download blueprint as .md file"
            >
              <Download size={14} />
              <span>Download .MD</span>
            </button>

            <button
              type="button"
              onClick={onOpenRoadmap}
              className="btn btn-primary btn-sm flex items-center gap-1"
            >
              <span>View Interactive Roadmap</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="tabs-nav" style={{ marginTop: '1.25rem' }}>
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                type="button"
                className={`tab-btn ${activeSection === sec.id ? 'active' : ''}`}
                onClick={() => setActiveSection(sec.id)}
              >
                <Icon size={14} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Problem, Target Users, Objectives */}
      {activeSection === 'overview' && (
        <div className="grid" style={{ gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <FileText size={18} color="var(--accent-primary)" />
              <span>1. Problem Definition</span>
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
              {blueprint.problemDefinition}
            </p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Eye size={18} color="var(--accent-cyan)" />
                <span>2. Target Users & Personas</span>
              </h3>
              <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(blueprint.targetUsers || []).map((user, idx) => (
                  <li key={idx} className="flex items-start gap-2" style={{ fontSize: '0.9rem' }}>
                    <span className="badge badge-cyan" style={{ minWidth: '24px', justifyContent: 'center' }}>{idx + 1}</span>
                    <span>{user}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Activity size={18} color="var(--accent-emerald)" />
                <span>3. Project Objectives & KPIs</span>
              </h3>
              <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(blueprint.objectives || []).map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2" style={{ fontSize: '0.9rem' }}>
                    <span className="badge badge-emerald" style={{ minWidth: '24px', justifyContent: 'center' }}>✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Core & Advanced Features */}
      {activeSection === 'features' && (
        <div className="grid" style={{ gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Zap size={18} color="var(--accent-amber)" />
              <span>4. Core Features (P0 MVP Deliverables)</span>
            </h3>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {(blueprint.coreFeatures || []).map((feat, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.4rem' }}>
                    <span className="badge badge-rose">P0 Core</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Feature #{idx + 1}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{feat.title}</h4>
                  <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Cpu size={18} color="var(--accent-purple)" />
              <span>5. Advanced Features (P1/P2 Differentiators)</span>
            </h3>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {(blueprint.advancedFeatures || []).map((feat, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.4rem' }}>
                    <span className="badge badge-purple">{feat.priority || 'P1'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Advanced #{idx + 1}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{feat.title}</h4>
                  <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Architecture & Tech Stack */}
      {activeSection === 'tech-arch' && (
        <div className="grid" style={{ gap: '1.5rem' }}>
          {/* Tech Stack Breakdown */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Layers size={18} color="var(--accent-cyan)" />
              <span>6. Recommended Technology Stack & Rationale</span>
            </h3>
            
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Frontend</span>
                <strong style={{ color: 'var(--text-accent)' }}>{blueprint.recommendedTechStack?.frontend}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Backend</span>
                <strong style={{ color: '#a855f7' }}>{blueprint.recommendedTechStack?.backend}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Database</span>
                <strong style={{ color: '#f59e0b' }}>{blueprint.recommendedTechStack?.database}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>AI / ML</span>
                <strong style={{ color: '#10b981' }}>{blueprint.recommendedTechStack?.aiMl}</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-primary)', margin: 0 }}>
              <strong>Architecture Rationale:</strong> {blueprint.recommendedTechStack?.rationale}
            </p>
          </div>

          {/* System Architecture Diagram (ASCII) */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Server size={18} color="var(--accent-primary)" />
              <span>12. System Architecture & Component Data Flow</span>
            </h3>
            
            <pre style={{
              background: 'var(--bg-app)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.825rem',
              color: '#38bdf8',
              overflowX: 'auto',
              lineHeight: 1.4,
              marginBottom: '1rem'
            }}>
              {blueprint.systemArchitecture?.diagramAscii}
            </pre>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              <strong>Data Flow:</strong> {blueprint.systemArchitecture?.dataFlowExplanation}
            </p>
          </div>

          {/* Frontend & Backend Architecture details */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
              <h4 style={{ marginBottom: '0.5rem' }}>7. Frontend Architecture</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{blueprint.frontendArchitecture}</p>
            </div>
            <div className="card">
              <h4 style={{ marginBottom: '0.5rem' }}>8. Backend Architecture</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{blueprint.backendArchitecture}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Database Schema & REST APIs */}
      {activeSection === 'schema-apis' && (
        <div className="grid" style={{ gap: '1.5rem' }}>
          {/* Database Tables */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Database size={18} color="var(--accent-amber)" />
              <span>9. Database Schema & Data Models</span>
            </h3>

            <div className="grid" style={{ gap: '1.25rem' }}>
              {(blueprint.databaseSchema || []).map((table, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                    <code style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>table: {table.tableName}</code>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>— {table.purpose}</span>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.4rem 0.6rem' }}>Column</th>
                          <th style={{ padding: '0.4rem 0.6rem' }}>Data Type</th>
                          <th style={{ padding: '0.4rem 0.6rem' }}>Constraints</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(table.columns || []).map((col, cIdx) => (
                          <tr key={cIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{col.name}</td>
                            <td style={{ padding: '0.4rem 0.6rem', color: 'var(--accent-purple)' }}>{col.type}</td>
                            <td style={{ padding: '0.4rem 0.6rem', color: 'var(--text-muted)' }}>{col.constraints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Endpoints */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Terminal size={18} color="var(--accent-emerald)" />
              <span>11. REST API Specification & Endpoints</span>
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Method</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Route</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Purpose</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Sample Request / Response</th>
                  </tr>
                </thead>
                <tbody>
                  {(blueprint.apiEndpoints || []).map((api, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <span className={`badge ${api.method === 'GET' ? 'badge-emerald' : api.method === 'POST' ? 'badge-cyan' : 'badge-amber'}`} style={{ fontWeight: 700 }}>
                          {api.method}
                        </span>
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{api.route}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>{api.purpose}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <code style={{ fontSize: '0.75rem', background: 'var(--bg-app)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                          {api.requestPayload || 'None'}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: Testing, Security, Accessibility, Performance */}
      {activeSection === 'testing-sec' && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Security */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Shield size={18} color="var(--accent-rose)" />
              <span>15. Security Considerations</span>
            </h3>
            <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(blueprint.securityConsiderations || []).map((sec, idx) => (
                <li key={idx} className="flex items-start gap-2" style={{ fontSize: '0.85rem' }}>
                  <span className="badge badge-rose" style={{ minWidth: '20px', justifyContent: 'center' }}>🔒</span>
                  <span>{sec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Eye size={18} color="var(--accent-cyan)" />
              <span>16. Accessibility (WCAG 2.1 AA)</span>
            </h3>
            <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(blueprint.accessibilityConsiderations || []).map((acc, idx) => (
                <li key={idx} className="flex items-start gap-2" style={{ fontSize: '0.85rem' }}>
                  <span className="badge badge-cyan" style={{ minWidth: '20px', justifyContent: 'center' }}>♿</span>
                  <span>{acc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testing */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Activity size={18} color="var(--accent-emerald)" />
              <span>14. Testing Strategy</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <div>
                <strong>Unit Tests:</strong> <span style={{ color: 'var(--text-secondary)' }}>{blueprint.testingStrategy?.unitTesting}</span>
              </div>
              <div>
                <strong>Integration:</strong> <span style={{ color: 'var(--text-secondary)' }}>{blueprint.testingStrategy?.integrationTesting}</span>
              </div>
              <div>
                <strong>E2E / Journeys:</strong> <span style={{ color: 'var(--text-secondary)' }}>{blueprint.testingStrategy?.e2eTesting}</span>
              </div>
              <div>
                <strong>AI Evaluation:</strong> <span style={{ color: 'var(--text-secondary)' }}>{blueprint.testingStrategy?.aiEvaluation}</span>
              </div>
            </div>
          </div>

          {/* Performance & Deployment */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Zap size={18} color="var(--accent-amber)" />
              <span>17 & 19. Performance & Deployment</span>
            </h3>
            <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {(blueprint.performanceConsiderations || []).map((perf, idx) => (
                <li key={idx} className="flex items-start gap-2" style={{ fontSize: '0.85rem' }}>
                  <span className="badge badge-amber" style={{ minWidth: '20px', justifyContent: 'center' }}>⚡</span>
                  <span>{perf}</span>
                </li>
              ))}
            </ul>
            <div style={{ fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
              <strong>Hosting & CI/CD:</strong> {blueprint.deploymentApproach?.hosting} | {blueprint.deploymentApproach?.ciCd}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: Academic Deliverables */}
      {activeSection === 'deliverables' && (
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <GraduationCap size={20} color="var(--accent-primary)" />
            <span>20. Expected Final-Year Project Deliverables</span>
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Academic artifacts required by university examiners to secure top marks during midterm evaluations and final project viva defense.
          </p>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {(blueprint.finalYearDeliverables || []).map((del, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span className="badge badge-purple" style={{ minWidth: '24px', justifyContent: 'center' }}>{idx + 1}</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>{del}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mandatory for project defense</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onOpenImprovement}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Zap size={16} color="var(--accent-amber)" />
              <span>Explore High-Impact Improvements</span>
            </button>

            <button
              type="button"
              onClick={onOpenRoadmap}
              className="btn btn-primary flex items-center gap-2"
            >
              <span>Launch 8-Phase Dev Roadmap</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
