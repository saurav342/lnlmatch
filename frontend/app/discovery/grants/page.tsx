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
import { Search } from "lucide-react";

import { useEffect, useState } from "react";
import { fetchGrants } from "@/lib/api";
import { OpportunityCard } from "@/components/discovery/OpportunityCard";
import { OpportunityDetailsModal } from "@/components/discovery/OpportunityDetailsModal";

// ... imports ...

export default function GrantsPage() {
    const [grants, setGrants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGrant, setSelectedGrant] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function loadGrants() {
            try {
                const data = await fetchGrants();
                setGrants(data);
            } catch (error) {
                console.error("Failed to load grants", error);
            } finally {
                setLoading(false);
            }
        }
        loadGrants();
    }, []);

    const handleViewDetails = (grant: any) => {
        setSelectedGrant(grant);
        setIsModalOpen(true);
    };

    const handleToggleWishlist = (id: string) => {
        console.log("Toggle wishlist for", id);
        // Optimistic update
        setGrants(prev => prev.map(g =>
            g.id === id ? { ...g, isWishlisted: !g.isWishlisted } : g
        ));
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <p>Loading grants...</p>
                </div>
            </DashboardLayout>
        );
    }

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

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {grants.map((grant) => (
                                <OpportunityCard
                                    key={grant.id}
                                    data={grant}
                                    type="grant"
                                    onViewDetails={handleViewDetails}
                                    onToggleWishlist={handleToggleWishlist}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <OpportunityDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedGrant}
                type="grant"
            />
        </DashboardLayout>
    );
}
