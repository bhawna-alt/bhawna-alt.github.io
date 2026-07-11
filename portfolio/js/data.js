/**
 * data.js
 * Central content model for Bhawna Teerth's portfolio.
 * Rewritten in professional, achievement-oriented language (not copy-pasted from resume).
 * Also consumed by chatbot.js as the knowledge base for the offline fallback assistant.
 */

const PORTFOLIO_DATA = {
  name: "Bhawna Teerth",
  roles: [
    "AI/ML Engineering Fellow",
    "Computational Researcher",
    "Full-Stack Developer",
    "Computer Science + Chemistry @ UMass Amherst"
  ],
  tagline:
    "Building intelligent systems at the intersection of software engineering, machine learning, and molecular science.",
  email: "bhawna@umass.edu",
  phone: "+1 (413) 315-0815",
  location: "Amherst, MA",
  links: {
    github: "https://github.com/bhawna-alt",
    linkedin: "https://www.linkedin.com/in/bhawnateerth",
    site: "https://bhawna-alt.github.io/"
  },

  about: `I'm a Computer Science and Chemistry student at UMass Amherst (Commonwealth Honors College) who
  builds software that turns messy, real-world data — from 10,000-atom molecular simulations to campus
  event feeds — into systems people can actually use. As a Cornell Breakthrough Tech AI Fellow, I split
  my time between shipping production-style ML pipelines and researching how computational modeling can
  accelerate molecular science. I care about writing clean, well-tested code and about the "why" behind
  the data as much as the "how."`,

  stats: [
    { value: 3.96, suffix: "", label: "Cumulative GPA", decimals: 2 },
    { value: 10000, suffix: "+", label: "Atoms modeled in ML graph pipelines" },
    { value: 300, suffix: "+", label: "Student orgs unified in event platform" },
    { value: 1000, suffix: "+", label: "Environmental sensor records analyzed" },
    { value: 240, suffix: "+", label: "Students mentored since 2025" },
    { value: 5, suffix: "+", label: "Pull requests shipped" }
  ],

  experience: [
    {
      org: "Breakthrough Tech AI — Cornell University",
      role: "AI Program Fellow, ML Foundations + AI Studio",
      period: "May 2026 – May 2027",
      points: [
        "Selected from a nationally competitive applicant pool for a year-long, industry-aligned AI/ML fellowship.",
        "Completing a Cornell-certified Machine Learning Foundations curriculum (12–15 hrs/week) spanning data pipelines, model training, and validation.",
        "Architecting a team-based industry challenge project (AI Studio) in partnership with leading tech companies.",
        "Receiving 1:1 mentorship, career coaching, and internship placement support from senior ML engineers and data scientists."
      ]
    },
    {
      org: "Lab of Prof. Scott M. Auerbach — UMass Amherst",
      role: "Undergraduate Research Assistant, Machine Learning & Graph Analysis",
      period: "Jan 2026 – Present",
      points: [
        "Modeled 10,000+ atom molecular simulations as graph networks to feed downstream ML pipelines.",
        "Engineered a feature-extraction pipeline using structured data transformations to accelerate model iteration.",
        "Maintained rigorous, reproducible research records across large, evolving datasets."
      ]
    },
    {
      org: "CodePath — Applied AI Engineering Pathway",
      role: "AI Engineering Fellow",
      period: "Feb 2026 – Apr 2026",
      points: [
        "Designed and shipped AI-powered software systems integrating LLM-based APIs end-to-end.",
        "Practiced AI-assisted development, debugging, and system design in a fast-paced fellowship cohort."
      ]
    },
    {
      org: "Riccio College of Engineering — Soil & Watershed Hydrology Research",
      role: "Research Assistant, Prof. Christian D. Guzman",
      period: "Aug 2025 – Dec 2025",
      points: [
        "Analyzed 1,000+ environmental sensor records spanning temperature, moisture, and watershed metrics.",
        "Built data cleaning, preprocessing, and quality-control workflows that improved dataset reliability."
      ]
    },
    {
      org: "UMass Residential Life",
      role: "Peer Mentor",
      period: "July 2025 – Present",
      points: [
        "Mentor 15–20 first-year students per month, providing academic, personal, and logistical support.",
        "Resolve interpersonal conflicts and serve as a trusted point of contact for a residential community."
      ]
    }
  ],

  projects: [
    {
      name: "MinuteCal",
      featured: true,
      tagline: "300+ student orgs, one unified feed",
      stack: ["React", "Node.js", "Express.js", "REST APIs", "Vercel"],
      description:
        "A full-stack platform that unifies UMass Amherst campus events — pulled live from Localist and Campus Pulse across 300+ student organizations — into a single, searchable interface.",
      highlights: [
        "Built RESTful APIs with Express.js to aggregate and normalize event data from multiple campus platforms.",
        "Designed a responsive React frontend with real-time filtering and search to streamline event discovery."
      ],
      link: null
    },
    {
      name: "Airbnb Price Prediction",
      featured: false,
      tagline: "ML pricing engine",
      stack: ["Python", "Scikit-learn", "Pandas", "NumPy"],
      description:
        "A regression pipeline that predicts Airbnb listing prices from structured housing and property features.",
      highlights: [
        "Engineered features and preprocessing steps that measurably improved model accuracy.",
        "Trained, evaluated, and serialized the final model for deployment."
      ],
      link: null
    },
    {
      name: "Stock Dashboard",
      featured: false,
      tagline: "Live market visualization",
      stack: ["React", "JavaScript", "Tailwind CSS", "Vercel"],
      description:
        "An interactive dashboard for visualizing live stock market data with a clean, component-driven UI.",
      highlights: [
        "Built reusable React components styled with Tailwind CSS for a fast, responsive experience.",
        "Deployed to Vercel for public access and continuous iteration."
      ],
      link: null
    },
    {
      name: "Digital Empathy Coach",
      featured: false,
      tagline: "36-hour hackathon build",
      stack: ["Python", "OpenAI API", "JavaScript"],
      description:
        "An AI-powered tool built in a 36-hour hackathon sprint at HackUMass XII that analyzes conversational sentiment to surface real-time emotional insights during virtual meetings.",
      highlights: [
        "Integrated NLP techniques to detect emotional cues and generate context-aware feedback.",
        "Shipped a working prototype as part of a 4-engineer team, contributing 10+ commits under a tight deadline."
      ],
      link: null
    }
  ],

  // Featured fellowship / research programs — spotlighted at the top of the Projects
  // section since they represent Bhawna's flagship, industry-facing work.
  programs: [
    {
      name: "Breakthrough Tech AI Studio",
      org: "Cornell University — Breakthrough Tech AI",
      tagline: "Nationally competitive AI/ML fellowship",
      period: "May 2026 – May 2027",
      description:
        "Selected from a nationally competitive applicant pool for a year-long fellowship pairing a Cornell-certified Machine Learning Foundations curriculum with a team-based AI Studio industry challenge project hosted by leading tech companies.",
      highlights: [
        "Completing 12–15 hrs/week of Cornell-certified ML coursework: data pipelines, model training, and validation.",
        "Building and presenting a professional AI/ML portfolio through Fall 2026 & Spring 2027 industry challenge projects.",
        "Receiving 1:1 mentorship, career coaching, and internship placement support from senior ML engineers."
      ],
      stack: ["Python", "Machine Learning", "Applied AI Engineering"],
      badge: "Cornell-Certified"
    },
    {
      name: "ICons: AI & the Future of Work",
      org: "UMass Amherst — Integrated Concentration in STEM",
      tagline: "20-credit interdisciplinary research track",
      period: "2025 – Present",
      description:
        "Selected as an ICons Scholar for the AI & the Future of Work track — a 20-credit interdisciplinary program tackling real-world AI and technology challenges alongside students from STEM, business, and policy.",
      highlights: [
        "Collaborated cross-functionally with STEM, business, and policy students to design research-driven solutions.",
        "Applied interdisciplinary frameworks to evaluate AI's real-world impact on the future of work."
      ],
      stack: ["Interdisciplinary Research", "AI Policy", "Collaboration"],
      badge: "Honors Program"
    }
  ],

  skills: {
    "Languages": [
      { name: "Python", level: 95 },
      { name: "JavaScript", level: 90 },
      { name: "HTML/CSS", level: 85 },
      { name: "Java", level: 75 },
      { name: "SQL", level: 70 },
      { name: "MATLAB", level: 68 },
      { name: "C", level: 60 }
    ],
    "Frameworks & Libraries": [
      { name: "React", level: 88 },
      { name: "Pandas", level: 88 },
      { name: "Scikit-learn", level: 85 },
      { name: "Tailwind CSS", level: 85 },
      { name: "NumPy", level: 84 },
      { name: "Node.js / Express", level: 80 },
      { name: "TensorFlow", level: 55 }
    ],
    "AI / ML & Data": [
      { name: "Machine Learning", level: 88 },
      { name: "LLM-based APIs", level: 87 },
      { name: "Data Cleaning & QC", level: 90 },
      { name: "Statistical Modeling", level: 82 },
      { name: "Quantitative Analysis", level: 85 }
    ],
    "Tools": [
      { name: "Git / GitHub", level: 92 },
      { name: "VS Code", level: 90 },
      { name: "Claude Code", level: 88 },
      { name: "REST APIs", level: 85 },
      { name: "Jupyter Notebook", level: 88 },
      { name: "Vercel", level: 80 },
      { name: "Copilot", level: 85 }
    ]
  },

  education: {
    school: "University of Massachusetts Amherst",
    college: "Manning College of Information and Computer Sciences & College of Natural Sciences (Commonwealth Honors College)",
    degree: "B.S. Computer Science & B.S. Chemistry",
    graduation: "Expected Spring 2028",
    gpa: 3.96,
    honors: [
      "Dean's List: Fall 2024, Spring 2025, Fall 2025, Spring 2026",
      "Chancellor's Award Recipient",
      "Member, Commonwealth Honors College",
      "ICons Scholar — AI & the Future of Work Track (20-credit interdisciplinary program)",
      "Certificate in Machine Learning, Cornell University (Breakthrough Tech AI Program)"
    ],
    thesis:
      "Honors Thesis: applying computational modeling, data science, AI, and algorithmic approaches to molecular research.",
    coursework: [
      "Artificial Intelligence", "Reasoning Under Uncertainty", "Data Structures", "Object-Oriented Programming",
      "Programming Methodology", "Practices & Applications of Data Management", "Quantitative Analysis (with Lab)",
      "Instrumental Analysis", "Advanced Organic Chemistry", "Linear Algebra", "Multivariate Calculus", "Calculus I & II"
    ],
    // Cumulative GPA (the standard trend metric) by semester — trends upward
    // overall across Bhawna's time at UMass so far.
    gpaTrend: [
      { term: "Fall '24", gpa: 3.856 },
      { term: "Spr '25", gpa: 3.924 },
      { term: "Fall '25", gpa: 3.938 },
      { term: "Spr '26", gpa: 3.96 }
    ]
  },

  certifications: [
    {
      name: "Breakthrough Tech AI Fellow",
      issuer: "Cornell University",
      period: "2026 – 2027",
      description: "Nationally competitive AI/ML fellowship combining a certified ML curriculum with an industry AI Studio capstone.",
      icon: "cornell"
    },
    {
      name: "Certificate in Machine Learning",
      issuer: "Cornell University — Breakthrough Tech AI Program",
      period: "2026",
      description: "Cornell-certified Machine Learning Foundations curriculum: data pipelines, model training & validation.",
      icon: "ml"
    },
    {
      name: "ICons Scholar",
      issuer: "UMass Amherst — AI & the Future of Work Track",
      period: "2025 – Present",
      description: "20-credit interdisciplinary honors program solving real-world AI & technology challenges.",
      icon: "icons"
    },
    {
      name: "Honors Thesis Researcher",
      issuer: "UMass Commonwealth Honors College",
      period: "In Progress",
      description: "Applying computational modeling, data science, and AI to molecular research.",
      icon: "research"
    }
  ],

  leadership: [
    {
      org: "CICSoft (Computer Science Club)",
      role: "Member",
      period: "Aug 2025 – Present",
      points: ["Collaborate with 4–6 developers on GitHub-based software projects, shipping features through 5+ pull requests."]
    },
    {
      org: "Hindu YUVA (Youth for Unity, Virtues, and Action)",
      role: "Member",
      period: "Fall 2024 – Present",
      points: [
        "Participate in campus-wide cultural and spiritual celebrations — including Diwali, Holi, Navratri, and Ganesh Chaturthi — that share Hindu traditions with the broader student community.",
        "Take part in community service (Sewa) initiatives organized through the chapter to give back to the local community.",
        "Engage in personal development sessions spanning meditation, yoga, and team-building, alongside discussions on applying Hindu philosophy to modern life."
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = PORTFOLIO_DATA;
}
