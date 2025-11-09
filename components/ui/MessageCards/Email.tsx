"use client";

import { useToast } from "@/components/ui/Toasts/use-toast";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { CheckCircleIcon, MailIcon, XCircleIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import LoadingDots from "../LoadingDots";

const EmailTool = {
	name: "SendEmail",
	description: "Sends an email",
	url: "https://app.vocaldesk.co/api/sms",
	method: "POST",
	body: '{\n  callerPhone: "{{phone_number}}",\n  aiPhone: "{{to}}",\n  message: "{{input.message}}",\n  \n}',
	input_schema: {
		example: {
			callerPhone: "+14155551234",
			aiPhone: "+15105551234",
			message: "Your appointment is confirmed for tomorrow at 10 AM.",
		},
		type: "object",
		properties: {
			callerPhone: {
				type: "string",
				description: "The recipient's phone number in E.164 format",
			},
			aiPhone: {
				type: "string",
				description:
					"The AI's phone number in E.164 format. This is the phone number that the AI is configured to.",
			},
			message: {
				type: "string",
				description: "The content of the SMS message",
			},
		},
		required: ["callerPhone", "aiPhone", "message"],
	},
	response: {
		message_sid: "$.sid",
		status: "$.status",
		error_code: "$.error_code",
		error_message: "$.error_message",
	},
};

export default function Email({ user, inboundNumberDetails }: any) {
	const { toast } = useToast();
	const supabase = createClient();
	const [submitting, setSubmitting] = useState(false);
	const [userDetails, setUserDetails] = useState(null);

	// useEffect(() => {
	// 	const fetchUserDetails = async () => {
	// 		const { data, error } = await supabase
	// 			.from("users")
	// 			.select("*")
	// 			.eq("id", user?.id)
	// 			.single();

	// 		if (error) {
	// 			console.error("Error fetching user details:", error);
	// 		} else if (data) {
	// 			setUserDetails(data);
	// 		}
	// 	};

	// 	fetchUserDetails();
	// }, [user]);

	const enableEmail = async () => {
		setSubmitting(true);
		try {
			inboundNumberDetails.tools.push(SMSTool);
			const payload = {
				phone_number: inboundNumberDetails.phone_number,
				tools: inboundNumberDetails.tools.map((t: any) =>
					t.name === SMSTool.name ? SMSTool : t,
				),
			};

			axios.post("/api/agent", payload).then((response) => {
				if (response?.data?.error) {
					console.error("Error adding SMS tool:", response.data.error);
				}
			});

			const { data, error } = await supabase
				.from("users")
				.update({ mid_call_messages: { sms: true } })
				.eq("id", user?.id);

			if (error) {
				throw error;
			}

			toast({
				title: "Success!",
				description: "SMS messages are now enabled.",
				variant: "default",
			});
		} catch (error) {
			toast({
				title: "Oops! Something went wrong.",
				description: "Failed to enable SMS messages. Please try again.",
				variant: "destructive",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const disableEmail = async () => {
		setSubmitting(true);
		try {
			// remove SMS tool
			const tools = inboundNumberDetails.tools.find(
				(t: any) => t.name !== SMSTool.name,
			);

			const payload = {
				phone_number: inboundNumberDetails.phone_number,
				tools,
			};

			axios.post("/api/agent", payload).then((response) => {
				if (response?.data?.error) {
					console.error("Error adding SMS tool:", response.data.error);
				}
			});

			const { data, error } = await supabase
				.from("users")
				.update({ mid_call_messages: { sms: false } })
				.eq("id", user?.id);

			if (error) {
				throw error;
			}

			toast({
				title: "Success!",
				description: "SMS messages are now disabled.",
				variant: "default",
			});
		} catch (error) {
			toast({
				title: "Oops! Something went wrong.",
				description: "Failed to disable SMS messages. Please try again.",
				variant: "destructive",
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="max-w-sm p-4 border border-gray-200 dark:border-gray-800 rounded-md">
			<div className="flex gap-2 items-center pb-3">
				<MailIcon className="w-8 h-8" />
				<h5 className="font-semibold">Email</h5>
			</div>
			<p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
				Send email during the call.
			</p>
			<div className="flex items-end justify-end">
				{userDetails?.mid_call_messages?.email ? (
					<Button variant="secondary" onClick={disableEmail}>
						<div className="flex items-center gap-2">
							<XCircleIcon color="red" className="w-4 h-4" />
							Disable
							{submitting && (
								<span className="ml-2">
									<LoadingDots />
								</span>
							)}
						</div>
					</Button>
				) : (
					<Button variant="secondary" onClick={enableEmail} disabled>
						{/* <CheckCircleIcon className="w-4 h-4 mr-2" /> */}
						Coming Soon
						{submitting && (
							<span className="ml-2">
								<LoadingDots />
							</span>
						)}
					</Button>
				)}
			</div>
		</div>
	);
}
