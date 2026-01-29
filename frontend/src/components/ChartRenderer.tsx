"use client";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

type ChartData = {
    type: "bar" | "line" | "pie" | "scatter";
    title?: string;
    x_key?: string;
    y_key?: string;
    data: any[];
};

export default function ChartRenderer({ data }: { data: ChartData }) {
    if (!data || !data.data) return null;

    const { type, title, data: chartData, x_key, y_key } = data;

    // Check if keys exist, otherwise infer them
    let xKey = x_key || "label";
    let yKey = y_key || "value";

    // Debugging
    console.log("ChartRenderer Data:", { type, xKey, yKey, dataLength: chartData?.length, chartData });

    // Robust Check: Ensure chartData is an array (or convert if it's an object)
    let processedData = chartData;

    if (!Array.isArray(chartData)) {
        console.warn("ChartRenderer: Converting object to array format", chartData);

        // If it's an object, try to convert it to an array
        if (typeof chartData === 'object' && chartData !== null) {
            // Check if it has a 'data' property that's an array
            if ('data' in chartData && Array.isArray((chartData as any).data)) {
                processedData = (chartData as any).data;
            } else {
                // Try to convert object entries to array format
                processedData = Object.entries(chartData).map(([key, value]) => ({
                    label: key,
                    value: value
                }));
            }
        } else {
            console.error("ChartRenderer Error: Invalid chart data format", chartData);
            return <p className="text-red-600 text-sm p-4 bg-red-50 rounded-lg">Unable to render chart: Invalid data format</p>;
        }
    }

    if (processedData && processedData.length > 0) {
        const firstItem = processedData[0];
        const keys = Object.keys(firstItem);

        const xKeyExists = Object.prototype.hasOwnProperty.call(firstItem, xKey);
        const yKeyExists = Object.prototype.hasOwnProperty.call(firstItem, yKey);

        if (!xKeyExists || !yKeyExists) {
            // Infer X (String/Category) and Y (Number)
            const inferredX = keys.find(k => typeof firstItem[k] === 'string') || keys[0];
            const inferredY = keys.find(k => typeof firstItem[k] === 'number') || keys[1] || keys[0];

            if (!xKeyExists) xKey = inferredX;
            if (!yKeyExists) yKey = inferredY;

            console.log(`Inferring Keys: X=${xKey}, Y=${yKey}`);
        }
    }

    // Generate unique ID for this chart instance to prevent gradient conflicts
    const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`;

    // Dark Cosmic Palette
    const COLORS = ['#0047AB', '#000080', '#82C8E5', '#6D8196'];

    const renderChart = () => {
        switch (type) {
            case "bar":
                return (
                    <BarChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis
                            dataKey={xKey}
                            stroke="#6B7280"
                            tick={{ fill: '#9CA3AF' }}
                        />
                        <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                color: '#0B1220',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                                backdropFilter: 'blur(4px)',
                            }}
                            cursor={{ fill: 'rgba(79, 107, 255, 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px', color: '#9CA3AF' }} />
                        <Bar
                            dataKey={yKey}
                            radius={[6, 6, 0, 0]}
                            animationDuration={1500}
                        >
                            {processedData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                );
            case "line":
                return (
                    <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis dataKey={xKey} stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#1E293B' }} />
                        <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                color: '#0B1220',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                                backdropFilter: 'blur(4px)',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey={yKey}
                            stroke={COLORS[0]}
                            strokeWidth={4}
                            dot={{ r: 4, fill: COLORS[0], strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 8, fill: COLORS[0] }}
                            animationDuration={1500}
                        />
                    </LineChart>
                );
            case "pie":
                return (
                    <PieChart>
                        <Pie
                            data={processedData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius="70%"
                            fill="#8884d8"
                            dataKey={yKey}
                            nameKey={xKey}
                            animationDuration={1500}
                        >
                            {chartData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                color: '#0B1220',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                                backdropFilter: 'blur(4px)',
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', color: '#000000' }} />
                    </PieChart>
                );
            default:
                return <p className="text-gray-500">Unsupported chart type: {type}</p>;
        }
    };

    return (
        <div className="w-full h-full min-h-[300px] bg-brand-card/30 p-4 rounded-[24px] border border-brand-border shadow-sm backdrop-blur-sm flex flex-col">
            {title && <h3 className="text-lg font-semibold mb-4 text-center text-brand-text-primary">{title}</h3>}
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
