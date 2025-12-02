import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
    title: string;
    value: string | number;
    delta?: number;
    deltaLabel?: string;
    icon?: ReactNode;
    trend?: "up" | "down" | "neutral";
    className?: string;
}

export function KpiCard({
    title,
    value,
    delta,
    deltaLabel,
    icon,
    trend,
    className,
}: KpiCardProps) {
    const getTrendIcon = () => {
        if (trend === "up") return <TrendingUp className="h-4 w-4" />;
        if (trend === "down") return <TrendingDown className="h-4 w-4" />;
        return <Minus className="h-4 w-4" />;
    };

    const getTrendColor = () => {
        if (trend === "up") return "text-[var(--admin-success)]";
        if (trend === "down") return "text-destructive";
        return "text-muted-foreground";
    };

    return (
        <Card
            className={cn(
                "relative overflow-hidden border-[var(--admin-neutral)]/30 bg-gradient-to-br from-white to-[var(--admin-bg-light)]/20 dark:from-card dark:to-card/50",
                className
            )}
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    {icon && (
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--admin-soft)]/20 to-[var(--admin-highlight)]/20">
                            {icon}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-foreground">{value}</div>
                {delta !== undefined && (
                    <div className={cn("flex items-center gap-1 mt-2 text-sm", getTrendColor())}>
                        {getTrendIcon()}
                        <span className="font-medium">
                            {delta > 0 ? "+" : ""}
                            {delta}%
                        </span>
                        {deltaLabel && (
                            <span className="text-muted-foreground ml-1">{deltaLabel}</span>
                        )}
                    </div>
                )}
            </CardContent>
            {/* Accent border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--admin-mid)] via-[var(--admin-accent)] to-[var(--admin-success)]" />
        </Card>
    );
}
