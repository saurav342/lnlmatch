"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComposeEmailModal } from "@/components/crm/ComposeEmailModal";
import { Heart, Mail } from "lucide-react";

export default function WishlistPage() {
    const [isComposeOpen, setIsComposeOpen] = useState(false);

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

                {/* Placeholder content for Wishlist */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Wishlisted Investors</CardTitle>
                        <CardDescription>You have 0 investors in your wishlist</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                        <Heart className="h-12 w-12 text-muted-foreground/20 mb-4" />
                        <p>No investors found in your wishlist.</p>
                        <Button variant="link" className="text-emerald-600">Browse Investors</Button>
                    </CardContent>
                </Card>

                <ComposeEmailModal
                    open={isComposeOpen}
                    onOpenChange={setIsComposeOpen}
                />
            </div>
        </DashboardLayout>
    );
}
