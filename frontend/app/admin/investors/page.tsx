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
import { useState } from "react";

const mockInvestors = [
    {
        id: "1",
        name: "Michael Roberts",
        company: "Sequoia Capital",
        location: "Menlo Park, CA",
        ticketSize: "$1M - $5M",
        industries: ["Fintech", "Enterprise"],
        isVerified: true,
        isActive: true,
        createdDate: "2024-10-22",
    },
    {
        id: "2",
        name: "Jennifer Lee",
        company: "Andreessen Horowitz",
        location: "San Francisco, CA",
        ticketSize: "$2M - $10M",
        industries: ["AI/ML", "Healthcare"],
        isVerified: true,
        isActive: true,
        createdDate: "2024-09-14",
    },
    {
        id: "3",
        name: "Alex Kumar",
        company: "Independent Angel",
        location: "New York, NY",
        ticketSize: "$100K - $500K",
        industries: ["E-commerce", "Consumer"],
        isVerified: false,
        isActive: true,
        createdDate: "2024-11-05",
    },
];

export default function InvestorsPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

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
            render: (item: any) => (
                <span className="font-mono text-sm">{item.ticketSize}</span>
            ),
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
            key: "createdDate",
            label: "Added",
            render: (item: any) => new Date(item.createdDate).toLocaleDateString(),
        },
        {
            key: "actions",
            label: "Actions",
            render: (item: any) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
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
                    title="Investor Management"
                    description="Manage all investors and their profiles"
                    action={
                        <Button className="gap-2 bg-gradient-to-r from-[var(--admin-mid)] to-[var(--admin-strong)] hover:from-[var(--admin-strong)] hover:to-[var(--admin-success)] text-gray-900">
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
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Verification" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="unverified">Unverified</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
                    data={mockInvestors}
                    pagination={{
                        page,
                        pageSize: 10,
                        total: mockInvestors.length,
                        onPageChange: setPage,
                    }}
                />
            </div>
        </AdminLayout>
    );
}
