"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Mail,
    Building2,
    Calendar,
    Activity,
    CreditCard,
    FileText,
    History,
    Edit,
    Ban,
    UserCheck,
} from "lucide-react";
import { useParams } from "next/navigation";

// Mock user data
const mockUser = {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    userType: "founder",
    subscriptionPlan: "pro",
    accountStatus: "active",
    signupDate: "2024-11-15",
    lastLogin: "2 hours ago",
    profileCompletion: 85,
    metadata: {
        company: "TechStart Inc.",
        location: "San Francisco, CA",
        phone: "+1 (555) 123-4567",
    },
};

const activityTimeline = [
    { type: "login", description: "Logged in from San Francisco, CA", timestamp: "2 hours ago" },
    { type: "profile", description: "Updated startup profile", timestamp: "1 day ago" },
    { type: "subscription", description: "Upgraded to Pro plan", timestamp: "3 days ago" },
    { type: "login", description: "Logged in from San Francisco, CA", timestamp: "5 days ago" },
];

export default function UserDetailPage() {
    const params = useParams();

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Action Bar */}
                <div className="flex items-center justify-between sticky top-0 z-10 bg-[var(--admin-bg-light)] dark:bg-background py-4 -mt-6 px-8 -mx-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src="https://avatar.vercel.sh/sarah.png" />
                            <AvatarFallback className="bg-gradient-to-br from-[var(--admin-highlight)] to-[var(--admin-mid)] text-gray-900 text-xl font-bold">
                                SC
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                            <p className="text-muted-foreground">{mockUser.email}</p>
                        </div>
                        <Badge
                            variant="default"
                            className="bg-[var(--admin-success)]/20 text-[var(--admin-success)] border-[var(--admin-success)]/30"
                        >
                            {mockUser.accountStatus}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <UserCheck className="h-4 w-4" />
                            Impersonate
                        </Button>
                        <Button variant="destructive" className="gap-2">
                            <Ban className="h-4 w-4" />
                            Suspend
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left: User Info */}
                    <Card className="border-[var(--admin-neutral)]/30">
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Email</p>
                                    <p className="font-medium">{mockUser.email}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3 text-sm">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Company</p>
                                    <p className="font-medium">{mockUser.metadata.company}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Signup Date</p>
                                    <p className="font-medium">
                                        {new Date(mockUser.signupDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3 text-sm">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Last Login</p>
                                    <p className="font-medium">{mockUser.lastLogin}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Profile Completion
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[var(--admin-mid)] to-[var(--admin-success)]"
                                            style={{ width: `${mockUser.profileCompletion}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium">
                                        {mockUser.profileCompletion}%
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Tabs */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="activity">Activity</TabsTrigger>
                                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                                <TabsTrigger value="notes">Notes</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6">
                                <Card className="border-[var(--admin-neutral)]/30">
                                    <CardHeader>
                                        <CardTitle>Account Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--admin-soft)]/10 to-[var(--admin-highlight)]/10 border border-[var(--admin-mid)]/20">
                                                <p className="text-sm text-muted-foreground">
                                                    User Type
                                                </p>
                                                <p className="text-2xl font-bold capitalize mt-1">
                                                    {mockUser.userType}
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--admin-soft)]/10 to-[var(--admin-highlight)]/10 border border-[var(--admin-mid)]/20">
                                                <p className="text-sm text-muted-foreground">
                                                    Subscription
                                                </p>
                                                <p className="text-2xl font-bold capitalize mt-1">
                                                    {mockUser.subscriptionPlan}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="activity" className="mt-6">
                                <Card className="border-[var(--admin-neutral)]/30">
                                    <CardHeader>
                                        <CardTitle>Activity Timeline</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {activityTimeline.map((activity, index) => (
                                                <div key={index} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="h-8 w-8 rounded-full bg-[var(--admin-soft)]/30 border-2 border-[var(--admin-mid)] flex items-center justify-center">
                                                            <History className="h-4 w-4 text-[var(--admin-accent)]" />
                                                        </div>
                                                        {index < activityTimeline.length - 1 && (
                                                            <div className="w-0.5 flex-1 bg-[var(--admin-neutral)]/30 my-1" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-4">
                                                        <p className="font-medium">
                                                            {activity.description}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {activity.timestamp}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="subscription" className="mt-6">
                                <Card className="border-[var(--admin-neutral)]/30">
                                    <CardHeader>
                                        <CardTitle>Subscription Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-[var(--admin-soft)]/10 to-[var(--admin-highlight)]/10 border border-[var(--admin-mid)]/20">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Current Plan
                                                    </p>
                                                    <p className="text-xl font-bold capitalize">
                                                        {mockUser.subscriptionPlan}
                                                    </p>
                                                </div>
                                                <CreditCard className="h-8 w-8 text-[var(--admin-accent)]" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Subscription billing history and payment details
                                                would appear here.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notes" className="mt-6">
                                <Card className="border-[var(--admin-neutral)]/30">
                                    <CardHeader>
                                        <CardTitle>Admin Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            No notes have been added for this user yet.
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
