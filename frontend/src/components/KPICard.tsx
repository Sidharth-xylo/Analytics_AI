import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface KPIData {
    label: string;
    value: string;
    trend?: string;
}

const KPICard: React.FC<{ data: KPIData }> = ({ data }) => {
    const { label, value, trend } = data;

    // Determine trend color and icon
    let trendColor = "text-gray-500";
    let TrendIcon = Minus;

    if (trend) {
        if (trend.includes("+") || trend.toLowerCase().includes("up") || trend.toLowerCase().includes("increase")) {
            trendColor = "text-brand-accent"; // Neon Green
            TrendIcon = ArrowUpRight;
        } else if (trend.includes("-") || trend.toLowerCase().includes("down") || trend.toLowerCase().includes("decrease")) {
            trendColor = "text-rose-500"; // Keep red for negative functionality even if not in strict palette, or use Gold? User said Gold is Warning. Let's stick to Rose for 'bad'.
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
                <div className="text-3xl font-bold text-brand-text-primary">{value}</div>
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
