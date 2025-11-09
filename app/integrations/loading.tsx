export default function IntegrationsLoading() {
	return (
		<div className="px-4">
			<div className="h-8 w-36 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-4" />

			{/* API Requests Card */}
			<div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="space-y-4">
							<div className="grid grid-cols-2 items-center gap-4">
								<div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
								<div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>
							{/* API Request Items */}
							{[1, 2].map((i) => (
								<div key={i} className="grid grid-cols-2 items-center gap-4">
									<div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
									<div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>

			{/* Messages Card */}
			<div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="grid grid-cols-2 gap-3">
							{/* SMS Card */}
							<div className="rounded-lg border p-4">
								<div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
								<div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-4" />
								<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>

							{/* Email Card */}
							<div className="rounded-lg border p-4">
								<div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
								<div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-4" />
								<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Calendars Card */}
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-80 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="grid grid-cols-2 gap-3">
							{/* Google Calendar Card */}
							<div className="rounded-lg border p-4">
								<div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
								<div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-4" />
								<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>

							{/* Cal Calendar Card */}
							<div className="rounded-lg border p-4">
								<div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
								<div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-4" />
								<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
