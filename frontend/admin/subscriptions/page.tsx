"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    fetchAllSubscriptions,
    fetchRevenueAnalytics,
    exportSubscriptions
} from "@/lib/adminApi";
import { Download, DollarSign, TrendingUp, CreditCard, Users, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        plan: "",
        status: ""
    });

    useEffect(() => {
        loadData();
    }, [page, filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [subsResponse, analyticsResponse] = await Promise.all([
                fetchAllSubscriptions({
                    page,
                    limit: 20,
                    ...filters
                }),
                fetchRevenueAnalytics()
            ]);

            if (subsResponse.success) {
                setSubscriptions(subsResponse.data);
                setTotalPages(subsResponse.pagination.pages);
            }

            if (analyticsResponse.success) {
                setAnalytics(analyticsResponse.data);
            }
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            await exportSubscriptions();
        } catch (error) {
            console.error("Failed to export subscriptions:", error);
            alert("Failed to export subscriptions");
        }
    };

    const getPlanBadge = (plan: string) => {
        const colors = {
            free: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
            pro: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            enterprise: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[plan as keyof typeof colors] || colors.free}`}>
                {plan.toUpperCase()}
            </span>
        );
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            trial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            expired: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.trial}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/dashboard">
                            <Button variant="ghost" size="sm" className="mb-2">
                                ← Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">Subscriptions & Revenue</h1>
                        <p className="text-muted-foreground">Track subscriptions and revenue metrics</p>
                    </div>
                    <Button onClick={handleExport} variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Subscriptions
                    </Button>
                </div>

                {/* Revenue Metrics */}
                {analytics && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">MRR</p>
                                    <h3 className="mt-2 text-3xl font-bold">
                                        ${(analytics.mrr || 0).toLocaleString()}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Monthly Recurring Revenue
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3 dark:bg-green-950">
                                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-500" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ARR</p>
                                    <h3 className="mt-2 text-3xl font-bold">
                                        ${(analytics.arr || 0).toLocaleString()}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Annual Recurring Revenue
                                    </p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-950">
                                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Churn Rate</p>
                                    <h3 className="mt-2 text-3xl font-bold">
                                        {analytics.churnRate || 0}%
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Last 30 days
                                    </p>
                                </div>
                                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-950">
                                    <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                                    <h3 className="mt-2 text-3xl font-bold">
                                        {analytics.activeSubscriptions || 0}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Total active
                                    </p>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-950">
                                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Filters */}
                <Card className="p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Select
                            value={filters.plan}
                            onValueChange={(value) => setFilters({ ...filters, plan: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Plans" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Plans</SelectItem>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="trial">Trial</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                {/* Subscriptions Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>Renewal Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        Loading subscriptions...
                                    </TableCell>
                                </TableRow>
                            ) : subscriptions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        No subscriptions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subscriptions.map((sub) => (
                                    <TableRow key={sub._id}>
                                        <TableCell className="font-medium">
                                            {sub.userId?.name || "N/A"}
                                        </TableCell>
                                        <TableCell>{sub.userId?.email || "N/A"}</TableCell>
                                        <TableCell>{getPlanBadge(sub.plan)}</TableCell>
                                        <TableCell>{getStatusBadge(sub.status)}</TableCell>
                                        <TableCell>
                                            ${sub.amount || 0}/{sub.plan === 'pro' ? 'mo' : sub.plan === 'enterprise' ? 'mo' : 'free'}
                                        </TableCell>
                                        <TableCell>
                                            {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
