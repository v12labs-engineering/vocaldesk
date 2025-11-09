export default function PromptsLoading() {
	return (
		<div className="px-4">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
			</div>

			{/* Data Table */}
			<div className="space-y-4">
				{/* Table Toolbar */}
				<div className="flex items-center justify-between">
					<div className="flex flex-1 items-center space-x-2">
						<div className="h-8 w-[250px] bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
						<div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					</div>
					<div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>

				{/* Table */}
				<div className="rounded-md border border-gray-200 dark:border-gray-800">
					<div className="relative w-full overflow-auto">
						{/* Table Header */}
						<div className="bg-gray-50 dark:bg-gray-900">
							<div className="grid grid-cols-5 border-b border-gray-200 dark:border-gray-800">
								{[1, 2, 3, 4, 5].map((i) => (
									<div key={i} className="p-4">
										<div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
									</div>
								))}
							</div>
						</div>

						{/* Table Body */}
						<div>
							{[1, 2, 3, 4, 5].map((row) => (
								<div
									key={row}
									className="grid grid-cols-5 border-b border-gray-200 dark:border-gray-800"
								>
									{[1, 2, 3, 4, 5].map((col) => (
										<div key={col} className="p-4">
											<div
												className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"
												style={{
													width: col === 3 ? "80%" : col === 2 ? "60%" : "40%",
												}}
											/>
										</div>
									))}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between px-2">
					<div className="flex-1" />
					<div className="flex items-center space-x-6 lg:space-x-8">
						<div className="flex items-center space-x-2">
							<div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							<div className="h-8 w-[70px] bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
						</div>
						<div className="flex w-[100px] items-center justify-center">
							<div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
						</div>
						<div className="flex items-center space-x-2">
							<div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							<div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
