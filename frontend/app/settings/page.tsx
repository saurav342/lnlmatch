"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                <Tabs defaultValue="profile" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="billing">Billing</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your personal and startup information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="https://avatar.vercel.sh/user.png" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">Change Avatar</Button>
                                </div>
                                <Separator />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" defaultValue="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" defaultValue="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" defaultValue="john@startup.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell us about yourself"
                                        className="min-h-[100px]"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>
                                    Choose what you want to be notified about
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="new-matches" className="flex flex-col space-y-1">
                                        <span>New Matches</span>
                                        <span className="font-normal text-muted-foreground">
                                            Receive emails when new investors match your profile
                                        </span>
                                    </Label>
                                    <Switch id="new-matches" defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                        <span>Marketing Emails</span>
                                        <span className="font-normal text-muted-foreground">
                                            Receive emails about new features and promotions
                                        </span>
                                    </Label>
                                    <Switch id="marketing" />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="security" className="flex flex-col space-y-1">
                                        <span>Security Alerts</span>
                                        <span className="font-normal text-muted-foreground">
                                            Receive emails about your account security
                                        </span>
                                    </Label>
                                    <Switch id="security" defaultChecked />
                                </div>
                                <div className="flex justify-end">
                                    <Button>Save Preferences</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="billing" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing Information</CardTitle>
                                <CardDescription>
                                    Manage your subscription and payment method
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Pro Plan</p>
                                            <p className="text-sm text-muted-foreground">
                                                $49/month • Renews on April 1, 2024
                                            </p>
                                        </div>
                                        <Button variant="outline">Manage Subscription</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Method</Label>
                                    <div className="flex items-center gap-4 rounded-lg border p-4">
                                        <div className="h-8 w-12 rounded bg-slate-200 dark:bg-slate-700" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Visa ending in 4242</p>
                                            <p className="text-xs text-muted-foreground">Expires 12/25</p>
                                        </div>
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
