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
import { useState } from "react";

const mockSubscriptions = [
    {
        id: "1",
        userName: "Sarah Chen",
        userEmail: "sarah@example.com",
        plan: "pro",
        status: "active",
        amount: 49,
        currency: "USD",
        startDate: "2024-11-01",
        renewalDate: "2024-12-01",
        transactionId: "txn_abc123",
    },
    {
        id: "2",
        userName: "Michael Roberts",
        userEmail: "michael@venture.com",
        plan: "enterprise",
        status: "active",
        amount: 199,
        currency: "USD",
        startDate: "2024-10-15",
        renewalDate: "2024-11-15",
        transactionId: "txn_def456",
    },
    {
        id: "3",
        userName: "Alex Kumar",
        userEmail: "alex@startup.io",
        plan: "free",
        status: "trial",
        amount: 0,
        currency: "USD",
        startDate: "2024-11-28",
        renewalDate: null,
        transactionId: null,
    },
];

export default function SubscriptionsPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const columns = [
        {
            key: "user",
            label: "User",
            render: (item: any) => (
                <div>
                    <div className="font-medium">{item.userName}</div>
                    <div className="text-xs text-muted-foreground">{item.userEmail}</div>
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

    // Calculate totals
    const totalMRR = mockSubscriptions
        .filter((sub) => sub.status === "active")
        .reduce((sum, sub) => sum + sub.amount, 0);

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
                    {["Active", "Trial", "Cancelled"].map((status, index) => (
                        <div
                            key={status}
                            className="p-6 rounded-lg border border-[var(--admin-neutral)]/30 bg-white dark:bg-card"
                        >
                            <p className="text-sm text-muted-foreground mb-2">{status}</p>
                            <p className="text-3xl font-bold">
                                {
                                    mockSubscriptions.filter(
                                        (sub) => sub.status.toLowerCase() === status.toLowerCase()
                                    ).length
                                }
                            </p>
                        </div>
                    ))}
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
                    <Select>
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
                    <Select>
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
                <EntityTable
                    columns={columns}
                    data={mockSubscriptions}
                    pagination={{
                        page,
                        pageSize: 10,
                        total: mockSubscriptions.length,
                        onPageChange: setPage,
                    }}
                />
            </div>
        </AdminLayout>
    );
}
