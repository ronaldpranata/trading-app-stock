import { AuthorProfile } from "@/types";
export const authorData: AuthorProfile = {
  name: "Ronald Pranata Kurniawan",
  title: "Senior Software Engineer | Singapore PR",
  location: "Singapore",
  socials: {
    linkedin: "https://www.linkedin.com/in/ronaldpranata/",
    github: "https://github.com/ronaldpranata",
  },
  contact: {
    email: "ronald_pranata@yahoo.co.id",
  },
  about: {
    intro:
      "Senior Software Engineer with 15+ years of experience in enterprise application development. Subject Matter Expert in Front-End Development (Vue.js, React) with strong proficiency in Backend Architecture (Java Spring Boot, PHP, Node.js).",
    description:
      "Expert in integrating complex backend services with responsive, high-performance interfaces. Specialized in building secure, high-availability systems for the Finance and Digital Media sectors, with recent innovations in Generative AI integration. Proven track record in Technical Leadership, DevOps (CI/CD), and delivering large-scale digital transformation projects.",
  },
  featuredProject: {
    title: "Stock Predictor AI",
    description:
      "A comprehensive stock analysis and prediction platform built to demonstrate advanced frontend architecture and data visualization capabilities.",
    keyFeatures: [
      "Real-time stock data visualization",
      "Technical Analysis (SMA, RSI, MACD)",
      "AI-driven Price Predictions",
      "Advanced Charting with Recharts",
    ],
    techStack: ["Next.js", "TypeScript", "Material UI", "Recharts", "Redux"],
  },
  skills: [
    {
      category: "Frontend (Expert)",
      items: [
        "Vue.js",
        "Nuxt.js (Composition API)",
        "Pinia",
        "JavaScript (ES6+)",
        "HTML5",
        "CSS3",
        "Sass",
      ],
    },
    {
      category: "Frontend (Proficient)",
      items: [
        "React.js",
        "Next.js",
        "React Native",
        "Redux",
        "Material-UI",
        "Tailwind CSS",
        "Bootstrap",
        "D3.js",
      ],
    },
    {
      category: "Backend & API",
      items: [
        "Java Spring Boot",
        "PHP",
        "Node.js",
        "NestJS",
        "RESTful API",
        "GraphQL",
        "MySQL",
      ],
    },
    {
      category: "AI & Emerging Tech",
      items: ["Google Gemini API", "OpenAI API", "ComfyUI", "Stable Diffusion"],
    },
    {
      category: "DevOps",
      items: ["Git", "GitHub Actions", "Docker", "AWS", "GCP", "Linux"],
    },
  ],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Dentsu, Singapore",
      period: "Mar 2023 — Present",
      details: [
        "Enterprise Projects (FWD & Prudential): Delivered critical platform enhancements achieving a 90% referral rate by architecting a high-performance, secure, and user-centric digital experience for FWD. Engineered a specialized internal logic engine using optimized Vanilla JavaScript for Prudential.",
        "Full-Stack Architecture: Crafted an award-winning digital ecosystem using Java Spring Boot integrated with Vue/Nuxt.",
        "AI & Generative Content Innovation: Architected an AI-powered storytelling platform using Nuxt 3 and Google Gemini to automate high-throughput content generation.",
        "DevOps: Streamlined deployment workflows using GitHub Actions and Docker.",
      ],
    },
    {
      role: "Software Engineer",
      company: "Dentsu (formerly Isobar), Singapore",
      period: "Jan 2017 — Feb 2023",
      details: [
        "Banking Sector Experience (OCBC Bank): Developed high-precision financial calculator and banking micro-site ensuring 100% accuracy.",
        "Data Visualization: Developed data-driven customer intelligence portals using D3.js and Chart.js.",
        "API Integration: Engineered custom resource management ecosystems integrating third-party APIs.",
      ],
    },
    {
      role: "Web Application Developer",
      company: "Islickmedia, Singapore",
      period: "Jan 2015 — Jan 2017",
      details: [
        "Third-Party API Integration: Designed complex API integrations for booking engines, transferable to financial transaction handling.",
        "Frontend & CMS Development: Delivered full-stack web applications meeting strict client specifications.",
      ],
    },
    {
      role: "Senior IT Specialist",
      company: "PT Prima Teknologi, Jakarta",
      period: "Jan 2013 — Jan 2015",
      details: [
        "Digital Transformation: Spearheaded web-based authorization system improving operational efficiency by 50%.",
        "High-Impact Web Development: Delivered responsive landing pages for major telecom clients (Indosat, XL).",
      ],
    },
    {
      role: "Web Developer",
      company: "PT Doxadigital, Jakarta",
      period: "Jan 2010 — Jun 2012",
      details: [
        "Analyzed business requirements and deployed custom web solutions using PHP and MySQL.",
      ],
    },
  ],
  education: [
    {
      degree: "MSc Information Systems",
      institution: "Nanyang Technological University, Singapore",
      period: "Jun 2024 — Jan 2026",
      details:
        "Specialized in Enterprise Architecture, HCI, and Internet Programming. GPA: 4.0/5.0",
    },
    {
      degree: "Bachelor of Computer Science",
      institution: "BINUS University, Jakarta",
      period: "Jul 2005 — Jul 2009",
      details:
        "Activities: BNCC (Bina Nusantara Computer Club), HIMTI. Graduated with High Merit.",
    },
  ],
};
