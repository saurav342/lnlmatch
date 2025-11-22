"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MATCHING_CRITERIA } from "@/lib/constants";
import { Scale, MapPin, Heart, TrendingUp } from "lucide-react";

// Icon mapping
const iconMap: Record<string, any> = {
    Scale,
    MapPin,
    Heart,
    TrendingUp,
};

export default function MatchmakingPage() {
    const aiCreditsRemaining = 15;

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">AI Matchmaking</h1>
                        <p className="text-muted-foreground">
                            Generate personalized investor and grant matches
                        </p>
                    </div>
                    <Badge variant="secondary" className="gap-2">
                        <span className="font-semibold">{aiCreditsRemaining}</span>
                        Credits Remaining
                    </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {MATCHING_CRITERIA.map((criteria) => {
                        const Icon = iconMap[criteria.icon];
                        return (
                            <Card key={criteria.id} className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="rounded-lg bg-primary/10 p-3">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">{criteria.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {criteria.description}
                                        </p>
                                    </div>
                                    <Button className="w-full">Generate Matches</Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Empty State with Tips */}
                <Card className="p-8">
                    <div className="space-y-4 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <TrendingUp className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                How AI Matchmaking Works
                            </h3>
                            <p className="mx-auto max-w-md text-sm text-muted-foreground">
                                Our AI analyzes your startup profile and matches you with
                                investors and grants that align with your industry, stage, and
                                funding needs.
                            </p>
                        </div>
                        <div className="grid gap-3 text-left sm:grid-cols-2">
                            <div className="rounded-lg border border-border p-4">
                                <h4 className="mb-1 font-medium">Step 1</h4>
                                <p className="text-sm text-muted-foreground">
                                    Complete your startup profile
                                </p>
                            </div>
                            <div className="rounded-lg border border-border p-4">
                                <h4 className="mb-1 font-medium">Step 2</h4>
                                <p className="text-sm text-muted-foreground">
                                    Choose a matching strategy
                                </p>
                            </div>
                            <div className="rounded-lg border border-border p-4">
                                <h4 className="mb-1 font-medium">Step 3</h4>
                                <p className="text-sm text-muted-foreground">
                                    Review your personalized matches
                                </p>
                            </div>
                            <div className="rounded-lg border border-border p-4">
                                <h4 className="mb-1 font-medium">Step 4</h4>
                                <p className="text-sm text-muted-foreground">
                                    Start reaching out to investors
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
