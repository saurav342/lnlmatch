import * as z from "zod";

// Founder schema
export const founderSchema = z.object({
    id: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.string().min(2, "Role is required"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    avatar: z.string().optional(),
});

// Overview tab schema
export const overviewSchema = z.object({
    name: z.string().min(2, "Company name is required"),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    description: z.string().min(50, "Description must be at least 50 characters"),
    industry: z.array(z.string()).min(1, "Select at least one industry"),
});

// Details tab schema
export const detailsSchema = z.object({
    stage: z.enum(["Idea", "MVP", "Beta", "Product-Market Fit", "Growth", "Scale"]),
    fundingAmount: z.number().min(0).optional(),
    marketSize: z.string().optional(),
    diversityTags: z.array(z.string()).optional(),
});

// Media tab schema
export const mediaSchema = z.object({
    pitchDeckUrl: z.string().optional(),
});

// Team tab schema
export const teamSchema = z.object({
    founders: z.array(founderSchema).min(1, "Add at least one founder"),
});

// Complete startup profile schema
export const startupProfileSchema = z.object({
    ...overviewSchema.shape,
    ...detailsSchema.shape,
    ...mediaSchema.shape,
    ...teamSchema.shape,
});

export type FounderFormData = z.infer<typeof founderSchema>;
export type OverviewFormData = z.infer<typeof overviewSchema>;
export type DetailsFormData = z.infer<typeof detailsSchema>;
export type MediaFormData = z.infer<typeof mediaSchema>;
export type TeamFormData = z.infer<typeof teamSchema>;
export type StartupProfileFormData = z.infer<typeof startupProfileSchema>;
