"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Shield, Database, Mail } from "lucide-react";

export default function SettingsPage() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <SectionHeader
                    title="Admin Settings"
                    description="Configure system-wide settings and preferences"
                />

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* General Settings */}
                    <Card className="border-[var(--admin-neutral)]/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--admin-soft)]/20 to-[var(--admin-highlight)]/20">
                                    <Settings className="h-5 w-5 text-[var(--admin-accent)]" />
                                </div>
                                <div>
                                    <CardTitle>General Settings</CardTitle>
                                    <CardDescription>Basic platform configuration</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="platform-name">Platform Name</Label>
                                <Input id="platform-name" defaultValue="LaunchAndLift" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="support-email">Support Email</Label>
                                <Input
                                    id="support-email"
                                    type="email"
                                    defaultValue="support@launchandlift.com"
                                />
                            </div>
                            <Button className="bg-gradient-to-r from-[var(--admin-mid)] to-[var(--admin-strong)] hover:from-[var(--admin-strong)] hover:to-[var(--admin-success)] text-gray-900">
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card className="border-[var(--admin-neutral)]/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--admin-soft)]/20 to-[var(--admin-highlight)]/20">
                                    <Bell className="h-5 w-5 text-[var(--admin-accent)]" />
                                </div>
                                <div>
                                    <CardTitle>Notifications</CardTitle>
                                    <CardDescription>Configure alert preferences</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Notification settings will be configured here
                            </p>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card className="border-[var(--admin-neutral)]/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--admin-soft)]/20 to-[var(--admin-highlight)]/20">
                                    <Shield className="h-5 w-5 text-[var(--admin-accent)]" />
                                </div>
                                <div>
                                    <CardTitle>Security</CardTitle>
                                    <CardDescription>Authentication & access control</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Security settings configuration panel
                            </p>
                        </CardContent>
                    </Card>

                    {/* Database Settings */}
                    <Card className="border-[var(--admin-neutral)]/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--admin-soft)]/20 to-[var(--admin-highlight)]/20">
                                    <Database className="h-5 w-5 text-[var(--admin-accent)]" />
                                </div>
                                <div>
                                    <CardTitle>Database</CardTitle>
                                    <CardDescription>Database maintenance & backups</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Database management tools and backup configuration
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
