import CalCalendar from "@/components/ui/CalendarCards/CalCalendar";
import GoogleCalendar from "@/components/ui/CalendarCards/GoogleCalendar";
import Email from "@/components/ui/MessageCards/Email";
import SMS from "@/components/ui/MessageCards/SMS";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getInboundNumberDetails, getTools } from "@/utils/agent";
import { getUser } from "@/utils/auth-helpers/server";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";

const reservedTools = ["GoogleCalendarBookAppointment", "SendSMS", "SendEmail"];

export default async function Integrations() {
	const response = await getUser();
	const user = response?.data || null;
	let inboundNumberDetails;
	let tools;
	if (user) {
		inboundNumberDetails = await getInboundNumberDetails(
			user?.phones?.[0]?.number,
		);
		tools = await getTools();
	}

	if (!user) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>VocalDesk</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="space-y-1.5">
							<p className="text-gray-500 dark:text-gray-400">
								Build AI Phone Agents
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
					<p className="pb-4 sm:pb-0">
						You must be signed in to access this page.
					</p>
					<Link href="/signin">
						<Button>Sign In</Button>
					</Link>
				</CardFooter>
			</Card>
		);
	}

	return (
		<div className="px-4 space-y-8">
			<h1 className="mb-4 text-lg font-semibold">Integrations</h1>
			<Card>
				<CardHeader>
					<CardTitle>API Requests</CardTitle>
					<CardDescription>
						Interact with the real world by connecting your agent to external APIs.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mt-8 mb-4">
						<div className="space-y-4">
							{inboundNumberDetails?.tools?.filter(
								(_tool: any) => !reservedTools.includes(_tool?.name),
							)?.length <= 0 ? (
								<p className="text-sm">No API requests added.</p>
							) : (
								<>
									<div className="grid grid-cols-2 items-center gap-4">
										<p className="text-md font-semibold">Name</p>
										<p className="text-md font-semibold">Description</p>
									</div>
									{inboundNumberDetails?.tools
										?.filter((_tool: any) => !reservedTools.includes(_tool?.name))
										?.map((tool: any) => (
											<div
												key={tool.name}
												className="grid grid-cols-2 items-center gap-4"
											>
												<Link
													href={`/integrations/api-request/${tool.name}`}
													className="text-sm underline"
												>
													{tool.name}
												</Link>
												<p className="text-sm">{tool.description}</p>
											</div>
										))}
								</>
							)}
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
					{!inboundNumberDetails?.phone_number && (
						<p className="pb-4 sm:pb-0">
							Purchase a phone number before you add an API request.
						</p>
					)}
					<Link href="/integrations/api-request">
						<Button>Add API Request</Button>
					</Link>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Messages</CardTitle>
					<CardDescription>Send messages during the call.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mt-8 mb-4">
						<div className="grid grid-cols-2 gap-3">
							<SMS user={user} inboundNumberDetails={inboundNumberDetails} />
							<Email user={user} inboundNumberDetails={inboundNumberDetails} />
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Calendars</CardTitle>
					<CardDescription>
						Integrate your calendars and book appointments
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mt-8 mb-4">
						<div className="grid grid-cols-2 gap-3">
							<GoogleCalendar
								user={user}
								inboundNumberDetails={inboundNumberDetails}
							/>
							<CalCalendar
								user={user}
								inboundNumberDetails={inboundNumberDetails}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
