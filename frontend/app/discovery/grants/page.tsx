"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ExternalLink, Calendar } from "lucide-react";

// Mock data
const grants = [
    {
        id: "1",
        title: "Small Business Innovation Research (SBIR)",
        organization: "National Science Foundation",
        amount: { min: 150000, max: 1000000 },
        type: "Government",
        isEquityFree: true,
        deadline: "2025-03-15",
        tags: ["Equity-free", "R&D", "Technology"],
        description: "Funding for small businesses engaged in R&D with potential for commercialization.",
    },
    {
        id: "2",
        title: "Climate Tech Innovation Grant",
        organization: "CleanTech Alliance",
        amount: { min: 50000, max: 250000 },
        type: "Nonprofit",
        isEquityFree: true,
        deadline: "2025-04-01",
        tags: ["Equity-free", "Climate", "Sustainability"],
        description: "Support for startups developing clean technology solutions.",
    },
    {
        id: "3",
        title: "Women in Tech Founders Program",
        organization: "Google for Startups",
        amount: { min: 100000, max: 500000 },
        type: "Corporate",
        isEquityFree: false,
        deadline: "2025-02-28",
        tags: ["Women-led", "Technology", "Accelerator"],
        description: "Funding and mentorship for women-led technology startups.",
    },
    {
        id: "4",
        title: "Healthcare Innovation Award",
        organization: "Gates Foundation",
        amount: { min: 500000, max: 2000000 },
        type: "Nonprofit",
        isEquityFree: true,
        deadline: "2025-05-15",
        tags: ["Equity-free", "Healthcare", "Global Health"],
        description: "Support for innovative healthcare solutions addressing global health challenges.",
    },
];

export default function GrantsPage() {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Grants</h1>
                    <p className="text-muted-foreground">
                        Discover funding opportunities for your startup
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    {/* Filters Sidebar */}
                    <Card className="h-fit p-4">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Filters</h3>

                            <Accordion type="multiple" className="w-full">
                                <AccordionItem value="type">
                                    <AccordionTrigger className="text-sm">
                                        Grant Type
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3">
                                            {["Government", "Corporate", "Nonprofit", "Research"].map((type) => (
                                                <div key={type} className="flex items-center space-x-2">
                                                    <Checkbox id={type} />
                                                    <label htmlFor={type} className="text-sm font-normal">
                                                        {type}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="industry">
                                    <AccordionTrigger className="text-sm">
                                        Industry
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3">
                                            {["Technology", "Healthcare", "Climate", "Education"].map((industry) => (
                                                <div key={industry} className="flex items-center space-x-2">
                                                    <Checkbox id={industry} />
                                                    <label htmlFor={industry} className="text-sm font-normal">
                                                        {industry}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="equity">
                                    <AccordionTrigger className="text-sm">
                                        Equity-Free
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="equity-free" />
                                                <label htmlFor="equity-free" className="text-sm font-normal">
                                                    Show only equity-free grants
                                                </label>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Button variant="outline" className="w-full" size="sm">
                                Clear Filters
                            </Button>
                        </div>
                    </Card>

                    {/* Grants Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search grants..." className="pl-9" />
                            </div>
                            <Badge variant="secondary">{grants.length} Results</Badge>
                        </div>

                        <div className="grid gap-4">
                            {grants.map((grant) => (
                                <Card key={grant.id} className="p-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-semibold">{grant.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {grant.organization}
                                                    </p>
                                                </div>
                                                <Badge variant={grant.isEquityFree ? "default" : "secondary"}>
                                                    {grant.isEquityFree ? "Equity-free" : "Equity"}
                                                </Badge>
                                            </div>

                                            <p className="text-sm">{grant.description}</p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline" className="gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Deadline: {formatDate(grant.deadline)}
                                            </Badge>
                                            <Badge variant="outline">
                                                {formatCurrency(grant.amount.min)} - {formatCurrency(grant.amount.max)}
                                            </Badge>
                                            {grant.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button className="gap-2">
                                                Apply Now
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline">Save for Later</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
