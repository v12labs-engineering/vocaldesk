"use client";

import LoadingDots from "@/components/ui/LoadingDots";
import { useToast } from "@/components/ui/Toasts/use-toast";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { CableIcon, UnplugIcon } from "lucide-react";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";

export default function CalCalendar({ user, inboundNumberDetails }: any) {
	const supabase = createClient();
	const { theme } = useTheme();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [disconnecting, setDisconnecting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		api_key: "",
	});

	const { toast } = useToast();

	useEffect(() => {
		const fetchConnectionStatus = async () => {
			const { data, error } = await supabase
				.from("oauth_tokens")
				.select("*")
				.eq("user_id", user?.id)
				.eq("service", "cal");

			if (error) {
				console.error("Error fetching auth status:", error);
			} else if (data && data.length > 0) {
				console.log("User is authenticated with Cal.com");
				setIsAuthenticated(true);
				if (data) {
					const formData = data?.[0]?.metadata || {};
					setFormData(formData);
				}
			} else {
				console.log("User is not authenticated with Cal.com");
			}
		};

		fetchConnectionStatus();
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const onOpenChange = (open: boolean) => {
		setIsDialogOpen(open);
	};

	const isToolRegistered = (name) => {
		return inboundNumberDetails?.tools?.find((t: any) => t.name === name);
	};

	const getEventTypesTool = (apiKey: string) => {
		return {
			name: "CalEventTypes",
			description: "Fetch available event types from Cal.com",
			url: "https://api.cal.com/v1/event-types",
			method: "GET",
			query: {
				apiKey: apiKey,
			},
			headers: {
				"Content-Type": "application/json",
			},
			input_schema: {
				type: "object",
				properties: {},
			},
			response_data: [
				{
					name: "event_types",
					data: "$.event_types",
				},
			],
			timeout: 10000,
		};
	};

	const getBookAppointmentTool = (apiKey: string) => {
		return {
			name: "CalBookAppointment",
			description: "Book an appointment using Cal.com API",
			url: "https://api.cal.com/v1/bookings",
			method: "POST",
			query: {
				apiKey: apiKey,
			},
			body: {
				eventTypeId: "{{input.event_type_id}}",
				start: "{{input.start_time}}",
				responses: {
					name: "{{input.name}}",
					email: "{{input.email}}",
					guests: [],
					location: {
						value: "{{input.location_value}}",
						optionValue: "{{input.location_option_value}}",
					},
				},
				metadata: {},
				timeZone: "{{input.time_zone}}",
				language: "{{input.language}}",
			},
			input_schema: {
				example: {
					event_type_id: 12345,
					start_time: "2024-05-30T12:00:00.000Z",
					name: "John Doe",
					email: "johndoe@example.com",
					location_value: "inPerson",
					location_option_value: "",
					time_zone: "Europe/London",
					language: "en",
				},
				type: "object",
				properties: {
					event_type_id: { type: "number" },
					start_time: { type: "string", format: "date-time" },
					name: { type: "string" },
					email: { type: "string", format: "email" },
					location_value: { type: "string" },
					location_option_value: { type: "string" },
					time_zone: { type: "string" },
					language: { type: "string" },
				},
				required: [
					"event_type_id",
					"start_time",
					"name",
					"email",
					"location_value",
					"time_zone",
					"language",
				],
			},
			response_data: [],
			timeout: 10000,
		};
	};

	const registerTools = async () => {
		try {
			// get event types tool from cal.com
			const eventTypesTool = getEventTypesTool(formData.api_key);

			// get book appointment tool from cal.com
			const bookAppointmentTool = getBookAppointmentTool(formData.api_key);

			if (!isToolRegistered("CalEventTypes")) {
				// register event types tool
				inboundNumberDetails.tools.push(eventTypesTool);
			}

			if (!isToolRegistered("CalBookAppointment")) {
				// register book appointment tool
				inboundNumberDetails.tools.push(bookAppointmentTool);
			}

			const payload = {
				phone_number: inboundNumberDetails.phone_number,
				tools: inboundNumberDetails.tools,
			};

			axios.post("/api/agent", payload).then((response) => {
				if (response?.data?.error) {
					console.error("Error adding Cal.com tool:", response.data.error);
					return { data: null, error: response.data.error };
				}
			});
			return { data: true, error: null };
		} catch (error) {
			console.error("Error registering Cal.com tools:", error);
			return { data: null, error: error };
		}
	};

	const connectCalcom = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formDataObject = Object.fromEntries(formData.entries());
		setSubmitting(true);

		try {
			// update oauth_tokens table
			const { data, error } = await supabase.from("oauth_tokens").upsert(
				[
					{
						user_id: user?.id,
						access_token: "No token",
						refresh_token: "No token",
						expires_in: null,
						token_type: "manual",
						scope: null,
						service: "cal",
						metadata: {
							...formDataObject,
						},
					},
				],
				{ onConflict: "user_id, service" },
			);

			if (error) {
				console.error("Error connecting Cal.com account:", error);
				toast({
					title: "Something went wrong",
					description: "Note: Ensure all required fields are filled correctly.",
					variant: "destructive",
				});
				return;
			}

			const { error: toolErr } = await registerTools();
			if (toolErr) {
				toast({
					title: "Something went wrong",
					description: "Error registering tools. Please try again.",
					variant: "destructive",
				});
			}

			setIsAuthenticated(true);
			toast({
				title: "Connected!",
				description: "You are now connected to Cal.com",
				variant: "default",
			});
			setIsDialogOpen(false);
		} catch (error) {
			console.error("Error connecting Cal.com account:", error);
			toast({
				title: "Something went wrong",
				description: "Note: Ensure all required fields are filled correctly.",
				variant: "destructive",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const disconnectCalcom = async () => {
		setDisconnecting(true);
		try {
			const { error } = await supabase
				.from("oauth_tokens")
				.delete()
				.eq("user_id", user?.id)
				.eq("service", "cal");

			if (error) {
				throw error;
			}

			const updatedTools = inboundNumberDetails.tools.filter(
				(t: any) =>
					t.name !== "CalEventTypes" && t.name !== "CalBookAppointment",
			);

			const payload = {
				phone_number: inboundNumberDetails.phone_number,
				tools: updatedTools,
			};

			await axios.post("/api/agent", payload);
			toast({
				title: "Success!",
				description: "Disconnected Cal.com.",
				variant: "default",
			});
		} catch (error) {
			toast({
				title: "Oops! Something went wrong.",
				description: "Failed to disconnect Cal.com. Please try again.",
				variant: "destructive",
			});
		} finally {
			setDisconnecting(false);
			setIsAuthenticated(false);
		}
	};

	return (
		<div className="max-w-sm p-4 border border-gray-200 dark:border-gray-800 rounded-md">
			<div className="flex gap-2 items-center pb-3">
				{theme === "dark" ? (
					<img
						src="https://cal.com/logo-white.svg"
						alt="Cal.com"
						className="w-16 h-8"
					/>
				) : (
					<img
						src="https://cal.com/logo.svg"
						alt="Cal.com"
						className="w-16 h-8"
					/>
				)}
			</div>
			<p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
				Connect your Cal.com Calendar and seamlessly book appointments.
			</p>
			<div className="flex items-end justify-end">
				{isAuthenticated && (
					<Button variant="secondary" onClick={disconnectCalcom}>
						<div className="flex items-center gap-2">
							<UnplugIcon color="red" className="w-4 h-4" />
							Disconnect
							{disconnecting && (
								<span className="ml-2">
									<LoadingDots />
								</span>
							)}
						</div>
					</Button>
				)}
				<Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
					<DialogTrigger asChild>
						{!isAuthenticated && (
							<Button variant="secondary">
								<CableIcon className="w-4 h-4 mr-2" />
								Connect
							</Button>
						)}
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Connect your Cal.com Account</DialogTitle>
							<DialogDescription>
								Provide required information to connect your Cal.com account.
								You can find your API key in the{" "}
								<a
									href="https://app.cal.com/settings/developer/api-keys"
									target="_blank"
									rel="noreferrer"
									className="text-blue-500 underline"
								>
									Cal.com account settings
								</a>
							</DialogDescription>
						</DialogHeader>
						<form
							id="calForm"
							name="calForm"
							className="flex flex-col items-center py-4 space-y-4 w-full"
							onSubmit={connectCalcom}
						>
							<div className="w-full space-y-2">
								<Label htmlFor="api_key">API Key</Label>
								<Input
									id="api_key"
									name="api_key"
									placeholder="API Key"
									value={formData.api_key}
									onChange={handleChange}
								/>
							</div>
						</form>
						<DialogFooter>
							<Button type="submit" form="calForm">
								Connect{" "}
								{submitting && (
									<span className="ml-2">
										<LoadingDots />
									</span>
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
