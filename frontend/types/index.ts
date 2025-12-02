// Core type definitions for iKomatch

export type UserRole = "startup" | "investor";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Startup {
  id: string;
  name: string;
  website?: string;
  description: string;
  industry: string[];
  stage: StartupStage;
  fundingAmount?: number;
  marketSize?: string;
  diversityTags?: string[];
  pitchDeckUrl?: string;
  founders: Founder[];
  profileCompleteness: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export type StartupStage =
  | "Idea"
  | "MVP"
  | "Beta"
  | "Product-Market Fit"
  | "Growth"
  | "Scale";

export interface Founder {
  id: string;
  name: string;
  role: string;
  email?: string;
  linkedin?: string;
  avatar?: string;
}

export interface Investor {
  id: string;
  name: string;
  type: InvestorType;
  company?: string;
  location: string;
  ticketSize?: {
    min: number;
    max: number;
  };
  industries: string[];
  stages: StartupStage[];
  website?: string;
  email?: string;
  linkedin?: string;
  avatar?: string;
  isWishlisted?: boolean;
}

export type InvestorType =
  | "Angel"
  | "VC"
  | "Corporate VC"
  | "Family Office"
  | "Accelerator";

export interface Grant {
  id: string;
  title: string;
  organization: string;
  amount: {
    min: number;
    max: number;
  };
  type: GrantType;
  industries: string[];
  countries: string[];
  description: string;
  deadline?: Date;
  isEquityFree: boolean;
  tags: string[];
  website?: string;
}

export type GrantType =
  | "Government"
  | "Private"
  | "Nonprofit"
  | "Corporate"
  | "Research";

export interface MatchingCriteria {
  id: string;
  type: "balanced" | "regional" | "impact" | "growth";
  name: string;
  description: string;
  icon: string;
}

export interface MatchResult {
  id: string;
  criteriaType: string;
  investors: Investor[];
  grants: Grant[];
  createdAt: Date;
  savedAt?: Date;
}

export interface EmailCampaign {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientType: "investor" | "grant";
  subject: string;
  body: string;
  status: EmailStatus;
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  repliedAt?: Date;
}

export type EmailStatus = "draft" | "sent" | "opened" | "clicked" | "replied" | "bounced";

export interface SubscriptionPlan {
  id: string;
  name: "Free" | "Premium";
  price: number;
  billingInterval: "monthly" | "annual";
  features: string[];
  limits: {
    matches: number;
    emails: number;
    aiCredits: number;
  };
  isPopular?: boolean;
}

export interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: "paid" | "pending" | "failed";
  downloadUrl?: string;
}

export interface DashboardStats {
  potentialMatches: number;
  grantsAvailable: number;
  activeInvestors: number;
  profileViews: number;
  emailsSent: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  children?: NavigationItem[];
}
