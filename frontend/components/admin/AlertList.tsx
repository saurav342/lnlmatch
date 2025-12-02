"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertSeverity = "low" | "medium" | "high" | "critical";

interface Alert {
    id: string;
    title: string;
    description: string;
    severity: AlertSeverity;
    timestamp: string;
    actionLabel?: string;
    onAction?: () => void;
    onDismiss?: () => void;
}

interface AlertListProps {
    alerts: Alert[];
    onDismiss?: (alertId: string) => void;
}

const severityConfig: Record<
    AlertSeverity,
    { icon: React.ReactNode; color: string; bgColor: string; label: string }
> = {
    low: {
        icon: <Info className="h-4 w-4" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900",
        label: "Low",
    },
    medium: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: "text-[var(--admin-accent)]",
        bgColor:
            "bg-[var(--admin-soft)]/20 dark:bg-[var(--admin-soft)]/10 border-[var(--admin-mid)]",
        label: "Medium",
    },
    high: {
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900",
        label: "High",
    },
    critical: {
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "text-destructive",
        bgColor: "bg-destructive/10 dark:bg-destructive/20 border-destructive/30",
        label: "Critical",
    },
};

export function AlertList({ alerts, onDismiss }: AlertListProps) {
    if (!alerts || alerts.length === 0) {
        return (
            <Card className="border-[var(--admin-neutral)]/30">
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-[var(--admin-success)]/20 flex items-center justify-center mb-3">
                            <Info className="h-6 w-6 text-[var(--admin-success)]" />
                        </div>
                        <p className="text-sm text-muted-foreground">No active alerts</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-[var(--admin-neutral)]/30">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>System Alerts</span>
                    <Badge variant="secondary" className="bg-[var(--admin-soft)]/30">
                        {alerts.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {alerts.map((alert) => {
                    const config = severityConfig[alert.severity];
                    return (
                        <div
                            key={alert.id}
                            className={cn(
                                "p-4 rounded-lg border transition-all hover:shadow-sm",
                                config.bgColor
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className={cn("mt-0.5", config.color)}>{config.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-foreground">
                                            {alert.title}
                                        </h4>
                                        <Badge
                                            variant="outline"
                                            className={cn("text-xs", config.color)}
                                        >
                                            {config.label}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {alert.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            {alert.timestamp}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {alert.actionLabel && alert.onAction && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={alert.onAction}
                                                    className="h-7 text-xs"
                                                >
                                                    {alert.actionLabel}
                                                </Button>
                                            )}
                                            {(alert.onDismiss || onDismiss) && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        alert.onDismiss
                                                            ? alert.onDismiss()
                                                            : onDismiss?.(alert.id)
                                                    }
                                                    className="h-7 w-7"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
