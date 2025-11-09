import { LoaderIcon } from "lucide-react";

export default function AdvancedSettingsLoading() {
	return (
		<div className="container py-10">
			<div className="mb-8">
				<div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
				<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
			</div>

			{/* Live Transfer List Card */}
			<div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="space-y-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
								<div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>
							{/* Transfer List Items */}
							{[1, 2, 3].map((i) => (
								<div key={i} className="grid grid-cols-4 items-center gap-4">
									<div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
									<div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
									<div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>

			{/* Call Settings Card */}
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-28 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-80 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="space-y-4">
							{/* Max Duration Setting */}
							<div className="space-y-2">
								<div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
								<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
								<div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>

							{/* Interruption Threshold Setting */}
							<div className="space-y-2">
								<div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
								<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
								<div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>
		</div>
	);
}
