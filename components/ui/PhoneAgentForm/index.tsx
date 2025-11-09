"use client";

import Language from "@/components/ui/Language";
import Phone from "@/components/ui/Phone";
import { useToast } from "@/components/ui/Toasts/use-toast";
import Voice from "@/components/ui/Voice";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RocketIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { MicIcon, PhoneIcon, SettingsIcon, UserIcon } from "lucide-react";
import { GlobeIcon, SpeakerIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { KnowledgeBase } from "../KnowledgeBase";
import LoadingDots from "../LoadingDots";

export default function PhoneAgentForm({
	voices,
	inboundNumberDetails,
}: { voices: any; inboundNumberDetails: any }) {
	const [phone, setPhone] = useState(inboundNumberDetails?.phone_number || "");
	const [name, setName] = useState(inboundNumberDetails?.metadata?.name || "");
	const [voice, setVoice] = useState(
		inboundNumberDetails?.voice || voices?.[0]?.name,
	);
	const [language, setLanguage] = useState(
		inboundNumberDetails?.language || "en",
	);
	const [prompt, setPrompt] = useState(inboundNumberDetails?.prompt || "");
	const [first_sentence, setFirstSentence] = useState(
		inboundNumberDetails?.first_sentence || null,
	);
	const [transfer_phone_number, setTransferPhoneNumber] = useState(
		inboundNumberDetails?.transfer_phone_number || null,
	);
	const [loading, setLoading] = useState(false);

	const { toast } = useToast();
	const webhook = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/agent`;

	const deployAgent = async () => {
		setLoading(true);
		try {
			await axios.post("/api/agent", {
				phone_number: phone,
				name,
				voice,
				language,
				prompt,
				transfer_phone_number: transfer_phone_number || null,
				first_sentence,
				model: "enhanced",
				webhook,
				metadata: {
					name,
				},
				analysis_schema: {
					first_name: "string",
					last_name: "string",
					email_address: "email",
					phone_number: "string",
					street: "string",
					city: "string",
					zip: "string",
					state: "string",
					country: "string",
					appointment_time: "YYYY-MM-DD HH:MM:SS",
					wants_to_book_appointment: "boolean",
				},
				analysis_prompt:
					"Extract all relevant details from the call transcripts, with a primary focus on accurately capturing any phone number user provides. If the phone number is not explicitly stated, attempt to extract it from the conversation context rather than relying solely on the caller ID. Additionally, identify and structure other key details such as personal information, contact details, location, and appointment preferences. Format the extracted data according to a predefined schema, ensuring accuracy and completeness. If any information is missing or ambiguous, infer logically where appropriate and flag uncertainties.",
			});
			toast({
				title: "Success!",
				description: `
                    Agent deployed!
                    Start taking inbound calls now..`,
				variant: "default",
			});
		} catch (error) {
			toast({
				title: "Oops! Something went wrong.",
				description: "Agent deployment failed! Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-5xl mx-auto">
			<div className="grid gap-6">
				{/* Main Configuration Card */}
				<Card>
					<CardHeader>
						<CardTitle>Configure Your AI Phone Agent</CardTitle>
						<CardDescription>
							Customize how your AI agent interacts with users
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-8">
							{/* Left Column */}
							<div className="space-y-8">
								{/* Agent Identity Section */}
								<div className="space-y-2">
									<div className="flex items-center gap-2 mb-2">
										<UserIcon className="w-4 h-4 text-muted-foreground" />
										<Label>Agent Name</Label>
									</div>
									<Input
										name="name"
										value={name}
										placeholder="Enter agent name..."
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								{/* Phone Setup Section */}
								<div className="space-y-2">
									<div className="flex flex-col items-start gap-2">
										<div className="flex items-center gap-2">
											<PhoneIcon className="w-4 h-4 text-muted-foreground" />
											<Label>Phone Number</Label>
										</div>
									</div>
									{phone ? (
										<Phone number={phone} />
									) : (
										<Link href="/onboarding">
											<Button variant="default" className="mt-3">
												Get Phone Number
											</Button>
										</Link>
									)}
								</div>
							</div>

							{/* Right Column */}
							<div className="space-y-8">
								{/* Voice Configuration */}
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<SpeakerIcon className="w-4 h-4 text-muted-foreground" />
										<Label>Voice</Label>
									</div>
									<Voice
										selected={voice}
										voices={voices}
										onVoiceChange={(name) => setVoice(name)}
									/>
								</div>
								{/* Language Selection */}
								<div className="space-y-2">
									<div className="flex items-center gap-2 mb-2">
										<GlobeIcon className="w-4 h-4 text-muted-foreground" />
										<Label>Language</Label>
									</div>
									<Language
										selected={language}
										onLanguageChange={(value) => setLanguage(value)}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Knowledge Base Card */}
				<Card>
					<CardHeader>
						<CardTitle>Agent Instructions</CardTitle>
						<CardDescription>
							A collection of information that the AI will use to answer
							questions.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Textarea
							name="prompt"
							value={prompt}
							rows={10}
							placeholder="Fits 8000 characters (approx 1600 words) of instructions. Try copy pasting your entire landing page's content here..."
							onChange={(e) => setPrompt(e.target.value)}
						/>
					</CardContent>
				</Card>

				{/* Call Settings Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							Call Settings
							<Link href="/advanced-settings">
								<Button variant="outline" size="sm">
									<SettingsIcon className="w-4 h-4 text-muted-foreground" />
									Advanced Settings
								</Button>
							</Link>
						</CardTitle>
						<CardDescription>
							Configure how your agent will interact with callers.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-6">
						{/* Greetings Section */}
						<div className="space-y-4">
							<div>
								<Label>Greetings</Label>
								<p className="text-sm text-muted-foreground mb-2">
									A phrase that your call will start with.
								</p>
								<Input
									name="first_sentence"
									value={first_sentence ?? ""}
									placeholder="Hello, how can I help you today?"
									onChange={(e) => setFirstSentence(e.target.value)}
								/>
							</div>
						</div>

						{/* Live Transfer Section */}
						<div className="space-y-4">
							<div>
								<Label>Live Transfer</Label>
								<p className="text-sm text-muted-foreground mb-2">
									Transfer to human under specific conditions.
								</p>
								<Input
									name="transfer_phone_number"
									value={transfer_phone_number ?? ""}
									placeholder="Phone number with country code.."
									onChange={(e) => setTransferPhoneNumber(e.target.value)}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Deploy Button */}
				<div className="flex justify-end">
					<Button
						disabled={!phone}
						size="lg"
						className="w-full md:w-auto"
						onClick={() => deployAgent()}
					>
						<RocketIcon className="w-5 h-5 mr-2" />
						Deploy AI Phone Agent
						{loading && (
							<span className="ml-2">
								<LoadingDots />
							</span>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
