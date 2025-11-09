import { LoaderIcon } from "lucide-react";

export default function Loading() {
	const callInfoItems = [
		"from",
		"to",
		"replied-by",
		"ended-by",
		"duration",
		"status",
	];

	return (
		<div className="px-4">
			<h1 className="mb-4 text-lg font-semibold">Call Details</h1>
			<div className="my-8">
				{/* Call Info Grid */}
				<div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 dark:border-gray-800 w-full md:grid-cols-3 md:gap-6">
					{callInfoItems.map((item) => (
						<div key={item} className="w-1/2 p-4">
							<div className="text-sm mb-2 flex items-center gap-2 text-accent-foreground/70">
								<div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
							</div>
							<div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-24 animate-pulse" />
						</div>
					))}
				</div>

				{/* Tabs Section */}
				<div className="relative my-12 rounded-lg border border-gray-200 dark:border-gray-800 w-full p-4">
					{/* Tab List */}
					<div className="absolute -top-[18px] flex gap-2 bg-background p-1 rounded-lg border border-gray-200 dark:border-gray-800">
						{["Summary", "Transcripts", "Recording", "Leads"].map((tab) => (
							<div
								key={tab}
								className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24 animate-pulse"
							/>
						))}
					</div>

					{/* Tab Content */}
					<div className="pt-4">
						{/* Summary Content */}
						<div className="space-y-4 p-4">
							{[...Array(5)].map((_, i) => (
								<div
									key={`summary-line-${i}`}
									className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse"
								/>
							))}
						</div>

						{/* Leads Content */}
						<div className="space-y-4 p-4 hidden">
							{[
								"First Name",
								"Last Name",
								"Email",
								"Appointment",
								"Preferred Time",
							].map((field) => (
								<div key={field} className="flex gap-4">
									<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse" />
									<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48 animate-pulse" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
