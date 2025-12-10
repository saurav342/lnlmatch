"use client";

import { useState, useEffect } from "react";
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
            // Open window immediately to avoid popup blocker
            const authWindow = window.open('', '_blank');

            try {
                if (authWindow) {
                    authWindow.document.write('Loading Google Auth...');
                }

                // Call backend to get auth URL
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/auth/google`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.url && authWindow) {
                    authWindow.location.href = data.url;
                } else if (authWindow) {
                    authWindow.close();
                }
            } catch (error) {
                console.error('Failed to initiate Gmail auth:', error);
                if (authWindow) authWindow.close();
            }
            return;
        }

        // Mock connection for others
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/email/connect/${provider.toLowerCase()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
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
    // Check status on mount
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/email/status`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.connected) {
                    setConnectedProvider(data.provider === 'gmail' ? 'Gmail' : data.provider === 'outlook' ? 'Outlook' : 'SMTP');
                }
            } catch (error) {
                console.error('Failed to check status:', error);
            }
        };
        checkStatus();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Email Settings</h1>
                    <p className="text-muted-foreground">
                        Connect your email account to send communications from your own email address for <span className="text-orange-600 font-semibold">Capify</span>
                    </p>
                    <div className="mt-2">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Capify
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Connected Email Account Status - Shows when connected */}
                        {connectedProvider && (
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="p-6 bg-orange-600 rounded-t-lg text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <h3 className="font-semibold">Connected Email Account</h3>
                                        </div>
                                        <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none">
                                            <div className="mr-1 h-1.5 w-1.5 rounded-full bg-orange-400" />
                                            Active
                                        </Badge>
                                    </div>
                                    <p className="mt-2 text-orange-100 text-sm">
                                        Your emails will be sent from this account
                                    </p>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                                                <Mail className="h-6 w-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg">{connectedProvider}</h4>
                                                <p className="text-muted-foreground">starelectric.ev@gmail.com</p>
                                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3 text-orange-600" />
                                                        Connected: Dec 09, 2025
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 text-blue-600">
                                                        <Shield className="h-3 w-3" />
                                                        Verified: 1 second ago
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="h-8 text-orange-600 border-orange-200 hover:bg-orange-50">
                                                <Mail className="mr-2 h-3 w-3" />
                                                Test Email
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8 text-red-600 border-red-200 hover:bg-red-50">
                                                Disconnect
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* From Name Settings */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-zinc-100 p-1">
                                        <div className="rounded-full border-2 border-zinc-600 p-0.5">
                                            <div className="h-2 w-2 rounded-full bg-zinc-600" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg">From Name</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <input
                                            type="text"
                                            defaultValue="GG"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            This name will appear as the sender when you send emails to investors.
                                        </p>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button className="bg-orange-600 hover:bg-orange-700">
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Update Name
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* How It Works (Moved to Sidebar in screenshot, but keeping existing structure if user wants, 
                            actually screenshot shows it on the right sidebar. I should move it to the right sidebar 
                            to match screenshot exactly if I can, but the plan didn't explicitly say move it. 
                            However, the screenshot has 'How It Works' on the right. 
                            I will focus on the main content first.) 
                        */}

                        {!connectedProvider && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full bg-orange-100 p-1">
                                            <div className="rounded-full border-2 border-orange-600 p-0.5">
                                                <div className="h-2 w-2 rounded-full bg-orange-600" />
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
                                        <div className="flex flex-col items-center justify-between rounded-xl border p-6 text-center hover:border-orange-500 hover:shadow-md transition-all">
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                                                <Mail className="h-8 w-8 text-orange-600" />
                                            </div>
                                            <h3 className="font-semibold">Gmail</h3>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Connect your Gmail account using secure OAuth 2.0 authentication.
                                            </p>
                                            <div className="mt-4 w-full space-y-2">
                                                <Badge variant="secondary" className="bg-orange-100 text-orange-800 w-full justify-center">
                                                    <span className="mr-1">★</span> Most Popular
                                                </Badge>
                                                <Button
                                                    className="w-full bg-orange-600 hover:bg-orange-700"
                                                    onClick={() => handleConnect('Gmail')}
                                                >
                                                    Connect Gmail
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
                                                    className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                                                    onClick={() => handleConnect('Outlook')}
                                                >
                                                    Connect Outlook
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
                        )}

                        {connectedProvider && (
                            <Alert className="bg-orange-50 border-orange-200">
                                <CheckCircle2 className="h-4 w-4 text-orange-600" />
                                <AlertTitle className="text-orange-800">Gmail account connected successfully!</AlertTitle>
                            </Alert>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-orange-600 text-white border-none">
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
                                        <p className="text-sm text-orange-100">
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
                                        <p className="text-sm text-orange-100">
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
                                        <p className="text-sm text-orange-100">
                                            All emails will be sent from your connected account.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-800 text-white border-none">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Shield className="h-5 w-5" />
                                    Security & Privacy
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <Lock className="h-5 w-5 shrink-0 text-orange-200" />
                                    <div>
                                        <h4 className="text-sm font-semibold">End-to-End Encryption</h4>
                                        <p className="text-xs text-orange-200">
                                            All credentials encrypted using industry standards
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Shield className="h-5 w-5 shrink-0 text-orange-200" />
                                    <div>
                                        <h4 className="text-sm font-semibold">OAuth 2.0 Authentication</h4>
                                        <p className="text-xs text-orange-200">
                                            Secure authorization without password sharing
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
