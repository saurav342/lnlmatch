import { NavigationItem, MatchingCriteria, SubscriptionPlan } from "@/types";

// Navigation Items
export const NAVIGATION: NavigationItem[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: "LayoutDashboard",
    },
    {
        name: "Fundraising",
        href: "/fundraising",
        icon: "Building2",
    },
    {
        name: "CRM",
        href: "/crm",
        icon: "Inbox",
        children: [
            {
                name: "Inbox",
                href: "/crm/inbox",
                icon: "Mail",
            },
            {
                name: "Tracking",
                href: "/crm/tracking",
                icon: "LineChart",
            },
        ],
    },
    {
        name: "Organization",
        href: "/organization",
        icon: "Settings",
        children: [
            {
                name: "Startup Profile",
                href: "/startup-profile",
                icon: "Building2",
            },
            {
                name: "Email Settings",
                href: "/email-settings",
                icon: "Settings",
            },
            {
                name: "Subscription",
                href: "/subscription",
                icon: "CreditCard",
            },
        ],
    },
];

// Industry Options
export const INDUSTRIES = [
    "AI/ML",
    "Fintech",
    "Healthcare",
    "E-commerce",
    "EdTech",
    "SaaS",
    "CleanTech",
    "Biotech",
    "Consumer",
    "Enterprise",
    "Gaming",
    "Hardware",
    "Marketplace",
    "Media",
    "PropTech",
    "Social",
    "Transportation",
    "Web3/Crypto",
] as const;

// Startup Stages
export const STARTUP_STAGES = [
    "Idea",
    "MVP",
    "Beta",
    "Product-Market Fit",
    "Growth",
    "Scale",
] as const;

// Diversity Tags
export const DIVERSITY_TAGS = [
    "Women-led",
    "BIPOC-led",
    "LGBTQ+-led",
    "Veteran-led",
    "First-time Founder",
    "Immigrant Founder",
] as const;

// Countries
export const COUNTRIES = [
    "United States",
    "United Kingdom",
    "Canada",
    "Germany",
    "France",
    "India",
    "Singapore",
    "Australia",
    "Netherlands",
    "Sweden",
    "Switzerland",
    "Israel",
    "UAE",
    "South Korea",
    "Japan",
] as const;

// Matching Criteria
export const MATCHING_CRITERIA: MatchingCriteria[] = [
    {
        id: "balanced",
        type: "balanced",
        name: "Balanced Match",
        description: "Find investors and grants that match your overall profile",
        icon: "Scale",
    },
    {
        id: "regional",
        type: "regional",
        name: "Regional Focus",
        description: "Prioritize investors and grants in your region",
        icon: "MapPin",
    },
    {
        id: "impact",
        type: "impact",
        name: "Impact Investors",
        description: "Connect with mission-driven investors and grants",
        icon: "Heart",
    },
    {
        id: "growth",
        type: "growth",
        name: "Growth Stage",
        description: "Target investors focused on scaling businesses",
        icon: "TrendingUp",
    },
];

// Subscription Plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: "free",
        name: "Free",
        price: 0,
        billingInterval: "monthly",
        features: [
            "5 AI matches per month",
            "Browse all investors & grants",
            "Basic profile",
            "10 emails per month",
        ],
        limits: {
            matches: 5,
            emails: 10,
            aiCredits: 5,
        },
    },
    {
        id: "premium",
        name: "Premium",
        price: 9999,
        billingInterval: "monthly",
        isPopular: true,
        features: [
            "Unlimited AI matches",
            "Advanced filtering",
            "Premium profile badge",
            "Unlimited emails",
            "Email tracking & analytics",
            "Priority support",
            "Dedicated account manager",
            "Custom integrations",
            "Team collaboration",
            "Advanced analytics",
            "White-label options",
        ],
        limits: {
            matches: -1, // unlimited
            emails: -1,
            aiCredits: -1,
        },
    },
];

// Design tokens (for reference, mainly using Tailwind classes directly)
export const DESIGN_TOKENS = {
    colors: {
        primary: "emerald",
        muted: "slate",
    },
    radius: {
        card: "rounded-xl",
        button: "rounded-lg",
        input: "rounded-md",
    },
    shadow: {
        card: "shadow-sm",
        dropdown: "shadow-md",
    },
} as const;
