"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MoreVertical, Heart, Mail, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchInvestors, API_BASE_URL } from "@/lib/api";

export function AngelInvestorsTab() {
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadInvestors() {
            try {
                const data = await fetchInvestors();
                // Filter for Angel investors
                const angelInvestors = data.filter((inv: any) => inv.type === 'Angel');
                setInvestors(angelInvestors);
            } catch (error) {
                console.error("Failed to load investors", error);
            } finally {
                setLoading(false);
            }
        }
        loadInvestors();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <p>Loading investors...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* Filters Sidebar */}
                <Card className="h-fit p-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold">Filters</h3>

                        <Accordion type="multiple" className="w-full">
                            <AccordionItem value="industry">
                                <AccordionTrigger className="text-sm">
                                    Industry
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3">
                                        {["AI/ML", "SaaS", "Fintech", "Healthcare", "E-commerce"].map(
                                            (industry) => (
                                                <div
                                                    key={industry}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox id={industry} />
                                                    <label
                                                        htmlFor={industry}
                                                        className="text-sm font-normal"
                                                    >
                                                        {industry}
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="location">
                                <AccordionTrigger className="text-sm">
                                    Location
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3">
                                        {["San Francisco", "New York", "Los Angeles", "Boston"].map(
                                            (location) => (
                                                <div
                                                    key={location}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox id={location} />
                                                    <label
                                                        htmlFor={location}
                                                        className="text-sm font-normal"
                                                    >
                                                        {location}
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="ticket">
                                <AccordionTrigger className="text-sm">
                                    Ticket Size
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3">
                                        {["< $100K", "$100K - $500K", "$500K - $2M", "> $2M"].map(
                                            (size) => (
                                                <div key={size} className="flex items-center space-x-2">
                                                    <Checkbox id={size} />
                                                    <label htmlFor={size} className="text-sm font-normal">
                                                        {size}
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <Button variant="outline" className="w-full" size="sm">
                            Clear Filters
                        </Button>
                    </div>
                </Card>

                {/* Results Table */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search investors..."
                                className="pl-9"
                            />
                        </div>
                        <Badge variant="secondary">{investors.length} Results</Badge>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Investor</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Ticket Size</TableHead>
                                    <TableHead>Industries</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {investors.map((investor) => (
                                    <TableRow key={investor.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={investor.avatar} />
                                                    <AvatarFallback>
                                                        {investor.name
                                                            .split(" ")
                                                            .map((n: string) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{investor.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{investor.company}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {investor.location}
                                        </TableCell>
                                        <TableCell>
                                            {investor.ticketSize && (investor.ticketSize.min || investor.ticketSize.max)
                                                ? `$${investor.ticketSize.min || 0}K - $${investor.ticketSize.max || 0}K`
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {investor.industries && investor.industries.length > 0 ? (
                                                    investor.industries.map((industry: string) => (
                                                        <Badge key={industry} variant="secondary" className="text-xs">
                                                            {industry}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">N/A</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Heart className="mr-2 h-4 w-4" />
                                                        {investor.isWishlisted
                                                            ? "Remove from wishlist"
                                                            : "Add to wishlist"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={async () => {
                                                            if (!investor.email) {
                                                                alert("No email address available for this investor");
                                                                return;
                                                            }

                                                            try {
                                                                // Check if connected
                                                                const statusRes = await fetch(`${API_BASE_URL}/email/status`);
                                                                const status = await statusRes.json();

                                                                if (!status.connected) {
                                                                    if (confirm("You need to connect your email account first. Go to settings?")) {
                                                                        window.location.href = "/email-settings";
                                                                    }
                                                                    return;
                                                                }

                                                                // Send email
                                                                const sendRes = await fetch(`${API_BASE_URL}/email/send`, {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({
                                                                        to: investor.email,
                                                                        subject: `Intro to ${investor.company}`,
                                                                        body: `Hi ${investor.name},\n\nI would like to connect regarding...`
                                                                    })
                                                                });

                                                                const sendData = await sendRes.json();
                                                                if (sendData.success) {
                                                                    alert("Email sent successfully!");
                                                                } else {
                                                                    alert("Failed to send email: " + sendData.message);
                                                                }
                                                            } catch (error) {
                                                                console.error("Error sending email:", error);
                                                                alert("An error occurred while sending the email.");
                                                            }
                                                        }}
                                                    >
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Send email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        View profile
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </div>
    );
}
