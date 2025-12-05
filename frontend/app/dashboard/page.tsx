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
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
                        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-lg text-muted-foreground">
                        Welcome back! Here's your startup overview.
                    </p>
                </div>

                {/* Action Center */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="group relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="p-8 relative">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Find Investors</h3>
                                    <p className="text-muted-foreground">
                                        Browse angel investors and VCs that match your startup
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-orange-100 p-3 dark:bg-orange-900/20 group-hover:scale-110 transition-transform">
                                    <Users className="h-8 w-8 text-orange-600" />
                                </div>
                            </div>
                            <Link href="/discovery/angels">
                                <Button variant="outline" className="w-full justify-between h-12 text-base hover:border-orange-500/50 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                                    Browse Investors
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="group relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="p-8 relative">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Start Outreach</h3>
                                    <p className="text-muted-foreground">
                                        Connect with investors through personalized campaigns
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-900/20 group-hover:scale-110 transition-transform">
                                    <Mail className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                            <Link href="/crm/inbox">
                                <Button variant="outline" className="w-full justify-between h-12 text-base hover:border-blue-500/50 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                                    Go to CRM
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Bento Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Hero Stat - Potential Matches (Spans 2 columns) */}
                    <Card className="md:col-span-2 lg:col-span-2 relative overflow-hidden border-none shadow-xl">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{ background: "var(--primary-gradient)" }}
                        />
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <Sparkles className="h-48 w-48 text-orange-500 rotate-12" />
                        </div>

                        <div className="relative p-8">
                            {hasMatches ? (
                                <div className="space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-orange-600 font-medium">
                                                <Sparkles className="h-5 w-5" />
                                                <span>AI Matchmaking</span>
                                            </div>
                                            <h2 className="text-5xl font-bold tracking-tight text-foreground">
                                                {stats.potentialMatches}
                                            </h2>
                                            <p className="text-lg text-muted-foreground max-w-md">
                                                Investors and grants perfectly matched to your startup's profile
                                            </p>
                                        </div>
                                    </div>
                                    <Link href="/matchmaking">
                                        <Button
                                            className="h-12 px-8 text-base font-semibold text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                                            style={{ background: "var(--primary-gradient)" }}
                                        >
                                            View Matches
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-8 text-center">
                                    <div className="mb-6 rounded-full bg-orange-100 p-6 dark:bg-orange-900/20">
                                        <Sparkles className="h-10 w-10 text-orange-600" />
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold">
                                        No matches yet
                                    </h3>
                                    <p className="mb-6 text-muted-foreground max-w-sm">
                                        Complete your profile to let our AI find the perfect investors and grants for you
                                    </p>
                                    <Link href="/matchmaking">
                                        <Button
                                            className="h-11 px-6 font-semibold text-white"
                                            style={{ background: "var(--primary-gradient)" }}
                                        >
                                            Start Matching
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Metric Cards */}
                    <div className="grid gap-6 grid-rows-3">
                        <Card className="p-6 flex items-center justify-between hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur-sm">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Grants Available
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-foreground">
                                    {stats.grantsAvailable}
                                </h3>
                            </div>
                            <div className="rounded-2xl bg-emerald-500/10 p-3">
                                <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                            </div>
                        </Card>

                        <Card className="p-6 flex items-center justify-between hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur-sm">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active Investors
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-foreground">
                                    {stats.activeInvestors}
                                </h3>
                            </div>
                            <div className="rounded-2xl bg-blue-500/10 p-3">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                            </div>
                        </Card>

                        <Card className="p-6 flex items-center justify-between hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur-sm">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Profile Views
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-foreground">
                                    {stats.profileViews}
                                </h3>
                            </div>
                            <div className="rounded-2xl bg-purple-500/10 p-3">
                                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                            </div>
                        </Card>
                    </div>
                </div>


            </div>
        </DashboardLayout>
    );
}
