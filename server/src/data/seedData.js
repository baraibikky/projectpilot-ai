export const DOMAINS = [
  { id: 'ai-ml', name: 'Artificial Intelligence & Machine Learning', icon: 'Cpu' },
  { id: 'healthcare', name: 'Healthcare & Medical Tech', icon: 'HeartPulse' },
  { id: 'fintech', name: 'FinTech & Blockchain', icon: 'Coins' },
  { id: 'cybersecurity', name: 'Cybersecurity & Privacy', icon: 'ShieldCheck' },
  { id: 'iot', name: 'IoT & Smart Systems', icon: 'Wifi' },
  { id: 'sustainability', name: 'Sustainability & Clean Tech', icon: 'Leaf' },
  { id: 'education', name: 'EdTech & Learning Platforms', icon: 'GraduationCap' },
  { id: 'agriculture', name: 'AgriTech & Smart Farming', icon: 'Sprout' },
  { id: 'web-cloud', name: 'Cloud Computing & DevOps', icon: 'Cloud' }
];

export const SKILL_PRESETS = [
  {
    id: 'ai-health',
    label: 'AI Healthcare Enthusiast',
    description: 'Python, PyTorch, SQL aiming for Medical Image/Data AI',
    profile: {
      skills: ['Python', 'SQL', 'PyTorch', 'FastAPI', 'Pandas'],
      languages: ['Python', 'SQL'],
      technologies: ['PyTorch', 'FastAPI', 'Docker', 'PostgreSQL'],
      interests: ['AI/ML', 'Healthcare', 'Computer Vision'],
      domain: 'Healthcare & Medical Tech',
      difficulty: 'Intermediate',
      projectType: 'Individual',
      duration: '3 months',
      preferredType: 'Machine Learning / Data Science',
      careerGoal: 'ML Engineer',
      description: 'An AI-assisted diagnostic assistant that flags early signs of retinal disease from scans with patient management.'
    }
  },
  {
    id: 'fullstack-fintech',
    label: 'Full-Stack FinTech Builder',
    description: 'TypeScript, React, Node.js, Microservices & Fraud Detection',
    profile: {
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      languages: ['TypeScript', 'SQL'],
      technologies: ['React', 'Node.js', 'Tailwind CSS', 'Redis', 'Docker'],
      interests: ['FinTech', 'Web Development', 'Security'],
      domain: 'FinTech & Blockchain',
      difficulty: 'Intermediate',
      projectType: 'Team (2-3)',
      duration: '6 months',
      preferredType: 'Full-Stack Web',
      careerGoal: 'Full-Stack Software Engineer',
      description: 'A micro-investing and automated fraud transaction anomaly detection platform for student budgets.'
    }
  },
  {
    id: 'cyber-cloud',
    label: 'Cybersecurity & Cloud Sentinel',
    description: 'Go, Python, Docker, Network Traffic & Zero-Trust Architecture',
    profile: {
      skills: ['Python', 'Go', 'Linux', 'Docker', 'Bash'],
      languages: ['Go', 'Python', 'Bash'],
      technologies: ['Kubernetes', 'Docker', 'Prometheus', 'Suricata', 'FastAPI'],
      interests: ['Cybersecurity', 'Cloud Computing', 'Networks'],
      domain: 'Cybersecurity & Privacy',
      difficulty: 'Advanced',
      projectType: 'Team (2-3)',
      duration: '6 months',
      preferredType: 'Cloud/DevOps',
      careerGoal: 'Security Engineer',
      description: 'An automated container vulnerability scanner and real-time network zero-trust policy enforcement agent.'
    }
  },
  {
    id: 'iot-agri',
    label: 'AgriTech IoT Specialist',
    description: 'C++, Python, ESP32, Soil Analytics & Yield Prediction',
    profile: {
      skills: ['C++', 'Python', 'MQTT', 'Flask', 'SQLite'],
      languages: ['C++', 'Python'],
      technologies: ['ESP32', 'Raspberry Pi', 'Flask', 'Chart.js', 'TensorFlow Lite'],
      interests: ['IoT', 'Agriculture', 'Sustainability'],
      domain: 'AgriTech & Smart Farming',
      difficulty: 'Intermediate',
      projectType: 'Team (3-4)',
      duration: '3 months',
      preferredType: 'Embedded/IoT',
      careerGoal: 'IoT Solutions Architect',
      description: 'Smart precision irrigation system using edge AI soil sensors and satellite weather forecasting.'
    }
  }
];

export const EDUCATIONAL_RESOURCES = [
  {
    provider: 'IBM SkillsBuild',
    category: 'Artificial Intelligence',
    title: 'Artificial Intelligence Fundamentals',
    description: 'Comprehensive IBM badge program covering neural networks, NLP, and ethical AI systems.',
    url: 'https://skillsbuild.org/students/course/artificial-intelligence-fundamentals',
    level: 'Beginner to Intermediate',
    tags: ['AI', 'Ethics', 'Machine Learning', 'IBM Badge']
  },
  {
    provider: 'IBM SkillsBuild',
    category: 'Cloud Computing',
    title: 'Cloud Core Concepts & Microservices',
    description: 'Hands-on curriculum exploring containerization, Docker, Kubernetes, and cloud deployment pipelines.',
    url: 'https://skillsbuild.org/students/course/cloud-computing-fundamentals',
    level: 'Intermediate',
    tags: ['Cloud', 'Docker', 'Kubernetes', 'Microservices']
  },
  {
    provider: 'IBM SkillsBuild',
    category: 'Cybersecurity',
    title: 'Cybersecurity Fundamentals',
    description: 'Master threat intelligence, authentication protocols, defensive security architecture and cryptography.',
    url: 'https://skillsbuild.org/students/course/cybersecurity-fundamentals',
    level: 'Beginner to Intermediate',
    tags: ['Security', 'Cryptography', 'Network Defense']
  },
  {
    provider: 'Open Educational Resources (OER)',
    category: 'Computer Science & Software Engineering',
    title: 'MIT OpenCourseWare: Software Construction',
    description: 'Free curriculum on rigorous software design, architecture, modularity, and testing methodologies.',
    url: 'https://ocw.mit.edu/courses/6-031-elements-of-software-construction-spring-2016/',
    level: 'Intermediate to Advanced',
    tags: ['Architecture', 'Testing', 'Clean Code', 'MIT']
  },
  {
    provider: 'Open Educational Resources (OER)',
    category: 'Machine Learning',
    title: 'Fast.ai: Practical Deep Learning for Coders',
    description: 'World-renowned hands-on course taking students from practical coding to state-of-the-art models.',
    url: 'https://course.fast.ai/',
    level: 'All Levels',
    tags: ['Deep Learning', 'PyTorch', 'Computer Vision', 'NLP']
  },
  {
    provider: 'Open Educational Resources (OER)',
    category: 'Web Engineering',
    title: 'MDN Web Docs & Architecture Curricula',
    description: 'Industry-standard open documentation on RESTful APIs, accessibility (WCAG), performance and security.',
    url: 'https://developer.mozilla.org/en-US/docs/Learn',
    level: 'All Levels',
    tags: ['APIs', 'Accessibility', 'Frontend', 'Performance']
  }
];

export const ASSESSMENT_QUESTION_BANK = {
  'Python': [
    {
      question: 'In Python, what is the key difference between a list and a generator when processing large data files?',
      options: [
        'Generators store all elements in memory, while lists calculate values lazily',
        'Generators yield elements lazily one by one, reducing memory footprint to O(1)',
        'Lists are immutable whereas generators are mutable',
        'Generators execute faster for random-access indexing'
      ],
      correctIndex: 1,
      explanation: 'Generators use lazy evaluation (`yield`), producing items only on demand and preserving memory overhead for massive datasets.'
    },
    {
      question: 'Which ASGI framework in Python is best suited for high-performance async REST APIs and automatic OpenAPI docs?',
      options: ['Django Classic', 'Flask 1.x', 'FastAPI', 'Tornado'],
      correctIndex: 2,
      explanation: 'FastAPI leverages Starlette and Pydantic for asynchronous IO and automatic interactive documentation generation.'
    }
  ],
  'React': [
    {
      question: 'When optimizing expensive calculations in a React component, which hook should you employ?',
      options: ['useEffect', 'useMemo', 'useCallback', 'useRef'],
      correctIndex: 1,
      explanation: '`useMemo` caches the calculated result between renders unless specified dependencies change.'
    },
    {
      question: 'Why is it critical to use unique, stable keys when rendering dynamic lists in React?',
      options: [
        'It speeds up network requests to the backend',
        'It enables React reconciliation to match virtual DOM nodes accurately during diffing',
        'It prevents CSS styles from cascading to child elements',
        'It binds event listeners automatically'
      ],
      correctIndex: 1,
      explanation: 'Stable keys allow React’s reconciliation algorithm to determine which items have changed, been added, or been removed.'
    }
  ],
  'AI/ML': [
    {
      question: 'In a classification project with severe class imbalance (e.g., 99% negative, 1% positive), which evaluation metric is most reliable?',
      options: ['Overall Accuracy', 'PR-AUC (Precision-Recall Area Under Curve) or F1-Score', 'Mean Squared Error', 'Training Loss alone'],
      correctIndex: 1,
      explanation: 'Accuracy is misleading on imbalanced datasets because a trivial model predicting only the majority class scores 99%. PR-AUC and F1-score measure minority class precision and recall.'
    },
    {
      question: 'What is Retrieval-Augmented Generation (RAG) primarily designed to achieve in LLM applications?',
      options: [
        'To train a base foundation model from scratch',
        'To ground LLM outputs in domain-specific external knowledge and reduce hallucinations',
        'To compress neural network weights into quantized 4-bit integers',
        'To replace traditional relational databases with JSON files'
      ],
      correctIndex: 1,
      explanation: 'RAG retrieves relevant semantic documents from a vector database and includes them in the LLM prompt context to guarantee factual accuracy.'
    }
  ],
  'General Architecture': [
    {
      question: 'What is the primary benefit of decoupling a web application into an API backend and SPA frontend for a final-year project?',
      options: [
        'It eliminates the need for unit testing',
        'Independent deployability, separation of concerns, and ability to support multi-client interfaces (mobile, web, CLI)',
        'It guarantees 100% test coverage automatically',
        'It replaces the database with local storage'
      ],
      correctIndex: 1,
      explanation: 'Decoupled architectures allow clear contracts, independent scaling, and versatility across platforms.'
    }
  ]
};
