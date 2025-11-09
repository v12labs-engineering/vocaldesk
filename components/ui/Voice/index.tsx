"use client";

import LoadingDots from "@/components/ui/LoadingDots";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useState } from "react";

interface Props {
	selected: string;
	voices?: { id: string; name: string; description: string }[];
	onVoiceChange?: (e: any) => void;
	displayOnly?: boolean;
}

export default function Voice({
	selected,
	voices = [],
	onVoiceChange,
	displayOnly = false,
}: Props) {
	const [loading, setLoading] = useState(false);

	const handlePlay = async (e) => {
		setLoading(true);
		e.preventDefault();
		let blobUrl;
		const voice = voices.find((voice) => voice.name === selected);
		if (voice) {
			try {
				const response = await axios.post(
					"/api/agent/voice-sample",
					{ voice_id: voice.id },
					{ responseType: "blob" },
				);
				blobUrl = window.URL.createObjectURL(response.data);
				const audio = new Audio(blobUrl);
				audio.onerror = (e: any) => {
					console.error("Error code:", e.target.error.code);
					console.error("Error message:", e.target.error.message);
				};
				await audio.play();
			} catch (error) {
				console.error("Error playing audio:", error);
			} finally {
				setLoading(false);
				if (blobUrl) {
					window.URL.revokeObjectURL(blobUrl);
				}
			}
		}
	};

	if (displayOnly) {
		return (
			<div className="flex items-center gap-4">
				<div className="text-sm">
					{selected.charAt(0).toUpperCase() + selected.slice(1)} -{" "}
					<span className="text-xs text-muted-foreground">
						{voices?.find((voice) => voice.name === selected)?.description}
					</span>
				</div>
				<Button
					variant="ghost"
					size="icon"
					disabled={!selected}
					onClick={handlePlay}
				>
					{loading ? <LoadingDots /> : <SpeakerLoudIcon className="w-3 h-3" />}
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-4">
			<div className="flex-1">
				<Select onValueChange={(e) => onVoiceChange?.(e)} value={selected}>
					<SelectTrigger className="">
						<SelectValue placeholder="Select a voice">
							{selected && (
								<>
									{selected.charAt(0).toUpperCase() + selected.slice(1)} -{" "}
									<span className="text-xs text-gray-500">
										{
											voices.find((voice) => voice.name === selected)
												?.description
										}
									</span>
								</>
							)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{voices
								.filter((voice) => voice.description)
								.map((voice) => (
									<SelectItem key={voice.name} value={voice.name}>
										<div className="flex flex-col">
											<span>
												{voice.name.charAt(0).toUpperCase() +
													voice.name.slice(1)}
											</span>
											<span className="text-xs text-gray-500">
												{voice.description}
											</span>
										</div>
									</SelectItem>
								))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<Button
				variant="outline"
				disabled={!selected}
				onClick={handlePlay}
				size="icon"
				className="flex-shrink-0"
			>
				{loading ? <LoadingDots /> : <SpeakerLoudIcon className="w-4 h-4" />}
			</Button>
		</div>
	);
}
