import {
  FaArrowLeft,
  FaArrowRight,
  FaBrain,
  FaBook,
  FaBriefcase,
  FaChartLine,
  FaCheckCircle,
  FaCloud,
  FaCode,
  FaCog,
  FaDatabase,
  FaGlobe,
  FaHome,
  FaLinkedin,
  FaRedo,
  FaRobot,
  FaShieldAlt,
  FaStar,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   TYPES
========================================================= */

type InterviewType = "technical" | "hr";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface Question {
  question: string;
  category: string;
  difficulty: Difficulty;
  expectedPoints: string[];
}

interface Resource {
  title: string;
  description: string;
  type: "Website" | "Book" | "Practice";
  url: string;
}

interface RoleData {
  icon: React.ReactNode;
  description: string;
  questions: Question[];
  resources: Resource[];
}

/* =========================================================
   COMMON TECHNICAL QUESTIONS
========================================================= */

const commonHRQuestions: Question[] = [
  {
    question:
      "Tell me about yourself and explain why you are interested in this role.",
    category: "Introduction",
    difficulty: "Beginner",
    expectedPoints: ["background", "skills", "experience", "role", "career"],
  },
  {
    question:
      "What is your greatest professional strength? Give a real example.",
    category: "Strengths",
    difficulty: "Beginner",
    expectedPoints: ["strength", "example", "result"],
  },
  {
    question:
      "What is one weakness you are currently working to improve?",
    category: "Self Awareness",
    difficulty: "Beginner",
    expectedPoints: ["weakness", "improve", "action"],
  },
  {
    question:
      "Describe a difficult problem you faced and explain how you solved it.",
    category: "Problem Solving",
    difficulty: "Intermediate",
    expectedPoints: ["situation", "action", "solution", "result"],
  },
  {
    question:
      "Describe a time when you had to work with a difficult team member.",
    category: "Teamwork",
    difficulty: "Intermediate",
    expectedPoints: ["situation", "communication", "team", "result"],
  },
  {
    question:
      "Why should we hire you instead of another candidate?",
    category: "Motivation",
    difficulty: "Intermediate",
    expectedPoints: ["skills", "value", "experience", "role"],
  },
  {
    question:
      "Where do you see yourself professionally in the next three to five years?",
    category: "Career Goals",
    difficulty: "Beginner",
    expectedPoints: ["career", "growth", "skills", "goals"],
  },
  {
    question:
      "Tell me about a failure or mistake and what you learned from it.",
    category: "Behavioral",
    difficulty: "Intermediate",
    expectedPoints: ["failure", "mistake", "learning", "improvement"],
  },
];

/* =========================================================
   ROLE QUESTION BANKS
========================================================= */

const roleData: Record<string, RoleData> = {
  "Software Engineer": {
    icon: <FaCode />,
    description:
      "Software development, programming, DSA, OOP, databases and system design.",
    questions: [
      {
        question:
          "What is the difference between an array and a linked list?",
        category: "Data Structures",
        difficulty: "Beginner",
        expectedPoints: ["array", "linked", "memory", "access", "insertion"],
      },
      {
        question:
          "Explain time complexity and why Big O notation is important.",
        category: "Algorithms",
        difficulty: "Beginner",
        expectedPoints: ["complexity", "big", "performance", "input"],
      },
      {
        question:
          "What is the difference between a stack and a queue?",
        category: "Data Structures",
        difficulty: "Beginner",
        expectedPoints: ["stack", "queue", "lifo", "fifo"],
      },
      {
        question:
          "Explain the four main principles of object-oriented programming.",
        category: "OOP",
        difficulty: "Intermediate",
        expectedPoints: [
          "encapsulation",
          "inheritance",
          "polymorphism",
          "abstraction",
        ],
      },
      {
        question:
          "What is database normalization and why is it useful?",
        category: "DBMS",
        difficulty: "Intermediate",
        expectedPoints: ["normalization", "redundancy", "dependency", "database"],
      },
      {
        question:
          "What is the difference between authentication and authorization?",
        category: "Security",
        difficulty: "Beginner",
        expectedPoints: ["authentication", "authorization", "identity", "access"],
      },
      {
        question:
          "What is a REST API and what are common HTTP methods?",
        category: "Web Development",
        difficulty: "Beginner",
        expectedPoints: ["rest", "api", "get", "post", "put", "delete"],
      },
      {
        question:
          "Explain the difference between a process and a thread.",
        category: "Operating Systems",
        difficulty: "Intermediate",
        expectedPoints: ["process", "thread", "memory", "execution"],
      },
      {
        question:
          "What is a deadlock in an operating system?",
        category: "Operating Systems",
        difficulty: "Advanced",
        expectedPoints: ["deadlock", "process", "resource", "waiting"],
      },
      {
        question:
          "Explain TCP versus UDP and give an example use case for each.",
        category: "Networking",
        difficulty: "Intermediate",
        expectedPoints: ["tcp", "udp", "connection", "reliable", "speed"],
      },
      {
        question:
          "How would you investigate and fix a slow production application?",
        category: "System Performance",
        difficulty: "Advanced",
        expectedPoints: [
          "bottleneck",
          "monitoring",
          "database",
          "cache",
          "performance",
        ],
      },
      {
        question:
          "What is the purpose of unit testing and integration testing?",
        category: "Software Engineering",
        difficulty: "Intermediate",
        expectedPoints: ["unit", "integration", "testing", "bug"],
      },
    ],
    resources: [
      {
        title: "MDN Web Docs",
        description: "Web fundamentals, APIs, JavaScript and browser technologies.",
        type: "Website",
        url: "https://developer.mozilla.org/",
      },
      {
        title: "LeetCode",
        description: "DSA and coding interview practice.",
        type: "Practice",
        url: "https://leetcode.com/",
      },
      {
        title: "GeeksforGeeks",
        description: "DSA, DBMS, OS, networking and interview questions.",
        type: "Website",
        url: "https://www.geeksforgeeks.org/",
      },
      {
        title: "Designing Data-Intensive Applications",
        description: "Excellent book for advanced software and system design concepts.",
        type: "Book",
        url: "https://dataintensive.net/",
      },
    ],
  },

  "Frontend Developer": {
    icon: <FaGlobe />,
    description:
      "HTML, CSS, JavaScript, React, accessibility, responsive design and performance.",
    questions: [
      {
        question:
          "What is the difference between semantic HTML and non-semantic HTML?",
        category: "HTML",
        difficulty: "Beginner",
        expectedPoints: ["semantic", "html", "accessibility", "structure"],
      },
      {
        question:
          "Explain the CSS box model.",
        category: "CSS",
        difficulty: "Beginner",
        expectedPoints: ["margin", "border", "padding", "content"],
      },
      {
        question:
          "What is responsive web design and how do you implement it?",
        category: "CSS",
        difficulty: "Beginner",
        expectedPoints: ["responsive", "media", "screen", "flexible"],
      },
      {
        question:
          "What is the difference between state and props in React?",
        category: "React",
        difficulty: "Beginner",
        expectedPoints: ["state", "props", "parent", "component"],
      },
      {
        question:
          "Why is the key prop important when rendering lists in React?",
        category: "React",
        difficulty: "Intermediate",
        expectedPoints: ["key", "unique", "reconciliation", "render"],
      },
      {
        question:
          "What is the purpose of React hooks such as useState and useEffect?",
        category: "React",
        difficulty: "Intermediate",
        expectedPoints: ["hook", "state", "effect", "component"],
      },
      {
        question:
          "Explain event bubbling and event delegation in JavaScript.",
        category: "JavaScript",
        difficulty: "Advanced",
        expectedPoints: ["event", "bubbling", "parent", "delegation"],
      },
      {
        question:
          "What is the difference between localStorage and sessionStorage?",
        category: "Web APIs",
        difficulty: "Beginner",
        expectedPoints: ["localstorage", "sessionstorage", "browser", "session"],
      },
      {
        question:
          "How would you improve the loading speed of a React website?",
        category: "Performance",
        difficulty: "Advanced",
        expectedPoints: ["lazy", "code", "image", "bundle", "cache"],
      },
      {
        question:
          "What is accessibility and why is it important in frontend development?",
        category: "Accessibility",
        difficulty: "Intermediate",
        expectedPoints: ["accessibility", "keyboard", "screen", "semantic"],
      },
    ],
    resources: [
      {
        title: "MDN Web Docs",
        description: "HTML, CSS, JavaScript and web platform fundamentals.",
        type: "Website",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
      },
      {
        title: "React Documentation",
        description: "Official React learning and reference material.",
        type: "Website",
        url: "https://react.dev/",
      },
      {
        title: "web.dev",
        description: "Modern web performance, accessibility and best practices.",
        type: "Website",
        url: "https://web.dev/",
      },
      {
        title: "JavaScript: The Definitive Guide",
        description: "Comprehensive JavaScript reference and learning book.",
        type: "Book",
        url: "https://www.oreilly.com/library/view/javascript-the-definitive/9781098148172/",
      },
    ],
  },

  "Backend Developer": {
    icon: <FaDatabase />,
    description:
      "APIs, databases, authentication, server architecture and backend performance.",
    questions: [
      {
        question:
          "What is the difference between SQL and NoSQL databases?",
        category: "Databases",
        difficulty: "Beginner",
        expectedPoints: ["sql", "nosql", "relational", "document"],
      },
      {
        question:
          "What is database indexing and what trade-offs does it introduce?",
        category: "Databases",
        difficulty: "Intermediate",
        expectedPoints: ["index", "query", "read", "write", "storage"],
      },
      {
        question:
          "What are ACID properties in database transactions?",
        category: "DBMS",
        difficulty: "Intermediate",
        expectedPoints: ["atomicity", "consistency", "isolation", "durability"],
      },
      {
        question:
          "How does JWT-based authentication work?",
        category: "Authentication",
        difficulty: "Intermediate",
        expectedPoints: ["jwt", "token", "authentication", "server"],
      },
      {
        question:
          "What is caching and when would you use Redis or another cache?",
        category: "Performance",
        difficulty: "Advanced",
        expectedPoints: ["cache", "redis", "memory", "performance"],
      },
      {
        question:
          "How would you design a scalable REST API?",
        category: "System Design",
        difficulty: "Advanced",
        expectedPoints: ["api", "scalable", "database", "cache", "load"],
      },
      {
        question:
          "What is rate limiting and why is it useful?",
        category: "Security",
        difficulty: "Intermediate",
        expectedPoints: ["rate", "limit", "abuse", "request", "security"],
      },
      {
        question:
          "How should passwords be securely stored?",
        category: "Security",
        difficulty: "Intermediate",
        expectedPoints: ["hash", "password", "salt", "bcrypt"],
      },
    ],
    resources: [
      {
        title: "Node.js Documentation",
        description: "Official Node.js runtime documentation.",
        type: "Website",
        url: "https://nodejs.org/docs/latest/api/",
      },
      {
        title: "PostgreSQL Documentation",
        description: "Official PostgreSQL database documentation.",
        type: "Website",
        url: "https://www.postgresql.org/docs/",
      },
      {
        title: "System Design Primer",
        description: "Open-source system design interview preparation.",
        type: "Practice",
        url: "https://github.com/donnemartin/system-design-primer",
      },
      {
        title: "Designing Data-Intensive Applications",
        description: "Distributed systems and data architecture.",
        type: "Book",
        url: "https://dataintensive.net/",
      },
    ],
  },

  "Full Stack Developer": {
    icon: <FaCode />,
    description:
      "Frontend + backend + databases + APIs + deployment and architecture.",
    questions: [
      {
        question:
          "Explain the complete flow from a browser request to a database response.",
        category: "Full Stack",
        difficulty: "Intermediate",
        expectedPoints: ["browser", "server", "api", "database", "response"],
      },
      {
        question:
          "How would you structure a production React and Node.js application?",
        category: "Architecture",
        difficulty: "Advanced",
        expectedPoints: ["frontend", "backend", "api", "database", "structure"],
      },
      {
        question:
          "What is CORS and why can it cause frontend API errors?",
        category: "Web Security",
        difficulty: "Intermediate",
        expectedPoints: ["cors", "origin", "browser", "request"],
      },
      {
        question:
          "How would you secure a full-stack application?",
        category: "Security",
        difficulty: "Advanced",
        expectedPoints: ["authentication", "authorization", "validation", "https"],
      },
      {
        question:
          "How would you deploy a full-stack application?",
        category: "Deployment",
        difficulty: "Intermediate",
        expectedPoints: ["frontend", "backend", "database", "deployment"],
      },
      {
        question:
          "How would you diagnose a production bug reported by users?",
        category: "Debugging",
        difficulty: "Advanced",
        expectedPoints: ["logs", "reproduce", "monitoring", "debug", "fix"],
      },
    ],
    resources: [
      {
        title: "React",
        description: "Official React documentation.",
        type: "Website",
        url: "https://react.dev/",
      },
      {
        title: "Node.js",
        description: "Official Node.js documentation.",
        type: "Website",
        url: "https://nodejs.org/",
      },
      {
        title: "MDN",
        description: "Core web platform reference.",
        type: "Website",
        url: "https://developer.mozilla.org/",
      },
      {
        title: "Full Stack Open",
        description: "Modern full-stack web development course.",
        type: "Practice",
        url: "https://fullstackopen.com/en/",
      },
    ],
  },

  "Data Analyst": {
    icon: <FaChartLine />,
    description:
      "SQL, Excel, statistics, dashboards, data cleaning and business insights.",
    questions: [
      {
        question:
          "What is the difference between mean, median and mode?",
        category: "Statistics",
        difficulty: "Beginner",
        expectedPoints: ["mean", "median", "mode", "data"],
      },
      {
        question:
          "What is the difference between WHERE and HAVING in SQL?",
        category: "SQL",
        difficulty: "Intermediate",
        expectedPoints: ["where", "having", "group", "filter"],
      },
      {
        question:
          "How would you handle missing values in a dataset?",
        category: "Data Cleaning",
        difficulty: "Intermediate",
        expectedPoints: ["missing", "remove", "impute", "data"],
      },
      {
        question:
          "What is an INNER JOIN and when would you use it?",
        category: "SQL",
        difficulty: "Beginner",
        expectedPoints: ["inner", "join", "table", "matching"],
      },
      {
        question:
          "How would you explain a dashboard insight to a non-technical manager?",
        category: "Communication",
        difficulty: "Intermediate",
        expectedPoints: ["insight", "business", "simple", "decision"],
      },
      {
        question:
          "What makes a good data visualization?",
        category: "Visualization",
        difficulty: "Beginner",
        expectedPoints: ["clear", "chart", "audience", "insight"],
      },
    ],
    resources: [
      {
        title: "Kaggle",
        description: "Datasets, notebooks and data science practice.",
        type: "Practice",
        url: "https://www.kaggle.com/",
      },
      {
        title: "SQLBolt",
        description: "Interactive SQL lessons and exercises.",
        type: "Practice",
        url: "https://sqlbolt.com/",
      },
      {
        title: "Mode SQL Tutorial",
        description: "Practical SQL and data analysis learning.",
        type: "Website",
        url: "https://mode.com/sql-tutorial/",
      },
      {
        title: "Storytelling with Data",
        description: "Book focused on communicating data effectively.",
        type: "Book",
        url: "https://www.storytellingwithdata.com/",
      },
    ],
  },

  "Cybersecurity Analyst": {
    icon: <FaShieldAlt />,
    description:
      "Security fundamentals, threats, authentication, networking and incident response.",
    questions: [
      {
        question:
          "What is the CIA triad in cybersecurity?",
        category: "Security Fundamentals",
        difficulty: "Beginner",
        expectedPoints: ["confidentiality", "integrity", "availability"],
      },
      {
        question:
          "What is the difference between hashing and encryption?",
        category: "Cryptography",
        difficulty: "Intermediate",
        expectedPoints: ["hash", "encryption", "reversible", "password"],
      },
      {
        question:
          "What is phishing and how can organizations reduce the risk?",
        category: "Threats",
        difficulty: "Beginner",
        expectedPoints: ["phishing", "email", "awareness", "security"],
      },
      {
        question:
          "What is the purpose of a firewall?",
        category: "Networking Security",
        difficulty: "Beginner",
        expectedPoints: ["firewall", "traffic", "network", "rule"],
      },
      {
        question:
          "How would you respond to a suspected security incident?",
        category: "Incident Response",
        difficulty: "Advanced",
        expectedPoints: ["detect", "contain", "investigate", "recover"],
      },
    ],
    resources: [
      {
        title: "OWASP",
        description: "Web application security risks and best practices.",
        type: "Website",
        url: "https://owasp.org/",
      },
      {
        title: "PortSwigger Web Security Academy",
        description: "Hands-on web security labs.",
        type: "Practice",
        url: "https://portswigger.net/web-security",
      },
      {
        title: "NIST Cybersecurity Framework",
        description: "Cybersecurity guidance and framework resources.",
        type: "Website",
        url: "https://www.nist.gov/cyberframework",
      },
    ],
  },

  "DevOps / Cloud Engineer": {
    icon: <FaCloud />,
    description:
      "Cloud infrastructure, CI/CD, containers, monitoring and deployment.",
    questions: [
      {
        question:
          "What problem does Docker solve?",
        category: "Containers",
        difficulty: "Beginner",
        expectedPoints: ["docker", "container", "environment", "deployment"],
      },
      {
        question:
          "What is CI/CD and why is it important?",
        category: "DevOps",
        difficulty: "Beginner",
        expectedPoints: ["continuous", "integration", "deployment", "automation"],
      },
      {
        question:
          "What is the difference between horizontal and vertical scaling?",
        category: "Cloud Architecture",
        difficulty: "Intermediate",
        expectedPoints: ["horizontal", "vertical", "server", "scale"],
      },
      {
        question:
          "What is infrastructure as code?",
        category: "Cloud",
        difficulty: "Intermediate",
        expectedPoints: ["infrastructure", "code", "automation", "terraform"],
      },
      {
        question:
          "How would you monitor a production cloud application?",
        category: "Monitoring",
        difficulty: "Advanced",
        expectedPoints: ["logs", "metrics", "alerts", "monitoring"],
      },
    ],
    resources: [
      {
        title: "AWS Documentation",
        description: "Official AWS cloud learning and documentation.",
        type: "Website",
        url: "https://docs.aws.amazon.com/",
      },
      {
        title: "Docker Documentation",
        description: "Official Docker documentation and guides.",
        type: "Website",
        url: "https://docs.docker.com/",
      },
      {
        title: "Kubernetes Documentation",
        description: "Container orchestration documentation.",
        type: "Website",
        url: "https://kubernetes.io/docs/",
      },
    ],
  },

  "AI / Machine Learning Engineer": {
    icon: <FaBrain />,
    description:
      "Machine learning fundamentals, models, evaluation and AI engineering.",
    questions: [
      {
        question:
          "What is the difference between supervised and unsupervised learning?",
        category: "Machine Learning",
        difficulty: "Beginner",
        expectedPoints: ["supervised", "unsupervised", "label", "data"],
      },
      {
        question:
          "What is overfitting and how can you reduce it?",
        category: "Machine Learning",
        difficulty: "Intermediate",
        expectedPoints: ["overfitting", "validation", "regularization", "data"],
      },
      {
        question:
          "Explain precision, recall and why they matter.",
        category: "Model Evaluation",
        difficulty: "Intermediate",
        expectedPoints: ["precision", "recall", "false", "positive"],
      },
      {
        question:
          "What is the difference between training, validation and test datasets?",
        category: "Machine Learning",
        difficulty: "Beginner",
        expectedPoints: ["training", "validation", "test", "model"],
      },
      {
        question:
          "How would you deploy a machine learning model into a production application?",
        category: "AI Engineering",
        difficulty: "Advanced",
        expectedPoints: ["model", "api", "deployment", "monitoring"],
      },
    ],
    resources: [
      {
        title: "Google Machine Learning Crash Course",
        description: "Practical introduction to machine learning concepts.",
        type: "Website",
        url: "https://developers.google.com/machine-learning/crash-course",
      },
      {
        title: "Kaggle Learn",
        description: "Hands-on machine learning and data courses.",
        type: "Practice",
        url: "https://www.kaggle.com/learn",
      },
      {
        title: "Hands-On Machine Learning",
        description: "Practical machine learning book.",
        type: "Book",
        url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125974/",
      },
    ],
  },

  "Software QA / Test Engineer": {
    icon: <FaCheckCircle />,
    description:
      "Manual testing, automation, test cases, bugs, APIs and quality assurance.",
    questions: [
      {
        question:
          "What is the difference between verification and validation?",
        category: "Testing Fundamentals",
        difficulty: "Beginner",
        expectedPoints: ["verification", "validation", "requirements", "product"],
      },
      {
        question:
          "What is the difference between a test case and a test scenario?",
        category: "Testing",
        difficulty: "Beginner",
        expectedPoints: ["test", "case", "scenario", "steps"],
      },
      {
        question:
          "What is regression testing?",
        category: "Testing",
        difficulty: "Beginner",
        expectedPoints: ["regression", "changes", "existing", "bugs"],
      },
      {
        question:
          "What is API testing and what would you validate?",
        category: "API Testing",
        difficulty: "Intermediate",
        expectedPoints: ["api", "status", "response", "request"],
      },
      {
        question:
          "When would you choose automation testing over manual testing?",
        category: "Automation",
        difficulty: "Intermediate",
        expectedPoints: ["automation", "repeat", "manual", "testing"],
      },
    ],
    resources: [
      {
        title: "ISTQB",
        description: "International software testing certification resources.",
        type: "Website",
        url: "https://www.istqb.org/",
      },
      {
        title: "Playwright",
        description: "Modern end-to-end browser automation.",
        type: "Practice",
        url: "https://playwright.dev/",
      },
      {
        title: "Postman",
        description: "API development and testing platform.",
        type: "Practice",
        url: "https://www.postman.com/",
      },
    ],
  },

  "Business Analyst": {
    icon: <FaBriefcase />,
    description:
      "Requirements, stakeholder management, business processes and analytical thinking.",
    questions: [
      {
        question:
          "What is the role of a business analyst in an organization?",
        category: "Business Analysis",
        difficulty: "Beginner",
        expectedPoints: ["business", "requirements", "stakeholder", "solution"],
      },
      {
        question:
          "How would you gather requirements from stakeholders?",
        category: "Requirements",
        difficulty: "Intermediate",
        expectedPoints: ["requirements", "stakeholder", "interview", "document"],
      },
      {
        question:
          "What is the difference between functional and non-functional requirements?",
        category: "Requirements",
        difficulty: "Intermediate",
        expectedPoints: ["functional", "non-functional", "performance", "feature"],
      },
      {
        question:
          "How would you handle conflicting requirements from two stakeholders?",
        category: "Stakeholder Management",
        difficulty: "Advanced",
        expectedPoints: ["stakeholder", "conflict", "priority", "communication"],
      },
      {
        question:
          "What is a KPI and how would you select useful KPIs?",
        category: "Analytics",
        difficulty: "Intermediate",
        expectedPoints: ["kpi", "metric", "goal", "business"],
      },
    ],
    resources: [
      {
        title: "IIBA",
        description: "International Institute of Business Analysis resources.",
        type: "Website",
        url: "https://www.iiba.org/",
      },
      {
        title: "BA Times",
        description: "Business analysis articles and career resources.",
        type: "Website",
        url: "https://www.batimes.com/",
      },
      {
        title: "Business Analysis for Practitioners",
        description: "Practical business analysis reference.",
        type: "Book",
        url: "https://www.pmi.org/pmbok-guide-standards/foundational/business-analysis",
      },
    ],
  },

  "Marketing Specialist": {
    icon: <FaGlobe />,
    description:
      "Digital marketing, branding, content, SEO, social media and analytics.",
    questions: [
      {
        question:
          "What is the difference between SEO and paid search?",
        category: "Digital Marketing",
        difficulty: "Beginner",
        expectedPoints: ["seo", "paid", "search", "organic"],
      },
      {
        question:
          "How would you create a digital marketing strategy for a new product?",
        category: "Strategy",
        difficulty: "Intermediate",
        expectedPoints: ["audience", "strategy", "content", "channel"],
      },
      {
        question:
          "What marketing KPIs would you monitor?",
        category: "Analytics",
        difficulty: "Beginner",
        expectedPoints: ["kpi", "conversion", "traffic", "engagement"],
      },
      {
        question:
          "How would you measure the success of a social media campaign?",
        category: "Social Media",
        difficulty: "Intermediate",
        expectedPoints: ["engagement", "reach", "conversion", "campaign"],
      },
      {
        question:
          "What is a target audience and how do you identify one?",
        category: "Marketing Strategy",
        difficulty: "Beginner",
        expectedPoints: ["audience", "customer", "segment", "research"],
      },
    ],
    resources: [
      {
        title: "Google Skillshop",
        description: "Google Ads, Analytics and digital marketing training.",
        type: "Website",
        url: "https://skillshop.withgoogle.com/",
      },
      {
        title: "HubSpot Academy",
        description: "Free marketing, sales and CRM learning resources.",
        type: "Website",
        url: "https://academy.hubspot.com/",
      },
      {
        title: "Google Analytics",
        description: "Official analytics learning resources.",
        type: "Website",
        url: "https://analytics.google.com/",
      },
    ],
  },

  "HR / Human Resources": {
    icon: <FaUsers />,
    description:
      "Recruitment, employee relations, performance management and HR strategy.",
    questions: [
      {
        question:
          "What are the main responsibilities of an HR professional?",
        category: "HR Fundamentals",
        difficulty: "Beginner",
        expectedPoints: ["recruitment", "employees", "performance", "culture"],
      },
      {
        question:
          "How would you conduct a structured interview?",
        category: "Recruitment",
        difficulty: "Intermediate",
        expectedPoints: ["questions", "criteria", "candidate", "evaluation"],
      },
      {
        question:
          "How would you handle an employee conflict?",
        category: "Employee Relations",
        difficulty: "Intermediate",
        expectedPoints: ["conflict", "communication", "listen", "solution"],
      },
      {
        question:
          "What makes a good employee performance review?",
        category: "Performance Management",
        difficulty: "Intermediate",
        expectedPoints: ["performance", "feedback", "goals", "improvement"],
      },
      {
        question:
          "How can HR improve employee retention?",
        category: "HR Strategy",
        difficulty: "Advanced",
        expectedPoints: ["retention", "engagement", "culture", "growth"],
      },
    ],
    resources: [
      {
        title: "SHRM",
        description: "Professional HR resources and career information.",
        type: "Website",
        url: "https://www.shrm.org/",
      },
      {
        title: "CIPD",
        description: "Professional HR and people-management resources.",
        type: "Website",
        url: "https://www.cipd.org/",
      },
      {
        title: "Harvard Business Review",
        description: "Leadership, management and workplace research.",
        type: "Website",
        url: "https://hbr.org/",
      },
    ],
  },

  "Finance / Accounting": {
    icon: <FaChartLine />,
    description:
      "Financial statements, accounting, budgeting, ratios and financial analysis.",
    questions: [
      {
        question:
          "Explain the three main financial statements.",
        category: "Accounting",
        difficulty: "Beginner",
        expectedPoints: ["income", "balance", "cash", "statement"],
      },
      {
        question:
          "What is the difference between revenue, profit and cash flow?",
        category: "Finance",
        difficulty: "Beginner",
        expectedPoints: ["revenue", "profit", "cash", "flow"],
      },
      {
        question:
          "What is working capital?",
        category: "Finance",
        difficulty: "Intermediate",
        expectedPoints: ["current", "assets", "liabilities", "capital"],
      },
      {
        question:
          "How would you evaluate the financial health of a company?",
        category: "Financial Analysis",
        difficulty: "Advanced",
        expectedPoints: ["ratio", "profit", "cash", "debt", "revenue"],
      },
      {
        question:
          "What is the difference between fixed and variable costs?",
        category: "Cost Accounting",
        difficulty: "Beginner",
        expectedPoints: ["fixed", "variable", "cost", "production"],
      },
    ],
    resources: [
      {
        title: "Investopedia",
        description: "Finance and accounting concepts explained clearly.",
        type: "Website",
        url: "https://www.investopedia.com/",
      },
      {
        title: "Corporate Finance Institute",
        description: "Financial modeling and finance learning resources.",
        type: "Website",
        url: "https://corporatefinanceinstitute.com/",
      },
      {
        title: "AccountingCoach",
        description: "Accounting fundamentals and explanations.",
        type: "Website",
        url: "https://www.accountingcoach.com/",
      },
    ],
  },

  "Sales / Business Development": {
    icon: <FaUserTie />,
    description:
      "Sales strategy, customer relationships, negotiation and business development.",
    questions: [
      {
        question:
          "How would you identify and qualify a potential customer?",
        category: "Sales",
        difficulty: "Beginner",
        expectedPoints: ["customer", "lead", "qualify", "need"],
      },
      {
        question:
          "How would you handle a customer who says your product is too expensive?",
        category: "Objection Handling",
        difficulty: "Intermediate",
        expectedPoints: ["value", "customer", "objection", "solution"],
      },
      {
        question:
          "What is the difference between upselling and cross-selling?",
        category: "Sales Strategy",
        difficulty: "Beginner",
        expectedPoints: ["upselling", "cross-selling", "customer", "product"],
      },
      {
        question:
          "How would you build a long-term relationship with an important client?",
        category: "Relationship Management",
        difficulty: "Intermediate",
        expectedPoints: ["relationship", "trust", "communication", "customer"],
      },
      {
        question:
          "Which sales KPIs would you monitor?",
        category: "Sales Analytics",
        difficulty: "Intermediate",
        expectedPoints: ["revenue", "conversion", "pipeline", "kpi"],
      },
    ],
    resources: [
      {
        title: "HubSpot Academy",
        description: "Sales, CRM and business development training.",
        type: "Website",
        url: "https://academy.hubspot.com/",
      },
      {
        title: "Salesforce Trailhead",
        description: "Free CRM and sales learning platform.",
        type: "Practice",
        url: "https://trailhead.salesforce.com/",
      },
      {
        title: "Harvard Business Review",
        description: "Leadership, sales and management insights.",
        type: "Website",
        url: "https://hbr.org/",
      },
    ],
  },

  "Project Manager": {
    icon: <FaCog />,
    description:
      "Project planning, risk management, Agile, Scrum and stakeholder communication.",
    questions: [
      {
        question:
          "What are the main responsibilities of a project manager?",
        category: "Project Management",
        difficulty: "Beginner",
        expectedPoints: ["planning", "team", "scope", "schedule"],
      },
      {
        question:
          "What is the difference between Agile and Waterfall?",
        category: "Methodologies",
        difficulty: "Beginner",
        expectedPoints: ["agile", "waterfall", "iteration", "planning"],
      },
      {
        question:
          "How would you handle a project that is falling behind schedule?",
        category: "Problem Solving",
        difficulty: "Intermediate",
        expectedPoints: ["schedule", "risk", "priority", "team"],
      },
      {
        question:
          "How do you manage conflicting stakeholder expectations?",
        category: "Stakeholder Management",
        difficulty: "Advanced",
        expectedPoints: ["stakeholder", "communication", "scope", "priority"],
      },
      {
        question:
          "What is risk management and how would you use it?",
        category: "Risk Management",
        difficulty: "Intermediate",
        expectedPoints: ["risk", "identify", "impact", "mitigation"],
      },
    ],
    resources: [
      {
        title: "PMI",
        description: "Professional project management standards and resources.",
        type: "Website",
        url: "https://www.pmi.org/",
      },
      {
        title: "Scrum Guide",
        description: "Official Scrum framework guide.",
        type: "Website",
        url: "https://scrumguides.org/",
      },
      {
        title: "Atlassian Agile Coach",
        description: "Agile, Scrum and project-management learning resources.",
        type: "Website",
        url: "https://www.atlassian.com/agile",
      },
    ],
  },

  "Supply Chain / Operations": {
    icon: <FaBriefcase />,
    description:
      "Operations, inventory, logistics, procurement and supply-chain management.",
    questions: [
      {
        question:
          "What is supply chain management?",
        category: "Supply Chain",
        difficulty: "Beginner",
        expectedPoints: ["supplier", "inventory", "logistics", "customer"],
      },
      {
        question:
          "What is safety stock and why is it important?",
        category: "Inventory",
        difficulty: "Intermediate",
        expectedPoints: ["safety", "stock", "demand", "inventory"],
      },
      {
        question:
          "How would you reduce unnecessary inventory costs?",
        category: "Operations",
        difficulty: "Intermediate",
        expectedPoints: ["inventory", "cost", "demand", "forecast"],
      },
      {
        question:
          "What factors should be considered when selecting a supplier?",
        category: "Procurement",
        difficulty: "Intermediate",
        expectedPoints: ["supplier", "cost", "quality", "delivery"],
      },
      {
        question:
          "How would you respond to a major supply disruption?",
        category: "Risk Management",
        difficulty: "Advanced",
        expectedPoints: ["disruption", "supplier", "risk", "alternative"],
      },
    ],
    resources: [
      {
        title: "ASCM",
        description: "Supply chain and operations professional resources.",
        type: "Website",
        url: "https://www.ascm.org/",
      },
      {
        title: "MIT Supply Chain",
        description: "Supply chain education and research.",
        type: "Website",
        url: "https://ctl.mit.edu/",
      },
    ],
  },
};

/* =========================================================
   COMPONENT
========================================================= */

function AIInterviews() {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [interviewType, setInterviewType] =
    useState<InterviewType>("technical");

  const [role, setRole] =
    useState("Software Engineer");

  const [difficulty, setDifficulty] =
    useState<"All" | Difficulty>("All");

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] = useState("");

  const [scores, setScores] =
    useState<number[]>([]);

  const [completed, setCompleted] =
    useState(false);

  const [feedback, setFeedback] =
    useState("");

  const [showResources, setShowResources] =
    useState(false);

  /* =========================================================
     ROLE LIST
  ========================================================= */

  const roleGroups = useMemo(() => {
    return {
      "Computer Science & IT": [
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Data Analyst",
        "Cybersecurity Analyst",
        "DevOps / Cloud Engineer",
        "AI / Machine Learning Engineer",
        "Software QA / Test Engineer",
      ],
      "Business & BBA": [
        "Business Analyst",
        "Marketing Specialist",
        "HR / Human Resources",
        "Finance / Accounting",
        "Sales / Business Development",
        "Project Manager",
        "Supply Chain / Operations",
      ],
    };
  }, []);

  /* =========================================================
     START INTERVIEW
  ========================================================= */

  const startInterview = () => {
    let selectedQuestions: Question[];

    if (interviewType === "hr") {
      selectedQuestions = commonHRQuestions;
    } else {
      selectedQuestions =
        roleData[role]?.questions ||
        roleData["Software Engineer"].questions;
    }

    if (difficulty !== "All") {
      const filtered = selectedQuestions.filter(
        (question) =>
          question.difficulty === difficulty
      );

      if (filtered.length >= 3) {
        selectedQuestions = filtered;
      }
    }

    // Randomize questions
    selectedQuestions = [...selectedQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(8, selectedQuestions.length));

    setQuestions(selectedQuestions);
    setCurrentQuestion(0);
    setAnswer("");
    setScores([]);
    setCompleted(false);
    setFeedback("");
    setShowResources(false);
    setStarted(true);
  };

  /* =========================================================
     SCORE ANSWER
  ========================================================= */

  const calculateScore = (
    userAnswer: string,
    question: Question
  ) => {
    const text = userAnswer
      .toLowerCase()
      .trim();

    if (!text) return 0;

    const words = text
      .split(/\s+/)
      .filter(Boolean);

    const matchedPoints =
      question.expectedPoints.filter(
        (point) =>
          text.includes(point.toLowerCase())
      ).length;

    let score = 30;

    if (words.length >= 20) score += 15;
    if (words.length >= 50) score += 15;
    if (words.length >= 90) score += 10;

    score += matchedPoints * 8;

    // Penalize extremely short answers
    if (words.length < 10) {
      score -= 15;
    }

    return Math.max(
      0,
      Math.min(100, score)
    );
  };

  /* =========================================================
     NEXT QUESTION
  ========================================================= */

  const handleNext = () => {
    const question =
      questions[currentQuestion];

    const answerScore = calculateScore(
      answer,
      question
    );

    const updatedScores = [
      ...scores,
      answerScore,
    ];

    setScores(updatedScores);

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
      setAnswer("");
      return;
    }

    const total =
      updatedScores.reduce(
        (sum, value) => sum + value,
        0
      );

    const finalScore = Math.round(
      total / updatedScores.length
    );

    if (finalScore >= 85) {
      setFeedback(
        "Excellent performance! Your answers show strong knowledge, structure and interview readiness. Keep practicing advanced follow-up questions to reach an even higher level."
      );
    } else if (finalScore >= 70) {
      setFeedback(
        "Very good performance. Your fundamentals are strong. Focus on adding practical examples, measurable results and deeper explanations."
      );
    } else if (finalScore >= 50) {
      setFeedback(
        "Good starting point. Your answers show some understanding, but you should improve answer structure, technical depth and real-world examples."
      );
    } else {
      setFeedback(
        "Keep practicing. Review the recommended resources for your selected field and practice explaining concepts in your own words before attempting another interview."
      );
    }

    const result = {
      role:
        interviewType === "technical"
          ? role
          : "HR Interview",
      score: finalScore,
      date: new Date().toISOString(),
    };

    localStorage.setItem(
      "lastInterviewResult",
      JSON.stringify(result)
    );

    setCompleted(true);
  };

  /* =========================================================
     RESTART
  ========================================================= */

  const restartInterview = () => {
    setStarted(false);
    setCompleted(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswer("");
    setScores([]);
    setFeedback("");
    setShowResources(false);
  };

  /* =========================================================
     AVERAGE
  ========================================================= */

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (sum, value) => sum + value,
            0
          ) / scores.length
        )
      : 0;

  /* =========================================================
     SETUP SCREEN
  ========================================================= */

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-purple-950 text-white">

        <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-500">
                <FaRobot />
              </div>

              <div>
                <h1 className="font-bold">
                  AI Interview
                </h1>

                <p className="text-xs text-slate-500">
                  CareerPilot AI
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-purple-500"
            >
              <FaHome />
              Dashboard
            </button>

          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-14">

          {/* HERO */}

          <div className="mx-auto max-w-4xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-400">
              <FaBrain />
              AI Career Interview Coach
            </div>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Prepare for the interview
              <span className="block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                that can change your career.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-400 md:text-lg">
              Choose your field, practice realistic questions,
              receive a performance score and discover curated
              learning resources to improve your career readiness.
            </p>

          </div>

          {/* SETUP */}

          <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/80 p-7 shadow-2xl sm:p-10">

            <h2 className="text-2xl font-bold">
              Configure Your Interview
            </h2>

            <p className="mt-2 text-slate-400">
              Select the field you want to prepare for.
            </p>

            {/* TYPE */}

            <div className="mt-8">

              <label className="mb-3 block text-sm font-semibold text-slate-300">
                Interview Type
              </label>

              <div className="grid gap-4 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={() =>
                    setInterviewType("technical")
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    interviewType === "technical"
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-700 bg-slate-950 hover:border-purple-500/50"
                  }`}
                >
                  <FaCode className="text-2xl text-purple-400" />

                  <h3 className="mt-3 font-bold">
                    Technical / Professional
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Prepare for Computer Science,
                    IT, BBA and business roles.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInterviewType("hr")
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    interviewType === "hr"
                      ? "border-pink-500 bg-pink-500/10"
                      : "border-slate-700 bg-slate-950 hover:border-pink-500/50"
                  }`}
                >
                  <FaUserTie className="text-2xl text-pink-400" />

                  <h3 className="mt-3 font-bold">
                    HR / Behavioral
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Practice communication, teamwork,
                    leadership and behavioral questions.
                  </p>
                </button>

              </div>

            </div>

            {/* ROLE */}

            {interviewType === "technical" && (
              <div className="mt-7">

                <label
                  htmlFor="role"
                  className="mb-3 block text-sm font-semibold text-slate-300"
                >
                  Target Career Field
                </label>

                <select
                  id="role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-white outline-none focus:border-purple-500"
                >

                  <optgroup label="Computer Science & IT">

                    {roleGroups[
                      "Computer Science & IT"
                    ].map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}

                  </optgroup>

                  <optgroup label="Business & BBA">

                    {roleGroups[
                      "Business & BBA"
                    ].map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}

                  </optgroup>

                </select>

                <div className="mt-4 rounded-2xl border border-purple-500/10 bg-purple-500/5 p-4">

                  <div className="flex items-start gap-3">

                    <span className="mt-1 text-purple-400">
                      {roleData[role]?.icon}
                    </span>

                    <div>
                      <p className="font-semibold text-white">
                        {role}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {roleData[role]?.description}
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* DIFFICULTY */}

            <div className="mt-7">

              <label
                htmlFor="difficulty"
                className="mb-3 block text-sm font-semibold text-slate-300"
              >
                Difficulty Level
              </label>

              <select
                id="difficulty"
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(
                    event.target.value as
                      | "All"
                      | Difficulty
                  )
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-white outline-none focus:border-purple-500"
              >
                <option value="All">
                  Mixed — Beginner to Advanced
                </option>

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>

            </div>

            {/* START */}

            <button
              type="button"
              onClick={startInterview}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 px-6 py-4 text-lg font-bold shadow-xl shadow-purple-900/30 transition hover:scale-[1.01]"
            >
              Start AI Interview
              <FaArrowRight />
            </button>

          </div>

          {/* BENEFITS */}

          <div className="mt-12 grid gap-5 md:grid-cols-4">

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <FaRobot className="text-3xl text-purple-400" />

              <h3 className="mt-4 font-bold">
                Role-Specific
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Questions are matched to your selected career.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <FaChartLine className="text-3xl text-pink-400" />

              <h3 className="mt-4 font-bold">
                Performance Score
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                See how strong your answers are.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <FaBook className="text-3xl text-cyan-400" />

              <h3 className="mt-4 font-bold">
                Study Resources
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Get books and websites for your field.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <FaStar className="text-3xl text-yellow-400" />

              <h3 className="mt-4 font-bold">
                Career Growth
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Practice repeatedly and improve.
              </p>
            </div>

          </div>

        </main>
      </div>
    );
  }

  /* =========================================================
     RESULT SCREEN
  ========================================================= */

  if (completed) {
    const resources =
      interviewType === "technical"
        ? roleData[role]?.resources || []
        : [
            {
              title: "Harvard Business Review",
              description:
                "Leadership, management, communication and career insights.",
              type: "Website" as const,
              url: "https://hbr.org/",
            },
            {
              title: "LinkedIn Learning",
              description:
                "Professional communication and career development courses.",
              type: "Website" as const,
              url: "https://www.linkedin.com/learning/",
            },
            {
              title: "Indeed Career Guide",
              description:
                "Interview preparation and career guidance.",
              type: "Website" as const,
              url: "https://www.indeed.com/career-advice",
            },
          ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-purple-950 text-white">

        <header className="border-b border-slate-800 bg-slate-950/90">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <div>
              <h1 className="font-bold">
                Interview Results
              </h1>

              <p className="text-xs text-slate-500">
                CareerPilot AI
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold hover:border-purple-500"
            >
              <FaHome />
              Dashboard
            </button>

          </div>

        </header>

        <main className="mx-auto max-w-6xl px-6 py-14">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <FaCheckCircle className="text-5xl text-green-400" />
            </div>

            <h1 className="mt-6 text-4xl font-bold">
              Interview Completed!
            </h1>

            <p className="mt-3 text-slate-400">
              {interviewType === "technical"
                ? `${role} interview performance report`
                : "HR / Behavioral interview performance report"}
            </p>

          </div>

          {/* SCORE */}

          <div className="mx-auto mt-10 max-w-md rounded-3xl border border-purple-500/30 bg-slate-900 p-8 text-center shadow-2xl">

            <FaStar className="mx-auto text-3xl text-yellow-400" />

            <p className="mt-4 text-sm uppercase tracking-widest text-slate-500">
              Overall Score
            </p>

            <div className="mt-2 text-7xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {averageScore}
            </div>

            <p className="mt-2 text-slate-400">
              out of 100
            </p>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
                style={{
                  width: `${averageScore}%`,
                }}
              />

            </div>

          </div>

          {/* FEEDBACK */}

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <div className="flex items-center gap-3">

              <FaChartLine className="text-2xl text-purple-400" />

              <h2 className="text-2xl font-bold">
                CareerPilot Feedback
              </h2>

            </div>

            <p className="mt-5 leading-8 text-slate-300">
              {feedback}
            </p>

          </div>

          {/* QUESTION SCORES */}

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <h2 className="text-2xl font-bold">
              Question Performance
            </h2>

            <div className="mt-6 space-y-4">

              {scores.map((score, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >

                  <div>

                    <p className="font-semibold">
                      Question {index + 1}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {questions[index]?.category}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {questions[index]?.difficulty}
                    </p>

                  </div>

                  <span
                    className={`font-bold ${
                      score >= 80
                        ? "text-green-400"
                        : score >= 60
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {score}/100
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* RESOURCES */}

          <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-slate-900 p-8">

            <button
              type="button"
              onClick={() =>
                setShowResources(
                  !showResources
                )
              }
              className="flex w-full items-center justify-between text-left"
            >

              <div className="flex items-center gap-3">

                <FaBook className="text-2xl text-cyan-400" />

                <div>

                  <h2 className="text-2xl font-bold">
                    Recommended Preparation Resources
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Books, websites and practice platforms
                    for your career field.
                  </p>

                </div>

              </div>

              <FaArrowRight
                className={`transition ${
                  showResources
                    ? "rotate-90"
                    : ""
                }`}
              />

            </button>

            {showResources && (

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                {resources.map(
                  (resource) => (

                    <a
                      key={resource.title}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-cyan-500/50"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                            {resource.type}
                          </span>

                          <h3 className="mt-2 text-lg font-bold text-white group-hover:text-cyan-400">
                            {resource.title}
                          </h3>

                        </div>

                        <FaArrowRight className="text-slate-600 transition group-hover:text-cyan-400" />

                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {resource.description}
                      </p>

                    </a>

                  )
                )}

              </div>

            )}

          </div>

          {/* ACTIONS */}

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <button
              type="button"
              onClick={restartInterview}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-7 py-4 font-bold transition hover:scale-[1.02]"
            >
              <FaRedo />
              Take Another Interview
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-7 py-4 font-semibold text-slate-200 transition hover:border-purple-500"
            >
              <FaHome />
              Back to Dashboard
            </button>

          </div>

        </main>
      </div>
    );
  }

  /* =========================================================
     ACTIVE INTERVIEW
  ========================================================= */

  const question =
    questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-purple-950 text-white">

      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <FaRobot className="text-purple-400" />
            </div>

            <div>

              <h1 className="font-bold">
                AI Interview
              </h1>

              <p className="text-xs text-slate-500">
                {interviewType === "technical"
                  ? role
                  : "HR / Behavioral Interview"}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-purple-500 hover:text-white"
          >
            <FaHome />
            Dashboard
          </button>

        </div>

      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">

        {/* PROGRESS */}

        <div className="mb-8">

          <div className="flex items-center justify-between text-sm">

            <span className="font-semibold text-slate-300">
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </span>

            <span className="text-purple-400">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* QUESTION CARD */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl sm:p-10">

          <div className="flex items-center justify-between gap-4">

            <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-400">
              {question.category}
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-400">
              {question.difficulty}
            </span>

          </div>

          <h2 className="mt-8 text-2xl font-bold leading-relaxed text-white sm:text-3xl">
            {question.question}
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Explain your answer clearly. Use examples,
            reasoning and practical experience wherever possible.
          </p>

          {/* ANSWER */}

          <textarea
            value={answer}
            onChange={(event) =>
              setAnswer(event.target.value)
            }
            placeholder="Write your answer here..."
            rows={10}
            className="mt-7 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
          />

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <span className="text-xs text-slate-600">
              {
                answer
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean).length
              }{" "}
              words
            </span>

            <span className="text-xs text-slate-500">
              CareerPilot evaluates relevance,
              detail and answer structure.
            </span>

          </div>

          {/* BUTTONS */}

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={() => {

                if (currentQuestion === 0) {
                  setStarted(false);
                  return;
                }

                setCurrentQuestion(
                  currentQuestion - 1
                );

                setAnswer("");

                setScores(
                  (previous) =>
                    previous.slice(0, -1)
                );

              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-6 py-4 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <FaArrowLeft />
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!answer.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-7 py-4 font-bold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >

              {currentQuestion ===
              questions.length - 1
                ? "Finish Interview"
                : "Next Question"}

              <FaArrowRight />

            </button>

          </div>

        </div>

        {/* TIP */}

        <div className="mt-6 rounded-2xl border border-purple-500/10 bg-purple-500/5 p-5 text-sm leading-6 text-slate-400">

          <strong className="text-purple-400">
            Interview Tip:
          </strong>{" "}

          For behavioral questions, use the{" "}
          <strong className="text-white">
            STAR
          </strong>{" "}
          structure: Situation → Task → Action → Result.

          For technical questions, explain your reasoning,
          trade-offs and practical examples.

        </div>

      </main>

    </div>
  );
}

export default AIInterviews;