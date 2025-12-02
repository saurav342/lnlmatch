"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { KpiCard } from "@/components/admin/KpiCard";
import { ActivityChart } from "@/components/admin/ActivityChart";
import { SegmentChart } from "@/components/admin/SegmentChart";
import { EntityTable } from "@/components/admin/EntityTable";
import { AlertList } from "@/components/admin/AlertList";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, DollarSign, Activity, TrendingUp, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/lib/api";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [kpiData, setKpiData] = useState({
        totalUsers: { value: 0, delta: 0, trend: "neutral" as const },
        activeUsers: { value: 0, delta: 0, trend: "neutral" as const },
        newSignups: { value: 0, delta: 0, trend: "neutral" as const },
        mrr: { value: "$0", delta: 0, trend: "neutral" as const },
        activeSubscriptions: { value: 0, delta: 0, trend: "neutral" as const },
        pendingTasks: { value: 0, delta: 0, trend: "neutral" as const },
    });

    const [activityData, setActivityData] = useState<any[]>([]);
    const [userTypeData, setUserTypeData] = useState<any[]>([]);
    const [subscriptionData, setSubscriptionData] = useState<any[]>([]);
    const [recentSignups, setRecentSignups] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const headers: HeadersInit = {
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
                    headers
                });

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const result = await response.json();

                if (result.success && result.data) {
                    const {
                        overview,
                        subscriptionBreakdown,
                        userTypeBreakdown,
                        signupTrend,
                        recentSignupsList,
                        recentActivity
                    } = result.data;

                    // Map Overview to KPI Data
                    setKpiData({
                        totalUsers: { value: overview.totalUsers, delta: 0, trend: "neutral" },
                        activeUsers: { value: overview.activeUsers, delta: 0, trend: "neutral" },
                        newSignups: { value: overview.recentSignupsCount, delta: 0, trend: "neutral" }, // This is actually 30d count from backend
                        mrr: { value: `$${overview.mrr}`, delta: 0, trend: "neutral" },
                        activeSubscriptions: { value: overview.activeSubscriptions, delta: 0, trend: "neutral" },
                        pendingTasks: { value: 0, delta: 0, trend: "neutral" }, // Not yet implemented in backend
                    });

                    // Map Signup Trend to Activity Data
                    // Backend returns { _id: "YYYY-MM-DD", count: N }
                    const mappedActivity = signupTrend.map((item: any) => ({
                        date: item._id,
                        value: item.count,
                        logins: 0 // Logins not yet tracked in this granularity
                    }));
                    setActivityData(mappedActivity);

                    // Map User Type Breakdown
                    const mappedUserTypes = userTypeBreakdown.map((item: any) => ({
                        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
                        value: item.count
                    }));
                    setUserTypeData(mappedUserTypes);

                    // Map Subscription Breakdown
                    const mappedSubs = subscriptionBreakdown.map((item: any) => ({
                        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
                        value: item.count
                    }));
                    setSubscriptionData(mappedSubs);

                    // Map Recent Signups
                    const mappedSignups = recentSignupsList.map((user: any) => ({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        userType: user.userType,
                        status: user.accountStatus || 'active',
                        signupDate: new Date(user.signupDate).toLocaleDateString()
                    }));
                    setRecentSignups(mappedSignups);

                    // Map Alerts (using recent activity as alerts for now)
                    const mappedAlerts = recentActivity.map((act: any) => ({
                        id: act._id,
                        title: act.action.replace(/_/g, ' ').toUpperCase(),
                        description: `Action on ${act.targetType}`,
                        severity: act.status === 'failed' ? 'high' : 'low',
                        timestamp: new Date(act.timestamp).toLocaleTimeString(),
                        actionLabel: 'View'
                    }));
                    setAlerts(mappedAlerts);
                }
            } catch (err: any) {
                console.error("Error fetching admin stats:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const signupColumns = [
        {
            key: "name",
            label: "Name",
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--admin-highlight)] to-[var(--admin-mid)] flex items-center justify-center text-xs font-semibold text-gray-900">
                        {item.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                    </div>
                    <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.email}</div>
                    </div>
                </div>
            ),
        },
        {
            key: "userType",
            label: "Type",
            render: (item: any) => (
                <Badge variant="outline" className="capitalize">
                    {item.userType}
                </Badge>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (item: any) => (
                <Badge
                    variant={item.status === "active" ? "default" : "secondary"}
                    className={
                        item.status === "active"
                            ? "bg-[var(--admin-success)]/20 text-[var(--admin-success)] border-[var(--admin-success)]/30"
                            : ""
                    }
                >
                    {item.status}
                </Badge>
            ),
        },
        {
            key: "signupDate",
            label: "Signup Date",
        },
        {
            key: "actions",
            label: "Actions",
            render: (item: any) => (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/admin/users/${item.id}`)}
                >
                    View
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-muted-foreground">Loading dashboard data...</div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-red-500">Error: {error}</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <KpiCard
                        title="Total Users"
                        value={kpiData.totalUsers.value}
                        delta={kpiData.totalUsers.delta}
                        deltaLabel="vs last month"
                        trend={kpiData.totalUsers.trend}
                        icon={<Users className="h-5 w-5 text-[var(--admin-accent)]" />}
                    />
                    <KpiCard
                        title="Active Users (30d)"
                        value={kpiData.activeUsers.value}
                        delta={kpiData.activeUsers.delta}
                        deltaLabel="vs previous"
                        trend={kpiData.activeUsers.trend}
                        icon={<Activity className="h-5 w-5 text-[var(--admin-success)]" />}
                    />
                    <KpiCard
                        title="New Signups (30d)"
                        value={kpiData.newSignups.value}
                        delta={kpiData.newSignups.delta}
                        deltaLabel="last 30 days"
                        trend={kpiData.newSignups.trend}
                        icon={<UserPlus className="h-5 w-5 text-[var(--admin-mid)]" />}
                    />
                    <KpiCard
                        title="Monthly Revenue"
                        value={kpiData.mrr.value}
                        delta={kpiData.mrr.delta}
                        deltaLabel="vs last month"
                        trend={kpiData.mrr.trend}
                        icon={<DollarSign className="h-5 w-5 text-[var(--admin-strong)]" />}
                    />
                    <KpiCard
                        title="Subscriptions"
                        value={kpiData.activeSubscriptions.value}
                        delta={kpiData.activeSubscriptions.delta}
                        deltaLabel="active"
                        trend={kpiData.activeSubscriptions.trend}
                        icon={<TrendingUp className="h-5 w-5 text-[var(--admin-accent)]" />}
                    />
                    <KpiCard
                        title="Pending Tasks"
                        value={kpiData.pendingTasks.value}
                        delta={kpiData.pendingTasks.delta}
                        trend={kpiData.pendingTasks.trend}
                        icon={<Eye className="h-5 w-5 text-orange-500" />}
                    />
                </div>

                {/* Activity Chart */}
                <ActivityChart
                    data={activityData}
                    title="User Signups Trend"
                    dataKeys={["value"]}
                    type="area"
                />

                {/* Segmented Insights */}
                <div className="grid gap-6 md:grid-cols-2">
                    <SegmentChart
                        data={userTypeData}
                        title="Users by Type"
                        type="donut"
                        height={300}
                    />
                    <SegmentChart
                        data={subscriptionData}
                        title="Subscriptions by Plan"
                        type="bar"
                        height={300}
                    />
                </div>

                {/* Recent Activity & Alerts */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <SectionHeader
                            title="Recent Signups"
                            description="Latest user registrations"
                            action={
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push("/admin/users")}
                                >
                                    View All
                                </Button>
                            }
                        />
                        <EntityTable columns={signupColumns} data={recentSignups} />
                    </div>

                    <div>
                        <AlertList alerts={alerts} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
