"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Award,
    Users,
    Eye,
    Mail,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/lib/api";

// ... imports ...

export default function DashboardPage() {
    const [stats, setStats] = useState({
        potentialMatches: 0,
        grantsAvailable: 0,
        activeInvestors: 0,
        profileViews: 0,
        emailsSent: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await fetchDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    const hasMatches = stats.potentialMatches > 0;

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <p>Loading dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's your startup overview.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Hero Stat - Potential Matches (Spans 2 columns) */}
                    <Card className="md:col-span-2 lg:col-span-2">
                        <div className="p-6">
                            {hasMatches ? (
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Potential Matches
                                            </p>
                                            <h2 className="mt-2 text-4xl font-bold">
                                                {stats.potentialMatches}
                                            </h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Investors and grants matched to your profile
                                            </p>
                                        </div>
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <Sparkles className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                    <Link href="/matchmaking">
                                        <Button className="gap-2">
                                            View Matches
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-8 text-center">
                                    <div className="mb-4 rounded-full bg-muted p-4">
                                        <Sparkles className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold">
                                        No matches yet
                                    </h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Complete your profile to find investors and grants
                                    </p>
                                    <Link href="/matchmaking">
                                        <Button className="gap-2">
                                            Start Matching
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Metric Cards */}
                    <Card className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Grants Available
                                </p>
                                <h3 className="mt-2 text-2xl font-bold">
                                    {stats.grantsAvailable}
                                </h3>
                                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                    Total available
                                </p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-950">
                                <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active Investors
                                </p>
                                <h3 className="mt-2 text-2xl font-bold">
                                    {stats.activeInvestors}
                                </h3>
                                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                    Total active
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Profile Views
                                </p>
                                <h3 className="mt-2 text-2xl font-bold">
                                    {stats.profileViews}
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Last 30 days
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-950">
                                <Eye className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Emails Sent
                                </p>
                                <h3 className="mt-2 text-2xl font-bold">{stats.emailsSent}</h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    This month
                                </p>
                            </div>
                            <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-950">
                                <Mail className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Action Center */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold">Find Investors</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Browse angel investors and VCs that match your startup
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <Link href="/discovery/angels">
                                <Button className="w-full gap-2">
                                    Browse Investors
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold">Start Outreach</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Connect with investors through personalized campaigns
                                    </p>
                                </div>
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                            <Link href="/crm/inbox">
                                <Button variant="outline" className="w-full gap-2">
                                    Go to CRM
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
