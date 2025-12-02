"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SegmentChartProps {
    data: Array<{ name: string; value: number;[key: string]: any }>;
    title: string;
    type?: "pie" | "donut" | "bar";
    height?: number;
}

const COLORS = [
    "var(--admin-accent)",
    "var(--admin-mid)",
    "var(--admin-success)",
    "var(--admin-highlight)",
    "var(--admin-strong)",
    "var(--admin-soft)",
];

export function SegmentChart({ data, title, type = "donut", height = 300 }: SegmentChartProps) {
    const renderPieChart = () => (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={type === "donut" ? "60%" : 0}
                    outerRadius="80%"
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--admin-neutral)",
                        borderRadius: "8px",
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );

    const renderBarChart = () => (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-neutral)" opacity={0.2} />
                <XAxis
                    dataKey="name"
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
                    }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <Card className="border-[var(--admin-neutral)]/30">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {type === "bar" ? renderBarChart() : renderPieChart()}
            </CardContent>
        </Card>
    );
}
