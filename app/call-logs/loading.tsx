import { LoaderIcon } from "lucide-react";

export default function Loading() {
	return (
		<div className="px-4">
			<h1 className="mb-4 text-lg font-semibold">Call Logs</h1>
			<div className="my-8">
				{/* Search and Filter Bar */}
				<div className="flex items-center justify-between pb-4">
					<div className="flex gap-2 items-center">
						<div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-[250px] animate-pulse" />
						<div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-[120px] animate-pulse" />
					</div>
				</div>

				{/* Table Header */}
				<div className="rounded-md border border-gray-200 dark:border-gray-800">
					<div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-900">
						{[...Array(6)].map((_, i) => (
							<div
								key={`header-${i}`}
								className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 animate-pulse"
							/>
						))}
					</div>

					{/* Table Rows */}
					{[...Array(8)].map((_, rowIndex) => (
						<div
							key={`row-${rowIndex}`}
							className="grid grid-cols-6 gap-4 p-4 border-t border-gray-200 dark:border-gray-800 animate-pulse"
						>
							{[...Array(6)].map((_, colIndex) => (
								<div
									key={`cell-${rowIndex}-${colIndex}`}
									className="h-4 bg-gray-200 dark:bg-gray-800 rounded"
									style={{
										width:
											colIndex === 0 ? "40%" : colIndex === 5 ? "20%" : "60%",
									}}
								/>
							))}
						</div>
					))}
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
