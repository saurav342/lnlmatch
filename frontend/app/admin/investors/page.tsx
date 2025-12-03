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
import { Search, Building2, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/lib/api";
import { ExcelUploadModal } from "@/components/admin/ExcelUploadModal";
import { InvestorModal } from "@/components/admin/InvestorModal";

export default function InvestorsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [verificationFilter, setVerificationFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
    const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleView = (investor: any) => {
        setSelectedInvestor(investor);
        setModalMode("view");
        setIsModalOpen(true);
    };

    const handleEdit = (investor: any) => {
        setSelectedInvestor(investor);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedInvestor(null);
        setModalMode("create");
        setIsModalOpen(true);
    };

    const handleSave = async (data: any) => {
        try {
            const token = localStorage.getItem('authToken');
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            let url = `${API_BASE_URL}/admin/investors`;
            let method = 'POST';

            if (modalMode === 'edit' && selectedInvestor) {
                url = `${API_BASE_URL}/admin/investors/${selectedInvestor._id}`;
                method = 'PATCH';
            }

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to save investor');
            }

            handleRefresh();
        } catch (error) {
            console.error("Error saving investor:", error);
            // Ideally show a toast notification here
        }
    };

    useEffect(() => {
        const fetchInvestors = async () => {
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
                    search: searchQuery,
                    isVerified: verificationFilter === "all" ? "" : verificationFilter === "verified" ? "true" : "false",
                    isActive: statusFilter === "all" ? "" : statusFilter === "active" ? "true" : "false",
                });

                const response = await fetch(`${API_BASE_URL}/admin/investors?${queryParams}`, {
                    headers
                });

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setInvestors(result.data);
                        setTotal(result.pagination.total);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch investors:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchInvestors();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [page, searchQuery, verificationFilter, statusFilter, refreshKey]);

    const columns = [
        {
            key: "name",
            label: "Investor",
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--admin-highlight)] to-[var(--admin-mid)] flex items-center justify-center text-sm font-semibold text-gray-900">
                        {item.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                    </div>
                    <div>
                        <div className="font-medium flex items-center gap-2">
                            {item.name}
                            {item.isVerified && (
                                <Badge
                                    variant="outline"
                                    className="bg-[var(--admin-success)]/20 text-[var(--admin-success)] border-[var(--admin-success)]/30 text-xs"
                                >
                                    Verified
                                </Badge>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {item.company}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "location",
            label: "Location",
        },
        {
            key: "ticketSize",
            label: "Ticket Size",
            render: (item: any) => {
                const size = item.ticketSize;
                if (typeof size === 'object' && size !== null) {
                    return <span className="font-mono text-sm">${size.min?.toLocaleString()} - ${size.max?.toLocaleString()}</span>;
                }
                return <span className="font-mono text-sm">{size}</span>;
            },
        },
        {
            key: "industries",
            label: "Industries",
            render: (item: any) => (
                <div className="flex gap-1 flex-wrap">
                    {item.industries.slice(0, 2).map((industry: string) => (
                        <Badge
                            key={industry}
                            variant="secondary"
                            className="text-xs bg-[var(--admin-soft)]/20"
                        >
                            {industry}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            key: "isActive",
            label: "Status",
            render: (item: any) => (
                <Badge
                    variant={item.isActive ? "default" : "secondary"}
                    className={
                        item.isActive
                            ? "bg-[var(--admin-success)]/20 text-[var(--admin-success)] border-[var(--admin-success)]/30"
                            : ""
                    }
                >
                    {item.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            key: "createdAt",
            label: "Added",
            render: (item: any) => new Date(item.createdAt).toLocaleDateString(),
        },
        {
            key: "actions",
            label: "Actions",
            render: (item: any) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleView(item); }}>
                        View
                    </Button>
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEdit(item); }}>
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
                    title="Investor Management"
                    description="Manage all investors and their profiles"
                    action={
                        <Button
                            onClick={handleCreate}
                            className="gap-2 bg-gradient-to-r from-[var(--admin-mid)] to-[var(--admin-strong)] hover:from-[var(--admin-strong)] hover:to-[var(--admin-success)] text-gray-900"
                        >
                            <Building2 className="h-4 w-4" />
                            Add Investor
                        </Button>
                    }
                />

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search investors by name or company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Verification" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="unverified">Unverified</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                        <ExcelUploadModal onSuccess={handleRefresh} />
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center p-8">Loading investors...</div>
                ) : (
                    <EntityTable
                        columns={columns}
                        data={investors}
                        pagination={{
                            page,
                            pageSize: 10,
                            total: total,
                            onPageChange: setPage,
                        }}
                    />
                )}
            </div>

            <InvestorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                investor={selectedInvestor}
                onSave={handleSave}
            />
        </AdminLayout>
    );
}
