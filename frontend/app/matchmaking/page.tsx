"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MATCHING_CRITERIA } from "@/lib/constants";
import { Scale, MapPin, Heart, TrendingUp } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

// Icon mapping
const iconMap: Record<string, any> = {
    Scale,
    MapPin,
    Heart,
    TrendingUp,
};

export default function MatchmakingPage() {
    const aiCreditsRemaining = 15;
    const generationsUsed = 0;
    const maxGenerations = 2;

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">AI Match Making</h1>
                        <p className="text-muted-foreground">
                            Generate personalized investor and grant matches
                        </p>
                    </div>
                </div>

                {/* Usage Stats */}
                <Card className="bg-emerald-50 border-emerald-100">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <div className="rounded-full bg-emerald-100 p-1">
                                <Zap className="h-4 w-4 text-emerald-600" />
                            </div>
                            <CardTitle className="text-base font-semibold text-emerald-900">
                                AI Matchmaking Usage - GG's Startup
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Generations Used</span>
                                <Badge variant="secondary" className="bg-emerald-900 text-white hover:bg-emerald-900">
                                    2 remaining
                                </Badge>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-emerald-600">{generationsUsed}</span>
                                <span className="text-muted-foreground mb-1">/ {maxGenerations}</span>
                            </div>
                            <Progress value={(generationsUsed / maxGenerations) * 100} className="h-2 bg-emerald-200" />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {MATCHING_CRITERIA.map((criteria) => {
                        const Icon = iconMap[criteria.icon] || TrendingUp;
                        return (
                            <Card key={criteria.id} className="flex flex-col border-emerald-100 hover:border-emerald-300 transition-colors">
                                <CardHeader className="pb-4 bg-emerald-50/50 rounded-t-xl">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-5 w-5 text-emerald-600" />
                                        <CardTitle className="text-lg text-emerald-900">{criteria.name}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 pt-4">
                                    <p className="text-sm text-muted-foreground">
                                        {criteria.description}
                                    </p>
                                </CardContent>
                                <div className="p-6 pt-0 mt-auto">
                                    <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium">
                                        <Zap className="mr-2 h-4 w-4" />
                                        Generate Now
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
}
