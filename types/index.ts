// For pages on sidebar
export interface Option {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
}

// Contact related interfaces
export interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  source: string | null;
  stage: string;
}

// For displaying basic information about a contact
export interface BasicContact {
  name: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  companyName: string | undefined;
}

// User related interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  roleId: number;
  createdAt?: Date;
  updatedAt?: Date;
  image: string | null;
  emailVerified?: Date | null;
}

// Project related interfaces
export interface Project {
  title: string;
  type: string;
  contactId: string;
  stage?: string;
}

// Web Project related interfaces
export interface WebProjectDocs {
  questionnaire?: string | null;
  quote?: string | null;
  contract?: string | null;
  invoice?: string | null;
}

export interface WebProjectDesign {
  sitemap: string | null;
  wireframes: string | null;
  colorScheme?: Record<string, string> | null;
  typography?: Record<string, string> | null;
  responsive?: boolean | null;
}

export interface WebProjectDev {
  domain: string | null;
  githubLink: string | null;
  pages?: Record<string, string[]>;
  vercelLink: string | null;
  integrations?: Record<string, string>;
}

export interface Content {
  page: string;
  section: string;
  content: string;
}
