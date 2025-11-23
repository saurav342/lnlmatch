"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Info, Lock, Mail, Shield, Server, Settings } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function EmailSettingsPage() {
    const [connectedProvider, setConnectedProvider] = useState<string | null>(null);

    const handleConnect = async (provider: string) => {
        if (provider === 'Gmail') {
            try {
                // Call backend to get auth URL
                const response = await fetch(`${API_BASE_URL}/auth/google`);
                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                }
            } catch (error) {
                console.error('Failed to initiate Gmail auth:', error);
            }
            return;
        }

        // Mock connection for others
        try {
            const response = await fetch(`/api/email/connect/${provider.toLowerCase()}`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.success) {
                setConnectedProvider(provider);
            }
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    // Check status on mount
    useState(() => {
        const checkStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/email/status`);
                const data = await response.json();
                if (data.connected && data.provider === 'Gmail') {
                    setConnectedProvider('Gmail');
                }
            } catch (error) {
                console.error('Failed to check status:', error);
            }
        };
        checkStatus();
    });

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Email Settings</h1>
                    <p className="text-muted-foreground">
                        Connect your email account to send communications from your own email address for <span className="text-emerald-600 font-semibold">Convi</span>
                    </p>
                    <div className="mt-2">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Convi
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-emerald-100 p-1">
                                        <div className="rounded-full border-2 border-emerald-600 p-0.5">
                                            <div className="h-2 w-2 rounded-full bg-emerald-600" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg">Connect Email Account</CardTitle>
                                </div>
                                <CardDescription>
                                    Choose your preferred email service provider
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {/* Gmail */}
                                    <div className="flex flex-col items-center justify-between rounded-xl border p-6 text-center hover:border-emerald-500 hover:shadow-md transition-all">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                                            <Mail className="h-8 w-8 text-orange-600" />
                                        </div>
                                        <h3 className="font-semibold">Gmail</h3>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Connect your Gmail account using secure OAuth 2.0 authentication.
                                        </p>
                                        <div className="mt-4 w-full space-y-2">
                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 w-full justify-center">
                                                <span className="mr-1">★</span> Most Popular
                                            </Badge>
                                            <Button
                                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                                onClick={() => handleConnect('Gmail')}
                                                disabled={connectedProvider === 'Gmail'}
                                            >
                                                {connectedProvider === 'Gmail' ? 'Connected' : 'Connect Gmail'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Outlook */}
                                    <div className="flex flex-col items-center justify-between rounded-xl border p-6 text-center hover:border-blue-500 hover:shadow-md transition-all">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                            <Mail className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold">Outlook</h3>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Connect your Outlook or Microsoft 365 account securely.
                                        </p>
                                        <div className="mt-4 w-full space-y-2">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 w-full justify-center">
                                                Business Ready
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                                                onClick={() => handleConnect('Outlook')}
                                                disabled={connectedProvider === 'Outlook'}
                                            >
                                                {connectedProvider === 'Outlook' ? 'Connected' : 'Connect Outlook'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Custom SMTP */}
                                    <div className="flex flex-col items-center justify-between rounded-xl border p-6 text-center hover:border-slate-500 hover:shadow-md transition-all">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                            <Settings className="h-8 w-8 text-slate-600" />
                                        </div>
                                        <h3 className="font-semibold">Custom SMTP</h3>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Configure your own SMTP server for any email provider.
                                        </p>
                                        <div className="mt-4 w-full space-y-2">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-800 w-full justify-center">
                                                Advanced
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => handleConnect('SMTP')}
                                            >
                                                Configure SMTP
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Alert className="bg-blue-50 border-blue-200">
                            <Info className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-800">Why connect your email?</AlertTitle>
                            <AlertDescription className="text-blue-700 text-sm">
                                When you send emails to investors, they'll come from your connected email address, building trust and ensuring better deliverability. Each startup profile can have its own email settings.
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-emerald-600 text-white border-none">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Info className="h-5 w-5" />
                                    How It Works
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Choose Provider</h4>
                                        <p className="text-sm text-emerald-100">
                                            Select Gmail, Outlook, or configure custom SMTP settings.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Authorize Access</h4>
                                        <p className="text-sm text-emerald-100">
                                            Grant permission to send emails on your behalf securely.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Start Sending</h4>
                                        <p className="text-sm text-emerald-100">
                                            All emails will be sent from your connected account.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-emerald-700 text-white border-none">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Shield className="h-5 w-5" />
                                    Security & Privacy
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <Lock className="h-5 w-5 shrink-0 text-emerald-200" />
                                    <div>
                                        <h4 className="text-sm font-semibold">End-to-End Encryption</h4>
                                        <p className="text-xs text-emerald-200">
                                            All credentials encrypted using industry standards
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Shield className="h-5 w-5 shrink-0 text-emerald-200" />
                                    <div>
                                        <h4 className="text-sm font-semibold">OAuth 2.0 Authentication</h4>
                                        <p className="text-xs text-emerald-200">
                                            Secure authorization without password sharing
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Server className="h-5 w-5 shrink-0 text-emerald-200" />
                                    <div>
                                        <h4 className="text-sm font-semibold">Full Control</h4>
                                        <p className="text-xs text-emerald-200">
                                            Disconnect anytime and revoke access instantly
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
