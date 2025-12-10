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
import { fetchInvestors, API_BASE_URL } from "@/lib/api";
import { OpportunityCard } from "@/components/discovery/OpportunityCard";
import { OpportunityDetailsModal } from "@/components/discovery/OpportunityDetailsModal";

export default function InstitutionalPage() {
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function loadInvestors() {
            try {
                const response = await fetchInvestors();
                // Handle new response format with meta
                const investorData = response.investors || response;
                // Filter for Institutional investors
                const institutionalInvestors = (investorData as any[]).filter((inv: any) => inv.type === 'Institutional');
                setInvestors(institutionalInvestors);
            } catch (error) {
                console.error("Failed to load investors", error);
            } finally {
                setLoading(false);
            }
        }
        loadInvestors();
    }, []);

    const handleViewDetails = (investor: any) => {
        setSelectedInvestor(investor);
        setIsModalOpen(true);
    };

    const handleToggleWishlist = (id: string) => {
        // Implement wishlist toggle logic here
        console.log("Toggle wishlist for", id);
        // Optimistic update for UI demo
        setInvestors(prev => prev.map(inv =>
            inv.id === id ? { ...inv, isWishlisted: !inv.isWishlisted } : inv
        ));
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <p>Loading investors...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Institutional Investors</h1>
                    <p className="text-muted-foreground">
                        Browse and connect with institutional investors
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    {/* Filters Sidebar */}
                    <Card className="h-fit p-4">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Filters</h3>

                            <Accordion type="multiple" className="w-full">
                                <AccordionItem value="industry">
                                    <AccordionTrigger className="text-sm">
                                        Industry
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3">
                                            {["AI/ML", "SaaS", "Fintech", "Healthcare", "E-commerce"].map(
                                                (industry) => (
                                                    <div
                                                        key={industry}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox id={industry} />
                                                        <label
                                                            htmlFor={industry}
                                                            className="text-sm font-normal"
                                                        >
                                                            {industry}
                                                        </label>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="location">
                                    <AccordionTrigger className="text-sm">
                                        Location
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3">
                                            {["San Francisco", "New York", "Los Angeles", "Boston"].map(
                                                (location) => (
                                                    <div
                                                        key={location}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox id={location} />
                                                        <label
                                                            htmlFor={location}
                                                            className="text-sm font-normal"
                                                        >
                                                            {location}
                                                        </label>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="ticket">
                                    <AccordionTrigger className="text-sm">
                                        Ticket Size
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3">
                                            {["< $100K", "$100K - $500K", "$500K - $2M", "> $2M"].map(
                                                (size) => (
                                                    <div key={size} className="flex items-center space-x-2">
                                                        <Checkbox id={size} />
                                                        <label htmlFor={size} className="text-sm font-normal">
                                                            {size}
                                                        </label>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Button variant="outline" className="w-full" size="sm">
                                Clear Filters
                            </Button>
                        </div>
                    </Card>

                    {/* Results Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search investors..."
                                    className="pl-9"
                                />
                            </div>
                            <Badge variant="secondary">{investors.length} Results</Badge>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {investors.map((investor) => (
                                <OpportunityCard
                                    key={investor.id}
                                    data={investor}
                                    type="investor"
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
                data={selectedInvestor}
                type="investor"
            />
        </DashboardLayout>
    );
}
