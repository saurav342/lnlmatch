"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { EntityTable } from "@/components/admin/EntityTable";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Download, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/lib/api";

export default function SubscriptionsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const headers: HeadersInit = {
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                // Fetch Subscriptions
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: '10',
                    search: searchQuery,
                    plan: planFilter === "all" ? "" : planFilter,
                    status: statusFilter === "all" ? "" : statusFilter,
                });

                const [subsResponse, analyticsResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/subscriptions?${queryParams}`, { headers }),
                    fetch(`${API_BASE_URL}/admin/revenue/analytics`, { headers })
                ]);

                if (subsResponse.status === 401 || analyticsResponse.status === 401) {
                    router.push('/login');
                    return;
                }

                if (subsResponse.ok) {
                    const result = await subsResponse.json();
                    if (result.success) {
                        setSubscriptions(result.data);
                        setTotal(result.pagination.total);
                    }
                }

                if (analyticsResponse.ok) {
                    const result = await analyticsResponse.json();
                    if (result.success) {
                        setAnalytics(result.data);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch subscription data:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchSubscriptions();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [page, searchQuery, planFilter, statusFilter]);

    const columns = [
        {
            key: "user",
            label: "User",
            render: (item: any) => (
                <div>
                    <div className="font-medium">{item.userId?.name || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{item.userId?.email || 'N/A'}</div>
                </div>
            ),
        },
        {
            key: "plan",
            label: "Plan",
            render: (item: any) => (
                <Badge
                    variant={item.plan === "free" ? "secondary" : "default"}
                    className={
                        item.plan !== "free"
                            ? "bg-gradient-to-r from-[var(--admin-mid)] to-[var(--admin-strong)] text-gray-900"
                            : ""
                    }
                >
                    {item.plan}
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
                            : item.status === "cancelled"
                                ? "bg-destructive/20 text-destructive border-destructive/30"
                                : ""
                    }
                >
                    {item.status}
                </Badge>
            ),
        },
        {
            key: "amount",
            label: "Amount",
            render: (item: any) => (
                <span className="font-mono font-medium">
                    {item.currency} ${item.amount}
                    {item.plan !== "free" && <span className="text-muted-foreground">/mo</span>}
                </span>
            ),
        },
        {
            key: "startDate",
            label: "Start Date",
            render: (item: any) => new Date(item.startDate).toLocaleDateString(),
        },
        {
            key: "renewalDate",
            label: "Renewal Date",
            render: (item: any) =>
                item.renewalDate ? new Date(item.renewalDate).toLocaleDateString() : "N/A",
        },
        {
            key: "actions",
            label: "Actions",
            render: (item: any) => (
                <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                    View
                </Button>
            ),
        },
    ];

    // Use analytics data for summary if available, otherwise 0
    const totalMRR = analytics?.mrr || 0;
    const activeCount = analytics?.activeSubscriptions || 0;
    // We don't have exact counts for trial/cancelled in analytics summary yet, 
    // but we can infer or just show 0 for now if not provided.
    // Actually `planBreakdown` is available.

    return (
        <AdminLayout>
            <div className="space-y-6">
                <SectionHeader
                    title="Subscription Management"
                    description="Manage all user subscriptions and billing"
                />

                {/* Revenue Summary */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="p-6 rounded-lg border border-[var(--admin-neutral)]/30 bg-gradient-to-br from-white to-[var(--admin-bg-light)]/20 dark:from-card dark:to-card/50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--admin-soft)]/20 to-[var(--admin-highlight)]/20">
                                <DollarSign className="h-5 w-5 text-[var(--admin-accent)]" />
                            </div>
                            <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                        </div>
                        <p className="text-3xl font-bold">${totalMRR}</p>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--admin-mid)] via-[var(--admin-accent)] to-[var(--admin-success)]" />
                    </div>

                    <div className="p-6 rounded-lg border border-[var(--admin-neutral)]/30 bg-white dark:bg-card">
                        <p className="text-sm text-muted-foreground mb-2">Active Subscriptions</p>
                        <p className="text-3xl font-bold">{activeCount}</p>
                    </div>

                    {/* Placeholder for other stats since analytics API doesn't return them explicitly yet */}
                    <div className="p-6 rounded-lg border border-[var(--admin-neutral)]/30 bg-white dark:bg-card">
                        <p className="text-sm text-muted-foreground mb-2">Churn Rate</p>
                        <p className="text-3xl font-bold">{analytics?.churnRate || 0}%</p>
                    </div>

                    <div className="p-6 rounded-lg border border-[var(--admin-neutral)]/30 bg-white dark:bg-card">
                        <p className="text-sm text-muted-foreground mb-2">ARR</p>
                        <p className="text-3xl font-bold">${analytics?.arr || 0}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by user name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={planFilter} onValueChange={setPlanFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Plan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Plans</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center p-8">Loading subscriptions...</div>
                ) : (
                    <EntityTable
                        columns={columns}
                        data={subscriptions}
                        pagination={{
                            page,
                            pageSize: 10,
                            total: total,
                            onPageChange: setPage,
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
