// A curated dictionary of common ATS/recruiter keywords across tech and
// general business roles. Terms here are treated as high-confidence
// "hard skill" keywords when they appear in a job description.
//
// Multi-word phrases are listed as-is; matching handles word boundaries
// and is case-insensitive. Longer phrases are matched before their
// substrings so "machine learning engineer" doesn't double count against
// "machine learning".

export const SKILLS_DICTIONARY: string[] = [
  // Programming languages
  "javascript", "typescript", "python", "java", "c++", "c#", "golang", "go",
  "rust", "kotlin", "swift", "php", "ruby", "scala", "r", "sql", "nosql",
  "html", "css", "sass", "less", "bash", "shell scripting", "matlab",

  // Frontend
  "react", "react.js", "reactjs", "angular", "angularjs", "vue", "vue.js",
  "next.js", "nextjs", "nuxt", "redux", "rxjs", "webpack", "vite", "jquery",
  "tailwind", "tailwind css", "bootstrap", "material ui", "responsive design",
  "single page application", "spa", "web components", "progressive web app",
  "pwa", "accessibility", "wcag", "cross-browser compatibility",

  // Backend
  "node.js", "nodejs", "express.js", "express", "django", "flask",
  "spring boot", "spring", ".net", "asp.net", "laravel", "ruby on rails",
  "fastapi", "graphql", "rest api", "restful api", "microservices",
  "api development", "grpc", "websockets", "serverless",

  // Mobile
  "react native", "flutter", "ios development", "android development",
  "swiftui", "xamarin", "mobile app development",

  // Databases
  "mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch",
  "firebase", "dynamodb", "oracle", "sql server", "sqlite", "cassandra",
  "database design", "data modeling", "orm",

  // Cloud & DevOps
  "aws", "amazon web services", "azure", "gcp", "google cloud platform",
  "docker", "kubernetes", "terraform", "ansible", "jenkins", "ci/cd",
  "github actions", "gitlab ci", "devops", "infrastructure as code",
  "load balancing", "nginx", "linux", "cloud architecture", "cloudformation",
  "monitoring", "prometheus", "grafana", "site reliability",

  // Data / AI
  "machine learning", "deep learning", "data science", "data analysis",
  "data engineering", "etl", "data pipeline", "pandas", "numpy",
  "tensorflow", "pytorch", "scikit-learn", "nlp", "natural language processing",
  "computer vision", "generative ai", "llm", "large language model",
  "power bi", "tableau", "data visualization", "big data", "spark", "hadoop",
  "a/b testing", "statistical analysis",

  // Tools & practices
  "git", "github", "gitlab", "bitbucket", "jira", "confluence", "agile",
  "scrum", "kanban", "unit testing", "test driven development", "tdd",
  "cypress", "selenium", "jest", "postman", "figma", "sketch", "ui/ux design",
  "wireframing", "prototyping", "version control", "code review",
  "design patterns", "object oriented programming", "oop", "system design",
  "performance optimization", "debugging", "sprint planning",

  // Project & product management
  "project management", "product management", "product roadmap",
  "stakeholder management", "requirements gathering", "risk management",
  "budget management", "pmp", "prince2", "resource planning",
  "cross-functional collaboration", "vendor management",

  // Sales / marketing / business
  "digital marketing", "seo", "sem", "content marketing", "social media marketing",
  "email marketing", "google analytics", "google ads", "crm", "salesforce",
  "hubspot", "lead generation", "market research", "brand management",
  "campaign management", "copywriting", "conversion rate optimization",
  "affiliate marketing", "growth marketing", "marketing automation",
  "business development", "account management", "b2b sales", "b2c sales",
  "negotiation", "client relationship management", "revenue growth",
  "forecasting", "kpi tracking",

  // Finance / operations
  "financial analysis", "financial modeling", "budgeting", "forecasting",
  "accounting", "bookkeeping", "gaap", "audit", "reconciliation",
  "supply chain management", "inventory management", "logistics",
  "process improvement", "six sigma", "lean manufacturing", "quality assurance",
  "quality control", "erp", "sap", "excel", "microsoft excel", "power query",

  // HR / general
  "recruitment", "talent acquisition", "onboarding", "performance management",
  "employee engagement", "hris", "payroll", "compensation and benefits",
  "training and development", "diversity and inclusion",

  // Soft / general professional skills
  "leadership", "communication", "problem solving", "critical thinking",
  "team collaboration", "time management", "adaptability", "mentoring",
  "presentation skills", "analytical skills", "attention to detail",
  "decision making", "conflict resolution", "customer service",
  "customer success", "technical writing", "public speaking",

  // Degrees / certs (common ATS filters)
  "bachelor's degree", "master's degree", "mba", "computer science",
  "information technology", "certification", "aws certified",
  "pmp certified", "cissp", "comptia",
];

// Generic words that should never be treated as meaningful keywords even
// if they survive frequency filtering.
export const STOPWORDS = new Set([
  "the", "and", "for", "are", "with", "this", "that", "will", "you", "your",
  "our", "have", "has", "from", "into", "about", "such", "who", "what",
  "when", "where", "why", "how", "a", "an", "in", "on", "of", "to", "is",
  "as", "at", "by", "or", "be", "we", "us", "it", "its", "their", "them",
  "role", "job", "work", "working", "team", "years", "year", "experience",
  "strong", "excellent", "ability", "including", "etc", "using", "use",
  "used", "within", "across", "other", "all", "any", "can", "must",
  "should", "would", "may", "including", "including", "responsibilities",
  "requirements", "preferred", "required", "plus", "looking", "candidate",
  "candidates", "company", "companies", "position", "opportunity", "please",
  "one", "new", "high", "level", "related", "based", "per", "etc.",
  "skills", "skill", "knowledge", "understanding", "familiarity", "including",
]);
