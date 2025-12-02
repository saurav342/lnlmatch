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
import { Search, Filter, Download, UserPlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock user data
const mockUsers = [
    {
        id: "1",
        name: "Sarah Chen",
        email: "sarah@example.com",
        userType: "founder",
        subscriptionPlan: "pro",
        accountStatus: "active",
        signupDate: "2024-11-15",
        lastLogin: "2 hours ago",
    },
    {
        id: "2",
        name: "Michael Roberts",
        email: "michael@venture.com",
        userType: "investor",
        subscriptionPlan: "enterprise",
        accountStatus: "active",
        signupDate: "2024-10-22",
        lastLogin: "1 day ago",
    },
    {
        id: "3",
        name: "Alex Kumar",
        email: "alex@startup.io",
        userType: "founder",
        subscriptionPlan: "free",
        accountStatus: "active",
        signupDate: "2024-11-28",
        lastLogin: "5 hours ago",
    },
    {
        id: "4",
        name: "Jennifer Lee",
        email: "jennifer@fund.com",
        userType: "investor",
        subscriptionPlan: "pro",
        accountStatus: "active",
        signupDate: "2024-09-14",
        lastLogin: "3 hours ago",
    },
    {
        id: "5",
        name: "David Park",
        email: "david@company.com",
        userType: "founder",
        subscriptionPlan: "free",
        accountStatus: "suspended",
        signupDate: "2024-11-01",
        lastLogin: "2 weeks ago",
    },
];

export default function UsersPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [userTypeFilter, setUserTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const columns = [
        {
            key: "name",
            label: "User",
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--admin-highlight)] to-[var(--admin-mid)] flex items-center justify-center text-sm font-semibold text-gray-900">
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
                <Badge
                    variant="outline"
                    className="capitalize bg-[var(--admin-soft)]/20 border-[var(--admin-mid)]/30"
                >
                    {item.userType}
                </Badge>
            ),
        },
        {
            key: "subscriptionPlan",
            label: "Plan",
            render: (item: any) => (
                <Badge
                    variant={item.subscriptionPlan === "free" ? "secondary" : "default"}
                    className={
                        item.subscriptionPlan !== "free"
                            ? "bg-gradient-to-r from-[var(--admin-mid)] to-[var(--admin-strong)] text-gray-900"
                            : ""
                    }
                >
                    {item.subscriptionPlan}
                </Badge>
            ),
        },
        {
            key: "accountStatus",
            label: "Status",
            render: (item: any) => (
                <Badge
                    variant={item.accountStatus === "active" ? "default" : "destructive"}
                    className={
                        item.accountStatus === "active"
                            ? "bg-[var(--admin-success)]/20 text-[var(--admin-success)] border-[var(--admin-success)]/30"
                            : ""
                    }
                >
                    {item.accountStatus}
                </Badge>
            ),
        },
        {
            key: "signupDate",
            label: "Signup Date",
            render: (item: any) => new Date(item.signupDate).toLocaleDateString(),
        },
        {
            key: "lastLogin",
            label: "Last Login",
        },
        {
            key: "actions",
            label: "Actions",
            render: (item: any) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/users/${item.id}`);
                        }}
                    >
                        View
                    </Button>
                    <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                        Edit
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <SectionHeader
                    title="User Management"
                    description="Manage all users, founders, and investors on the platform"
                    action={
                        <Button className="gap-2 bg-gradient-to-r from-[var(--admin-mid)] to-[var(--admin-strong)] hover:from-[var(--admin-strong)] hover:to-[var(--admin-success)] text-gray-900">
                            <UserPlus className="h-4 w-4" />
                            Add User
                        </Button>
                    }
                />

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="User Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="founder">Founders</SelectItem>
                            <SelectItem value="investor">Investors</SelectItem>
                            <SelectItem value="admin">Admins</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="deleted">Deleted</SelectItem>
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
                    data={mockUsers}
                    onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
                    pagination={{
                        page,
                        pageSize: 10,
                        total: mockUsers.length,
                        onPageChange: setPage,
                    }}
                />
            </div>
        </AdminLayout>
    );
}
