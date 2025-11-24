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
import { fetchAllUsers, exportUsers, updateUserStatus } from "@/lib/adminApi";
import { Search, Download, ChevronLeft, ChevronRight, CheckCircle, XCircle, Ban } from "lucide-react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        subscriptionPlan: "",
        subscriptionStatus: "",
        accountStatus: ""
    });

    useEffect(() => {
        loadUsers();
    }, [page, filters]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchAllUsers({
                page,
                limit: 20,
                search,
                ...filters
            });

            if (response.success) {
                setUsers(response.data);
                setTotalPages(response.pagination.pages);
            }
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        loadUsers();
    };

    const handleExport = async () => {
        try {
            await exportUsers();
        } catch (error) {
            console.error("Failed to export users:", error);
            alert("Failed to export users");
        }
    };

    const handleStatusChange = async (userId: string, newStatus: string) => {
        try {
            await updateUserStatus(userId, newStatus);
            loadUsers(); // Reload data
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update user status");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="h-3 w-3" /> Active</span>;
            case "suspended":
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><Ban className="h-3 w-3" /> Suspended</span>;
            case "deleted":
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"><XCircle className="h-3 w-3" /> Deleted</span>;
            default:
                return status;
        }
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
                        <h1 className="text-3xl font-bold">Users & Signups</h1>
                        <p className="text-muted-foreground">Manage all user accounts</p>
                    </div>
                    <Button onClick={handleExport} className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Users
                    </Button>
                </div>

                {/* Filters */}
                <Card className="p-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <Button onClick={handleSearch}>
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>

                        <Select
                            value={filters.subscriptionPlan}
                            onValueChange={(value) => setFilters({ ...filters, subscriptionPlan: value })}
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
                            value={filters.subscriptionStatus}
                            onValueChange={(value) => setFilters({ ...filters, subscriptionStatus: value })}
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

                        <Select
                            value={filters.accountStatus}
                            onValueChange={(value) => setFilters({ ...filters, accountStatus: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Account Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="deleted">Deleted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                {/* Users Table */}
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Account Status</TableHead>
                                <TableHead>Signup Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        Loading users...
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span className="capitalize">{user.subscriptionPlan}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="capitalize">{user.subscriptionStatus}</span>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(user.accountStatus)}</TableCell>
                                        <TableCell>
                                            {new Date(user.signupDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={user.accountStatus}
                                                onValueChange={(value) => handleStatusChange(user._id, value)}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Activate</SelectItem>
                                                    <SelectItem value="suspended">Suspend</SelectItem>
                                                    <SelectItem value="deleted">Delete</SelectItem>
                                                </SelectContent>
                                            </Select>
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
