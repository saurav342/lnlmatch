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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/lib/api";

export default function ActivityLogPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [targetTypeFilter, setTargetTypeFilter] = useState("all");

    const [activityLog, setActivityLog] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchActivityLog = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const headers: HeadersInit = {
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: "10",
                    action: actionFilter === "all" ? "" : actionFilter,
                    targetType: targetTypeFilter === "all" ? "" : targetTypeFilter,
                });

                const response = await fetch(`${API_BASE_URL}/admin/dashboard/activity-log?${queryParams}`, {
                    headers
                });

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setActivityLog(result.data);
                        setTotal(result.pagination.total);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch activity log:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivityLog();
    }, [page, actionFilter, targetTypeFilter]);

    const columns = [
        {
            key: "timestamp",
            label: "Timestamp",
            render: (item: any) => (
                <div className="font-mono text-sm text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                </div>
            ),
        },
        {
            key: "adminName",
            label: "Admin",
            render: (item: any) => <div className="font-medium">{item.adminId?.name || 'Unknown'}</div>,
        },
        {
            key: "action",
            label: "Action",
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[var(--admin-accent)]" />
                    <span className="font-medium capitalize">{item.action.replace(/_/g, ' ')}</span>
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
            key: "targetId",
            label: "Target ID",
            render: (item: any) => <span className="text-sm font-mono">{item.targetId || 'N/A'}</span>,
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
            render: (item: any) => <span className="font-mono text-xs">{item.ipAddress || 'N/A'}</span>,
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
                            disabled // Search not fully supported in backend yet
                        />
                    </div>
                    <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Action Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Actions</SelectItem>
                            <SelectItem value="create_investor">Create Investor</SelectItem>
                            <SelectItem value="update_investor">Update Investor</SelectItem>
                            <SelectItem value="delete_investor">Delete Investor</SelectItem>
                            <SelectItem value="view_users">View Users</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={targetTypeFilter} onValueChange={setTargetTypeFilter}>
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
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center p-8">Loading activity log...</div>
                ) : (
                    <EntityTable
                        columns={columns}
                        data={activityLog}
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
