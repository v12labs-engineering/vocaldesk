"use client";

import { useToast } from "@/components/ui/Toasts/use-toast";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useState } from "react";
import LoadingDots from "../LoadingDots";

export default function CallSettings({
	numberDetails,
}: { numberDetails: any }) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [maxDuration, setMaxDuration] = useState<number>(
		numberDetails?.max_duration,
	);
	const [interruptionThreshold, setInterruptionThreshold] = useState<number>(
		numberDetails?.interruption_threshold,
	);
	const [record, setRecord] = useState<boolean>(numberDetails?.record);
	const [backgroundTrack, setBackgroundTrack] = useState<string>(
		numberDetails?.background_track ?? "null",
	);

	const saveCallSettings = async () => {
		setIsSubmitting(true);
		const payload = {
			phone_number: numberDetails.phone_number,
			max_duration: maxDuration ?? null,
			interruption_threshold: interruptionThreshold ?? null,
			record: record ?? null,
			background_track: backgroundTrack ?? null,
		};

		try {
			await axios.post("/api/agent", payload);
			toast({
				title: "Success!",
				description: "Saved call settings successfully",
				variant: "default",
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Oops! Something went wrong.",
				description: "Failed to save call settings. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Call Settings</CardTitle>
				<CardDescription>
					Advanced call settings for your agent.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mt-8 mb-4">
					<div className="grid grid-cols-2 gap-8">
						<div className="space-y-2">
							<Label>Max Duration (minutes)</Label>
							<p className="text-xs p-0 m-0 text-gray-500 dark:text-gray-400">
								The maximum duration that calls to your agent can last.
							</p>
							<Input
								type="number"
								placeholder="Please enter value in minutes(Default: 30min)"
								value={maxDuration}
								onChange={(e) =>
									setMaxDuration(Number.parseInt(e.target.value))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Interruption Threshold (ms)</Label>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Adjusts how patient the AI is when waiting for the user to
								finish speaking.
							</p>
							<Input
								type="number"
								placeholder="Please enter value in milliseconds(Default: 50ms)"
								value={interruptionThreshold}
								onChange={(e) =>
									setInterruptionThreshold(Number.parseInt(e.target.value))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Call Recording</Label>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Enable call recording for your agent.
							</p>
							<Switch checked={record} onChange={() => setRecord(!record)} />
						</div>
						<div className="space-y-2">
							<Label>Background Track</Label>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Use this to provide a more natural, seamless, engaging
								experience for the conversation
							</p>
							<Select
								value={backgroundTrack}
								onValueChange={(value) => setBackgroundTrack(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Background Track" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="null">
										Default, will play audible but quiet phone static.
									</SelectItem>
									<SelectItem value="office">
										Office-style soundscape
									</SelectItem>
									<SelectItem value="cafe">Cafe-like soundscape</SelectItem>
									<SelectItem value="none">
										Minimize background noise
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					{/* <div className="mt-8">
						<Label>Dispatch Call</Label>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Restricts calls to certain hours in your timezone.
						</p>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Coming Soon!
						</p>
					</div> */}
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex flex-col items-start justify-between sm:flex-row sm:items-center w-full">
					{!numberDetails?.phone_number && (
						<p className="pb-4 sm:pb-0">
							Purchase a phone number before you update the list.
						</p>
					)}
					<Button
						disabled={!numberDetails?.phone_number}
						onClick={() => saveCallSettings()}
					>
						Save{" "}
						{isSubmitting && (
							<span className="ml-2">
								<LoadingDots />
							</span>
						)}
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
