"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreHorizontal, ArrowUpRight } from "lucide-react";

import { useEffect, useState } from "react";
import { fetchCampaigns } from "@/lib/api";

// ... imports ...

export default function TrackingPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadCampaigns() {
            try {
                const data = await fetchCampaigns();
                setCampaigns(data);
                setFilteredCampaigns(data);
            } catch (error) {
                console.error("Failed to load campaigns", error);
            } finally {
                setLoading(false);
            }
        }
        loadCampaigns();
    }, []);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = campaigns.filter(campaign =>
            campaign.investor.toLowerCase().includes(lowerQuery) ||
            campaign.subject.toLowerCase().includes(lowerQuery) ||
            campaign.contact.toLowerCase().includes(lowerQuery)
        );
        setFilteredCampaigns(filtered);
    }, [searchQuery, campaigns]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <p>Loading campaigns...</p>
                </div>
            </DashboardLayout>
        );
    }
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Email Tracking</h1>
                    <p className="text-muted-foreground">
                        Monitor the performance of your outreach campaigns
                    </p>
                </div>

                <Card className="p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="relative flex-1 md:max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search campaigns..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <Button variant="outline" className="gap-2">
                                Export
                                <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Investor</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sent</TableHead>
                                    <TableHead>Opened</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCampaigns.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No campaigns found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCampaigns.map((campaign) => (
                                        <TableRow key={campaign.id}>
                                            <TableCell className="font-medium">
                                                {campaign.investor}
                                            </TableCell>
                                            <TableCell>{campaign.contact}</TableCell>
                                            <TableCell>{campaign.subject}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        campaign.status === "Replied"
                                                            ? "default"
                                                            : campaign.status === "Opened"
                                                                ? "secondary"
                                                                : campaign.status === "Bounced"
                                                                    ? "destructive"
                                                                    : "outline"
                                                    }
                                                    className={
                                                        campaign.status === "Replied"
                                                            ? "bg-green-500 hover:bg-green-600"
                                                            : campaign.status === "Opened"
                                                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                                                : ""
                                                    }
                                                >
                                                    {campaign.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{campaign.sentAt}</TableCell>
                                            <TableCell>
                                                {campaign.openedAt || "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
