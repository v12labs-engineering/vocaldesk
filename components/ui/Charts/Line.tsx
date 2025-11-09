"use client";

import { AlertCircle } from "lucide-react";
import {
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

interface ChartData {
	month?: string;
	day?: string;
	city?: string;
	count: number;
}

interface AppLineChartProps {
	chartData: ChartData[];
	title: string;
	dataKey: "month" | "day" | "city";
}

export default function AppLineChart({
	chartData,
	title,
	dataKey,
}: AppLineChartProps) {
	// Format data for better display
	const formattedData = chartData.map((item) => ({
		name: item[dataKey], // 'month', 'day', or 'city'
		value: item.count,
		label: "Calls",
	}));

	// If no data or all values are 0, show empty state
	if (
		!formattedData.length ||
		formattedData.every((item) => item.value === 0)
	) {
		return (
			<div className="w-full">
				<h3 className="text-sm font-semibold mb-4">{title}</h3>
				<div className="h-[300px] w-full flex items-center justify-center">
					<div className="text-center">
						<AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">
							No data available
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							There isn't enough data to display this chart.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<h3 className="text-sm font-semibold mb-4">{title}</h3>
			<div className="h-[300px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={formattedData}>
						<XAxis dataKey="name" tick={{ fontSize: 10 }} />
						<Tooltip content={<CustomTooltip />} />
						<Line
							type="monotone"
							dataKey="value"
							stroke="#2563eb"
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
