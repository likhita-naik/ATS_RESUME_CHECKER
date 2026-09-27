// Source data for the static "/ats-resume-keywords/<slug>/" SEO pages
// (generated in vite.config.ts) and for prefilling the checker via
// "/?role=<slug>". Keywords should be display terms from skillsDictionary.ts
// so the checker recognises them.

export interface Role {
  slug: string;
  title: string;
  summary: string;
  keywords: string[];
  tips: string[];
  sampleJD: string;
}

export const ROLES: Role[] = [
  {
    slug: "software-engineer",
    title: "Software Engineer",
    summary:
      "Software engineer job descriptions mix a core language, a framework, cloud/DevOps basics, and engineering practices like testing and code review. ATS filters usually check the language and framework first.",
    keywords: ["java", "python", "javascript", "sql", "rest api", "microservices", "git", "aws", "docker", "ci/cd", "unit testing", "system design", "data structures", "agile", "computer science"],
    tips: [
      "Name the language inside each experience bullet (\"Built a payment service in Java and Spring Boot…\"), not only in a skills list.",
      "Quantify scale: requests per second, users, latency cut, deployment frequency.",
      "If the JD says \"CI/CD\", write \"CI/CD\" — an ATS may not connect it to \"Jenkins pipelines\".",
    ],
    sampleJD:
      "We are hiring a Software Engineer to design, build and maintain scalable microservices. You will write clean, well-tested code in Java, Python or JavaScript, design REST APIs, and work with SQL databases. Experience with AWS, Docker and CI/CD pipelines is expected. You will participate in code review, system design discussions and agile sprint planning. Strong knowledge of data structures and algorithms and a bachelor's degree in computer science or equivalent experience required. Unit testing and Git are part of daily work.",
  },
  {
    slug: "frontend-developer",
    title: "Frontend Developer",
    summary:
      "Frontend roles filter on the framework (usually React), JavaScript/TypeScript, and CSS skills, then look for performance, accessibility, and testing experience.",
    keywords: ["javascript", "typescript", "react", "html", "css", "redux", "next.js", "tailwind", "responsive design", "rest api", "jest", "accessibility", "performance optimization", "git", "figma"],
    tips: [
      "List both \"JavaScript\" and \"TypeScript\" if you use them — many JDs require one explicitly.",
      "Mention Core Web Vitals or load-time improvements with numbers.",
      "Link a live portfolio or GitHub in your contact line as plain text.",
    ],
    sampleJD:
      "We are looking for a Frontend Developer with strong JavaScript and TypeScript skills to build web applications in React with responsive design. You will work with Redux for state management, Next.js for server rendering, and Tailwind CSS for styling. You will integrate REST APIs, write unit tests with Jest, and turn Figma designs into accessible, pixel-perfect HTML and CSS. Experience with performance optimization, accessibility (WCAG) and Git is required.",
  },
  {
    slug: "backend-developer",
    title: "Backend Developer",
    summary:
      "Backend JDs centre on a server language plus databases, APIs, and cloud deployment. Expect ATS filters on the specific language/framework pair (Node.js + Express, Java + Spring Boot, Python + Django).",
    keywords: ["node.js", "java", "python", "spring boot", "express", "rest api", "microservices", "postgresql", "mongodb", "redis", "docker", "kubernetes", "aws", "system design", "unit testing"],
    tips: [
      "Write the framework next to the language: \"Node.js/Express\", \"Java/Spring Boot\".",
      "Show database depth — schema design, indexing, query optimization with measured gains.",
      "Mention reliability numbers: uptime, error-rate reduction, p99 latency.",
    ],
    sampleJD:
      "As a Backend Developer you will design and build REST APIs and microservices using Node.js with Express or Java with Spring Boot. You will model data in PostgreSQL and MongoDB, use Redis for caching, and deploy with Docker and Kubernetes on AWS. We value strong system design skills, unit testing, and experience with performance optimization of high-traffic services. Python experience is a plus.",
  },
  {
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    summary:
      "Full stack roles expect one frontend framework, one backend stack, a database, and deployment experience. ATS filters usually look for the exact stack named in the JD (e.g. MERN).",
    keywords: ["javascript", "typescript", "react", "node.js", "express", "mongodb", "postgresql", "rest api", "html", "css", "git", "docker", "aws", "ci/cd", "agile"],
    tips: [
      "If the JD names a stack (\"MERN\"), spell out each piece too: MongoDB, Express, React, Node.js.",
      "Describe one project end-to-end: UI, API, database, deployment.",
      "Put deployment/cloud experience in a bullet, not just the skills list.",
    ],
    sampleJD:
      "We need a Full Stack Developer comfortable across the MERN stack: MongoDB, Express, React and Node.js. You will build features end-to-end, from responsive HTML/CSS and TypeScript on the frontend to REST APIs and PostgreSQL or MongoDB data models on the backend. Experience with Git, Docker, AWS and CI/CD pipelines is required. You will work in an agile team with two-week sprints.",
  },
  {
    slug: "java-developer",
    title: "Java Developer",
    summary:
      "Java developer JDs almost always pair Java with Spring Boot and a relational database. Hibernate/JPA, Maven, and microservices come up constantly.",
    keywords: ["java", "spring boot", "spring", "hibernate", "jpa", "microservices", "rest api", "sql", "mysql", "maven", "junit", "git", "docker", "oop", "design patterns"],
    tips: [
      "Mention the Java version if it's recent (Java 17/21) — some JDs filter on it.",
      "\"OOP\" and \"design patterns\" are common ATS filters; name specific patterns you used.",
      "Include JUnit / testing coverage numbers where you can.",
    ],
    sampleJD:
      "We are hiring a Java Developer to build enterprise microservices with Java 17, Spring Boot and Hibernate/JPA. You will design REST APIs, write optimized SQL for MySQL, manage builds with Maven, and write unit tests with JUnit. Strong OOP fundamentals and knowledge of design patterns are essential. Familiarity with Docker, Git and agile practices required.",
  },
  {
    slug: "python-developer",
    title: "Python Developer",
    summary:
      "Python developer roles split between web backends (Django, Flask, FastAPI) and data/automation work. ATS filters check Python plus the framework named in the JD.",
    keywords: ["python", "django", "flask", "fastapi", "rest api", "sql", "postgresql", "pandas", "aws", "docker", "git", "unit testing", "linux", "celery", "microservices"],
    tips: [
      "Name the framework you used in each bullet — Django and FastAPI are filtered separately.",
      "Mention automation wins with time saved (\"cut a 4-hour report to 5 minutes\").",
      "List testing tools (pytest) explicitly.",
    ],
    sampleJD:
      "We are looking for a Python Developer to build backend services with Django, Flask or FastAPI. You will design REST APIs, work with PostgreSQL and SQL, and use Pandas for data processing tasks. Experience deploying with Docker on AWS and Linux is required, along with unit testing using pytest and version control with Git. Experience with Celery and microservices is a plus.",
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    summary:
      "Data analyst JDs filter heavily on SQL, Excel, and a BI tool (Power BI or Tableau), plus Python for analysis. Stakeholder communication shows up in almost every posting.",
    keywords: ["sql", "excel", "power bi", "tableau", "python", "pandas", "data analysis", "data visualization", "statistics", "statistical analysis", "a/b testing", "google analytics", "communication", "stakeholder management", "kpi tracking"],
    tips: [
      "Say which BI tool you used — \"dashboards\" alone won't match \"Power BI\" or \"Tableau\".",
      "Tie every analysis to a business decision or number it changed.",
      "Mention dataset sizes and the SQL you wrote (joins, window functions).",
    ],
    sampleJD:
      "We are hiring a Data Analyst to turn data into business insights. You will write complex SQL queries, build dashboards in Power BI or Tableau, and perform data analysis and statistical analysis in Python with Pandas. Advanced Excel and a solid grounding in statistics are required. You will own KPI tracking, support A/B testing, and present findings to stakeholders with clear data visualization. Strong communication and stakeholder management skills are essential; Google Analytics experience is a plus.",
  },
  {
    slug: "data-scientist",
    title: "Data Scientist",
    summary:
      "Data scientist roles look for Python, statistics, and machine learning libraries, plus the ability to ship models. Deep learning and NLP appear in more specialised postings.",
    keywords: ["python", "machine learning", "statistics", "sql", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "deep learning", "nlp", "data visualization", "a/b testing", "big data", "spark"],
    tips: [
      "Report model impact in business terms (revenue, churn, cost), not only accuracy.",
      "Name the libraries: scikit-learn, TensorFlow, PyTorch are separate ATS keywords.",
      "Mention deployment — models in production beat notebooks.",
    ],
    sampleJD:
      "As a Data Scientist you will build and deploy machine learning models that drive product decisions. You need strong statistics, Python (Pandas, NumPy, scikit-learn) and SQL skills. Experience with deep learning frameworks such as TensorFlow or PyTorch and NLP is highly desirable. You will design A/B testing experiments, work with big data using Spark, and communicate results through data visualization.",
  },
  {
    slug: "machine-learning-engineer",
    title: "Machine Learning Engineer",
    summary:
      "ML engineer JDs sit between data science and backend engineering: model building plus MLOps, cloud deployment, and increasingly LLMs and generative AI.",
    keywords: ["python", "machine learning", "deep learning", "pytorch", "tensorflow", "mlops", "llm", "generative ai", "nlp", "docker", "kubernetes", "aws", "sql", "data pipeline", "computer vision"],
    tips: [
      "Separate training work from serving work — MLOps and deployment are distinct filters.",
      "If you've worked with LLMs, say \"LLM\" and \"generative AI\" explicitly.",
      "Quantify latency, throughput, or cost per inference.",
    ],
    sampleJD:
      "We are seeking a Machine Learning Engineer to train, deploy and monitor models in production. You will work with PyTorch or TensorFlow for deep learning, build data pipelines, and own MLOps tooling with Docker and Kubernetes on AWS. Experience with LLMs, generative AI and NLP is a strong plus, as is computer vision. Solid Python and SQL skills are required.",
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    summary:
      "DevOps JDs filter on cloud platform, containers, infrastructure as code, and CI/CD tooling. Monitoring and Linux fundamentals are nearly universal.",
    keywords: ["aws", "azure", "docker", "kubernetes", "terraform", "ansible", "jenkins", "ci/cd", "github actions", "linux", "bash", "infrastructure as code", "monitoring", "prometheus", "grafana"],
    tips: [
      "Name the exact tools — \"Terraform\" and \"Ansible\" are filtered individually.",
      "Show outcomes: deploy time cut, incidents reduced, cost saved per month.",
      "Mention certifications (AWS Certified, CKA) in a Certifications section.",
    ],
    sampleJD:
      "We are hiring a DevOps Engineer to build and run our cloud infrastructure on AWS and Azure. You will manage Docker and Kubernetes clusters, write infrastructure as code with Terraform and Ansible, and maintain CI/CD pipelines in Jenkins and GitHub Actions. Strong Linux and Bash scripting skills required. You will set up monitoring with Prometheus and Grafana and improve system reliability.",
  },
  {
    slug: "cloud-engineer",
    title: "Cloud Engineer",
    summary:
      "Cloud engineer postings name a specific provider (AWS, Azure, GCP) and its core services, plus networking, security, and infrastructure as code.",
    keywords: ["aws", "azure", "gcp", "ec2", "s3", "iam", "vpc", "terraform", "cloudformation", "docker", "kubernetes", "linux", "networking", "cloud architecture", "aws certified"],
    tips: [
      "List the individual services you've used (EC2, S3, IAM, VPC) — ATS matches them one by one.",
      "Put certifications near the top; many cloud roles filter on them.",
      "Mention cost optimization with a number.",
    ],
    sampleJD:
      "We are looking for a Cloud Engineer to design and manage cloud architecture on AWS, with exposure to Azure or GCP. You will provision EC2, S3, IAM and VPC resources using Terraform and CloudFormation, run containers with Docker and Kubernetes, and administer Linux servers. Strong networking fundamentals are required. AWS Certified Solutions Architect is preferred.",
  },
  {
    slug: "qa-engineer",
    title: "QA / Software Test Engineer",
    summary:
      "QA JDs separate manual testing from automation testing, and name the automation tool (Selenium, Cypress, Appium). API testing and test case design come up constantly.",
    keywords: ["manual testing", "automation testing", "selenium", "cypress", "testng", "appium", "api testing", "postman", "test case", "regression testing", "jira", "java", "python", "sql", "agile"],
    tips: [
      "Write both \"manual testing\" and \"automation testing\" if you do both — they're separate filters.",
      "Quantify: test cases written, automation coverage %, bugs caught before release.",
      "Name the language your automation framework uses.",
    ],
    sampleJD:
      "We are hiring a QA Engineer with experience in both manual testing and automation testing. You will write test cases, run regression testing, and build automation frameworks with Selenium and TestNG in Java or Python, or Cypress for web. Experience with Appium for mobile and API testing with Postman is required. You will log defects in Jira, write basic SQL queries, and work in an agile team.",
  },
  {
    slug: "android-developer",
    title: "Android Developer",
    summary:
      "Android JDs filter on Kotlin (and often Java), modern Android architecture (MVVM, Jetpack Compose), and networking libraries like Retrofit.",
    keywords: ["kotlin", "java", "android development", "jetpack compose", "mvvm", "retrofit", "rest api", "firebase", "sqlite", "git", "unit testing", "ci/cd", "design patterns", "agile"],
    tips: [
      "Link your Play Store apps with install counts or ratings.",
      "Mention Jetpack Compose explicitly if you've used it — it's a growing filter.",
      "Include crash-rate or app-size improvements with numbers.",
    ],
    sampleJD:
      "We are looking for an Android Developer with 3+ years of Android development experience in Kotlin and Java. You should have hands-on experience with Jetpack Compose, MVVM architecture, Retrofit for REST API integration, Firebase and SQLite. You will own unit testing, use Git and CI/CD pipelines, and apply design patterns in an agile team.",
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    summary:
      "Design JDs filter on the tool (Figma dominates), research methods, and deliverables like wireframes and prototypes. A portfolio link matters more than for any other role.",
    keywords: ["figma", "ui/ux design", "user research", "wireframing", "prototyping", "usability testing", "design systems", "interaction design", "adobe xd", "accessibility", "responsive design", "html", "css", "communication"],
    tips: [
      "Put your portfolio URL in plain text in the header — not only as a hyperlinked icon.",
      "ATS can't see your visuals; describe each project's problem, method, and result in words.",
      "Mention research methods by name (interviews, usability testing, A/B tests).",
    ],
    sampleJD:
      "We are hiring a UI/UX Designer to own user research, wireframing and prototyping in Figma. You will run usability testing, maintain our design systems, and create interaction design for web and mobile with a focus on accessibility and responsive design. Experience with Adobe XD and basic HTML/CSS is a plus. Strong communication skills and a portfolio are required.",
  },
  {
    slug: "product-manager",
    title: "Product Manager",
    summary:
      "Product manager JDs look for roadmap ownership, stakeholder management, data-driven decisions, and agile delivery. Metrics and outcomes carry more weight than tool names.",
    keywords: ["product management", "product roadmap", "stakeholder management", "requirements gathering", "user stories", "agile", "scrum", "jira", "data analysis", "a/b testing", "market research", "go-to-market", "okr", "cross-functional collaboration", "sql"],
    tips: [
      "Lead with outcomes: revenue, activation, retention moved by a feature you shipped.",
      "Use the JD's words — \"product roadmap\", \"go-to-market\", \"OKRs\".",
      "Mention the size of the teams you worked with.",
    ],
    sampleJD:
      "We are seeking a Product Manager with 4+ years of product management experience to own the product roadmap for our core platform. You will lead requirements gathering, write user stories, and prioritise the backlog in Jira within an agile/Scrum process. You will use data analysis, SQL and A/B testing to make decisions, run market research, and plan go-to-market launches. Strong stakeholder management, cross-functional collaboration and OKR-setting experience required.",
  },
  {
    slug: "project-manager",
    title: "Project Manager",
    summary:
      "Project manager postings filter on methodology (Agile, Scrum, Waterfall), certifications (PMP, PRINCE2), and delivery skills like risk and budget management.",
    keywords: ["project management", "agile", "scrum", "pmp", "prince2", "risk management", "budget management", "stakeholder management", "resource planning", "jira", "ms office", "vendor management", "communication", "leadership"],
    tips: [
      "Put PMP/PRINCE2 in the header or a Certifications section — it's often a hard filter.",
      "Give each project a budget, team size, and on-time/on-budget result.",
      "Name the methodology used on each project.",
    ],
    sampleJD:
      "We are hiring a Project Manager with 5+ years of project management experience to deliver multiple projects on time and within budget. You will own scope, schedule, risk management and budget management, handle resource planning and vendor management, and lead stakeholder management with senior leadership. Experience with agile and Scrum, Jira and MS Office is required. PMP or PRINCE2 certification is preferred. Strong leadership and communication skills are essential.",
  },
  {
    slug: "digital-marketing-executive",
    title: "Digital Marketing Executive",
    summary:
      "Digital marketing JDs list channels (SEO, SEM, social, email) and tools (Google Analytics, Google Ads, HubSpot). Campaign results with numbers are the strongest signal.",
    keywords: ["digital marketing", "seo", "sem", "google ads", "google analytics", "social media marketing", "content marketing", "email marketing", "lead generation", "conversion rate optimization", "copywriting", "campaign management", "hubspot", "marketing automation"],
    tips: [
      "List every channel you ran and its result: CTR, CPL, ROAS, organic traffic growth.",
      "Spell out both \"SEO\" and \"search engine optimization\" at least once.",
      "Include Google Ads / Analytics certifications if you have them.",
    ],
    sampleJD:
      "We are looking for a Digital Marketing Executive to plan and run campaigns across SEO, SEM and social media marketing. You will manage Google Ads budgets, track performance in Google Analytics, create content marketing and email marketing campaigns, and drive lead generation. Experience with conversion rate optimization, copywriting, campaign management and HubSpot marketing automation is required.",
  },
  {
    slug: "business-analyst",
    title: "Business Analyst",
    summary:
      "Business analyst roles filter on requirements gathering, documentation, and data skills (SQL, Excel, Power BI), plus process mapping and stakeholder work.",
    keywords: ["business analysis", "requirements gathering", "user stories", "process mapping", "sql", "excel", "power bi", "tableau", "stakeholder management", "agile", "jira", "data analysis", "process improvement", "communication"],
    tips: [
      "Name your artifacts: BRDs, user stories, process maps, dashboards.",
      "Show a process you improved with before/after numbers.",
      "Mention the tools (Jira, Power BI, SQL) inside bullets.",
    ],
    sampleJD:
      "We are hiring a Business Analyst with strong business analysis skills to bridge business and technology teams. You will lead requirements gathering, write user stories, create process mapping documents and drive process improvement. Strong data analysis skills with SQL, Excel and Power BI or Tableau are required. You will work in an agile environment using Jira and own stakeholder management across departments. Excellent communication skills are essential.",
  },
  {
    slug: "hr-executive",
    title: "HR Executive",
    summary:
      "HR JDs look for recruitment and onboarding experience, HR systems (HRIS), payroll, and employee relations. Many filter on familiarity with specific processes more than tools.",
    keywords: ["recruitment", "talent acquisition", "onboarding", "hris", "payroll", "employee engagement", "employee relations", "performance management", "compensation and benefits", "training and development", "ms office", "communication"],
    tips: [
      "Quantify hiring: roles closed per month, time-to-hire, offer-acceptance rate.",
      "Name the HRIS / payroll software you've used.",
      "Mention compliance work you've handled in bullets.",
    ],
    sampleJD:
      "We are looking for an HR Executive to manage end-to-end recruitment and talent acquisition, onboarding, and employee engagement programs. You will maintain HRIS records, process payroll, handle employee relations and support performance management cycles. Knowledge of compensation and benefits and training and development is a plus. Proficiency in MS Office and strong communication skills are required.",
  },
  {
    slug: "accountant",
    title: "Accountant",
    summary:
      "Accountant JDs filter on accounting software (Tally, SAP), tax work (GST, TDS), reconciliation, and reporting. Excel is assumed almost everywhere.",
    keywords: ["accounting", "tally", "gst", "tds", "taxation", "reconciliation", "accounts payable", "accounts receivable", "financial reporting", "bookkeeping", "excel", "sap", "audit", "budgeting"],
    tips: [
      "Name the software (Tally Prime, SAP FICO) — \"accounting software\" won't match.",
      "Mention filings you owned: GST returns, TDS returns, audits supported.",
      "Quantify: number of vendors, monthly transaction volume, closing time reduced.",
    ],
    sampleJD:
      "We are hiring an Accountant to manage day-to-day accounting and bookkeeping in Tally and SAP. You will handle accounts payable and accounts receivable, bank reconciliation, GST and TDS filings and other taxation compliance. You will prepare monthly financial reporting, support audit and budgeting, and maintain records in Excel.",
  },
  {
    slug: "sales-executive",
    title: "Sales Executive",
    summary:
      "Sales JDs look for pipeline and CRM skills, prospecting (cold calling, lead generation), and closing. Targets achieved, in numbers, are the single strongest resume signal.",
    keywords: ["b2b sales", "lead generation", "cold calling", "sales pipeline", "crm", "salesforce", "negotiation", "account management", "business development", "revenue growth", "client relationship management", "communication"],
    tips: [
      "Put quota attainment up front: \"Achieved 132% of annual target\".",
      "Name the CRM you've used (Salesforce, HubSpot, Zoho).",
      "Mention deal sizes and sales cycle length.",
    ],
    sampleJD:
      "We are looking for a Sales Executive to drive B2B sales and business development. You will drive lead generation through cold calling and outreach, manage the sales pipeline in a CRM such as Salesforce, and handle negotiation through to closing. You will own account management and client relationship management for key customers and deliver revenue growth against targets. Excellent communication skills are required.",
  },
  {
    slug: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    summary:
      "Security analyst JDs filter on SIEM tools, incident response, vulnerability assessment, and certifications (CompTIA Security+, CISSP). Networking fundamentals are assumed.",
    keywords: ["cybersecurity", "network security", "siem", "incident response", "vulnerability assessment", "penetration testing", "firewall", "linux", "python", "iso 27001", "comptia", "cissp", "risk management"],
    tips: [
      "Name the SIEM (Splunk, QRadar, Sentinel) — \"SIEM\" alone may not match every JD.",
      "List certifications in their own section; they're often hard filters.",
      "Quantify: alerts triaged per day, mean time to respond, vulnerabilities closed.",
    ],
    sampleJD:
      "We are hiring a Cybersecurity Analyst to monitor and protect our infrastructure. You will triage alerts in our SIEM, lead incident response, run vulnerability assessment and penetration testing, and manage firewalls and network security controls. Experience with Linux and Python scripting is required. Knowledge of ISO 27001 and risk management is a plus. CompTIA Security+ or CISSP certification preferred.",
  },
];
