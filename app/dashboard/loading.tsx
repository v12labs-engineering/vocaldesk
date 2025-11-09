import { LoaderIcon } from "lucide-react";

export default function Loading() {
	return (
		<div className="">
			<h1 className="mb-4 text-lg font-semibold">Dashboard</h1>

			{/* AI Phone Section */}
			<div className="rounded-md border border-gray-200 dark:border-gray-800 p-4 space-y-4 w-[50%] my-4 animate-pulse">
				<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
				<div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48" />
				<div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-40" />
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-3 items-stretch gap-4 mt-8">
				{/* Total Calls Card */}
				<div className="rounded-md border border-gray-200 dark:border-gray-800 p-4 space-y-4">
					<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
					<div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-16" />
					<div className="space-y-2 w-full">
						<div className="flex justify-between">
							<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-12" />
							<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
						</div>
						<div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-full" />
					</div>
				</div>

				{/* Total Duration Card */}
				<div className="rounded-md border border-gray-200 dark:border-gray-800 p-4 space-y-4">
					<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-28" />
					<div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-20" />
					<div className="space-y-2 w-full">
						<div className="flex justify-between">
							<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-12" />
							<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-28" />
						</div>
						<div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-full" />
					</div>
				</div>

				{/* Third Card (Reserved for future use) */}
				<div className="rounded-md border border-gray-200 dark:border-gray-800 p-4 space-y-4">
					<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
					<div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-16" />
					<div className="space-y-2 w-full">
						<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
					</div>
				</div>
			</div>

			{/* Chart Area */}
			<div className="mt-8 rounded-md border border-gray-200 dark:border-gray-800 p-4">
				<div className="h-[300px] bg-gray-200 dark:bg-gray-800 rounded w-full" />
			</div>
		</div>
	);
}
