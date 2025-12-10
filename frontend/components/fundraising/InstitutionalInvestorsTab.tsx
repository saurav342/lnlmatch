"use client";

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
import { Search, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchInvestors, toggleWishlist, InvestorMeta } from "@/lib/api";
import { OpportunityCard } from "@/components/discovery/OpportunityCard";
import { InstitutionalInvestorModal } from "@/components/fundraising/InstitutionalInvestorModal";

export function InstitutionalInvestorsTab() {
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [meta, setMeta] = useState<InvestorMeta | null>(null);

    useEffect(() => {
        async function loadInvestors() {
            try {
                const response = await fetchInvestors();
                // Handle new response format with meta
                const investorData = response.investors || response;
                const metaData = response.meta || null;

                // Filter for Institutional investors
                const institutionalInvestors = investorData.filter((inv: any) => inv.type === 'Institutional');
                setInvestors(institutionalInvestors);
                setMeta(metaData);
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

    const handleToggleWishlist = async (id: string) => {
        try {
            // Optimistic update
            setInvestors(prev => prev.map(inv =>
                inv.id === id ? { ...inv, isWishlisted: !inv.isWishlisted } : inv
            ));

            await toggleWishlist(id);
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
            // Revert on failure
            setInvestors(prev => prev.map(inv =>
                inv.id === id ? { ...inv, isWishlisted: !inv.isWishlisted } : inv
            ));
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <p>Loading investors...</p>
            </div>
        );
    }

    const showUpgradeBanner = meta && !meta.isPremium && meta.counts.totalInstitutional > meta.counts.institutional;

    return (
        <div className="space-y-6">
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

                    {/* Upgrade Banner */}
                    {showUpgradeBanner && (
                        <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                                        <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-amber-900 dark:text-amber-100">
                                            Viewing {meta?.counts.institutional} of {meta?.counts.totalInstitutional} institutional investors
                                        </p>
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            Upgrade to Premium to access all {meta?.counts.totalInstitutional} institutional investors
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                                    <Crown className="h-4 w-4 mr-2" />
                                    Upgrade Now
                                </Button>
                            </div>
                        </Card>
                    )}

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

            <InstitutionalInvestorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                investor={selectedInvestor}
                meta={meta}
            />
        </div>
    );
}
