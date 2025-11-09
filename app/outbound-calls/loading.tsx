import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	const summaryItems = [
		"batch-1",
		"batch-2",
		"batch-3",
		"batch-4",
		"batch-5",
		"batch-6",
		"batch-7",
		"batch-8",
	];

	return (
		<div className="px-4">
			{/* Header with Create Button */}
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold">Outbound Calls</h1>
				<div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-[180px] animate-pulse" />
			</div>

			<div className="my-8">
				{/* Search and Filter Bar */}
				<div className="flex items-center justify-between pb-4">
					<div className="flex gap-2 items-center">
						<div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-[250px] animate-pulse" />
						<div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-[120px] animate-pulse" />
					</div>
				</div>

				{/* Table */}
				<div className="rounded-md border border-gray-200 dark:border-gray-800">
					{/* Table Header */}
					<div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-900">
						{["Label", "Status", "Created", "Total Calls", "Actions"].map(
							(header) => (
								<div
									key={header}
									className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 animate-pulse"
								/>
							),
						)}
					</div>

					{/* Table Rows */}
					<div className="divide-y divide-gray-200 dark:divide-gray-800">
						{summaryItems.map((item) => (
							<div
								key={item}
								className="grid grid-cols-5 gap-4 p-4 animate-pulse"
							>
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
							</div>
						))}
					</div>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between py-4">
					<div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-[200px] animate-pulse" />
					<div className="flex gap-2">
						<div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-[100px] animate-pulse" />
						<div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-[100px] animate-pulse" />
					</div>
				</div>
			</div>
		</div>
	);
}
