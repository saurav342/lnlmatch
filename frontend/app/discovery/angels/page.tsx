"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
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
import { useState } from "react";

// Mock data
const investors = [
    {
        id: "1",
        name: "Sarah Chen",
        company: "Accel Partners",
        location: "San Francisco, CA",
        ticketSize: "$500K - $2M",
        industries: ["AI/ML", "SaaS"],
        avatar: "https://avatar.vercel.sh/sarah",
        isWishlisted: false,
    },
    {
        id: "2",
        name: "Michael Roberts",
        company: "Sequoia Capital",
        location: "Menlo Park, CA",
        ticketSize: "$1M - $5M",
        industries: ["Fintech", "Enterprise"],
        avatar: "https://avatar.vercel.sh/michael",
        isWishlisted: true,
    },
    {
        id: "3",
        name: "Alex Kumar",
        company: "Independent Angel",
        location: "New York, NY",
        ticketSize: "$100K - $500K",
        industries: ["E-commerce", "Consumer"],
        avatar: "https://avatar.vercel.sh/alex",
        isWishlisted: false,
    },
    {
        id: "4",
        name: "Jennifer Lee",
        company: "Andreessen Horowitz",
        location: "San Francisco, CA",
        ticketSize: "$2M - $10M",
        industries: ["AI/ML", "Healthcare"],
        avatar: "https://avatar.vercel.sh/jennifer",
        isWishlisted: false,
    },
];

export default function AngelsPage() {
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Angel Investors</h1>
                    <p className="text-muted-foreground">
                        Browse and connect with angel investors
                    </p>
                </div>

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
                                                                .map((n) => n[0])
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
                                            <TableCell>{investor.ticketSize}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {investor.industries.map((industry) => (
                                                        <Badge key={industry} variant="secondary" className="text-xs">
                                                            {industry}
                                                        </Badge>
                                                    ))}
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
                                                        <DropdownMenuItem>
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
        </DashboardLayout>
    );
}
