"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName?: string;
}

export function PaymentSuccessModal({
    isOpen,
    onClose,
    planName = "Premium",
}: PaymentSuccessModalProps) {
    const router = useRouter();

    const handleGoToDashboard = () => {
        onClose();
        router.push("/dashboard");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <DialogTitle className="text-center text-xl">Payment Successful!</DialogTitle>
                    <DialogDescription className="text-center">
                        Welcome to the {planName} plan. Your account has been upgraded successfully.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <h4 className="text-sm font-medium">What&apos;s next?</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                                <ArrowRight className="h-3 w-3 text-primary" />
                            </div>
                            <span>Complete your startup profile to get better matches</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                                <ArrowRight className="h-3 w-3 text-primary" />
                            </div>
                            <span>Browse our curated list of investors</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                                <ArrowRight className="h-3 w-3 text-primary" />
                            </div>
                            <span>Start connecting with potential backers</span>
                        </li>
                    </ul>
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button onClick={handleGoToDashboard} className="w-full sm:w-auto">
                        Go to Dashboard
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
