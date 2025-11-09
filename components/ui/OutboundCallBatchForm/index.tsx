"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import CSVReader from "react-csv-reader";
import { z } from "zod";

import ContactsTable from "@/components/ui/ContactsTable";
import LoadingDots from "@/components/ui/LoadingDots";
import Voice from "@/components/ui/Voice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	ChevronRightIcon,
	DownloadIcon,
	RocketIcon,
	UploadIcon,
} from "lucide-react";
import Language from "../Language";

const formSchema = z.object({
	base_prompt: z
		.string({ required_error: "Please enter a base prompt." })
		.min(1, "Prompt is required"),
	label: z
		.string({ required_error: "Please enter a name." })
		.min(1, "Name is required"),
	voice: z
		.string({ required_error: "Please select a voice." })
		.min(1, "Voice selection is required"),
	language: z
		.string({ required_error: "Please select a language." })
		.min(1, "Language selection is required"),
	model: z.string().optional(),
	first_sentence: z
		.string({ required_error: "Please enter a greeting." })
		.min(1, "Greeting is required"),
	wait_for_greeting: z.boolean().optional(),
	transfer_phone_number: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type VoiceType = {
	id: string;
	name: string;
	description: string;
};

type OutboundCallBatchFormProps = {
	inboundNumberDetails: {
		phone_number?: string;
		voice?: string;
		language?: string;
	};
	voices: VoiceType[];
};

export function OutboundCallBatchForm({
	inboundNumberDetails,
	voices,
}: OutboundCallBatchFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [csvData, setCsvData] = useState<Array<Record<string, string>>>([]);
	const [showTable, setShowTable] = useState(false);
	const [voice, setVoice] = useState(
		inboundNumberDetails?.voice || voices?.[0]?.name,
	);
	const [language, setLanguage] = useState(
		inboundNumberDetails?.language || "en-US",
	);
	const [formData, setFormData] = useState<FormData>({
		base_prompt: "",
		label: "",
		voice: voice,
		language: language,
		model: "enhanced",
		first_sentence: "",
		wait_for_greeting: false,
		transfer_phone_number: "",
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof FormData | "csvData", string>>
	>({});

	const validateForm = () => {
		try {
			if (csvData.length === 0) {
				setErrors((prev) => ({
					...prev,
					csvData: "Please upload contacts data",
				}));
				return false;
			}
			formSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Partial<Record<keyof FormData | "csvData", string>> =
					{};
				for (const err of error.errors) {
					if (err.path[0]) {
						newErrors[err.path[0] as keyof FormData] = err.message;
					}
				}
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleForce = useCallback(
		(
			data: Array<Record<string, string>>,
			fileInfo: { name: string; size: number; type: string },
		) => {
			setCsvData(data);
		},
		[],
	);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!validateForm()) return;

			try {
				setIsSubmitting(true);
				const outboundBatch = {
					call_data: csvData,
					...formData,
					metadata: {
						phone_number: inboundNumberDetails?.phone_number,
					},
				};

				if (outboundBatch.call_data.length === 0) {
					return;
				}

				await axios.post("/api/agent/batch", outboundBatch);
				router.push("/outbound-calls");
			} catch (error) {
				console.error("Error submitting form:", error);
			} finally {
				setIsSubmitting(false);
			}
		},
		[
			csvData,
			formData,
			inboundNumberDetails?.phone_number,
			router,
			validateForm,
		],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;
			setFormData((prev) => ({ ...prev, [name]: value }));
		},
		[],
	);

	const handleRemoveContact = (contact: Record<string, string>) => {
		const updatedData = csvData.filter((item) => item !== contact);
		setCsvData(updatedData);
	};

	const handleTableToggle = (e: React.MouseEvent) => {
		e.preventDefault();
		setShowTable(!showTable);
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Contact Upload</CardTitle>
					<CardDescription>
						Upload a CSV file with contact information for your outbound calls
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div>
						<p className="text-sm text-gray-500 mb-2">
							The first row should be the headers of the table, and your headers
							should not include any special characters other than hyphens (-)
							or underscores (_).
						</p>
						<div className="flex gap-2 mb-4">
							<Badge variant={"secondary"}>
								<DownloadIcon className="w-4 h-4 mr-1" />
								<a href="/simple.csv" download>
									Download Starter CSV
								</a>
							</Badge>
							<Badge variant={"secondary"}>
								<DownloadIcon className="w-4 h-4 mr-1" />
								<a href="/complex.csv" download>
									Download Complex CSV
								</a>
							</Badge>
						</div>
						<label htmlFor="csv-upload" className="block cursor-pointer">
							<div className="flex flex-col justify-center items-center px-4 py-8 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
								<UploadIcon className="w-8 h-8 text-gray-500" />
								<p className="text-sm text-gray-500 mt-2">
									Click or drag and drop a file here to upload
								</p>
							</div>
						</label>
						<div style={{ display: "none" }}>
							<CSVReader
								inputId="csv-upload"
								onFileLoaded={handleForce}
								parserOptions={{
									header: true,
									skipEmptyLines: true,
								}}
							/>
						</div>
						{errors.csvData && (
							<p className="text-sm text-red-500 mt-1">{errors.csvData}</p>
						)}
					</div>

					{csvData.length > 0 && (
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h3 className="text-sm font-medium">Uploaded Contacts</h3>
								<button
									type="button"
									className="inline-flex items-center text-sm text-blue-500 hover:text-blue-700"
									onClick={handleTableToggle}
								>
									{showTable ? "Hide" : "Show"} contact data
									<ChevronRightIcon
										className={`w-4 h-4 ml-2 transition-transform ${
											showTable ? "rotate-90" : ""
										}`}
									/>
								</button>
							</div>
							{showTable && (
								<ContactsTable
									data={csvData}
									onRemoveContact={handleRemoveContact}
								/>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<label className="text-sm font-medium">
								Name <span className="text-red-500">*</span>
							</label>
							<p className="text-sm text-gray-500">
								Give your outbound call batch a unique name
							</p>
							<Input
								name="label"
								value={formData.label}
								onChange={handleInputChange}
								placeholder="Enter name for your outbound call batch"
								className="mt-2"
							/>
							{errors.label && (
								<p className="text-sm text-red-500 mt-1">{errors.label}</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium">
								Prompt <span className="text-red-500">*</span>
							</label>
							<p className="text-sm text-gray-500">
								Enter the main conversation script
							</p>
							<Textarea
								name="base_prompt"
								value={formData.base_prompt}
								onChange={handleInputChange}
								placeholder="Enter your base prompt"
								rows={10}
								className="mt-2"
							/>
							{errors.base_prompt && (
								<p className="text-sm text-red-500 mt-1">
									{errors.base_prompt}
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Call Settings</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<label className="text-sm font-medium">
								Greetings <span className="text-red-500">*</span>
							</label>
							<p className="text-sm text-gray-500">
								Specify the opening sentence
							</p>
							<Input
								name="first_sentence"
								value={formData.first_sentence}
								onChange={handleInputChange}
								placeholder="Enter your greetings"
								className="mt-2"
							/>
							{errors.first_sentence && (
								<p className="text-sm text-red-500 mt-1">
									{errors.first_sentence}
								</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium">
								Voice Selection <span className="text-red-500">*</span>
							</label>
							<p className="text-sm text-gray-500">
								Choose the AI voice for all calls
							</p>
							<Voice
								selected={voice}
								voices={voices}
								onVoiceChange={(name) => {
									setVoice(name);
									setFormData((prev) => ({ ...prev, voice: name }));
								}}
							/>
							{errors.voice && (
								<p className="text-sm text-red-500 mt-1">{errors.voice}</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium">Transfer Phone</label>
							<p className="text-sm text-gray-500">
								Enter an optional transfer phone number
							</p>
							<Input
								name="transfer_phone_number"
								value={formData.transfer_phone_number}
								onChange={handleInputChange}
								placeholder="Enter your transfer phone number"
								className="mt-2"
							/>
						</div>

						<div>
							<label className="text-sm font-medium">
								Language <span className="text-red-500">*</span>
							</label>
							<p className="text-sm text-gray-500">
								Select the conversation language
							</p>
							<Language
								selected={language}
								onLanguageChange={(lang) => {
									setLanguage(lang);
									setFormData((prev) => ({ ...prev, language: lang }));
								}}
							/>
							{errors.language && (
								<p className="text-sm text-red-500 mt-1">{errors.language}</p>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end">
					<Button type="submit" className="flex items-center">
						<RocketIcon className="ml-2 h-4 w-4" />
						Send Outbound Calls
						{isSubmitting && (
							<span className="ml-2">
								<LoadingDots />
							</span>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
