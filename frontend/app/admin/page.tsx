"use client";

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

// Mock data for the dashboard
const kpiData = {
    totalUsers: { value: 2847, delta: 12.5, trend: "up" as const },
    activeUsers: { value: 1923, delta: 8.2, trend: "up" as const },
    newSignups: { value: 43, delta: -3.1, trend: "down" as const },
    mrr: { value: "$24,580", delta: 15.3, trend: "up" as const },
    activeSubscriptions: { value: 187, delta: 6.7, trend: "up" as const },
    pendingTasks: { value: 12, delta: 0, trend: "neutral" as const },
};

const activityData = [
    { date: "Nov 23", value: 45, logins: 120 },
    { date: "Nov 24", value: 52, logins: 135 },
    { date: "Nov 25", value: 48, logins: 128 },
    { date: "Nov 26", value: 61, logins: 145 },
    { date: "Nov 27", value: 55, logins: 138 },
    { date: "Nov 28", value: 67, logins: 156 },
    { date: "Nov 29", value: 58, logins: 142 },
    { date: "Nov 30", value: 43, logins: 118 },
    { date: "Dec 1", value: 71, logins: 165 },
    { date: "Dec 2", value: 43, logins: 95 },
];

const userTypeData = [
    { name: "Founders", value: 1523 },
    { name: "Investors", value: 892 },
    { name: "Admins", value: 12 },
];

const subscriptionData = [
    { name: "Free", value: 1680 },
    { name: "Pro", value: 156 },
    { name: "Enterprise", value: 31 },
];

const recentSignups = [
    {
        id: "1",
        name: "Sarah Chen",
        email: "sarah@example.com",
        userType: "founder",
        status: "active",
        signupDate: "2 hours ago",
    },
    {
        id: "2",
        name: "Michael Roberts",
        email: "michael@venture.com",
        userType: "investor",
        status: "active",
        signupDate: "5 hours ago",
    },
    {
        id: "3",
        name: "Alex Kumar",
        email: "alex@startup.io",
        userType: "founder",
        status: "pending",
        signupDate: "8 hours ago",
    },
    {
        id: "4",
        name: "Jennifer Lee",
        email: "jennifer@fund.com",
        userType: "investor",
        status: "active",
        signupDate: "1 day ago",
    },
    {
        id: "5",
        name: "David Park",
        email: "david@company.com",
        userType: "founder",
        status: "active",
        signupDate: "1 day ago",
    },
];

const alerts = [
    {
        id: "1",
        title: "Payment Failure",
        description: "5 subscription renewals failed due to payment issues",
        severity: "high" as const,
        timestamp: "15 minutes ago",
        actionLabel: "View Details",
    },
    {
        id: "2",
        title: "Pending Verifications",
        description: "12 investor profiles awaiting verification",
        severity: "medium" as const,
        timestamp: "1 hour ago",
        actionLabel: "Review",
    },
    {
        id: "3",
        title: "System Performance",
        description: "API response time increased by 15% in the last hour",
        severity: "low" as const,
        timestamp: "2 hours ago",
    },
];

export default function AdminDashboard() {
    const router = useRouter();

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
                        title="New Signups"
                        value={kpiData.newSignups.value}
                        delta={kpiData.newSignups.delta}
                        deltaLabel="today"
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
                    title="User Signups & Logins"
                    dataKeys={["value", "logins"]}
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
