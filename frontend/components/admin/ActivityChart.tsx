"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ActivityChartProps {
    data: Array<{ date: string; value: number;[key: string]: any }>;
    title?: string;
    dataKeys?: string[];
    type?: "line" | "area";
    height?: number;
    timeRanges?: { label: string; value: string }[];
    onTimeRangeChange?: (range: string) => void;
}

const defaultTimeRanges = [
    { label: "7D", value: "7d" },
    { label: "30D", value: "30d" },
    { label: "90D", value: "90d" },
    { label: "1Y", value: "1y" },
];

export function ActivityChart({
    data,
    title = "Activity Over Time",
    dataKeys = ["value"],
    type = "area",
    height = 350,
    timeRanges = defaultTimeRanges,
    onTimeRangeChange,
}: ActivityChartProps) {
    const [selectedRange, setSelectedRange] = useState(timeRanges[1].value);

    const handleRangeChange = (range: string) => {
        setSelectedRange(range);
        onTimeRangeChange?.(range);
    };

    const colors = [
        "var(--admin-accent)",
        "var(--admin-mid)",
        "var(--admin-success)",
        "var(--admin-highlight)",
    ];

    const ChartComponent = type === "area" ? AreaChart : LineChart;

    return (
        <Card className="border-[var(--admin-neutral)]/30">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                        {timeRanges.map((range) => (
                            <Button
                                key={range.value}
                                size="sm"
                                variant="ghost"
                                className={cn(
                                    "h-7 px-3 text-xs font-medium transition-all",
                                    selectedRange === range.value
                                        ? "bg-gradient-to-r from-[var(--admin-mid)] to-[var(--admin-strong)] text-gray-900 dark:text-white shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => handleRangeChange(range.value)}
                            >
                                {range.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    <ChartComponent data={data}>
                        <defs>
                            {dataKeys.map((key, index) => (
                                <linearGradient
                                    key={key}
                                    id={`gradient-${key}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={colors[index % colors.length]}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={colors[index % colors.length]}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-neutral)" opacity={0.2} />
                        <XAxis
                            dataKey="date"
                            stroke="var(--foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="var(--foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--card)",
                                border: "1px solid var(--admin-neutral)",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                        {dataKeys.length > 1 && <Legend />}
                        {dataKeys.map((key, index) =>
                            type === "area" ? (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={colors[index % colors.length]}
                                    fill={`url(#gradient-${key})`}
                                    strokeWidth={2}
                                />
                            ) : (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={colors[index % colors.length]}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            )
                        )}
                    </ChartComponent>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
