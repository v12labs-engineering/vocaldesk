import { LoaderIcon } from "lucide-react";

export default function AccountLoading() {
	return (
		<div className="px-4">
			{/* Header */}
			<div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-4" />

			{/* Name Form Card */}
			<div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="h-10 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>

			{/* Email Form Card */}
			<div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="h-10 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>

			{/* API Key Card */}
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="space-y-4">
							<div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							<div className="flex items-center justify-end space-x-2">
								<div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
								<div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
