import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface KPIData {
    label: string;
    value: string | number;
    trend?: string;
}

const KPICard: React.FC<{ data: KPIData | any }> = ({ data }) => {
    // Defensive check for undefined or null data
    if (!data) {
        console.error("KPICard received undefined data");
        return (
            <Card className="w-full bg-brand-card/70 backdrop-blur-md border border-rose-500/50 shadow-sm">
                <CardContent className="p-4">
                    <p className="text-sm text-rose-500">Invalid KPI data</p>
                </CardContent>
            </Card>
        );
    }

    // Handle different data formats
    let label = data.label || data.title || "Unknown";
    let value = data.value;
    let trend = data.trend || data.change;

    // If value is undefined, try to extract from nested structure
    if (value === undefined) {
        // Sometimes backend might send it as { kpi: { label, value } }
        if (data.kpi) {
            label = data.kpi.label || label;
            value = data.kpi.value;
            trend = data.kpi.trend || trend;
        } else if (data.payload) {
            label = data.payload.label || label;
            value = data.payload.value;
            trend = data.payload.trend || trend;
        }
    }

    // Final check - if still no value, show error
    if (value === undefined || value === null) {
        console.error("KPICard: No value found in data:", data);
        value = "N/A";
    }

    // Convert value to string for display
    const displayValue = typeof value === 'number' ? value.toLocaleString() : String(value);

    // Determine trend color and icon
    let trendColor = "text-gray-500";
    let TrendIcon = Minus;

    if (trend) {
        const trendStr = String(trend);
        if (trendStr.includes("+") || trendStr.toLowerCase().includes("up") || trendStr.toLowerCase().includes("increase")) {
            trendColor = "text-brand-accent"; // Neon Green
            TrendIcon = ArrowUpRight;
        } else if (trendStr.includes("-") || trendStr.toLowerCase().includes("down") || trendStr.toLowerCase().includes("decrease")) {
            trendColor = "text-rose-500";
            TrendIcon = ArrowDownRight;
        }
    }

    return (
        <Card className="w-full bg-brand-card/70 backdrop-blur-md border border-brand-border/50 shadow-sm text-brand-text-primary hover:shadow-md transition-all duration-300 rounded-[20px] hover:border-brand-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-brand-text-muted">
                    {label}
                </CardTitle>
                <TrendIcon className={`h-4 w-4 ${trendColor}`} />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-brand-text-primary">{displayValue}</div>
                {trend && (
                    <p className={`text-xs ${trendColor} mt-1 flex items-center font-medium`}>
                        {trend}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default KPICard;
