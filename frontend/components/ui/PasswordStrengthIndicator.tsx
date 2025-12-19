"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
    password: string;
}

interface Requirement {
    label: string;
    regex: RegExp;
}

const requirements: Requirement[] = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "Contains uppercase letter", regex: /[A-Z]/ },
    { label: "Contains lowercase letter", regex: /[a-z]/ },
    { label: "Contains a number", regex: /[0-9]/ },
    { label: "Contains special character", regex: /[^A-Za-z0-9]/ },
];

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
    const strength = useMemo(() => {
        if (!password) return { score: 0, label: "", color: "" };
        
        const passedRequirements = requirements.filter((req) => req.regex.test(password)).length;
        
        if (passedRequirements <= 2) {
            return { score: passedRequirements, label: "Weak", color: "bg-red-500" };
        } else if (passedRequirements <= 4) {
            return { score: passedRequirements, label: "Medium", color: "bg-yellow-500" };
        } else {
            return { score: passedRequirements, label: "Strong", color: "bg-green-500" };
        }
    }, [password]);

    const requirementStatuses = useMemo(() => {
        return requirements.map((req) => ({
            ...req,
            passed: req.regex.test(password),
        }));
    }, [password]);

    if (!password) return null;

    return (
        <div className="space-y-3 mt-2">
            {/* Strength Bar */}
            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Password strength</span>
                    <span className={cn(
                        "text-xs font-medium",
                        strength.label === "Weak" && "text-red-500",
                        strength.label === "Medium" && "text-yellow-500",
                        strength.label === "Strong" && "text-green-500"
                    )}>
                        {strength.label}
                    </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className={cn("h-full transition-all duration-300 rounded-full", strength.color)}
                        style={{ width: `${(strength.score / requirements.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Requirements Checklist */}
            <div className="grid grid-cols-1 gap-1">
                {requirementStatuses.map((req, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex items-center gap-2 text-xs transition-colors",
                            req.passed ? "text-green-500" : "text-muted-foreground"
                        )}
                    >
                        {req.passed ? (
                            <Check className="h-3.5 w-3.5 flex-shrink-0" />
                        ) : (
                            <X className="h-3.5 w-3.5 flex-shrink-0" />
                        )}
                        <span>{req.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PasswordStrengthIndicator;
