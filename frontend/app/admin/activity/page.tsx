"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { EntityTable } from "@/components/admin/EntityTable";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Activity } from "lucide-react";
import { useState } from "react";

const mockActivityLog = [
    {
        id: "1",
        timestamp: "2024-12-02 09:45:23",
        adminName: "Admin User",
        action: "User Updated",
        targetType: "user",
        targetName: "Sarah Chen",
        status: "success",
        ipAddress: "192.168.1.1",
    },
    {
        id: "2",
        timestamp: "2024-12-02 09:30:15",
        adminName: "Admin User",
        action: "Subscription Cancelled",
        targetType: "subscription",
        targetName: "Pro Plan - John Doe",
        status: "success",
        ipAddress: "192.168.1.1",
    },
    {
        id: "3",
        timestamp: "2024-12-02 08:15:42",
        adminName: "Super Admin",
        action: "Investor Verified",
        targetType: "investor",
        targetName: "Michael Roberts",
        status: "success",
        ipAddress: "192.168.1.5",
    },
    {
        id: "4",
        timestamp: "2024-12-01 17:23:11",
        adminName: "Admin User",
        action: "Data Export",
        targetType: "system",
        targetName: "Users Export (CSV)",
        status: "success",
        ipAddress: "192.168.1.1",
    },
    {
        id: "5",
        timestamp: "2024-12-01 14:56:33",
        adminName: "Super Admin",
        action: "User Suspended",
        targetType: "user",
        targetName: "David Park",
        status: "failed",
        ipAddress: "192.168.1.5",
    },
];

export default function ActivityLogPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const columns = [
        {
            key: "timestamp",
            label: "Timestamp",
            render: (item: any) => (
                <div className="font-mono text-sm text-muted-foreground">{item.timestamp}</div>
            ),
        },
        {
            key: "adminName",
            label: "Admin",
            render: (item: any) => <div className="font-medium">{item.adminName}</div>,
        },
        {
            key: "action",
            label: "Action",
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[var(--admin-accent)]" />
                    <span className="font-medium">{item.action}</span>
                </div>
            ),
        },
        {
            key: "targetType",
            label: "Target Type",
            render: (item: any) => (
                <Badge variant="outline" className="capitalize bg-[var(--admin-soft)]/20">
                    {item.targetType}
                </Badge>
            ),
        },
        {
            key: "targetName",
            label: "Target",
            render: (item: any) => <span className="text-sm">{item.targetName}</span>,
        },
        {
            key: "status",
            label: "Status",
            render: (item: any) => (
                <Badge
                    variant={item.status === "success" ? "default" : "destructive"}
                    className={
                        item.status === "success"
                            ? "bg-[var(--admin-success)]/20 text-[var(--admin-success)] border-[var(--admin-success)]/30"
                            : ""
                    }
                >
                    {item.status}
                </Badge>
            ),
        },
        {
            key: "ipAddress",
            label: "IP Address",
            render: (item: any) => <span className="font-mono text-xs">{item.ipAddress}</span>,
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <SectionHeader
                    title="Activity Log"
                    description="Monitor all administrative actions and system events"
                />

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search activity log..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Action Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Actions</SelectItem>
                            <SelectItem value="create">Create</SelectItem>
                            <SelectItem value="update">Update</SelectItem>
                            <SelectItem value="delete">Delete</SelectItem>
                            <SelectItem value="export">Export</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Target Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="investor">Investor</SelectItem>
                            <SelectItem value="subscription">Subscription</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <EntityTable
                    columns={columns}
                    data={mockActivityLog}
                    pagination={{
                        page,
                        pageSize: 10,
                        total: mockActivityLog.length,
                        onPageChange: setPage,
                    }}
                />
            </div>
        </AdminLayout>
    );
}
