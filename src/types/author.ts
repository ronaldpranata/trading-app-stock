export interface AuthorProfile {
  name: string;
  title: string;
  location: string;
  socials: SocialLinks;
  contact: {
    email: string;
  };
  about: {
    intro: string;
    description: string;
  };
  featuredProject: Project;
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
}

export interface SocialLinks {
  linkedin: string;
  github: string;
}

export interface Project {
  title: string;
  description: string;
  keyFeatures: string[];
  techStack: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  details: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  details: string;
}
