"use client";

import { useToast } from "@/components/ui/Toasts/use-toast";
import { Button } from "@/components/ui/button";
import { getWindowParams, pollAuthWindow } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { CableIcon, UnplugIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import LoadingDots from "../LoadingDots";

const customPrompt = `
	I can assist you in booking appointments on your Google Calendar.

	To start, I will need the following details:
	1. The title of your appointment.
	2. The start date and time with your timezone.
	3. The duration of the appointment.

	Let's begin.

	1. What is the title of your appointment?
	- [Wait for user input]

	2. What is the start date and time for your appointment? Please include your timezone.
	- [Wait for user input]

	3. How long will the appointment last?
	- [Wait for user input]

	You have provided the following details:
	- **Title**: [Appointment Title]
	- **Start Date and Time**: [Start Date and Time]
	- **Timezone**: [Timezone]
	- **Duration**: [Duration]

	Shall I confirm these details and proceed to book the appointment?
	- [Wait for user confirmation]

	If the user confirms:
	- I will now book your appointment with the provided details.

	- Use the tool {{GoogleCalendarBookAppointment}} to book the appointment on Google Calendar. Provide the event name, start date, end date.

	- After the booking is successful, respond with:
	"Your appointment has been booked successfully. You will receive a confirmation shortly. Please check your calendar."

	If the user does not confirm or needs to make changes:
	- Let's update the details as needed. Please provide the revised information.
	- [Repeat the process as necessary]
`;

export default function GoogleCalendar({ user, inboundNumberDetails }: any) {
	const { toast } = useToast();
	const supabase = createClient();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [accessToken, setAccessToken] = useState("");
	const [disconnecting, setDisconnecting] = useState(false);

	const fetchAuthStatus = async () => {
		const { data, error } = await supabase
			.from("oauth_tokens")
			.select("*")
			.eq("user_id", user?.id)
			.eq("service", "google");

		if (error) {
			console.error("Error fetching auth status:", error);
		} else if (data && data.length > 0) {
			setAccessToken(data[0].access_token);
			setIsAuthenticated(true);
		} else {
			console.log("User is not authenticated with Google Calendar");
		}
	};

	const fetchUserTimezone = async () => {
		try {
			const response = await axios.get(
				"https://www.googleapis.com/calendar/v3/users/me/settings/timezone",
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			return response.data.value;
		} catch (error) {
			console.error("Error fetching user timezone:", error);
			return "UTC"; // Default to UTC if there's an error
		}
	};

	const registerGoogleCalendarTool = async () => {
		const bookAppointmentTool = {
			name: "GoogleCalendarBookAppointment",
			description: "Book an appointment on your Google Calendar",
			method: "POST",
			url: "https://www.googleapis.com/calendar/v3/calendars/primary/events",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			speech: "Please wait while I book that appointment for you",
			input_schema: {
				example: {
					name: "Meeting with John",
					email: "john@example.com",
					startDate: "2024-08-21T09:00:00",
					endDate: "2024-08-21T10:00:00",
				},
				type: "object",
				properties: {
					name: {
						type: "string",
						description: "Name of the event",
					},
					email: {
						type: "string",
						description: "Email address of the attendee",
					},
					startDate: {
						type: "string",
						description: "Start date and time of the event",
					},
					endDate: {
						type: "string",
						description: "End date and time of the event",
					},
				},
				required: ["name", "email", "startDate", "endDate"],
			},
			body: {
				summary: "{{input.name}}",
				start: {
					dateTime: "{{input.startDate}}",
					timeZone: "{{input.timeZone}}",
				},
				end: {
					dateTime: "{{input.endDate}}",
					timeZone: "{{input.timeZone}}",
				},
				attendees: [
					{
						email: "{{input.email}}",
					},
				],
				description: "{{phone_number}}",
			},
			response_data: [
				{
					name: "google_confirmation_message",
					data: "$.error.message",
				},
			],
			timeout: 99999999,
		};
		const timeZone = await fetchUserTimezone();

		// Set the timeZone in the body
		bookAppointmentTool.body.start.timeZone = timeZone;
		bookAppointmentTool.body.end.timeZone = timeZone;

		const existingTool = isToolRegistered();
		if (!existingTool) {
			inboundNumberDetails.tools.push(bookAppointmentTool);
		}

		const payload = {
			phone_number: inboundNumberDetails.phone_number,
			tools: inboundNumberDetails.tools.map((t: any) =>
				t.name === bookAppointmentTool.name ? bookAppointmentTool : t,
			),
		};

		axios.post("/api/agent", payload).then((response) => {
			if (response?.data?.error) {
				console.error(
					"Error adding Google Calendar tool:",
					response.data.error,
				);
			}
		});
	};

	const isToolRegistered = () => {
		return inboundNumberDetails?.tools?.find(
			(t: any) => t.name === "GoogleCalendarBookAppointment",
		);
	};

	useEffect(() => {
		fetchAuthStatus();
	}, [user]);

	useEffect(() => {
		if (isAuthenticated && accessToken) {
			const existingTool = isToolRegistered();
			if (!existingTool) {
				registerGoogleCalendarTool();
			}
		}
	}, [isAuthenticated, accessToken]);

	const getSiteUrl = () => {
		if (typeof window !== "undefined") {
			// Client-side
			return window.location.origin;
		}

		// Server-side
		// Use a default URL or try to construct it from headers
		return process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";
	};

	const initiateAuthFlow = async () => {
		const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
		const redirectUri = encodeURIComponent(
			`${getSiteUrl()}/api/callback/google`,
		);
		const scope = encodeURIComponent(
			"https://www.googleapis.com/auth/calendar",
		);
		const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

		// Open a new window for the Google OAuth
		const windowParams = getWindowParams();
		const googleAuthWindow = window.open(
			authUrl,
			"googleAuthWindow",
			windowParams,
		);
		await pollAuthWindow(googleAuthWindow);
		await fetchAuthStatus();
	};

	const disconnectGoogle = async () => {
		setDisconnecting(true);
		try {
			const { error } = await supabase
				.from("oauth_tokens")
				.delete()
				.eq("user_id", user?.id)
				.eq("service", "google");

			if (error) {
				throw error;
			}

			const updatedTools = inboundNumberDetails.tools.filter(
				(t: any) => t.name !== "GoogleCalendarBookAppointment",
			);

			const payload = {
				phone_number: inboundNumberDetails.phone_number,
				tools: updatedTools,
			};

			await axios.post("/api/agent", payload);
			toast({
				title: "Success!",
				description: "Disconnected Google Calendar.",
				variant: "default",
			});
		} catch (error) {
			toast({
				title: "Oops! Something went wrong.",
				description: "Failed to disconnect Google Calendar. Please try again.",
				variant: "destructive",
			});
		} finally {
			setDisconnecting(false);
			setIsAuthenticated(false);
			setAccessToken("");
		}
	};

	return (
		<div className="max-w-sm p-4 border border-gray-200 dark:border-gray-800 rounded-md">
			<div className="flex gap-2 items-center pb-3">
				<img
					src="https://lh3.googleusercontent.com/K0vgpnn9Vour8ByU3htR3ou5Cx70Me-lW_51VEAIS5dfzXCQ0otXakVuPiQVc0V6qcf9aP_vkVul59airN27m3mttf4zQ1TPv4MVrw"
					alt="Google Calendar"
					className="w-8 h-8"
				/>
				<h5 className="font-semibold">Google</h5>
			</div>
			<p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
				Connect your Google Calendar and seamlessly book appointments.
			</p>
			<div className="flex items-end justify-end">
				{accessToken ? (
					<Button variant="secondary" onClick={disconnectGoogle}>
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
				) : (
					<Button variant="secondary" onClick={initiateAuthFlow}>
						<CableIcon className="w-4 h-4 mr-2" />
						Connect
					</Button>
				)}
			</div>
		</div>
	);
}
