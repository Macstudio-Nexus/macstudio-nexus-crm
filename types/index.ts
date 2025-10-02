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
  domain?: string;
  meetingNotes?: string;
  source?: string;
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
  phoneNumber: string;
  roleId: number;
}

// Project related interfaces
export interface Project {
  title: string;
  description?: string;
  domain?: string;
  type: string;
  contactId: string | number;
  siteId?: string | number;
}

// Web Project related interfaces

export interface WebProjectDocs {
  questionnaire?: string | null;
  quote?: string | null;
  contract?: string | null;
  invoice?: string | null;
}

export interface WebProjectDesign {
  sitemap?: string;
  wireframes?: string;
  colorScheme?: Record<string, string>;
  typography?: Record<string, string>;
  responsive?: boolean;
}

export interface WebProjectDev {
  domain?: string;
  githubLink?: string;
  pages?: Record<string, string[]>;
  vercelLink?: string;
  integrations?: Record<string, string>;
}

//