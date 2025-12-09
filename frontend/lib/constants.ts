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
            {
                name: "My Wishlist",
                href: "/wishlist",
                icon: "Heart",
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
        name: "Balanced Matching",
        description: "Uses the existing matchmaking flow that prioritizes sector, stage, geography, and cheque size alignment.",
        icon: "Scale",
    },
    {
        id: "regional",
        type: "regional",
        name: "Regional Focus",
        description: "Prioritizes alignment of investor's regional focus with the startup's country.",
        icon: "MapPin",
    },
    {
        id: "country",
        type: "country",
        name: "Country Match",
        description: "Strict preference for investors in the same country as the startup.",
        icon: "TrendingUp",
    },
    {
        id: "recent",
        type: "recent",
        name: "Recent Investors",
        description: "Prioritizes investors who have made recent investments in the last 18 months.",
        icon: "TrendingUp", // Using TrendingUp as a placeholder if Clock/History isn't available in imports currently, will check imports
    },
    {
        id: "sector_stage",
        type: "sector_stage",
        name: "Sector + Stage Priority",
        description: "Prioritizes sector and stage alignment, with geography and cheque size as secondary filters.",
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
