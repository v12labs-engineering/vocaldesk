import Transcript from "@/components/ui/Transcript";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	analyzeCallEmotions,
	getInboundCallDetails,
	getRecordings,
} from "@/utils/agent";
import { getUser } from "@/utils/auth-helpers/server";
import { formatMinutes } from "@/utils/helpers";
import {
	AlertTriangleIcon,
	CircleDotIcon,
	ClockIcon,
	FlameIcon,
	FrownIcon,
	HeadsetIcon,
	MehIcon,
	PhoneIncomingIcon,
	PhoneOffIcon,
	PhoneOutgoingIcon,
	SmileIcon,
} from "lucide-react";
import { redirect } from "next/navigation";

// Import the Transcript type from the component
type TranscriptItem = {
	user: string;
	text: string;
	created_at: string;
};

export default async function CallLog({ params }: { params: { id: string } }) {
	const response = await getUser();
	const user = response?.data || null;

	// Adding proper type definitions to fix linter errors
	interface CallDetails {
		from?: string;
		to?: string;
		answered_by?: string;
		call_ended_by?: string;
		call_length?: number;
		status?: string;
		summary?: string;
		transcripts?: TranscriptItem[];
		analysis?: {
			first_name?: string;
			last_name?: string;
			email?: string;
			phone_number?: string;
			wants_to_book_appointment?: string;
			appointment_time?: string;
		};
	}

	let inboundCallDetails: CallDetails | null = null;
	let recording: { url?: string } = {};
	// let emotions: { emotion?: string } = {};
	if (user) {
		inboundCallDetails = await getInboundCallDetails(params?.id);
		recording = await getRecordings(params?.id);
		// const emotion = await analyzeCallEmotions(params?.id);
		// emotions = emotion.data?.data;
	} else {
		redirect("/signin");
	}

	// Function to get emotion icon and color
	// const getEmotionDetails = (emotion: string | undefined) => {
	// 	switch (emotion?.toLowerCase()) {
	// 		case "happy":
	// 			return {
	// 				icon: <SmileIcon className="h-8 w-8" />,
	// 				color: "text-green-500",
	// 				bgColor: "bg-green-50 dark:bg-green-950/30",
	// 				label: "Happy",
	// 				description:
	// 					"The caller expressed positive emotions throughout the call.",
	// 			};
	// 		case "angry":
	// 			return {
	// 				icon: <FlameIcon className="h-8 w-8" />,
	// 				color: "text-red-500",
	// 				bgColor: "bg-red-50 dark:bg-red-950/30",
	// 				label: "Angry",
	// 				description:
	// 					"The caller showed signs of frustration or anger during the conversation.",
	// 			};
	// 		case "sad":
	// 			return {
	// 				icon: <FrownIcon className="h-8 w-8" />,
	// 				color: "text-blue-500",
	// 				bgColor: "bg-blue-50 dark:bg-blue-950/30",
	// 				label: "Sad",
	// 				description:
	// 					"The caller expressed sadness or disappointment during the call.",
	// 			};
	// 		case "fear":
	// 			return {
	// 				icon: <AlertTriangleIcon className="h-8 w-8" />,
	// 				color: "text-amber-500",
	// 				bgColor: "bg-amber-50 dark:bg-amber-950/30",
	// 				label: "Fear",
	// 				description:
	// 					"The caller showed signs of anxiety or concern during the conversation.",
	// 			};
	// 		// Fixed the default case by making it a separate case without the 'default' keyword
	// 		case "neutral":
	// 		case undefined:
	// 			return {
	// 				icon: <MehIcon className="h-8 w-8" />,
	// 				color: "text-gray-500",
	// 				bgColor: "bg-gray-50 dark:bg-gray-800/30",
	// 				label: "Neutral",
	// 				description:
	// 					"The caller maintained a neutral tone throughout the conversation.",
	// 			};
	// 	}
	// 	// Default fallback return for any other unexpected values
	// 	return {
	// 		icon: <MehIcon className="h-8 w-8" />,
	// 		color: "text-gray-500",
	// 		bgColor: "bg-gray-50 dark:bg-gray-800/30",
	// 		label: "Neutral",
	// 		description:
	// 			"The caller maintained a neutral tone throughout the conversation.",
	// 	};
	// };

	// const emotionDetails = getEmotionDetails(emotions?.emotion);

	return (
		<div className="px-4">
			<h1 className="mb-4 text-lg font-semibold">Call Details</h1>
			<div className="my-8">
				<div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8">
					{[
						{
							icon: <PhoneIncomingIcon className="h-5 w-5" />,
							label: "From",
							value: inboundCallDetails?.from,
						},
						{
							icon: <PhoneOutgoingIcon className="h-5 w-5" />,
							label: "To",
							value: inboundCallDetails?.to,
						},
						{
							icon: <HeadsetIcon className="h-5 w-5" />,
							label: "Replied By",
							value: inboundCallDetails?.answered_by || "N/A",
						},
						{
							icon: <PhoneOffIcon className="h-5 w-5" />,
							label: "Ended By",
							value: inboundCallDetails?.call_ended_by || "N/A",
						},
						{
							icon: <ClockIcon className="h-5 w-5" />,
							label: "Duration",
							value: formatMinutes(inboundCallDetails?.call_length || 0),
						},
						{
							icon: <CircleDotIcon className="h-5 w-5" />,
							label: "Status",
							value: inboundCallDetails?.status,
						},
					].map((item, index) => (
						<div
							key={index}
							className="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-700"
						>
							<div className="flex items-start space-x-4">
								<div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-2 transition-colors group-hover:bg-primary/10 group-hover:text-primary dark:group-hover:bg-primary/20">
									{item.icon}
								</div>
								<div className="flex-1">
									<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
										{item.label}
									</h3>
									<p className="font-semibold text-gray-900 dark:text-gray-100">
										{item.value}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="relative my-12 rounded-lg !bg-white border border-gray-200 dark:border-gray-800 w-full p-4">
					<Tabs defaultValue="summary">
						<TabsList className="absolute -top-[18px] bg-gray-100">
							<TabsTrigger value="summary">Summary</TabsTrigger>
							<TabsTrigger value="transcripts">Transcripts</TabsTrigger>
							<TabsTrigger value="recording">Recording</TabsTrigger>
							<TabsTrigger value="leads">Leads</TabsTrigger>
							{/* <TabsTrigger value="emotions">
								Emotions{" "}
								<Badge className="ml-2" variant="outline">
									<span className="text-primary text-xs font-normal">Beta</span>
								</Badge>
							</TabsTrigger> */}
						</TabsList>
						<TabsContent value="summary">
							<p className="text-sm p-4">{inboundCallDetails?.summary}</p>
						</TabsContent>
						<TabsContent value="transcripts">
							<div className="text-sm p-4">
								<Transcript
									transcript={inboundCallDetails?.transcripts || []}
								/>
							</div>
						</TabsContent>
						<TabsContent value="recording">
							<div className="text-sm p-4">
								{recording ? (
									// biome-ignore lint/a11y/useMediaCaption: <explanation>
									<audio controls className="w-full">
										<source src={recording?.url} type="audio/mpeg" />
										Your browser does not support the audio element.
									</audio>
								) : (
									<p>No recording found</p>
								)}
							</div>
						</TabsContent>
						<TabsContent value="leads">
							<div className="text-sm p-4">
								<dl className="space-y-2">
									<div className="flex">
										<dt className="font-semibold">First Name:</dt>
										<dd className="ml-2">
											{inboundCallDetails?.analysis?.first_name || "N/A"}
										</dd>
									</div>
									<div className="flex">
										<dt className="font-semibold">Last Name:</dt>
										<dd className="ml-2">
											{inboundCallDetails?.analysis?.last_name || "N/A"}
										</dd>
									</div>
									<div className="flex">
										<dt className="font-semibold">Email:</dt>
										<dd className="ml-2">
											{inboundCallDetails?.analysis?.email || "N/A"}
										</dd>
									</div>
									<div className="flex">
										<dt className="font-semibold">Phone Number:</dt>
										<dd className="ml-2">
											{inboundCallDetails?.analysis?.phone_number || "N/A"}
										</dd>
									</div>
									<div className="flex">
										<dt className="font-semibold">
											Wants to book an appointment:
										</dt>
										<dd className="ml-2">
											{inboundCallDetails?.analysis
												?.wants_to_book_appointment || "N/A"}
										</dd>
									</div>
									<div className="flex">
										<dt className="font-semibold">Preferred time:</dt>
										<dd className="ml-2">
											{inboundCallDetails?.analysis?.appointment_time || "N/A"}
										</dd>
									</div>
								</dl>
							</div>
						</TabsContent>
						{/* <TabsContent value="emotions">
							<div className="text-sm p-4">
								{emotions?.emotion ? (
									<div className={`p-6 rounded-lg ${emotionDetails.bgColor}`}>
										<div className="flex items-center mb-4">
											<div
												className={`p-3 rounded-full ${emotionDetails.bgColor} ${emotionDetails.color} mr-4`}
											>
												{emotionDetails.icon}
											</div>
											<div>
												<h3
													className={`text-lg font-semibold ${emotionDetails.color}`}
												>
													{emotionDetails.label} Tone Detected
												</h3>
												<p className="text-gray-600 dark:text-gray-300">
													{emotionDetails.description}
												</p>
											</div>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
											{["neutral", "happy", "angry", "sad", "fear"].map(
												(emotionType) => {
													const isActive =
														emotions?.emotion?.toLowerCase() === emotionType;
													const details = getEmotionDetails(emotionType);
													return (
														<div
															key={emotionType}
															className={`p-4 rounded-lg ${
																isActive
																	? details.bgColor
																	: "bg-gray-100 dark:bg-gray-800"
															} flex flex-col items-center justify-center transition-all ${
																isActive ? "scale-110 shadow-md" : "opacity-70"
															}`}
														>
															<div
																className={
																	isActive ? details.color : "text-gray-400"
																}
															>
																{details.icon}
															</div>
															<span
																className={`mt-2 font-medium ${
																	isActive
																		? details.color
																		: "text-gray-500 dark:text-gray-400"
																}`}
															>
																{details.label}
															</span>
														</div>
													);
												},
											)}
										</div>
									</div>
								) : (
									<p>No emotion analysis available</p>
								)}
							</div>
						</TabsContent> */}
					</Tabs>
				</div>
			</div>
		</div>
	);
}
