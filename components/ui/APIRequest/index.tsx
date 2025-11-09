"use client";

import LoadingDots from "@/components/ui/LoadingDots";
import { useToast } from "@/components/ui/Toasts/use-toast";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrashIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import APIRequestForm from "./APIRequestForm";
import APIRequestStructure from "./APIRequestStructure";
import InputSchema from "./InputSchema";
import ResponseData from "./ResponseData";

export default function APIRequest({
	numberDetails,
	tool,
}: { numberDetails: any; tool: any }) {
	const { toast } = useToast();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [formData, setFormData] = useState(
		tool ?? {
			name: "",
			description: "",
			speech: "",
			input_schema: {},
			method: "GET",
			url: "",
			headers: [],
			query: [],
			body: "",
			response_data: "",
		},
	);

	const saveAPIRequest = async () => {
		setIsSubmitting(true);

		try {
			if (!formData.name || !formData.url) {
				toast({
					title: "Oops! Please fill required fields.",
					description: "Name and URL are required fields.",
					variant: "destructive",
				});
				setIsSubmitting(false);
				return;
			}

			const toolPayload = { ...formData };
			if (toolPayload?.method === "GET") {
				delete toolPayload?.body;
			}

			if (toolPayload?.headers?.length === 0) {
				delete toolPayload?.headers;
			}

			if (toolPayload?.query?.length === 0) {
				delete toolPayload?.query;
			}

			// convert headers to object
			if (toolPayload?.headers?.length > 0) {
				toolPayload.headers = toolPayload.headers.reduce((acc, header) => {
					const key = header.key;
					const value = header.value;
					acc[key] = value;
					return acc;
				}, {});
			}

			// convert query to object
			if (toolPayload?.query?.length > 0) {
				toolPayload.query = toolPayload.query.reduce((acc, query) => {
					const key = query.key;
					const value = query.value;
					acc[key] = value;
					return acc;
				}, {});
			}

			const payload = {
				phone_number: numberDetails.phone_number,
				tools: !tool
					? [...(numberDetails.tools ?? []), toolPayload]
					: numberDetails.tools.map((t: any) =>
							t.name === tool.name ? toolPayload : t,
						),
			};
			const response = await axios.post("/api/agent", payload);

			if (response?.data?.error) {
				throw response.data.error;
			}

			toast({
				title: "Success!",
				description: "Saved API request successfully.",
				variant: "default",
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Oops! Something went wrong.",
				description: "Failed to add API request. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const deleteAPIRequest = async () => {
		setIsDeleting(true);
		try {
			const updatedTools = numberDetails.tools.filter(
				(t: any) => t.name !== tool.name,
			);
			const payload = {
				phone_number: numberDetails.phone_number,
				tools: updatedTools,
			};

			await axios.post("/api/agent", payload);
			toast({
				title: "Success!",
				description: "Deleted API request successfully.",
				variant: "default",
			});
			router.push("/integrations");
		} catch (error) {
			toast({
				title: "Oops! Something went wrong.",
				description: "Failed to delete API request. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<Accordion type="multiple" defaultValue={["name"]} className="w-full">
				<AccordionItem value="name">
					<AccordionTrigger className="font-bold text-md">
						Add Name & Description
					</AccordionTrigger>
					<AccordionContent className="rounded-lg border border-gray-200 dark:border-gray-800 bg-secondary/30 dark:bg-black p-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							The name and the description will help the AI phone agent when it
							decides to call the API.
						</p>
						<div className="flex flex-col gap-4 max-w-3xl px-4 py-6">
							<div className="space-y-2">
								<Label htmlFor="name" className="font-semibold">
									Name
								</Label>
								<Input
									id="name"
									type="text"
									value={formData.name}
									placeholder="Eg: Send SMS/Get Weather/Shedule Meeting"
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="description" className="font-semibold">
									Description
								</Label>
								<Textarea
									id="description"
									value={formData.description}
									placeholder="A short explanation of what the API does"
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="name" className="font-semibold">
									Wait Phrase
								</Label>
								<Input
									id="name"
									type="text"
									value={formData.speech}
									placeholder="(Optional) A phrase that will be spoken to the user while your API call waits for a response"
									onChange={(e) =>
										setFormData({ ...formData, speech: e.target.value })
									}
								/>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem
					value="input"
					className="border-gray-200 dark:border-gray-800"
				>
					<AccordionTrigger className="font-bold text-md">
						Define user input required to make an API request
					</AccordionTrigger>
					<AccordionContent className="rounded-lg border border-gray-200 dark:border-gray-800 bg-secondary/30 dark:bg-black p-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							This is the data that the user will provide to the API. This is a{" "}
							<a
								className="underline"
								href="https://json-schema.org/overview/what-is-jsonschema"
								target="_blank"
								rel="noreferrer"
							>
								JSON schema
							</a>{" "}
							describing the input data. You can use the editor below to define
							the input schema, and refer it as <code>{`{{input}}`}</code> that
							you can use in the request body/query/headers. To access nested
							properties, use dot notation:{" "}
							<code>{`{{input.property.subproperty}}`}</code>
						</p>
						<InputSchema
							inputSchema={formData?.input_schema || {}}
							setInputSchema={(inputSchema: any) =>
								setFormData({
									...formData,
									input_schema: { ...inputSchema },
								})
							}
						/>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem
					value="api"
					className="border-gray-200 dark:border-gray-800"
				>
					<AccordionTrigger className="font-bold text-md">
						API request builder
					</AccordionTrigger>
					<AccordionContent className="rounded-lg border border-gray-200 dark:border-gray-800 bg-secondary/30 dark:bg-black p-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							This is where you define the API request details. You can use the
							input schema defined above in the request body/query/headers.
						</p>
						<APIRequestForm
							formData={formData}
							setFormData={(apiDetails: any) =>
								setFormData({ ...formData, ...apiDetails })
							}
						/>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem
					value="response"
					className="border-gray-200 dark:border-gray-800"
				>
					<AccordionTrigger className="font-bold text-md">
						Extract response data
					</AccordionTrigger>
					<AccordionContent className="rounded-lg border border-gray-200 dark:border-gray-800 bg-secondary/30 dark:bg-black p-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Once your API request comes back, you need to extract the response
							data, and then make the phone agent aware of the new information.
							The variable name is case_sensitive and space_sensitive, use the
							exact name that you defined here in the prompt. Eg:{" "}
							<code>{`{{variable_name}}`}</code>. You can extract the data from
							the response using the JSONPath syntax. Eg:{" "}
							<code>{`$.data[0].name`}</code>
						</p>
						<ResponseData
							formData={formData}
							setFormData={(variables: any) =>
								setFormData({ ...formData, response_data: variables })
							}
						/>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem
					value="final_strucutre"
					className="border-gray-200 dark:border-gray-800"
				>
					<AccordionTrigger className="font-bold text-md">
						Preview API Request Structure
					</AccordionTrigger>
					<AccordionContent className="rounded-lg border border-gray-200 dark:border-gray-800 bg-secondary/30 dark:bg-black p-4">
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
							Make sure the API request structure is correct before saving and
							matches exactly the example mentioned in the documentation.
						</p>
						<APIRequestStructure
							formData={formData}
							setFormData={(finalApiDetails: any) =>
								setFormData(finalApiDetails)
							}
						/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<div className="flex items-center justify-between">
				<Button onClick={() => saveAPIRequest()} className="my-5">
					{tool ? "Update API Request" : "Save API Request"}{" "}
					{isSubmitting && (
						<span className="ml-2">
							<LoadingDots />
						</span>
					)}
				</Button>
				{tool && (
					<Button
						variant="destructive"
						onClick={() => deleteAPIRequest()}
						className="my-5"
					>
						<Trash2Icon className="w-4 h-4 mr-2" /> Delete{" "}
						{isDeleting && (
							<span className="ml-2">
								<LoadingDots />
							</span>
						)}
					</Button>
				)}
			</div>
		</>
	);
}
