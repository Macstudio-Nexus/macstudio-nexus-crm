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
  industry: string;
  domain?: string;
  meetingNotes?: string;
  source?: string;
  stage: string;
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