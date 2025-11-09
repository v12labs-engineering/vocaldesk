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
import { CheckCircle2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

export default function PeoplevineCalendar({
	user,
	inboundNumberDetails,
}: any) {
	const supabase = createClient();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		company_no: "",
		api_username: "",
		api_password: "",
		api_key: "",
	});

	const { toast } = useToast();

	useEffect(() => {
		const fetchConnectionStatus = async () => {
			const { data, error } = await supabase
				.from("oauth_tokens")
				.select("*")
				.eq("user_id", user?.id)
				.eq("service", "peoplevine");

			if (error) {
				console.error("Error fetching auth status:", error);
			} else if (data && data.length > 0) {
				console.log("User is authenticated with Peoplevine");
				setIsAuthenticated(true);
				if (data) {
					const formData = data?.[0]?.metadata || {};
					setFormData(formData);
				}
			} else {
				console.log("User is not authenticated with Peoplevine");
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

	const connectPeoplevine = async (event: React.FormEvent<HTMLFormElement>) => {
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
						service: "peoplevine",
						metadata: {
							...formDataObject,
						},
					},
				],
				{ onConflict: "user_id, service" },
			);

			if (error) {
				console.error("Error connecting Peoplevine account:", error);
				toast({
					title: "Something went wrong",
					description: "Note: Ensure all required fields are filled correctly.",
					variant: "destructive",
				});
				return;
			}
			toast({
				title: "Connected!",
				description: "You are now connected to Peoplevine.",
				variant: "default",
			});
			setIsDialogOpen(false);
		} catch (error) {
			console.error("Error connecting Peoplevine account:", error);
			toast({
				title: "Something went wrong",
				description: "Note: Ensure all required fields are filled correctly.",
				variant: "destructive",
			});
		} finally {
			setSubmitting(false);
		}
	};

	// const prompt = `
	// 	As a customer service agent, your primary responsibility is to manage appointment bookings. When a user inquires about availability, activate the {{Get available slots}} tool to retrieve the slots.
	// 	Upon receiving {{availableSlots}}, analyze the data carefully, considering the specified timezone. Clearly articulate the available time slots. For example, state: 'Available appointment slots on June fifteenth, twenty twenty-four, are from four thirty to five AM, five to five thirty AM, and five thirty to six AM.'
	// 	After presenting the options, prompt the user by asking, 'Which time would you like to book for your appointment?'
	// 	Once the user selects a time slot, confirm the selection by repeating it and ask for final confirmation: 'You have chosen [time slot]. Shall I confirm this booking?'
	// 	Utilize the {{Book an appointment}} tool for booking, ensuring to input the correct 'schedule_slot_no' and 'schedule_item_no' from the user's confirmed slot object.
	// 	Conclude the interaction by confirming the booking to the user: 'Your appointment has been successfully booked. Thank you for choosing our services.'
	// `;

	// const tools = [{
	//   name: 'Get available slots',
	//   description: 'Get available slots from peoplevine',
	//   speech: 'Sure, let me check for available time slots',
	//   input_schema: {},
	//   method: 'POST',
	//   url: 'https://infernix-git-develop-sharath-challas-projects.vercel.app/api/peoplevine/available-slots',
	//   body: '{\n  "phone_number": {{to}}\n}',
	//   response_data: [Array]
	// },
	// {
	//   name: 'Book an appointment',
	//   description: 'Book an appointment with an available slot',
	//   speech: "Please wait while I'm booking appointment for you",
	//   input_schema: [Object],
	//   method: 'POST',
	//   url: 'https://infernix-git-develop-sharath-challas-projects.vercel.app/api/peoplevine/book-slot',
	//   body: '{\n' +
	//     '    "schedule_item_no": {{input.schedule_item_no}},\n' +
	//     '    "schedule_slot_no": {{input.schedule_slot_no}},\n' +
	//     '    "phone_number":  "{{to}}",\n' +
	//     '    "book_status": "booked",\n' +
	//     '    "customer_no": 0\n' +
	//     '}',
	//   response_data: [Array]
	// }];

	return (
		<div className="max-w-sm p-4 border border-gray-200 dark:border-gray-800 rounded-md">
			<div className="flex gap-2 items-center pb-3">
				{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="28"
					height="28"
					fill="none"
					viewBox="0 0 28 28"
					className="w-6 h-6"
				>
					<path
						fill="#628b79"
						d="M13.2594 0C9.74404 0.00412431 6.37386 1.40241 3.88814 3.88814C1.40241 6.37386 0.00412431 9.74404 0 13.2594L0 27.4202H14.1608C17.6762 27.4161 21.0464 26.0178 23.5321 23.5321C26.0178 21.0464 27.4161 17.6762 27.4202 14.1608V0H13.2594ZM12.5162 16.3582H25.0731C24.8334 17.5511 24.398 18.6962 23.7844 19.747H9.12729L12.5162 16.3582ZM14.6463 14.228L18.0028 10.8715H25.2936V14.1668C25.2936 14.1896 25.2936 14.2124 25.2936 14.234L14.6463 14.228ZM25.2936 8.73649H20.139L25.2936 3.58187V8.73649ZM13.2594 2.13018H23.7353L2.13018 23.7353V13.2594C2.13525 10.3093 3.30942 7.48148 5.39545 5.39545C7.48148 3.30942 10.3093 2.13525 13.2594 2.13018ZM14.1608 25.2936H3.58426L6.99831 21.8772H22.1769C21.1403 22.9579 19.8957 23.8177 18.5181 24.4049C17.1405 24.992 15.6583 25.2943 14.1608 25.2936Z"
					/>
				</svg>
				<h5 className="font-semibold">PeopleVine</h5>
			</div>
			<p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
				Connect your PeopleVine Calendar and seamlessly book appointments.
			</p>
			<div className="flex items-end justify-end">
				<Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
					<DialogTrigger asChild>
						<Button variant="outline">
							{isAuthenticated ? (
								<div className="flex items-center gap-2">
									<CheckCircle2 color="green" className="w-4 h-4" />
									Connected
								</div>
							) : (
								"Connect"
							)}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Connect your PeopleVine Account</DialogTitle>
							<DialogDescription>
								Provide required information to connect your PeopleVine account.
							</DialogDescription>
						</DialogHeader>
						<form
							id="peoplevineForm"
							name="peoplevineForm"
							className="flex flex-col items-center py-4 space-y-4 w-full"
							onSubmit={connectPeoplevine}
						>
							<div className="w-full space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									name="username"
									placeholder="Username"
									value={formData.username}
									onChange={handleChange}
								/>
							</div>
							<div className="w-full space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Password"
									value={formData.password}
									onChange={handleChange}
								/>
							</div>
							<div className="w-full space-y-2">
								<Label htmlFor="company_no">Company Number</Label>
								<Input
									id="company_no"
									name="company_no"
									placeholder="Company Number"
									value={formData.company_no}
									onChange={handleChange}
								/>
							</div>
							<div className="w-full space-y-2">
								<Label htmlFor="api_username">API Username</Label>
								<Input
									id="api_username"
									name="api_username"
									placeholder="API Username"
									value={formData.api_username}
									onChange={handleChange}
								/>
							</div>
							<div className="w-full space-y-2">
								<Label htmlFor="api_password">API Password</Label>
								<Input
									id="api_password"
									name="api_password"
									type="password"
									placeholder="API Password"
									value={formData.api_password}
									onChange={handleChange}
								/>
							</div>
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
							<Button type="submit" form="peoplevineForm">
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
