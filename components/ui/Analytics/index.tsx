"use client";

import AppBarChart from "@/components/ui/Charts/Bar";
import AppLineChart from "@/components/ui/Charts/Line";
import AppMapChart from "@/components/ui/Charts/Map";
import AppPieChart from "@/components/ui/Charts/Pie";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	calculateAverageDuration,
	formatMinutes,
	getCallsByCity,
	getCallsByDay,
	getCallsByMonth,
} from "@/utils/helpers";
import { addDays } from "date-fns";
import { ClockIcon, PhoneIcon, TimerIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function Analytics({ calls }: { calls: any }) {
	// Initialize with last 30 days
	const [dateRange, setDateRange] = useState<DateRange>({
		from: addDays(new Date(), -30),
		to: new Date(),
	});

	// Filter calls based on date range
	const filteredCalls = calls?.filter((call) => {
		const callDate = new Date(call.created_at);
		return (
			dateRange.from &&
			dateRange.to &&
			callDate >= dateRange.from &&
			callDate <= dateRange.to
		);
	});

	const callsByDay = getCallsByDay(filteredCalls);
	const callsByMonth = getCallsByMonth(filteredCalls);
	const callsByCity = getCallsByCity(filteredCalls);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div className="flex gap-2 mr-4">
					<Tabs defaultValue="month" className="w-[400px]">
						<TabsList>
							<TabsTrigger
								value="week"
								onClick={() =>
									setDateRange({
										from: addDays(new Date(), -7),
										to: new Date(),
									})
								}
							>
								Week
							</TabsTrigger>
							<TabsTrigger
								value="month"
								onClick={() =>
									setDateRange({
										from: addDays(new Date(), -30),
										to: new Date(),
									})
								}
							>
								Month
							</TabsTrigger>
							<TabsTrigger
								value="quarter"
								onClick={() =>
									setDateRange({
										from: addDays(new Date(), -90),
										to: new Date(),
									})
								}
							>
								Quarter
							</TabsTrigger>
							<TabsTrigger
								value="year"
								onClick={() =>
									setDateRange({
										from: addDays(new Date(), -365),
										to: new Date(),
									})
								}
							>
								Year
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
				<DateRangePicker
					align="end"
					defaultValue={dateRange}
					onChange={(newDateRange) => {
						setDateRange(
							newDateRange || {
								from: addDays(new Date(), -30),
								to: new Date(),
							},
						);
					}}
				/>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
					<div className="flex items-center gap-4">
						<div className="p-4 bg-primary/10 rounded-full">
							<PhoneIcon className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">
								Total Calls
							</h3>
							<p className="text-2xl font-bold mt-2">
								{filteredCalls?.length || 0}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
					<div className="flex items-center gap-4">
						<div className="p-4 bg-primary/10 rounded-full">
							<ClockIcon className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">
								Total Duration
							</h3>
							<p className="text-2xl font-bold mt-2">
								{formatMinutes(
									filteredCalls?.reduce(
										(acc, call) => acc + Number(call?.call_length || 0),
										0,
									),
								)}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
					<div className="flex items-center gap-4">
						<div className="p-4 bg-primary/10 rounded-full">
							<TimerIcon className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">
								Avg Call Duration
							</h3>
							<p className="text-2xl font-bold mt-2">
								{calculateAverageDuration(filteredCalls)}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
					<AppLineChart
						chartData={callsByDay}
						title="Calls per Day"
						dataKey="day"
					/>
				</div>
				<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
					<AppBarChart
						chartData={callsByMonth}
						title="Calls per Month"
						dataKey="month"
					/>
				</div>
			</div>

			<AppMapChart data={callsByCity} title="Calls by Location" />
		</div>
	);
}
