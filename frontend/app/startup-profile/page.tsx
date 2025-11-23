"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { OverviewTab } from "@/components/startup-profile/overview-tab";
import { DetailsTab } from "@/components/startup-profile/details-tab";
import { MediaTab } from "@/components/startup-profile/media-tab";
import { TeamTab } from "@/components/startup-profile/team-tab";
import { Building2, FileText, Upload, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/lib/api";

export default function StartupProfilePage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await fetchUserProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    // Mock profile completion - in a real app, calculate based on filled fields
    const profileCompletion = profile?.profileCompletion || 0;

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <p>Loading profile...</p>
                </div>
            </DashboardLayout>
        );
    }

    const tabs = [
        { id: "overview", label: "Overview", icon: Building2 },
        { id: "details", label: "Details", icon: FileText },
        { id: "media", label: "Media", icon: Upload },
        { id: "team", label: "Team", icon: Users },
    ];

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header with Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Startup Profile</h1>
                        <div className="text-sm text-muted-foreground">
                            {profileCompletion}% Complete
                        </div>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                </div>

                {/* Tabbed Interface */}
                <Card className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="flex items-center gap-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <OverviewTab />
                        </TabsContent>

                        <TabsContent value="details" className="space-y-4">
                            <DetailsTab />
                        </TabsContent>

                        <TabsContent value="media" className="space-y-4">
                            <MediaTab />
                        </TabsContent>

                        <TabsContent value="team" className="space-y-4">
                            <TeamTab />
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </DashboardLayout>
    );
}
