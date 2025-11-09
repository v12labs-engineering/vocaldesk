import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
	return (
		<div className="px-4">
			{/* Header */}
			<div className="h-8 w-36 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-4" />

			{/* Email Notifications Card */}
			<div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="h-10 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
						<div className="h-3 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mt-3" />
						<div className="h-3 w-80 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mt-3" />
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>

			{/* SMS Notifications Card */}
			<div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="h-10 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
						<div className="h-3 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mt-3" />
						<div className="h-3 w-80 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mt-3" />
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>

			{/* Webhook Card */}
			<div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>

			{/* Custom Notification Settings Header */}
			<div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mt-8 mb-4" />

			{/* SMTP Settings Card */}
			<div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="flex items-center space-x-4 mb-8">
							<div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							<div>
								<div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-1" />
								<div className="h-3 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>

			{/* Twilio Settings Card */}
			<div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="flex items-center space-x-4 mb-8">
							<div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							<div>
								<div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-1" />
								<div className="h-3 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>

			{/* Textgrid Settings Card */}
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<div className="h-6 w-44 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
					<div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

					<div className="mt-8 mb-4">
						<div className="flex items-center space-x-4 mb-8">
							<div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							<div>
								<div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-1" />
								<div className="h-3 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between p-6 border-t">
					<div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
					<div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
				</div>
			</div>
		</div>
	);
}
