"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { Check, CreditCard, Loader2 } from "lucide-react";
import Script from "next/script";
import { useState } from "react";
import { PaymentSuccessModal } from "@/components/payment-success-modal";

export default function SubscriptionPage() {
    const currentPlan = "Free";
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successPlanName, setSuccessPlanName] = useState("");

    const handlePayment = async (plan: any) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Please login to upgrade');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: plan.price,
                    currency: 'INR'
                })
            });

            const order = await res.json();

            if (!order.id) {
                throw new Error('Order creation failed');
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RelY3H33Nz1lCf',
                amount: order.amount,
                currency: order.currency,
                name: "Capify",
                description: `Subscription to ${plan.name} Plan`,
                order_id: order.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/payment/verify-payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan: plan.name,
                            amount: plan.price
                        })
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        setSuccessPlanName(plan.name);
                        setShowSuccessModal(true);
                    } else {
                        alert('Payment verification failed');
                    }
                },
                theme: {
                    color: "#10B981"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed');
        } finally {
            setLoading(false);
        }
    };

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
                                    disabled={plan.name === currentPlan || loading}
                                    onClick={() => plan.name !== currentPlan && handlePayment(plan)}
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
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
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <PaymentSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                planName={successPlanName}
            />
        </DashboardLayout>
    );
}
