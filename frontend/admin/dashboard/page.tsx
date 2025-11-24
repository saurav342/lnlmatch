"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    CreditCard,
    UserPlus,
    TrendingUp,
    DollarSign,
    Building2,
    Activity,
    ArrowRight
} from "lucide-react";
import { fetchAdminDashboardStats } from "@/lib/adminApi";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            const response = await fetchAdminDashboardStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Failed to load dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading admin dashboard...</p>
            </div>
        );
    }

    const overview = stats?.overview || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Monitor and manage your platform
                        </p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline">Back to App</Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Users
                                </p>
                                <h3 className="mt-2 text-3xl font-bold">{overview.totalUsers || 0}</h3>
                                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                    {overview.activeUsers || 0} active
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-950">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active Subscriptions
                                </p>
                                <h3 className="mt-2 text-3xl font-bold">{overview.activeSubscriptions || 0}</h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    of {overview.totalSubscriptions || 0} total
                                </p>
                            </div>
                            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-950">
                                <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    MRR
                                </p>
                                <h3 className="mt-2 text-3xl font-bold">
                                    ${(overview.mrr || 0).toLocaleString()}
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    ARR: ${(overview.arr || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-950">
                                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-500" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Investors
                                </p>
                                <h3 className="mt-2 text-3xl font-bold">{overview.totalInvestors || 0}</h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {overview.verifiedInvestors || 0} verified
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-950">
                                <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/admin/users">
                        <Card className="p-6 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">Users & Signups</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Manage all user accounts
                                    </p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </Card>
                    </Link>

                    <Link href="/admin/subscriptions">
                        <Card className="p-6 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">Subscriptions</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        View subscriptions & revenue
                                    </p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </Card>
                    </Link>

                    <Link href="/admin/investors">
                        <Card className="p-6 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">Investor Database</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Upload & manage investors
                                    </p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </Card>
                    </Link>
                </div>

                {/* Recent Signups Stats */}
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-950">
                            <UserPlus className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{overview.recentSignups || 0}</p>
                            <p className="text-sm text-muted-foreground">New signups (last 30 days)</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
