"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CRMInboxPage() {
    // Empty state for demo
    const hasEmails = false;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">CRM Inbox</h1>
                    <p className="text-muted-foreground">
                        Manage your investor outreach campaigns
                    </p>
                </div>

                {hasEmails ? (
                    <Card className="p-6">
                        <p>Email list would show here...</p>
                    </Card>
                ) : (
                    <Card className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Mail className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">
                            No outreach campaigns active yet
                        </h3>
                        <p className="mb-6 max-w-md text-muted-foreground">
                            Start connecting with investors to see your conversations here.
                            Browse our database to find the perfect match for your startup.
                        </p>
                        <div className="flex gap-3">
                            <Link href="/discovery/angels">
                                <Button className="gap-2">
                                    Browse Investors
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/matchmaking">
                                <Button variant="outline" className="gap-2">
                                    Find Matches
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
