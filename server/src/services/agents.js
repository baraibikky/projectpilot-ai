import { callGeminiApi } from './aiProvider.js';
import { DOMAINS, EDUCATIONAL_RESOURCES, ASSESSMENT_QUESTION_BANK } from '../data/seedData.js';

// Helper to calculate realistic suitability scores
function calculateSuitabilityScores(profile, projectDifficulty = 'Intermediate') {
  const skillCount = (profile.skills || []).length;
  const techCount = (profile.technologies || []).length;
  
  let skillMatch = Math.min(96, Math.max(68, 70 + skillCount * 4));
  let interestMatch = Math.min(98, Math.max(75, 82 + (profile.interests || []).length * 4));
  
  let feasibility = 88;
  if (projectDifficulty === 'Advanced' && profile.difficulty === 'Beginner') feasibility = 68;
  else if (projectDifficulty === 'Advanced' && profile.difficulty === 'Advanced') feasibility = 92;
  else if (projectDifficulty === 'Intermediate') feasibility = 86;

  const innovation = Math.floor(Math.random() * 10) + 86; // 86 - 95
  const careerRelevance = Math.floor(Math.random() * 8) + 90; // 90 - 97
  const complexity = projectDifficulty === 'Advanced' ? 88 : projectDifficulty === 'Intermediate' ? 72 : 55;

  const overall = Math.round((skillMatch * 0.3) + (interestMatch * 0.25) + (feasibility * 0.2) + (innovation * 0.15) + (careerRelevance * 0.1));

  return {
    overall,
    skillMatch,
    interestMatch,
    feasibility,
    innovation,
    careerRelevance,
    complexity
  };
}

/**
 * 1. RECOMMENDATION AGENT
 */
export async function runRecommendationAgent(profile, apiKey = null) {
  const prompt = `You are a Principal Software Architect and Final-Year University Project Mentor.
Generate 4 highly innovative, practical, non-generic final-year project ideas tailored for this student:

STUDENT PROFILE:
- Skills: ${(profile.skills || []).join(', ') || 'Python, JavaScript'}
- Programming Languages: ${(profile.languages || []).join(', ') || 'Python'}
- Technologies Known: ${(profile.technologies || []).join(', ') || 'React, SQL'}
- Areas of Interest: ${(profile.interests || []).join(', ') || 'AI, Web Development'}
- Preferred Domain: ${profile.domain || 'Artificial Intelligence'}
- Difficulty Level: ${profile.difficulty || 'Intermediate'}
- Project Mode: ${profile.projectType || 'Individual'}
- Duration: ${profile.duration || '3 months'}
- Preferred Project Type: ${profile.preferredType || 'Full-Stack Web'}
- Career Goal: ${profile.careerGoal || 'Software Engineer'}
- Student Idea Notes: ${profile.description || 'None provided'}

Return a JSON array with exactly 4 project objects. Each object MUST have this structure:
[
  {
    "id": "project-slug-id",
    "title": "Clear, compelling project name",
    "shortDescription": "2-3 punchy sentences explaining what it does",
    "problemStatement": "The specific real-world problem being solved",
    "whyMatch": "Explicit reason why this matches their specific skills and career goals",
    "innovation": "What makes this stand out from generic student projects",
    "difficulty": "Beginner" | "Intermediate" | "Advanced",
    "estimatedTime": "e.g. 10-12 weeks",
    "teamRecommendation": "Individual" or "Team of 2-3",
    "recommendedTech": {
      "frontend": "e.g. React 18 / Vite",
      "backend": "e.g. FastAPI / Node.js",
      "database": "e.g. PostgreSQL / MongoDB",
      "aiMl": "e.g. PyTorch, Hugging Face, Gemini API",
      "devops": "e.g. Docker, GitHub Actions, Render"
    },
    "aiUsage": "Detailed description of how AI/ML is integrated",
    "expectedOutcome": "Tangible working deliverable by end of project",
    "careerRelevance": "How this bolsters resume for target role",
    "scalability": "Potential to scale from prototype to real users",
    "suitabilityScore": {
      "overall": 92,
      "skillMatch": 94,
      "interestMatch": 90,
      "feasibility": 88,
      "innovation": 95,
      "careerRelevance": 96,
      "complexity": 75
    }
  }
]`;

  try {
    const result = await callGeminiApi({
      prompt,
      systemInstruction: 'You are an elite academic project supervisor and tech lead. Output valid JSON only without markdown fences.',
      apiKey,
      temperature: 0.6,
      jsonMode: true
    });

    if (Array.isArray(result) && result.length > 0) {
      return result;
    }
    if (result && Array.isArray(result.projects)) {
      return result.projects;
    }
  } catch (err) {
    console.log('Using Dynamic Recommendation Fallback Engine:', err.message);
  }

  // High-fidelity dynamic fallback generator tailored to student inputs
  return generateDynamicFallbackRecommendations(profile);
}

function generateDynamicFallbackRecommendations(profile) {
  const domain = profile.domain || 'Healthcare & Medical Tech';
  const skills = profile.skills?.length ? profile.skills : ['Python', 'React', 'SQL'];
  const primaryLang = profile.languages?.[0] || skills[0] || 'Python';
  const career = profile.careerGoal || 'Software Engineer';
  const diff = profile.difficulty || 'Intermediate';
  const duration = profile.duration || '3 months';

  const isHealth = domain.toLowerCase().includes('health') || (profile.interests || []).some(i => i.toLowerCase().includes('health'));
  const isFintech = domain.toLowerCase().includes('fintech') || (profile.interests || []).some(i => i.toLowerCase().includes('fin'));
  const isCyber = domain.toLowerCase().includes('cyber') || (profile.interests || []).some(i => i.toLowerCase().includes('sec'));
  const isAgri = domain.toLowerCase().includes('agri') || (profile.interests || []).some(i => i.toLowerCase().includes('farm'));

  if (isHealth) {
    return [
      {
        id: 'mediscan-ai-triage',
        title: 'MediScan AI: Multi-Modal Patient Triage & Retinal Anomaly Flagging',
        shortDescription: 'A clinical decision-support portal that ingests fundus scans and clinical patient vitals to prioritize urgent ophthalmology referrals using a vision transformer pipeline.',
        problemStatement: 'Rural clinics face a 4-month backlog for specialist ophthalmology screenings, leading to preventable vision loss from diabetic retinopathy and glaucoma.',
        whyMatch: `Leverages your proficiency in ${primaryLang} and interest in ${domain}. Perfectly positions you for ${career} roles requiring multimodal data pipelines.`,
        innovation: 'Cross-attention fusion between tabular patient vitals (HbA1c, BP) and imaging data, outputting calibrated uncertainty confidence bounds.',
        difficulty: diff,
        estimatedTime: duration,
        teamRecommendation: profile.projectType || 'Individual',
        recommendedTech: {
          frontend: 'React 18 / Vite with Tailwind UI & Canvas DICOM Viewer',
          backend: primaryLang.toLowerCase().includes('python') ? 'FastAPI (Asynchronous REST)' : 'Node.js Express + Python Microservice',
          database: 'PostgreSQL with pgvector for patient vector embeddings',
          aiMl: 'PyTorch Vision Transformer (ViT) & Gemini API for clinical report summarization',
          devops: 'Docker containerization, GitHub Actions CI/CD'
        },
        aiUsage: 'Vision Transformer trained on EyePACS dataset with Grad-CAM visual heatmaps and Gemini-powered patient discharge summaries.',
        expectedOutcome: 'A HIPAA-conscious web application capable of classifying retinal lesions with 92%+ F1-score and generating physician audit trails.',
        careerRelevance: `Demonstrates real-world Computer Vision and full-stack medical informatics, top-tier portfolio evidence for ${career} positions.`,
        scalability: 'Microservice container architecture can horizontally scale across distributed hospital EHR queues.',
        suitabilityScore: calculateSuitabilityScores(profile, diff)
      },
      {
        id: 'vitalguard-icu-forecast',
        title: 'VitalGuard: Real-Time ICU Sepsis Early-Warning & Deterioration Predictor',
        shortDescription: 'An automated telemetry monitoring agent that streams continuous physiological signals (HR, SpO2, MAP) to predict sepsis onset 6 hours prior to clinical shock.',
        problemStatement: 'Sepsis mortality increases 8% per hour of delayed antibiotic treatment; traditional threshold-based hospital monitors trigger severe alarm fatigue.',
        whyMatch: `Directly builds upon your ${skills.slice(0, 3).join(', ')} background, giving you end-to-end telemetry and time-series ML credentials.`,
        innovation: 'Temporal Convolutional Network with Dynamic Time Warping to suppress false positive clinical alarms by 40%.',
        difficulty: diff === 'Beginner' ? 'Intermediate' : diff,
        estimatedTime: duration,
        teamRecommendation: 'Team (2-3) or Individual',
        recommendedTech: {
          frontend: 'React with Recharts real-time streaming dashboard',
          backend: 'FastAPI / WebSocket streaming server',
          database: 'TimescaleDB (Time-series PostgreSQL extension)',
          aiMl: 'XGBoost + LSTM ensemble model with SHAP explainability values',
          devops: 'Docker, Prometheus alert metrics, Grafana'
        },
        aiUsage: 'Time-series recurrent neural net predicting organ failure probability trajectory with real-time SHAP feature attribution.',
        expectedOutcome: 'Live clinical ward dashboard displaying bed occupancy, alert severity scores, and instant countermeasure guidelines.',
        careerRelevance: `Direct proof of streaming telemetry and explainable ML, highly attractive for ${career} applicants.`,
        scalability: 'WebSocket pub/sub architecture supporting hundreds of concurrent patient telemetry streams.',
        suitabilityScore: calculateSuitabilityScores(profile, diff)
      },
      {
        id: 'pharma-assist-rag',
        title: 'PharmIQ: Contextual Drug-Drug Interaction Checker with Hybrid RAG',
        shortDescription: 'An intelligent pharmacological safety copilot using graph retrieval-augmented generation to cross-verify multi-drug prescriptions against FDA OpenFDA safety monographs.',
        problemStatement: 'Adverse Drug Reactions (ADRs) account for over 100,000 deaths annually in the US alone due to polypharmacy in elderly patients with complex prescriptions.',
        whyMatch: `Combines modern GenAI RAG techniques with your ${skills.join(', ')} skills to solve high-impact clinical safety problems.`,
        innovation: 'Hybrid Knowledge Graph + Vector DB lookup that detects secondary metabolic pathway conflicts beyond simple keyword matching.',
        difficulty: 'Intermediate',
        estimatedTime: duration,
        teamRecommendation: profile.projectType || 'Individual',
        recommendedTech: {
          frontend: 'React with accessible interactive medication timeline',
          backend: 'Python FastAPI with Pydantic contract validation',
          database: 'Neo4j Graph Database + PostgreSQL',
          aiMl: 'LangChain, Gemini 1.5 Pro, FAISS vector index',
          devops: 'Docker, AWS ECS / Render'
        },
        aiUsage: 'Bi-encoder semantic retrieval grounding clinical queries with strict citation verification and zero hallucination safeguards.',
        expectedOutcome: 'Full-stack prescription auditing portal with automated interaction graphs and patient-friendly dosage advisories.',
        careerRelevance: 'Validates cutting-edge RAG, Knowledge Graph traversal, and API engineering skills.',
        scalability: 'Graph cache ensures sub-100ms response times even for complex 10-drug combinations.',
        suitabilityScore: calculateSuitabilityScores(profile, 'Intermediate')
      },
      {
        id: 'neurovoice-parkinsons',
        title: 'NeuroAcoustic: Non-Invasive Acoustic Vocal Biomarker Screening for Neurodegeneration',
        shortDescription: 'A mobile-friendly acoustic diagnostic web app measuring sustained phonation jitter, shimmer, and vocal tremor to flag early parkinsonian symptoms.',
        problemStatement: 'Specialist neurological evaluations take months to schedule; subtle early vocal micro-tremors precede visible motor tremors by up to 5 years.',
        whyMatch: `Applies your ${primaryLang} abilities to signal processing and audio AI, a standout domain that immediately impresses recruiters.`,
        innovation: 'Browser-based Web Audio API spectral extraction paired with lightweight 1D-CNN running fast edge inference.',
        difficulty: diff === 'Beginner' ? 'Intermediate' : diff,
        estimatedTime: duration,
        teamRecommendation: 'Individual',
        recommendedTech: {
          frontend: 'React + Web Audio API / MediaRecorder API',
          backend: 'FastAPI / Librosa audio processing microservice',
          database: 'MongoDB Atlas with encrypted audio feature buckets',
          aiMl: 'Librosa acoustic feature pipeline + PyTorch 1D ResNet',
          devops: 'Docker, Vercel + Railway'
        },
        aiUsage: 'Mel-frequency cepstral coefficients (MFCCs) and pitch perturbation quotient classification via deep neural networks.',
        expectedOutcome: 'Interactive voice recording portal that computes a Vocal Impairment Index with longitudinal tracking.',
        careerRelevance: `Highlights rare Signal Processing and Edge AI competence, distinguishing you from standard CRUD developers.`,
        scalability: 'Stateless audio inference container handles thousands of audio snippets per minute.',
        suitabilityScore: calculateSuitabilityScores(profile, diff)
      }
    ];
  }

  if (isFintech) {
    return [
      {
        id: 'sentinel-fraud-gnn',
        title: 'SentinelPay: Graph Neural Network Real-Time Transaction Anti-Money Laundering',
        shortDescription: 'A fraud detection platform that models financial transaction graphs to detect cyclic laundering rings and mule account clusters in milliseconds.',
        problemStatement: 'Traditional rule-based fraud engines suffer from high false-positive rates and fail to uncover coordinated multi-hop smurfing attacks.',
        whyMatch: `Capitalizes on your ${skills.join(', ')} skills and builds a high-frequency financial engineering portfolio piece.`,
        innovation: 'Sub-graph isomorphism detection paired with inductive Graph Convolutional Networks (GCN) for sub-50ms inference.',
        difficulty: diff === 'Beginner' ? 'Intermediate' : diff,
        estimatedTime: duration,
        teamRecommendation: profile.projectType || 'Individual',
        recommendedTech: {
          frontend: 'React with interactive D3 / ForceGraph network visualization',
          backend: 'Node.js / FastAPI with Redis queue',
          database: 'Neo4j Graph Database + PostgreSQL',
          aiMl: 'PyTorch Geometric (PyG) + Gemini API fraud narrative generator',
          devops: 'Docker, Redis, Apache Kafka simulator'
        },
        aiUsage: 'GNN embedding propagation detecting topological anomalies combined with LLM automated Suspicious Activity Report (SAR) generation.',
        expectedOutcome: 'Compliance investigator portal with visual interactive money flow graphs and automated regulatory report export.',
        careerRelevance: `Essential credential for high-paying FinTech, Neobank, and quantitative risk engineering roles.`,
        scalability: 'Graph shard caching allowing inspection of millions of simulated transactions.',
        suitabilityScore: calculateSuitabilityScores(profile, diff)
      },
      {
        id: 'smart-expense-copilot',
        title: 'FinPilot: AI Financial Health Copilot & Autonomous Cash-Flow Forecaster',
        shortDescription: 'An open-banking personal finance management suite that uses synthetic transaction generation and prophet forecasting to optimize savings and tax deductions.',
        problemStatement: 'College students and gig-economy workers struggle with volatile income streams and miss out on eligible tax deductions due to poor receipt tracking.',
        whyMatch: `Directly matches your interest in ${domain} and leverages ${skills.slice(0, 3).join(', ')} to deliver a polished consumer product.`,
        innovation: 'Zero-shot OCR receipt parsing paired with time-series cash-flow runway forecasting with monte-carlo scenario simulations.',
        difficulty: 'Intermediate',
        estimatedTime: duration,
        teamRecommendation: profile.projectType || 'Individual',
        recommendedTech: {
          frontend: 'React + Tailwind CSS with responsive mobile-first UI',
          backend: 'Node.js Express / TypeScript',
          database: 'PostgreSQL with Prisma ORM',
          aiMl: 'Tesseract OCR + Meta Prophet time-series + Gemini API advisor',
          devops: 'Docker, Vercel, Supabase'
        },
        aiUsage: 'Vision receipt extraction, semantic categorization, and personalized natural language financial coaching with guardrails.',
        expectedOutcome: 'Production-ready financial dashboard with live budget alerts, OCR receipt ingestion, and CSV export.',
        careerRelevance: `Shows complete product ownership, clean TypeScript architecture, and real-world API integration.`,
        scalability: 'Serverless architecture capable of handling thousands of active concurrent users at near-zero idle cost.',
        suitabilityScore: calculateSuitabilityScores(profile, 'Intermediate')
      },
      {
        id: 'algo-sent-trader',
        title: 'AlphaPulse: Multi-Source Market Sentiment & Quantitative Risk Backtester',
        shortDescription: 'A quantitative analytics engine that correlates Reddit/Twitter financial sentiment with SEC 10-K filings and volatility metrics to backtest portfolio hedging.',
        problemStatement: 'Retail investors lack tools to systematically measure narrative sentiment momentum against macroeconomic fundamentals.',
        whyMatch: `Bridges your ${primaryLang} proficiency and analytical thinking with algorithmic trading infrastructure.`,
        innovation: 'FinBERT transformer embeddings fused with historical price order books to generate dynamic Value-at-Risk (VaR) signals.',
        difficulty: diff,
        estimatedTime: duration,
        teamRecommendation: profile.projectType || 'Individual',
        recommendedTech: {
          frontend: 'React with TradingView lightweight charts',
          backend: 'Python FastAPI with Celery background worker',
          database: 'PostgreSQL + Redis cache',
          aiMl: 'FinBERT NLP pipeline + Vector DB for SEC filings',
          devops: 'Docker, GitHub Actions, AWS S3'
        },
        aiUsage: 'Financial domain transformer fine-tuned for aspect-based sentiment extraction on earnings conference call transcripts.',
        expectedOutcome: 'Interactive trading strategy backtesting engine with drawdown metrics, Sharpe ratio calculations, and signal alerts.',
        careerRelevance: `Direct pathway to Quant Developer, Hedge Fund Analyst, or FinTech Backend positions.`,
        scalability: 'Asynchronous workers decouple heavy SEC filing ingestion from web serving.',
        suitabilityScore: calculateSuitabilityScores(profile, diff)
      },
      {
        id: 'defi-escrow-arbitrage',
        title: 'TrustEscrow: Multi-Party Smart Escrow & Dispute Resolution Arbiter',
        shortDescription: 'A decentralized milestone-based freelance contract escrow platform with AI-assisted deliverable code auditing and dispute settlement.',
        problemStatement: 'Freelancers routinely face delayed payments or ghosting, while clients fear receiving non-functional or plagiarized software deliverables.',
        whyMatch: `Demonstrates smart contract security, modern web frameworks, and practical blockchain problem-solving.`,
        innovation: 'Automated CI/CD deliverable verification testing tied to smart contract multi-sig fund release with LLM code diff summarization.',
        difficulty: 'Advanced',
        estimatedTime: duration,
        teamRecommendation: 'Team (2-3) or Individual',
        recommendedTech: {
          frontend: 'React / Next.js with Wagmi / Ethers.js',
          backend: 'Node.js Express + Solidity / Hardhat environment',
          database: 'PostgreSQL + IPFS for encrypted contract documents',
          aiMl: 'AST-based static code analysis + Gemini code audit API',
          devops: 'Hardhat local node, Sepolia Testnet, Docker'
        },
        aiUsage: 'Automated deliverable code coverage verification and plain-English contract clause explanation.',
        expectedOutcome: 'DApp with wallet connection, milestone creation, cryptographic escrow locking, and automated payouts.',
        careerRelevance: `High-demand Web3 / Smart Contract developer skills combined with enterprise security best practices.`,
        scalability: 'Layer-2 rollup compatibility ensures transaction fees remain under $0.05 per milestone.',
        suitabilityScore: calculateSuitabilityScores(profile, 'Advanced')
      }
    ];
  }

  if (isCyber) {
    return [
      {
        id: 'zerotrust-cloud-sentinel',
        title: 'ZeroShield: Dynamic Zero-Trust Network Microsegmentation & Anomaly Hunter',
        shortDescription: 'An automated container security orchestrator that monitors eBPF kernel network events to detect unauthorized lateral movement and enforce runtime isolation.',
        problemStatement: 'Perimeter firewalls are obsolete; modern cloud breaches spread laterally between compromised microservices within minutes.',
        whyMatch: `Perfect for your ${skills.join(', ')} skills and goals in ${career}. Proves deep systems and cloud security knowledge.`,
        innovation: 'Kernel-level eBPF telemetry with zero performance overhead, trained on MITRE ATT&CK adversarial tactics.',
        difficulty: 'Advanced',
        estimatedTime: duration,
        teamRecommendation: profile.projectType || 'Team (2-3)',
        recommendedTech: {
          frontend: 'React + Vis.js dynamic network topology graph',
          backend: 'Go / Python FastAPI with gRPC telemetry stream',
          database: 'ClickHouse / PostgreSQL for audit logs',
          aiMl: 'Isolation Forest + Autoencoder network intrusion detection',
          devops: 'Docker, Kubernetes, Linux eBPF, Prometheus'
        },
        aiUsage: 'Unsupervised deep autoencoder detecting zero-day command-and-control beaconing in encrypted TLS traffic.',
        expectedOutcome: 'Live SOC dashboard with threat kill-chain visualizer, auto-quarantine toggle, and MITRE mapping.',
        careerRelevance: `Top-tier proof of DevSecOps, eBPF, and Cloud Security engineering capabilities.`,
        scalability: 'Event-driven architecture handles 50,000+ network events per second with minimal CPU load.',
        suitabilityScore: calculateSuitabilityScores(profile, 'Advanced')
      },
      {
        id: 'honey-trap-ai',
        title: 'DecoyMesh: Autonomous Adaptive Honeypot & Threat Intelligence Synthesizer',
        shortDescription: 'A dynamic decoy server cluster that emulates vulnerable SSH, API, and DB services, capturing attacker keystrokes and generating automated threat reports.',
        problemStatement: 'Organizations lack early warning visibility into threat actor probing before targeted internal networks are attacked.',
        whyMatch: `Highlights your ${primaryLang} and system defense skills with tangible threat intelligence collection.`,
        innovation: 'Generative AI persona response engine that dynamically engages attackers to keep them trapped in the honeypot longer.',
        difficulty: diff,
        estimatedTime: duration,
        teamRecommendation: profile.projectType || 'Individual',
        recommendedTech: {
          frontend: 'React dark-mode SOC command center',
          backend: 'Python with AsyncIO low-level socket emulation',
          database: 'Elasticsearch / SQLite + GeoIP2 database',
          aiMl: 'Gemini 1.5 Flash for IOC extraction & Yara rule synthesis',
          devops: 'Docker sandboxing, DigitalOcean/Linode droplet deploy'
        },
        aiUsage: 'Automated extraction of Indicators of Compromise (IOCs) from bash sessions and instant Yara signature generation.',
        expectedOutcome: 'Interactive world threat map with real-time attacker IP geolocation, payload dissection, and downloadable IOC feeds.',
        careerRelevance: `Direct evidence of Threat Intelligence and SOC analyst capabilities.`,
        scalability: 'Lightweight sandboxed honeypot nodes deployable across multiple cloud zones with a single CLI command.',
        suitabilityScore: calculateSuitabilityScores(profile, diff)
      },
      {
        id: 'secure-code-auditor',
        title: 'VulnScan AI: Semantic AST & LLM Static Application Security Testing (SAST)',
        shortDescription: 'A developer-friendly CI/CD security scanner combining Abstract Syntax Tree taint analysis with LLM reasoning to identify SQLi, XSS, and SSRF vulnerabilities with zero false positives.',
        problemStatement: 'Existing regex-based SAST tools generate hundreds of false alarms, causing developers to ignore critical vulnerability alerts.',
        whyMatch: `Connects software engineering practices with cybersecurity, demonstrating deep code analysis knowledge.`,
        innovation: 'Hybrid AST data-flow taint analysis coupled with LLM contextual verification that generates working patch diffs automatically.',
        difficulty: 'Intermediate',
        estimatedTime: duration,
        teamRecommendation: profile.projectType || 'Individual',
        recommendedTech: {
          frontend: 'React with Monaco code editor & interactive vulnerability diffs',
          backend: 'Node.js Express / Python FastAPI with Babel/Tree-sitter parser',
          database: 'PostgreSQL for scan histories and CVE repository',
          aiMl: 'Tree-sitter AST parser + Gemini API security vulnerability verifier',
          devops: 'GitHub Actions integration, Docker CLI scanner'
        },
        aiUsage: 'LLM verifies whether user input actually flows into sensitive sinks without sanitization, drafting one-click Pull Request fixes.',
        expectedOutcome: 'A web portal and GitHub Action that scans Git repositories and outputs OWASP Top 10 compliance reports.',
        careerRelevance: `Directly qualifies you for Application Security Engineer and DevSecOps positions.`,
        scalability: 'Worker queue parses hundreds of files concurrently using worker threads.',
        suitabilityScore: calculateSuitabilityScores(profile, 'Intermediate')
      },
      {
        id: 'phish-shield-genai',
        title: 'PhishGuard: Multi-Factor GenAI Spear-Phishing & Deepfake URL Defense',
        shortDescription: 'A browser extension and API gateway analyzing incoming email headers, linguistic manipulation tactics, and domain brand spoofing to prevent CEO fraud.',
        problemStatement: 'Generative AI enables cybercriminals to write hyper-personalized spear-phishing emails that bypass traditional spam filters.',
        whyMatch: `Combines browser extension frontend development with defensive machine learning and cybersecurity protocols.`,
        innovation: 'Optical character domain homograph detection combined with behavioral sentiment coercion analysis.',
        difficulty: 'Intermediate',
        estimatedTime: duration,
        teamRecommendation: profile.projectType || 'Individual',
        recommendedTech: {
          frontend: 'Chrome Extension (Manifest V3) + React dashboard',
          backend: 'Python FastAPI with DNS/WHOIS lookup tools',
          database: 'MongoDB + Redis URL reputation cache',
          aiMl: 'DistilBERT sentiment analysis + Gemini API threat assessment',
          devops: 'Docker, Cloudflare DNS security'
        },
        aiUsage: 'NLP model scoring urgency, authority manipulation, and financial coercion indicators in email bodies.',
        expectedOutcome: 'Working browser extension that displays safety badges on Gmail/Outlook with technical threat breakdowns.',
        careerRelevance: `Proves full-stack security engineering, extension APIs, and practical NLP deployment.`,
        scalability: 'Sub-30ms DNS reputation cache minimizes any user browsing latency.',
        suitabilityScore: calculateSuitabilityScores(profile, 'Intermediate')
      }
    ];
  }

  // Default / Universal Intelligent Recommendation Suite (IoT, Sustainability, Web, EdTech, General)
  return [
    {
      id: 'ecotrack-iot-carbon',
      title: 'EcoPulse: Edge IoT Environmental Footprint & Smart Energy Optimization',
      shortDescription: 'A smart facility energy intelligence platform that ingests environmental sensor telemetry to forecast carbon footprints and automate HVAC duty cycles.',
      problemStatement: 'Campus buildings and commercial facilities waste up to 35% of cooling energy due to rigid non-adaptive HVAC timers.',
      whyMatch: `Tailored to your skills in ${skills.join(', ')} and career aspirations in ${career}. Combines hardware/telemetry with full-stack analytics.`,
      innovation: 'Reinforcement learning model that balances indoor air quality (CO2/PM2.5) with minimal electrical draw.',
      difficulty: diff,
      estimatedTime: duration,
      teamRecommendation: profile.projectType || 'Team (2-3)',
      recommendedTech: {
        frontend: 'React with dynamic thermal heatmaps and energy charts',
        backend: primaryLang.toLowerCase().includes('python') ? 'Python FastAPI' : 'Node.js Express',
        database: 'TimescaleDB / PostgreSQL for high-frequency sensor readings',
        aiMl: 'Random Forest & Q-Learning for thermal equilibrium optimization',
        devops: 'Docker, MQTT Mosquitto Broker, Grafana'
      },
      aiUsage: 'Predictive thermal inertia model forecasting building cooling demand 3 hours ahead based on weather forecasts.',
      expectedOutcome: 'Complete interactive campus energy dashboard with simulated IoT sensor feeds and automated relay controls.',
      careerRelevance: `Direct evidence of IoT, Time-Series analytics, and Green Computing, highly sought after in modern enterprise engineering.`,
      scalability: 'MQTT broker can process thousands of telemetry packets per minute across multiple campus buildings.',
      suitabilityScore: calculateSuitabilityScores(profile, diff)
    },
    {
      id: 'edupath-adaptive-mentor',
      title: 'SkillGraph: Autonomous Knowledge-Graph & Adaptive Learning Engine',
      shortDescription: 'An intelligent educational platform that models student concept mastery through an evolving knowledge graph and generates personalized micro-curricula.',
      problemStatement: 'Standard online learning courses have an 85% dropout rate because they follow rigid linear tracks that fail to diagnose student prerequisite knowledge gaps.',
      whyMatch: `Directly aligns with your ${skills.slice(0, 3).join(', ')} skillset and interest in ${domain}.`,
      innovation: 'Bayesian Knowledge Tracing combined with dynamic concept graph dependency traversal to diagnose misconceptions.',
      difficulty: 'Intermediate',
      estimatedTime: duration,
      teamRecommendation: profile.projectType || 'Individual',
      recommendedTech: {
        frontend: 'React with interactive Cytoscape.js / D3 graph explorer',
        backend: 'Node.js Express / Python FastAPI',
        database: 'Neo4j / PostgreSQL with JSONB schema',
        aiMl: 'Item Response Theory (IRT) + Gemini API diagnostic tutor',
        devops: 'Docker, GitHub Actions, Vercel'
      },
      aiUsage: 'Generative AI tutor that adapts Socratic explanations based on exact conceptual gaps identified in the knowledge graph.',
      expectedOutcome: 'Student learning portal with visual interactive mastery tree, automated quizzes, and AI mentor conversations.',
      careerRelevance: `Demonstrates advanced data structures, graph algorithms, and pedagogical AI design.`,
      scalability: 'Graph query caching enables instant rendering of 500+ concept dependencies.',
      suitabilityScore: calculateSuitabilityScores(profile, 'Intermediate')
    },
    {
      id: 'agri-vision-cropguard',
      title: 'AgriVision: Edge AI Precision Crop Disease Diagnosis & Yield Forecaster',
      shortDescription: 'A farmer-first mobile web application that identifies crop foliar diseases from smartphone camera photos with offline capability and provides organic treatment remedies.',
      problemStatement: 'Smallholder farmers lose 20-40% of annual crop yields to fungal and bacterial blights due to late detection and lack of accessible agricultural extension officers.',
      whyMatch: `Solves an urgent real-world problem using your ${primaryLang} abilities, making a compelling story for hackathons and job interviews.`,
      innovation: 'Lightweight quantized MobileNet running directly in the browser via WebAssembly / ONNX Runtime with zero internet connectivity required.',
      difficulty: diff,
      estimatedTime: duration,
      teamRecommendation: profile.projectType || 'Individual',
      recommendedTech: {
        frontend: 'React Progressive Web App (PWA) with camera stream & indexedDB offline cache',
        backend: 'Python FastAPI with GDAL / weather API integration',
        database: 'SQLite / PostgreSQL with PostGIS for farm geo-tagging',
        aiMl: 'PyTorch MobileNetV3 quantized with ONNX Runtime Web',
        devops: 'Docker, GitHub Pages / Render'
      },
      aiUsage: 'On-device computer vision classification of 38 plant disease classes with regional language audio readout for accessibility.',
      expectedOutcome: 'Installable PWA capable of diagnosing plant leaf diseases offline within 200ms of photo capture.',
      careerRelevance: `Exemplifies Edge AI, Progressive Web App engineering, and high-impact social technology.`,
      scalability: 'Client-side inference reduces backend hosting costs to zero for image processing.',
      suitabilityScore: calculateSuitabilityScores(profile, diff)
    },
    {
      id: 'devflow-ai-collab',
      title: 'DevSync AI: Distributed Developer Knowledge Engine & Pull-Request Arbiter',
      shortDescription: 'A smart development workflow intelligence platform that clusters code review discussions, summarizes architectural decisions, and flags breaking API changes.',
      problemStatement: 'Remote engineering teams waste hours searching through scattered Slack threads and outdated documentation to understand why code was written a certain way.',
      whyMatch: `Directly exercises your ${skills.join(', ')} engineering skills, building a tool you and your peers would use daily.`,
      innovation: 'Automated Architecture Decision Record (ADR) generation from git commit history and GitHub PR review threads.',
      difficulty: 'Intermediate',
      estimatedTime: duration,
      teamRecommendation: profile.projectType || 'Individual',
      recommendedTech: {
        frontend: 'React + Monaco Editor + Markdown visualizer',
        backend: 'Node.js Express / TypeScript with Octokit GitHub API',
        database: 'PostgreSQL with pgvector for semantic code search',
        aiMl: 'Gemini 1.5 Flash + CodeBERT semantic embeddings',
        devops: 'Docker, GitHub Webhooks, Railway'
      },
      aiUsage: 'Semantic code diff embeddings linking source code changes to relevant Jira issues and Slack design discussions.',
      expectedOutcome: 'A searchable developer portal that indexes git repositories and answers natural language architecture questions.',
      careerRelevance: `Signals senior-level engineering maturity, tooling empathy, and modern vector database expertise.`,
      scalability: 'Incremental webhook indexing ensures immediate updates without full-repo rescanning.',
      suitabilityScore: calculateSuitabilityScores(profile, 'Intermediate')
    }
  ];
}

/**
 * 2. PROJECT PLANNING AGENT (20-Aspect Blueprint)
 */
export async function runProjectPlanningAgent(project, studentProfile, apiKey = null) {
  const prompt = `You are a Principal Software Architect generating a complete, comprehensive 20-aspect Final-Year Engineering Project Blueprint for:
Project Title: ${project.title}
Short Description: ${project.shortDescription}
Difficulty: ${project.difficulty}
Target Technologies: ${JSON.stringify(project.recommendedTech)}
Student Background: ${(studentProfile.skills || []).join(', ')}

Return a structured JSON object containing all 20 aspects:
{
  "problemDefinition": "string",
  "targetUsers": ["user personas"],
  "objectives": ["bullet points with measurable KPIs"],
  "coreFeatures": [{"title": "string", "description": "string", "priority": "P0" | "P1"}],
  "advancedFeatures": [{"title": "string", "description": "string", "priority": "P2"}],
  "recommendedTechStack": {
    "frontend": "string",
    "backend": "string",
    "database": "string",
    "aiMl": "string",
    "devops": "string",
    "rationale": "string"
  },
  "frontendArchitecture": "string",
  "backendArchitecture": "string",
  "databaseSchema": [
    {
      "tableName": "string",
      "purpose": "string",
      "columns": [{"name": "string", "type": "string", "constraints": "string"}]
    }
  ],
  "aiMlComponents": [
    {
      "name": "string",
      "modelArchitecture": "string",
      "trainingData": "string",
      "inferencePipeline": "string"
    }
  ],
  "apiEndpoints": [
    {
      "method": "GET" | "POST" | "PUT" | "DELETE",
      "route": "string",
      "purpose": "string",
      "requestPayload": "string",
      "responsePayload": "string"
    }
  ],
  "systemArchitecture": {
    "diagramAscii": "string",
    "dataFlowExplanation": "string"
  },
  "developmentRoadmapOverview": "string",
  "testingStrategy": {
    "unitTesting": "string",
    "integrationTesting": "string",
    "e2eTesting": "string",
    "aiEvaluation": "string"
  },
  "securityConsiderations": ["bullet points covering auth, OWASP, encryption, etc."],
  "accessibilityConsiderations": ["bullet points covering WCAG 2.1 AA, screen readers, keyboard nav"],
  "performanceConsiderations": ["bullet points covering caching, latency, indexing"],
  "futureImprovements": ["bullet points for post-graduation / v2"],
  "deploymentApproach": {
    "hosting": "string",
    "ciCd": "string",
    "monitoring": "string"
  },
  "finalYearDeliverables": [
    "Project Synopsis Document",
    "Software Requirement Specification (SRS)",
    "Clean Git Repository with README and Dockerfile",
    "IEEE Format Final Project Report",
    "Presentation Slides (15 slides)",
    "3-Minute Video Demonstration Script"
  ]
}`;

  try {
    const result = await callGeminiApi({
      prompt,
      systemInstruction: 'You are an elite software architect and university project advisor. Return clean JSON only.',
      apiKey,
      temperature: 0.5,
      jsonMode: true
    });

    if (result && result.problemDefinition && result.coreFeatures) {
      return result;
    }
  } catch (err) {
    console.log('Using Blueprint Fallback Engine:', err.message);
  }

  // Fallback Dynamic Blueprint Generator
  return generateDynamicBlueprint(project, studentProfile);
}

function generateDynamicBlueprint(project, studentProfile) {
  const title = project.title || 'Intelligent Multi-Modal Project';
  const tech = project.recommendedTech || {
    frontend: 'React 18 / Vite with Tailwind CSS',
    backend: 'FastAPI (Python) / Node.js Express',
    database: 'PostgreSQL with pgvector extension',
    aiMl: 'PyTorch / Hugging Face Transformers & Gemini API',
    devops: 'Docker containerization & GitHub Actions'
  };

  return {
    problemDefinition: project.problemStatement || `${title} solves critical operational bottlenecks by modernizing manual workflows with intelligent predictive automation and accessible real-time dashboards.`,
    targetUsers: [
      'Primary End-Users: Domain practitioners requiring fast, reliable decision support without cognitive overload.',
      'Administrative Managers: Supervisors auditing system performance metrics, compliance logs, and team throughput.',
      'System Administrators: Engineering operators deploying, monitoring, and maintaining secure data pipelines.'
    ],
    objectives: [
      'Achieve sub-200ms median API response times for 95% of standard user transactions.',
      'Deliver an intuitive, responsive interface meeting WCAG 2.1 AA accessibility standards.',
      'Provide explainable AI inferences with clear confidence bounds and human-in-the-loop oversight.',
      'Complete end-to-end deployment with automated CI/CD unit testing exceeding 80% code coverage.'
    ],
    coreFeatures: [
      {
        title: 'User Authentication & Role-Based Access Control (RBAC)',
        description: 'Secure JWT-based session management distinguishing standard users, clinicians/analysts, and system administrators.',
        priority: 'P0'
      },
      {
        title: 'Interactive Operational Dashboard',
        description: 'Real-time responsive dashboard visualizing live telemetry, recent transactions, alert feeds, and analytical trends.',
        priority: 'P0'
      },
      {
        title: 'AI Inference & Analytics Engine',
        description: 'Dedicated processing pipeline executing classification/forecasting algorithms with real-time feedback and visualization.',
        priority: 'P0'
      },
      {
        title: 'Data Ingestion & Validation Gateway',
        description: 'Multi-format ingestion supporting CSV, JSON, and direct file uploads with schema sanitization and duplicate detection.',
        priority: 'P0'
      }
    ],
    advancedFeatures: [
      {
        title: 'Real-Time WebSocket Notification Bus',
        description: 'Push notification service alerting users instantly when anomalies exceed critical thresholds.',
        priority: 'P1'
      },
      {
        title: 'Natural Language Query Copilot',
        description: 'Integrated conversational assistant allowing users to query data patterns and generate audit reports via natural language.',
        priority: 'P1'
      },
      {
        title: 'Offline PWA Synchronization',
        description: 'Service worker caching enabling field users to record data offline and automatically synchronize when connectivity resumes.',
        priority: 'P2'
      }
    ],
    recommendedTechStack: {
      frontend: tech.frontend || 'React 18 + Vite',
      backend: tech.backend || 'Python FastAPI / Node.js Express',
      database: tech.database || 'PostgreSQL with pgvector',
      aiMl: tech.aiMl || 'PyTorch & Google Gemini API',
      devops: tech.devops || 'Docker & GitHub Actions',
      rationale: 'This stack combines modern developer velocity, rock-solid relational integrity, high-throughput asynchronous execution, and frictionless cloud deployment.'
    },
    frontendArchitecture: 'Component-driven Single Page Application (SPA) structured using atomic design principles, custom CSS tokens for theme toggling, custom hook state management, and lazy-loaded routes.',
    backendArchitecture: 'Layered RESTful architecture strictly separating routing controllers, service-layer business logic, data repository access, and asynchronous AI model inference workers.',
    databaseSchema: [
      {
        tableName: 'users',
        purpose: 'Stores registered accounts, credentials hash, role permissions, and profile metadata.',
        columns: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()' },
          { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE, NOT NULL' },
          { name: 'password_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
          { name: 'role', type: 'VARCHAR(50)', constraints: 'DEFAULT "student"' },
          { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
        ]
      },
      {
        tableName: 'records',
        purpose: 'Contains core domain transaction logs, telemetry samples, and raw input files.',
        columns: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'user_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES users(id)' },
          { name: 'payload', type: 'JSONB', constraints: 'NOT NULL' },
          { name: 'status', type: 'VARCHAR(50)', constraints: 'DEFAULT "pending"' },
          { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
        ]
      },
      {
        tableName: 'ai_predictions',
        purpose: 'Persists model inferences, confidence intervals, explainability SHAP vectors, and reviewer feedback.',
        columns: [
          { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
          { name: 'record_id', type: 'UUID', constraints: 'FOREIGN KEY REFERENCES records(id)' },
          { name: 'prediction_label', type: 'VARCHAR(100)', constraints: 'NOT NULL' },
          { name: 'confidence_score', type: 'FLOAT', constraints: 'NOT NULL' },
          { name: 'metadata', type: 'JSONB', constraints: 'NULLABLE' },
          { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
        ]
      }
    ],
    aiMlComponents: [
      {
        name: 'Feature Extraction & Preprocessing Pipeline',
        modelArchitecture: 'Standardized scaling, missing value imputation, and tokenization/tensorization pipeline.',
        trainingData: 'Curated domain benchmark dataset partitioned into 70% train, 15% validation, and 15% holdout test.',
        inferencePipeline: 'Sub-50ms vectorized batch inference wrapped in an asynchronous worker with response caching.'
      },
      {
        name: 'Contextual AI Explainer & Copilot',
        modelArchitecture: 'Google Gemini 1.5 Flash / Transformer LLM prompted with domain system instructions and few-shot examples.',
        trainingData: 'Pretrained foundation weights grounded with domain-specific JSON schema context.',
        inferencePipeline: 'Direct HTTPS REST endpoint with exponential backoff and structured output sanitation.'
      }
    ],
    apiEndpoints: [
      {
        method: 'POST',
        route: '/api/v1/auth/login',
        purpose: 'Authenticate user credentials and issue signed JWT bearer token',
        requestPayload: '{ "email": "student@uni.edu", "password": "SecurePassword123!" }',
        responsePayload: '{ "token": "jwt_token_string", "user": { "id": "...", "role": "admin" } }'
      },
      {
        method: 'GET',
        route: '/api/v1/records',
        purpose: 'Fetch paginated list of domain transactions with filtering and search',
        requestPayload: 'Query params: ?page=1&limit=20&status=processed',
        responsePayload: '{ "items": [...], "total": 142, "page": 1, "pageSize": 20 }'
      },
      {
        method: 'POST',
        route: '/api/v1/analyze',
        purpose: 'Submit payload for immediate AI inference and explanation generation',
        requestPayload: '{ "inputData": { ... }, "options": { "explain": true } }',
        responsePayload: '{ "prediction": "Low Risk", "confidence": 0.94, "explanation": "..." }'
      },
      {
        method: 'GET',
        route: '/api/v1/analytics/summary',
        purpose: 'Aggregate statistical metrics for dashboard summary cards and chart rendering',
        requestPayload: 'None',
        responsePayload: '{ "totalAnalyzed": 1280, "avgAccuracy": 0.93, "trends": [...] }'
      }
    ],
    systemArchitecture: {
      diagramAscii: `
+-------------------------------------------------------------------------+
|                           CLIENT BROWSER                                |
|  React 18 SPA  |  State Manager  |  Canvas Visualizer  |  PWA Storage   |
+------------------------------------+------------------------------------+
                                     | HTTPS / WSS
                                     v
+------------------------------------+------------------------------------+
|                         API GATEWAY & ROUTER                            |
|             Express / FastAPI  |  CORS  |  JWT Auth Middleware          |
+-------------------+--------------------------------+--------------------+
                    |                                |
                    v                                v
+-------------------+----------------+   +-----------+--------------------+
|         BUSINESS LOGIC LAYER       |   |       AI INFERENCE ENGINE      |
|  Controllers  |  Data Sanitizers   |   | PyTorch / Gemini API Pipeline  |
+-------------------+----------------+   +-----------+--------------------+
                    |                                |
                    +----------------+---------------+
                                     |
                                     v
+------------------------------------+------------------------------------+
|                           PERSISTENCE LAYER                             |
|          PostgreSQL Relational DB   |   Redis Caching & Vector Store    |
+-------------------------------------------------------------------------+
`,
      dataFlowExplanation: 'Clients authenticate via JWT. Incoming request payloads pass through schema validation middleware. Core CRUD actions query PostgreSQL directly, while analytics and inference triggers invoke the asynchronous AI pipeline with response caching.'
    },
    developmentRoadmapOverview: 'Structured into 8 sequential phases covering initial repository scaffolding, database schema deployment, REST API controllers, AI pipeline integration, responsive frontend UI, integration testing, and production containerization.',
    testingStrategy: {
      unitTesting: 'Jest / Vitest for frontend components; PyTest or Supertest for backend business logic and controllers.',
      integrationTesting: 'Automated REST endpoint validation against a temporary Dockerized PostgreSQL test database.',
      e2eTesting: 'Playwright / Cypress user journeys covering user login, file upload, inference trigger, and report export.',
      aiEvaluation: 'Confusion matrix, precision-recall curve, F1-score, and BLEU/ROUGE metrics for generative explanations.'
    },
    securityConsiderations: [
      'Environment variable separation ensuring no API keys or database credentials are ever committed.',
      'Argon2 / BCrypt salted hashing for all stored user passwords.',
      'Strict Cross-Origin Resource Sharing (CORS) whitelisting and Helmet security headers.',
      'Parameterized SQL queries and ORM mappings preventing SQL injection vectors.',
      'Rate-limiting middleware (express-rate-limit) shielding sensitive authentication endpoints.'
    ],
    accessibilityConsiderations: [
      'Semantic HTML5 structure (header, main, nav, section, article) with ARIA live regions for dynamic alerts.',
      'Keyboard navigation trap prevention with visible high-contrast focus rings on all interactive elements.',
      'WCAG 2.1 AA color contrast compliance (> 4.5:1 ratio for normal text across both dark and light modes).',
      'Descriptive alt text on all visual diagrams, chart SVG labels, and screen-reader status announcements.'
    ],
    performanceConsiderations: [
      'Client-side code splitting and dynamic component lazy loading to minimize initial bundle size below 200KB.',
      'Database B-Tree indexing on foreign keys and frequently queried status/timestamp columns.',
      'In-memory caching for frequently requested analytics aggregates and AI model weights.',
      'Gzip / Brotli asset compression and CDN delivery for static stylesheets and fonts.'
    ],
    futureImprovements: [
      'Multi-tenant enterprise licensing module with organization workspace isolation.',
      'Native mobile companion application using React Native / Flutter sharing existing API backend.',
      'Federated learning integration allowing multiple hospitals/institutions to train models without sharing raw private data.'
    ],
    deploymentApproach: {
      hosting: 'Vercel / Netlify for the frontend client; Render / Railway / AWS Cloud Run for the containerized API backend.',
      ciCd: 'GitHub Actions workflow triggering automated linting, test suites, and Docker image builds on every pull request.',
      monitoring: 'Prometheus metrics endpoint + Sentry exception tracking for real-time error alerts.'
    },
    finalYearDeliverables: [
      'Project Synopsis Document (formal academic summary, problem scope, and methodology)',
      'Software Requirements Specification (SRS) compliant with IEEE 830 standards',
      'Production-Ready Source Code Repository with comprehensive README, Dockerfile, and .env.example',
      'Final Academic Project Report / Research Paper formatted in IEEE conference layout',
      'Executive Slide Deck (15-slide defense presentation with architecture, results, and live demo)',
      '3-Minute High-Impact Demo Video Script demonstrating core user journeys and technical innovation'
    ]
  };
}

/**
 * 3. DEVELOPMENT ROADMAP GENERATOR (8-Phase Step-by-Step)
 */
export function generateProjectRoadmap(project) {
  const tech = project.recommendedTech || {};
  const frontendTech = tech.frontend || 'React 18 & Vite';
  const backendTech = tech.backend || 'Python FastAPI / Node.js Express';
  const dbTech = tech.database || 'PostgreSQL / Supabase';
  const aiTech = tech.aiMl || 'PyTorch / Gemini API';

  return [
    {
      phaseNumber: 1,
      title: 'Phase 1: Project Setup & Architecture Foundations',
      description: 'Establish version control, project skeleton, linting rules, and local runtime dependencies.',
      isCoreMvp: true,
      estimatedEffort: '3-4 days',
      dependencies: 'None (Initial Step)',
      tasks: [
        {
          id: 'p1-t1',
          task: 'Initialize Git Repository & Directory Structure',
          whatToBuild: 'Set up monorepo or client/server folders, .gitignore, .env.example, and README documentation.',
          technology: 'Git, GitHub',
          dependencies: 'None',
          estimatedEffort: '1 day',
          expectedOutput: 'Clean repository with initial commit and development branching strategy established.',
          completed: true
        },
        {
          id: 'p1-t2',
          task: 'Scaffold Frontend & Backend Environments',
          whatToBuild: 'Initialize client application with Vite and backend service with required packages.',
          technology: `${frontendTech}, ${backendTech}`,
          dependencies: 'p1-t1 Git Init',
          estimatedEffort: '1-2 days',
          expectedOutput: 'Local development servers running simultaneously on ports 5173 and 5000 with CORS configured.',
          completed: true
        },
        {
          id: 'p1-t3',
          task: 'Design UI Design System & Component Tokens',
          whatToBuild: 'Implement color tokens, typography, dark/light theme variables, and global CSS reset.',
          technology: 'Vanilla CSS / Design Tokens',
          dependencies: 'p1-2 Frontend Scaffold',
          estimatedEffort: '1 day',
          expectedOutput: 'Consistent design system with accessible contrast and responsive layout breakpoints.',
          completed: false
        }
      ]
    },
    {
      phaseNumber: 2,
      title: 'Phase 2: Database Modeling & Persistence Core',
      description: 'Define relational entities, run migrations, and implement data access repositories.',
      isCoreMvp: true,
      estimatedEffort: '4-5 days',
      dependencies: 'Phase 1 Environment Setup',
      tasks: [
        {
          id: 'p2-t1',
          task: 'Draft Entity-Relationship Diagram (ERD)',
          whatToBuild: 'Specify table schemas, primary/foreign keys, indexing strategies, and JSONB schemas.',
          technology: `${dbTech}, DBML / Mermaid`,
          dependencies: 'Database selected',
          estimatedEffort: '1 day',
          expectedOutput: 'Validated schema diagram covering users, records, audit logs, and predictions.',
          completed: false
        },
        {
          id: 'p2-t2',
          task: 'Execute Database Migrations & Seed Scripts',
          whatToBuild: 'Write SQL migration scripts and mock development datasets for realistic testing.',
          technology: `${dbTech}, SQL`,
          dependencies: 'p2-t1 Schema Draft',
          estimatedEffort: '2 days',
          expectedOutput: 'Populated local database with sample domain records ready for querying.',
          completed: false
        },
        {
          id: 'p2-t3',
          task: 'Build Data Access Repositories',
          whatToBuild: 'Implement reusable CRUD functions and query builders with error handling.',
          technology: `${backendTech}, ORM / Query Builder`,
          dependencies: 'p2-t2 Migrations',
          estimatedEffort: '2 days',
          expectedOutput: 'Unit-tested repository methods for insert, update, query by ID, and paginated search.',
          completed: false
        }
      ]
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: Authentication & Security Guardrails',
      description: 'Implement secure user registration, token-based session management, and route protection.',
      isCoreMvp: true,
      estimatedEffort: '3-4 days',
      dependencies: 'Phase 2 Users Table',
      tasks: [
        {
          id: 'p3-t1',
          task: 'Implement Password Hashing & Verification',
          whatToBuild: 'Integrate cryptographic hashing (Argon2/bcrypt) on user signup and password reset.',
          technology: 'Crypto / Bcrypt / Argon2',
          dependencies: 'Users table created',
          estimatedEffort: '1 day',
          expectedOutput: 'Zero plaintext passwords stored in database; robust salt generation.',
          completed: false
        },
        {
          id: 'p3-t2',
          task: 'Build JWT Token Issuance & Verification Middleware',
          whatToBuild: 'Generate signed access tokens upon login and validate headers on protected routes.',
          technology: 'JSON Web Tokens (JWT)',
          dependencies: 'p3-t1 Hashing Logic',
          estimatedEffort: '1-2 days',
          expectedOutput: 'HTTP Bearer authorization middleware rejecting invalid or expired requests with 401 status.',
          completed: false
        },
        {
          id: 'p3-t3',
          task: 'Set Up Role-Based Access Control (RBAC)',
          whatToBuild: 'Define permissions for student/analyst vs admin roles and protect administrative endpoints.',
          technology: `${backendTech} Middleware`,
          dependencies: 'p3-t2 JWT Middleware',
          estimatedEffort: '1 day',
          expectedOutput: 'Forbidden (403) error responses for unauthorized role escalation attempts.',
          completed: false
        }
      ]
    },
    {
      phaseNumber: 4,
      title: 'Phase 4: Core Domain MVP Features Implementation',
      description: 'Develop the primary business workflows, data ingestion mechanisms, and dashboard controllers.',
      isCoreMvp: true,
      estimatedEffort: '1-2 weeks',
      dependencies: 'Phase 2 Database & Phase 3 Auth',
      tasks: [
        {
          id: 'p4-t1',
          task: 'Build Data Ingestion & Sanitization Controller',
          whatToBuild: 'Create API endpoints accepting user inputs and uploaded files with strict schema validation.',
          technology: `${backendTech}, Input Validation (Zod / Pydantic)`,
          dependencies: 'Database connection verified',
          estimatedEffort: '3 days',
          expectedOutput: 'Validated records saved to database with bad inputs returning 422 descriptive errors.',
          completed: false
        },
        {
          id: 'p4-t2',
          task: 'Implement Record Management & Filtering APIs',
          whatToBuild: 'Build paginated list endpoints supporting sorting, date range filters, and text search.',
          technology: `${backendTech}, ${dbTech}`,
          dependencies: 'p4-t1 Ingestion controller',
          estimatedEffort: '3 days',
          expectedOutput: 'Fast paginated queries executing in under 50ms over seeded records.',
          completed: false
        },
        {
          id: 'p4-t3',
          task: 'Construct Analytics Aggregation Pipeline',
          whatToBuild: 'Write database aggregations computing totals, averages, and historical time series for dashboard charts.',
          technology: `${dbTech} Aggregations`,
          dependencies: 'Record tables populated',
          estimatedEffort: '2 days',
          expectedOutput: 'Summary API endpoint feeding high-level stats and KPIs to the frontend.',
          completed: false
        }
      ]
    },
    {
      phaseNumber: 5,
      title: 'Phase 5: AI / Machine Learning Integration',
      description: 'Integrate predictive models, embeddings, GenAI reasoning, and explainability heatmaps.',
      isCoreMvp: false,
      estimatedEffort: '1-2 weeks',
      dependencies: 'Phase 4 Core Data Pipeline',
      tasks: [
        {
          id: 'p5-t1',
          task: 'Configure AI Provider / Model Pipeline',
          whatToBuild: 'Set up inference wrapper supporting real-time model predictions and fallback mock mode.',
          technology: `${aiTech}`,
          dependencies: 'API keys or local weights downloaded',
          estimatedEffort: '3 days',
          expectedOutput: 'Robust inference service returning predictions, confidence scores, and structured explanations.',
          completed: false
        },
        {
          id: 'p5-t2',
          task: 'Implement Semantic Search / Prompt Engineering',
          whatToBuild: 'Craft system prompts with few-shot examples or configure vector embeddings index.',
          technology: 'Prompt Engineering / Vector Index',
          dependencies: 'p5-t1 Model Pipeline',
          estimatedEffort: '3 days',
          expectedOutput: 'Accurate, domain-grounded responses without hallucinations or prompt injections.',
          completed: false
        },
        {
          id: 'p5-t3',
          task: 'Generate Model Explainability Artifacts',
          whatToBuild: 'Compute feature importances (SHAP values) or highlight key diagnostic factors for users.',
          technology: `${aiTech}, Explainable AI`,
          dependencies: 'p5-t1 Prediction outputs',
          estimatedEffort: '3 days',
          expectedOutput: 'Transparent rationale displayed alongside every automated recommendation or flag.',
          completed: false
        }
      ]
    },
    {
      phaseNumber: 6,
      title: 'Phase 6: Frontend Integration & Interactive UI',
      description: 'Connect React components to backend APIs, design forms, graphs, and live feedback states.',
      isCoreMvp: false,
      estimatedEffort: '1 week',
      dependencies: 'Phase 4 REST APIs & Phase 5 AI',
      tasks: [
        {
          id: 'p6-t1',
          task: 'Build Interactive Dashboard & Navigation',
          whatToBuild: 'Implement tabbed navigation, stats cards, recent activity tables, and quick action buttons.',
          technology: `${frontendTech}, Lucide Icons`,
          dependencies: 'Design system tokens ready',
          estimatedEffort: '2 days',
          expectedOutput: 'Smooth, responsive navigation with zero layout shift across desktop, tablet, and mobile.',
          completed: false
        },
        {
          id: 'p6-t2',
          task: 'Implement Forms with Validation & Feedback',
          whatToBuild: 'Create intuitive multi-step input forms with inline validation, loading spinners, and error toasts.',
          technology: `${frontendTech}, Form Hooks`,
          dependencies: 'API contracts defined',
          estimatedEffort: '2 days',
          expectedOutput: 'Frictionless user data entry with accessible error states and optimistic updates.',
          completed: false
        },
        {
          id: 'p6-t3',
          task: 'Integrate Interactive Charts & Data Visualizers',
          whatToBuild: 'Render interactive charts (trends, radar scores, network graphs) with hover tooltips.',
          technology: 'SVG / Canvas / Charting',
          dependencies: 'Summary API endpoint',
          estimatedEffort: '2 days',
          expectedOutput: 'Rich data visualizations rendering clearly in both dark and light modes.',
          completed: false
        }
      ]
    },
    {
      phaseNumber: 7,
      title: 'Phase 7: Comprehensive Testing & Quality Audit',
      description: 'Conduct automated test suites, security scans, accessibility audits, and performance tuning.',
      isCoreMvp: false,
      estimatedEffort: '4-5 days',
      dependencies: 'Phase 6 Functional UI & Backend',
      tasks: [
        {
          id: 'p7-t1',
          task: 'Execute Automated Unit & Endpoint Tests',
          whatToBuild: 'Write test scripts for all critical backend routes and core React component renders.',
          technology: 'Vitest / Pytest / Supertest',
          dependencies: 'Controllers & services completed',
          estimatedEffort: '2 days',
          expectedOutput: 'Passing automated test suite verifying auth, CRUD operations, and error handling.',
          completed: false
        },
        {
          id: 'p7-t2',
          task: 'Conduct Accessibility & Screen Reader Audit',
          whatToBuild: 'Audit DOM with axe-core / Lighthouse; verify keyboard tab order, ARIA attributes, and color contrast.',
          technology: 'WCAG 2.1 Guidelines, Lighthouse',
          dependencies: 'UI views finalized',
          estimatedEffort: '1 day',
          expectedOutput: 'Lighthouse Accessibility score > 95 with zero missing labels or contrast failures.',
          completed: false
        },
        {
          id: 'p7-t3',
          task: 'Performance Profiling & Asset Optimization',
          whatToBuild: 'Audit bundle size, implement component lazy loading, and verify sub-second page load.',
          technology: 'Vite Analyzer, Chrome DevTools',
          dependencies: 'Frontend build generated',
          estimatedEffort: '1-2 days',
          expectedOutput: 'Fast First Contentful Paint (<1.2s) and smooth 60fps animations.',
          completed: false
        }
      ]
    },
    {
      phaseNumber: 8,
      title: 'Phase 8: Deployment & Academic Deliverables Packaging',
      description: 'Deploy live application, containerize with Docker, and generate final project report assets.',
      isCoreMvp: false,
      estimatedEffort: '3-4 days',
      dependencies: 'Phase 7 Tests Passed',
      tasks: [
        {
          id: 'p8-t1',
          task: 'Containerize Application with Docker',
          whatToBuild: 'Write multi-stage Dockerfile and docker-compose.yml for one-command local reproduction.',
          technology: 'Docker, Docker Compose',
          dependencies: 'Package configs verified',
          estimatedEffort: '1 day',
          expectedOutput: 'Production Docker container building cleanly and launching both frontend and backend services.',
          completed: false
        },
        {
          id: 'p8-t2',
          task: 'Deploy Live Cloud Demo',
          whatToBuild: 'Deploy frontend to Vercel and backend service to Render / Railway with HTTPS certificates.',
          technology: 'Vercel, Render / Cloud Run',
          dependencies: 'Docker image or git repository',
          estimatedEffort: '1 day',
          expectedOutput: 'Publicly accessible URL ready for live hackathon demo and examiner evaluation.',
          completed: false
        },
        {
          id: 'p8-t3',
          task: 'Package Final Academic Documentation',
          whatToBuild: 'Compile IEEE project report, architecture diagrams, slides, and 3-minute video presentation script.',
          technology: 'Markdown, IEEE Template, PDF Export',
          dependencies: 'Complete tested prototype',
          estimatedEffort: '2 days',
          expectedOutput: 'Complete submission-ready academic bundle fulfilling all university degree requirements.',
          completed: false
        }
      ]
    }
  ];
}

/**
 * 4. IMPROVEMENT AGENT ("Improve My Project")
 */
export async function runImprovementAgent({ projectTitle, projectDescription, queryType, customQuery }, apiKey = null) {
  const queryPrompt = customQuery || getQueryPromptForType(queryType);

  const prompt = `You are a Principal Software Architect and Hackathon Judge.
Review this student project and provide high-impact, actionable improvements:

PROJECT TITLE: ${projectTitle || 'Final-Year Capstone Project'}
PROJECT DESCRIPTION: ${projectDescription || 'Student application with database, authentication and web interface'}
IMPROVEMENT FOCUS: ${queryPrompt}

Provide 4-6 practical recommendations ranked strictly as:
"HIGH IMPACT" (critical differentiator or major grade booster),
"MEDIUM IMPACT" (solid enhancement with reasonable effort), or
"OPTIONAL" (nice-to-have if time permits).

Return a valid JSON array of objects with this exact structure:
[
  {
    "id": "imp-1",
    "title": "Clear action title",
    "priority": "HIGH IMPACT" | "MEDIUM IMPACT" | "OPTIONAL",
    "category": "Uniqueness" | "AI Integration" | "Scalability" | "Resume Value" | "UI/UX" | "Hackathon Readiness" | "Simplification" | "Architecture",
    "impactExplanation": "Why this improvement significantly elevates the project in grading or demo",
    "implementationSteps": [
      "Step 1: ...",
      "Step 2: ...",
      "Step 3: ..."
    ],
    "codeOrTechSuggestion": "Specific library, API, or code pattern to use",
    "difficultyToImplement": "Low (1-2 days)" | "Medium (3-5 days)" | "High (1-2 weeks)"
  }
]`;

  try {
    const result = await callGeminiApi({
      prompt,
      systemInstruction: 'You are an elite software architect and hackathon judge. Output valid JSON only without markdown formatting.',
      apiKey,
      temperature: 0.6,
      jsonMode: true
    });

    if (Array.isArray(result) && result.length > 0) {
      return result;
    }
    if (result && Array.isArray(result.improvements)) {
      return result.improvements;
    }
  } catch (err) {
    console.log('Using Dynamic Improvement Fallback Engine:', err.message);
  }

  return generateDynamicImprovements(projectTitle, projectDescription, queryType, customQuery);
}

function getQueryPromptForType(queryType) {
  switch (queryType) {
    case 'innovative':
    case 'unique':
      return 'How can I make this project more innovative and unique compared to standard student submissions?';
    case 'easier':
      return 'How can I make this project easier to build without sacrificing academic marks or evaluation quality?';
    case 'ai':
      return 'How can I integrate meaningful, explainable AI/GenAI without it feeling like a superficial wrapper?';
    case 'learn':
      return 'What specific technologies, libraries, and architectural concepts should I learn first?';
    case 'missing':
      return 'What critical features, edge-case protections, or architectural pieces are currently missing?';
    case 'resume':
      return 'How can I maximize the tech resume, portfolio impact, and interview discussion value of this project?';
    case '30days':
      return 'What is the most practical, high-scoring MVP I can realistically complete within 30 days?';
    case 'scalable':
      return 'How can I make this project more scalable and architecturally robust?';
    default:
      return 'Comprehensive architectural, functional, and evaluation enhancement review.';
  }
}

function generateDynamicImprovements(title, desc, queryType, customQuery) {
  const pTitle = title || 'Your Project';
  const qType = (queryType || '').toLowerCase();

  if (qType.includes('30days') || qType.includes('30-day')) {
    return [
      {
        id: 'imp-30d-1',
        title: 'Lock In the 30-Day Single "Happy Path" Workflow',
        priority: 'HIGH IMPACT',
        category: 'Simplification',
        impactExplanation: 'Trying to build 10 features in 30 days results in an unstable demo. Perfecting one complete journey (input -> AI processing -> actionable output) guarantees an A grade.',
        implementationSteps: [
          'Week 1: Set up React frontend, Express/FastAPI skeleton, and PostgreSQL tables.',
          'Week 2: Implement core business logic and AI inference endpoint with realistic sample data.',
          'Week 3: Connect UI dashboard with loading states, error toasts, and responsive charts.',
          'Week 4: Unit test critical routes, write IEEE report synopsis, and rehearse live demo.'
        ],
        codeOrTechSuggestion: 'Focus on 1 solid end-to-end user flow using pre-built UI components.',
        difficultyToImplement: 'Low (1-2 days planning)'
      },
      {
        id: 'imp-30d-2',
        title: 'Use Docker Compose for One-Command Judge Reproduction',
        priority: 'HIGH IMPACT',
        category: 'Architecture',
        impactExplanation: 'Examiners appreciate candidates whose code runs immediately without manual dependency hell.',
        implementationSteps: [
          'Write a multi-stage Dockerfile for client and server.',
          'Add docker-compose.yml exposing ports 5173 and 5000.',
          'Test clean clone on a fresh environment.'
        ],
        codeOrTechSuggestion: 'docker-compose up --build in root directory',
        difficultyToImplement: 'Low (1 day)'
      },
      {
        id: 'imp-30d-3',
        title: 'Add Automated API Contract Testing (Supertest / Pytest)',
        priority: 'MEDIUM IMPACT',
        category: 'Resume Value',
        impactExplanation: 'Shows industry maturity by verifying that your core REST endpoints always respond with valid schemas.',
        implementationSteps: [
          'Write 5 endpoint integration tests verifying login, data query, and prediction routes.',
          'Run tests before finalizing final presentation.'
        ],
        codeOrTechSuggestion: 'Supertest with Jest/Vitest, or PyTest for Python backends.',
        difficultyToImplement: 'Low (1-2 days)'
      },
      {
        id: 'imp-30d-4',
        title: 'Replace Manual Cloud Provisioning with One-Click Cloud Deploy',
        priority: 'OPTIONAL',
        category: 'Scalability',
        impactExplanation: 'Deploying the frontend to Vercel and backend to Railway/Render provides an instant live link for judges.',
        implementationSteps: [
          'Connect GitHub repo to Vercel for frontend.',
          'Deploy backend container to Railway or Render free tier.'
        ],
        codeOrTechSuggestion: 'Vercel / Railway / Render deploy triggers',
        difficultyToImplement: 'Medium (2-3 days)'
      }
    ];
  }

  return [
    {
      id: 'imp-1',
      title: 'Integrate Real-Time Visual Explainability (XAI) & Confidence Bounds',
      priority: 'HIGH IMPACT',
      category: 'AI Integration',
      impactExplanation: `Examiners penalize projects that treat AI as an opaque black box. Adding visual explainability transforms ${pTitle} from a basic wrapper into a credible engineering accomplishment.`,
      implementationSteps: [
        'Calculate prediction confidence intervals or token logits alongside output labels.',
        'Use SHAP (SHapley Additive exPlanations) or Grad-CAM to highlight which specific input features triggered the result.',
        'Render interactive visual confidence bars and feature contribution waterfalls directly in the UI.'
      ],
      codeOrTechSuggestion: 'Python shap package for tabular data, or Grad-CAM for images; Recharts or Canvas for interactive UI visualization.',
      difficultyToImplement: 'Medium (3-5 days)'
    },
    {
      id: 'imp-2',
      title: 'Add Automated CI/CD Testing Pipeline with Code Coverage Badges',
      priority: 'HIGH IMPACT',
      category: 'Resume Value',
      impactExplanation: '90% of student projects have zero automated tests. Adding an automated GitHub Actions pipeline with unit/integration tests instantly puts you in the top 5% of candidate portfolios.',
      implementationSteps: [
        'Create a .github/workflows/ci.yml file that triggers on every push and pull request.',
        'Configure test runs for both client and server with coverage threshold enforcement (>75%).',
        'Add passing build and coverage badges to your root README.md.'
      ],
      codeOrTechSuggestion: 'GitHub Actions + Vitest / Jest + Supertest for API endpoint simulation.',
      difficultyToImplement: 'Low (1-2 days)'
    },
    {
      id: 'imp-3',
      title: 'Implement Offline PWA Caching & Optimistic State Updates',
      priority: 'MEDIUM IMPACT',
      category: 'UI/UX',
      impactExplanation: 'Demonstrates deep front-end engineering prowess beyond standard static websites, making the application feel like a responsive native app.',
      implementationSteps: [
        'Configure a Service Worker with Cache-First strategy for static assets and Network-First for API requests.',
        'Implement optimistic UI updates in React: immediately reflect user actions in the DOM while network requests resolve in the background.',
        'Display a sleek offline status banner when the browser loses connectivity.'
      ],
      codeOrTechSuggestion: 'Workbox / Vite PWA plugin + IndexedDB for local offline storage.',
      difficultyToImplement: 'Medium (3-5 days)'
    },
    {
      id: 'imp-4',
      title: 'Introduce Multi-Tier Caching with Redis & In-Memory Invalidation',
      priority: 'MEDIUM IMPACT',
      category: 'Scalability',
      impactExplanation: 'Reduces database load by up to 80% and slashes median API response times from 180ms to under 15ms.',
      implementationSteps: [
        'Wrap frequently queried endpoints (e.g. public summaries, taxonomy lists) with a cache middleware.',
        'Set up cache key generation based on request query parameters with a 5-minute Time-To-Live (TTL).',
        'Implement automated cache invalidation whenever new records are posted or updated.'
      ],
      codeOrTechSuggestion: 'ioredis client or lightweight node-cache with cache-manager in Express/FastAPI.',
      difficultyToImplement: 'Low (1-2 days)'
    },
    {
      id: 'imp-5',
      title: 'Strip Redundant Administrative Sub-Modules to Focus on Core Demo Flow',
      priority: 'OPTIONAL',
      category: 'Simplification',
      impactExplanation: 'Prevents scope creep. Focus 100% of your remaining energy on perfecting the core user journey rather than half-finishing 10 secondary admin screens.',
      implementationSteps: [
        'Identify features that are rarely seen in a 3-minute defense (e.g., custom avatar crop, complex password reset email loops).',
        'Replace multi-page settings forms with pre-configured defaults.',
        'Ensure the primary 2-minute "happy path" works flawlessly without a single console warning.'
      ],
      codeOrTechSuggestion: 'Focus engineering effort on polish of the main dashboard and primary workflow.',
      difficultyToImplement: 'Low (1 day)'
    }
  ];
}

/**
 * 5. MENTOR AGENT (Contextual AI Mentor Chat)
 */
export async function runMentorAgent({ message, history = [], activeProject = null, studentProfile = {} }, apiKey = null) {
  const contextDescription = activeProject
    ? `ACTIVE PROJECT CONTEXT:
Title: ${activeProject.title}
Problem: ${activeProject.problemStatement || activeProject.shortDescription}
Difficulty: ${activeProject.difficulty}
Tech Stack: ${JSON.stringify(activeProject.recommendedTech || {})}`
    : 'No project currently selected by the student.';

  const profileSummary = `STUDENT PROFILE:
Skills: ${(studentProfile.skills || []).join(', ') || 'Not specified'}
Languages: ${(studentProfile.languages || []).join(', ') || 'Not specified'}
Interests: ${(studentProfile.interests || []).join(', ') || 'Not specified'}
Career Goal: ${studentProfile.careerGoal || 'Software Engineer'}`;

  const prompt = `You are "ProjectPilot AI", an expert University Final-Year Project Supervisor and Principal Software Architect.
You give encouraging, technically precise, structured, and pragmatic advice to help university students build impressive, practical projects.

${contextDescription}

${profileSummary}

CONVERSATION HISTORY:
${history.slice(-6).map(m => `${m.role === 'user' ? 'Student' : 'Mentor'}: ${m.text}`).join('\n')}

CURRENT STUDENT QUESTION:
"${message}"

Provide a direct, inspiring, and technically grounded response.
- Use clear markdown formatting with bolding, code snippets, or bullet points where helpful.
- Keep the tone professional, friendly, and empowering.
- If they ask about viva or defense questions, provide exact examiner questions and how to answer them.
- If they ask about presentation or demo, give a 3-minute structured script.
- If they ask to make the project easier, explain exactly what to cut and what core to keep.
- If they ask for innovative features, provide practical modern ideas.
- If they ask about architecture, provide clear layer-by-layer blueprints.
- Keep answers under 400 words so they remain digestible.`;

  try {
    const result = await callGeminiApi({
      prompt,
      systemInstruction: 'You are ProjectPilot AI, a brilliant senior software engineer and final-year academic mentor. Provide insightful, actionable answers.',
      apiKey,
      temperature: 0.7,
      jsonMode: false
    });

    if (result && result.text) {
      return result.text;
    }
  } catch (err) {
    console.log('Using Dynamic Mentor Fallback Engine:', err.message);
  }

  return generateDynamicMentorResponse(message, activeProject, studentProfile);
}

function generateDynamicMentorResponse(message, project, profile) {
  const msgLower = (message || '').toLowerCase();
  const projectTitle = project?.title || 'your final-year project';

  if (msgLower.includes('viva') || msgLower.includes('examiner') || msgLower.includes('defense') || msgLower.includes('oral')) {
    return `### 🎓 Top 5 Viva Questions Examiners Will Ask for **${projectTitle}**:

Here is how to answer them like a seasoned engineer:

1. **"Why did you choose this architecture over a monolithic framework?"**
   - *Model Answer:* "Decoupling the frontend (React) and backend API (FastAPI/Express) enables independent scalability, cleaner unit testing, and allows future mobile or IoT clients to consume the same endpoints without refactoring."

2. **"How did you validate that your AI isn't simply hallucinating or guessing?"**
   - *Model Answer:* "We evaluated the model using Precision, Recall, and F1-score on a dedicated 20% holdout test split rather than raw accuracy alone, and integrated visual confidence bounds."

3. **"How do you handle edge cases where the database or third-party AI fails?"**
   - *Model Answer:* "We implemented a dual-mode fallback strategy with cached responses, schema sanitization, and descriptive HTTP 503 error handling so the user is never left with an unhandled crash."

4. **"What security controls protect user inputs from injection attacks?"**
   - *Model Answer:* "We employ parameterized database queries via our ORM, schema validation with Pydantic/Zod, salted password hashing, and strict CORS headers."

5. **"If you had 3 more months, what would be your next architectural milestone?"**
   - *Model Answer:* "Implementing horizontal container auto-scaling with Kubernetes and setting up Redis pub/sub for real-time telemetry streaming."`;
  }

  if (msgLower.includes('presentation') || msgLower.includes('demo') || msgLower.includes('script') || msgLower.includes('pitch')) {
    return `### ⏱️ High-Impact 3-Minute Project Defense Demo Script:

- **Minute 0:00 – 0:45: The Urgent Problem**
  - "Respected examiners, currently [state problem from blueprint]. Existing manual workflows result in delay and high error rates. Today, I am demonstrating **${projectTitle}**."
- **Minute 0:45 – 1:45: The Live Working Solution**
  - Walk through the primary user journey: upload/input -> click analyze -> show immediate visual results and explainability metrics on the dashboard.
- **Minute 1:45 – 2:30: Technical Architecture & Innovation**
  - Highlight the decoupled architecture, database indexing, and AI model pipeline.
  - Show the automated test results and Docker containerization.
- **Minute 2:30 – 3:00: Impact, Evaluation & Conclusion**
  - Summarize performance metrics (e.g. sub-200ms latency, 92% F1-score).
  - Open the floor for examiner questions with confidence!`;
  }

  if (msgLower.includes('debug') || msgLower.includes('error') || msgLower.includes('troubleshoot')) {
    return `### 🛠️ Systematic Debugging Protocol for **${projectTitle}**:

1. **Step 1: Inspect the Network Tab First**
   - Look at the Request Payload and Response status code:
     - \`401/403\`: Missing or expired JWT Bearer token in headers.
     - \`422/400\`: Schema mismatch between frontend form and backend validation schema.
     - \`500\`: Unhandled server exception (check server console logs for the exact line number).
2. **Step 2: Isolate the AI Pipeline from Web Controllers**
   - Write a standalone test script (e.g. \`node test_ai.js\`) to verify the model/API responds before testing inside React components.
3. **Step 3: CORS & Localhost Mismatches**
   - Ensure the Express backend has \`cors()\` enabled and the Vite client proxies \`/api\` requests to port 5000.`;
  }

  if (msgLower.includes('easier') || msgLower.includes('reduce') || msgLower.includes('simple')) {
    return `### How to Simplify **${projectTitle}** Without Losing Marks:

To make this project achievable without sacrificing academic rigor, adopt the **"Core MVP + 1 Wow Factor"** strategy:

1. **Keep These P0 Essentials:**
   - **Single Primary User Flow**: Focus on one complete journey (e.g. data input $\\rightarrow$ processing $\\rightarrow$ visual output).
   - **Clean Relational Schema**: 3 well-designed tables (Users, Records, Results) are much better than 10 half-empty tables.
   - **Clear Dashboard**: A polished React frontend showing the results clearly.

2. **Cut These Non-Essential Complexities:**
   - ❌ Replace manual custom OAuth/email verification with a simple JWT mock or basic auth for your demo.
   - ❌ Drop real-time WebSockets if not strictly required; simple 5-second polling or on-demand fetch is completely acceptable for academic evaluation.
   - ❌ Don't train large neural networks from scratch—use fine-tuned lightweight models or official API calls (like Gemini / Hugging Face Inference).

> **Mentor Tip:** Examiners grade on *code quality, error handling, and your understanding of the architecture*, not on how many half-broken features you attempted!`;
  }

  if (msgLower.includes('innovative') || msgLower.includes('unique') || msgLower.includes('stand out') || msgLower.includes('features')) {
    return `### 5 High-Impact Innovative Features for **${projectTitle}**:

Here is how you can instantly make this project stand out in a university defense or hackathon:

1. **Visual Explainability (XAI):** Don't just display an output label; show *why* the model made that decision with feature contribution bars (SHAP values) or heatmaps.
2. **Natural Language Query Copilot:** Add a small embedded chat assistant that allows the examiner to ask: *"Show me all anomalies detected this week"* and renders the filtered data.
3. **Automated Audit Trail & PDF Report Generation:** Allow users to click one button to download an official IEEE/industry-standard PDF summary report of their results.
4. **Offline Resilience (PWA):** Enable Progressive Web App caching so the app still functions smoothly if the campus Wi-Fi drops during your live presentation.
5. **Interactive Simulation / "What-If" Mode:** Add sliders that let users tweak input parameters to immediately see how the prediction outcome shifts in real-time.`;
  }

  if (msgLower.includes('architecture') || msgLower.includes('explain the architecture')) {
    return `### Architectural Breakdown of **${projectTitle}**:

The recommended architecture is a **Decoupled 3-Tier Layered System**:

\`\`\`
[ React 18 / Vite SPA ]  <-- User Interface & State Management
         |
    REST API (HTTPS + JWT)
         v
[ Node.js / FastAPI Service ] <-- Business Logic, Validation, Auth
    |                    |
    v                    v
[ PostgreSQL DB ]   [ AI Inference Worker ]
(Data Persistence)   (PyTorch / Gemini API)
\`\`\`

- **Presentation Layer (Frontend):** React Single Page App that communicates via asynchronous REST calls. Handles responsive rendering, input validation, and real-time state.
- **Application Layer (Backend):** Express or FastAPI server serving as the single source of truth. Validates all inputs with strict schemas, manages authentication tokens, and dispatches data tasks.
- **Persistence & AI Layer:** PostgreSQL maintains ACID compliance for transactional data, while AI inference runs asynchronously so long tasks never block user requests.`;
  }

  if (msgLower.includes('learn first') || msgLower.includes('what should i learn') || msgLower.includes('learn')) {
    const primaryTech = project?.recommendedTech?.backend || 'Python FastAPI';
    return `### What You Should Learn First:

Follow this 3-step sequence to ramp up smoothly:

1. **Step 1: Master the API Contract (Days 1–3)**
   - Before building fancy UI or complex ML, get comfortable creating basic REST endpoints in **${primaryTech}**.
   - Learn how to accept a JSON body, validate fields, and return structured JSON responses.

2. **Step 2: Database Modeling & Basic Queries (Days 4–7)**
   - Set up your local PostgreSQL instance and practice connecting your backend.
   - Build simple CRUD functions (Create, Read, Update, Delete).

3. **Step 3: Connect Frontend to Backend (Days 8–10)**
   - In React, use \`fetch()\` or \`axios\` inside a custom hook to pull live data from your backend.
   - Handle **Loading**, **Success**, and **Error** states cleanly in the UI.

Check the **Learning & Quiz** tab in the navigation bar to access curated IBM SkillsBuild and MIT OpenCourseWare modules!`;
  }

  if (msgLower.includes('30-day') || msgLower.includes('roadmap') || msgLower.includes('30 day') || msgLower.includes('plan')) {
    return `### Practical 30-Day Sprint Roadmap for **${projectTitle}**:

- **Days 1–5: Environment & Foundation**
  - Git repository setup, basic client/server skeleton, and database schema creation.
- **Days 6–12: Core Backend & Data Ingestion**
  - Implement authentication, primary CRUD endpoints, and test with Postman/Swagger.
- **Days 13–19: AI Integration & Model Pipeline**
  - Connect your model/Gemini API, verify prediction accuracy, and implement fallback error handling.
- **Days 20–25: Frontend Dashboard & Polish**
  - Build the React views, connect to your APIs, design charts, and add loading feedback.
- **Days 26–30: Testing, Documentation & Demo Rehearsal**
  - Run unit tests, write your IEEE project report, and practice a 3-minute presentation script.`;
  }

  // Default helpful response
  return `Hello! I'm your **ProjectPilot AI Mentor**. 

Regarding **${projectTitle}**:
You have a fantastic foundation to create an impressive final-year project. With your focus on **${profile.careerGoal || 'software engineering'}**, this project provides concrete evidence of full-stack competence, architectural thinking, and practical AI integration.

You can ask me to:
- *"Prepare me for viva defense questions"*
- *"Provide a 3-minute presentation script"*
- *"Make this project easier"* to cut scope safely
- *"Add 5 innovative features"* for hackathons
- *"Explain the architecture in simple terms"*
- *"What should I learn first?"*
- *"Create a 30-day development plan"*

What specific challenge or component would you like to tackle right now?`;
}

/**
 * 6. LEARNING & ASSESSMENT AGENTS
 */
export function getLearningResources(studentSkills = [], projectTech = {}) {
  return {
    resources: EDUCATIONAL_RESOURCES,
    recommendedForProject: [
      {
        provider: 'IBM SkillsBuild',
        title: 'Artificial Intelligence & Cloud Microservices',
        url: 'https://skillsbuild.org/students',
        badge: 'IBM Credential Available',
        relevance: 'Essential for containerizing project microservices and deploying cloud APIs.'
      },
      {
        provider: 'Open Educational Resources',
        title: 'MIT OpenCourseWare: Software Architecture & Testing',
        url: 'https://ocw.mit.edu',
        badge: 'Free MIT Course',
        relevance: 'Guides clean separation of concerns, modular design patterns, and unit testing.'
      }
    ]
  };
}

export function generateCheckpointQuiz(technologies = ['Python', 'React', 'AI/ML']) {
  const quiz = [];
  
  technologies.forEach(tech => {
    const key = Object.keys(ASSESSMENT_QUESTION_BANK).find(k => tech.toLowerCase().includes(k.toLowerCase()));
    if (key && ASSESSMENT_QUESTION_BANK[key]) {
      quiz.push(...ASSESSMENT_QUESTION_BANK[key]);
    }
  });

  if (quiz.length === 0) {
    quiz.push(...ASSESSMENT_QUESTION_BANK['Python']);
    quiz.push(...ASSESSMENT_QUESTION_BANK['React']);
  }

  quiz.push(...ASSESSMENT_QUESTION_BANK['General Architecture']);

  return quiz.slice(0, 5).map((q, idx) => ({
    id: `q-${idx + 1}`,
    ...q
  }));
}

/**
 * 7. ANALYTICS AGENT (Student Readiness & Skill Gap Analysis)
 */
export function runAnalyticsAgent(profile, project) {
  const studentSkills = (profile.skills || []).map(s => s.toLowerCase());
  const tech = project.recommendedTech || {};
  const requiredTechs = [
    tech.frontend || 'React',
    tech.backend || 'Node.js',
    tech.database || 'PostgreSQL',
    tech.aiMl || 'PyTorch'
  ];

  const matchedSkills = [];
  const missingSkills = [];

  requiredTechs.forEach(req => {
    const reqWords = req.toLowerCase().split(/[\s,/]+/);
    const hasMatch = reqWords.some(w => w.length > 2 && studentSkills.some(s => s.includes(w) || w.includes(s)));
    if (hasMatch) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const readinessScore = Math.min(95, Math.max(65, Math.round((matchedSkills.length / Math.max(1, requiredTechs.length)) * 100)));

  return {
    readinessScore,
    matchedSkills,
    missingSkills,
    summary: readinessScore > 80
      ? 'Strong profile match! You possess the fundamental core technologies needed to execute this project with confidence.'
      : 'Good foundation with manageable learning opportunities. Review the recommended IBM SkillsBuild and OER resources to bridge the highlighted skills.',
    estimatedHoursToLearnGaps: missingSkills.length * 12,
    recommendationAction: missingSkills.length > 0
      ? `Dedicate the first 2 weeks to learning ${missingSkills[0]} before jumping into complex implementation.`
      : 'You are ready to begin Phase 1 setup immediately!'
  };
}
