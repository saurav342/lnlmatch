"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { Check, CreditCard } from "lucide-react";

export default function SubscriptionPage() {
    const currentPlan = "Free";

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-5xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Subscription Plans</h1>
                    <p className="text-muted-foreground">Choose the plan that&apos;s right for you</p>
                </div>

                {/* Current Plan */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-primary/10 p-3">
                                <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Current Plan</h3>
                                <p className="text-sm text-muted-foreground">
                                    You are currently on the {currentPlan} plan
                                </p>
                            </div>
                        </div>
                        <Button variant="outline">Manage Subscription</Button>
                    </div>
                </Card>

                {/* Pricing Grid */}
                <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                    {SUBSCRIPTION_PLANS.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`p-6 ${plan.isPopular ? "ring-2 ring-primary" : ""
                                }`}
                        >
                            {plan.isPopular && (
                                <Badge className="mb-4">Most Popular</Badge>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold">{plan.name}</h3>
                                    <div className="mt-2">
                                        <span className="text-4xl font-bold">
                                            ₹{plan.price}
                                        </span>
                                        <span className="text-muted-foreground">/month</span>
                                    </div>
                                </div>

                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 shrink-0 text-primary" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className="w-full"
                                    variant={
                                        plan.name === currentPlan
                                            ? "secondary"
                                            : plan.isPopular
                                                ? "default"
                                                : "outline"
                                    }
                                    disabled={plan.name === currentPlan}
                                >
                                    {plan.name === currentPlan
                                        ? "Current Plan"
                                        : "Upgrade"}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Invoice History */}
                <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">Invoice History</h3>
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <p>No invoices yet</p>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
