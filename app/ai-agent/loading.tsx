import { LoaderIcon } from "lucide-react";

export default function Loading() {
	return (
		<div className="px-4">
			<h1 className="mb-4 text-lg font-semibold">AI Phone Agent</h1>

			<div className="my-8">
				<div className="w-full">
					<div className="space-y-8">
						{/* Phone Number Section */}
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/6" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
							</div>
							<div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
						</div>

						{/* Voice Selection Section */}
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/6" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
							</div>
							<div className="grid grid-cols-3 gap-4">
								{[1, 2, 3].map((i) => (
									<div
										key={`voice-${i}`}
										className="h-24 bg-gray-200 dark:bg-gray-800 rounded"
									/>
								))}
							</div>
						</div>

						{/* Knowledge Base Section */}
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/6" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
							</div>
							<div className="h-[300px] bg-gray-200 dark:bg-gray-800 rounded w-full" />
						</div>

						{/* Greetings Section */}
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/6" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
							</div>
							<div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
						</div>

						{/* Live Transfer Section */}
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/6" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
							</div>
							<div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
						</div>

						{/* Language Section */}
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/6" />
								<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
							</div>
						</div>

						{/* Deploy Button */}
						<div className="space-y-4">
							<div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
