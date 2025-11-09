"use client";

import { AlertCircle } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CustomTooltip } from "./CustomTooltip";

interface ChartData {
	month?: string;
	day?: string;
	city?: string;
	count: number;
}

interface AppPieChartProps {
	chartData: ChartData[];
	title: string;
	dataKey: "month" | "day" | "city";
}

// Custom colors for different cities
const COLORS = [
	"#2563eb", // blue-600
	"#3b82f6", // blue-500
	"#60a5fa", // blue-400
	"#93c5fd", // blue-300
	"#bfdbfe", // blue-200
	"#4f46e5", // indigo-600
	"#6366f1", // indigo-500
	"#818cf8", // indigo-400
	"#a5b4fc", // indigo-300
	"#c7d2fe", // indigo-200
];

export default function AppPieChart({
	chartData,
	title,
	dataKey,
}: AppPieChartProps) {
	// Format and sort data by count (descending)
	const formattedData = chartData
		.map((item) => ({
			name: item[dataKey],
			value: item.count,
		}))
		.sort((a, b) => b.value - a.value);

	// If no data or all values are 0, show empty state
	if (!formattedData.length || formattedData.every(item => item.value === 0)) {
		return (
			<div className="w-full">
				<h3 className="text-sm font-semibold mb-4">{title}</h3>
				<div className="h-[400px] w-full flex items-center justify-center">
					<div className="text-center">
						<AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
						<p className="mt-1 text-sm text-gray-500">
							There isn't enough data to display this chart.
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Calculate total for percentage
	const total = formattedData.reduce((sum, item) => sum + item.value, 0);

	return (
		<div className="w-full">
			<h3 className="text-sm font-semibold mb-4">{title}</h3>
			<div className="h-[400px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={formattedData}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							outerRadius={120}
							innerRadius={60} // Makes it a donut chart
							label={({
								cx,
								cy,
								midAngle,
								innerRadius,
								outerRadius,
								value,
								name,
								percent
							}) => {
								// Only show label if segment is more than 5% of total
								if (percent < 0.05) return null;
								
								const RADIAN = Math.PI / 180;
								const radius = 25 + innerRadius + (outerRadius - innerRadius);
								const x = cx + radius * Math.cos(-midAngle * RADIAN);
								const y = cy + radius * Math.sin(-midAngle * RADIAN);

								return (
									<text
										x={x}
										y={y}
										fill="#374151"
										textAnchor={x > cx ? "start" : "end"}
										dominantBaseline="central"
										className="text-xs"
									>
										{`${name} (${((percent * 100).toFixed(0))}%)`}
									</text>
								);
							}}
						>
							{formattedData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip content={<CustomTooltip />} />
						<Legend 
							layout="vertical" 
							align="right"
							verticalAlign="middle"
							formatter={(value, entry) => {
								const item = formattedData.find(d => d.name === value);
								return `${value} (${item?.value})`;
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
