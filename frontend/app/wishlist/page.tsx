"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComposeEmailModal } from "@/components/crm/ComposeEmailModal";
import { Heart, Mail } from "lucide-react";
import { fetchWishlist, toggleWishlist } from "@/lib/api";
import { OpportunityCard } from "@/components/discovery/OpportunityCard";

export default function WishlistPage() {
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const data = await fetchWishlist();
            setWishlist(data);
        } catch (error) {
            console.error("Failed to load wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleWishlist = async (id: string) => {
        try {
            // Optimistic update - remove from list immediately
            setWishlist(prev => prev.filter(inv => inv.id !== id));
            await toggleWishlist(id);
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
            // Reload on error
            loadWishlist();
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                    <p className="text-muted-foreground">
                        Manage your wishlisted investors and communications
                    </p>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => setIsComposeOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                        <Mail className="mr-2 h-4 w-4" />
                        Compose Email to Investor
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">Loading wishlist...</div>
                ) : wishlist.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Wishlisted Investors</CardTitle>
                            <CardDescription>You have 0 investors in your wishlist</CardDescription>
                        </CardHeader>
                        <CardContent className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                            <Heart className="h-12 w-12 text-muted-foreground/20 mb-4" />
                            <p>No investors found in your wishlist.</p>
                            <Button variant="link" className="text-emerald-600" onClick={() => window.location.href = '/fundraising'}>Browse Investors</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {wishlist.map((investor) => (
                            <OpportunityCard
                                key={investor.id}
                                data={investor}
                                type="investor"
                                onViewDetails={() => { }} // No details view on wishlist page for now, or could link back
                                onToggleWishlist={handleToggleWishlist}
                            />
                        ))}
                    </div>
                )}

                <ComposeEmailModal
                    open={isComposeOpen}
                    onOpenChange={setIsComposeOpen}
                />
            </div>
        </DashboardLayout>
    );
}
