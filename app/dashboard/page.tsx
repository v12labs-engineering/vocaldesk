import Analytics from "@/components/ui/Analytics";
import Language from "@/components/ui/Language";
import Phone from "@/components/ui/Phone";
import Voice from "@/components/ui/Voice";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	getInboundCalls,
	getInboundNumberDetails,
	getVoices,
} from "@/utils/agent";
import { getUser } from "@/utils/auth-helpers/server";
import { formatMinutes } from "@/utils/helpers";
import {
	GlobeIcon,
	PhoneIcon,
	SettingsIcon,
	SpeakerIcon,
	TableIcon,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { redirect } from "next/navigation";

interface InboundNumberDetails {
	metadata?: {
		name?: string;
	};
	voice?: string;
	language?: string;
}

interface Call {
	id: string;
	from: string;
	created_at: string;
	call_length: number;
	variables?: {
		city?: string;
	};
}

export default async function Dashboard() {
	const response = await getUser();
	const user = response?.data || null;
	let inboundCalls: { calls: Call[] } = { calls: [] };
	let inboundNumberDetails: InboundNumberDetails | null = null;
	let voices: { id: string; name: string; description: string }[] = [];
	if (user) {
		inboundCalls = await getInboundCalls(user?.phones?.[0]?.number);
		inboundNumberDetails = await getInboundNumberDetails(
			user?.phones?.[0]?.number,
		);
		const availableVoices = await getVoices();
		voices = availableVoices?.voices.filter(
			(voice: { name: string }) =>
				!voice.name.toLowerCase().includes("bland") &&
				!voice.name.toLowerCase().includes("public"),
		);
	} else {
		redirect("/signin");
	}

	const phone = user?.phones?.[0]?.number;

	return (
		<div className="space-y-8">
			<h1 className="mb-4 text-lg font-semibold">Dashboard</h1>

			{/* Phone Info Card */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div className="space-y-1">
						<CardTitle>AI Phone Agent</CardTitle>
						<CardDescription>
							Manage your virtual phone agent and access call logs
						</CardDescription>
					</div>
					<Button variant="outline" asChild size="sm">
						<Link href="/ai-agent" className="flex items-center gap-2">
							<SettingsIcon className="h-4 w-4" />
							<span>Configure Agent</span>
						</Link>
					</Button>
				</CardHeader>
				<CardContent className="p-6">
					<div className="grid grid-cols-2 gap-8">
						{/* Left Column */}
						<div className="space-y-6">
							<div>
								<div className="flex items-center gap-2 mb-2">
									<SettingsIcon className="h-4 w-4 text-muted-foreground" />
									<p className="text-sm font-medium">Agent Name</p>
								</div>
								<p className="text-xl font-bold text-primary flex items-center">
									{inboundNumberDetails?.metadata?.name || "Unnamed Agent"}
								</p>
							</div>
							<div>
								<div className="flex items-center gap-2 mb-2">
									<PhoneIcon className="h-4 w-4 text-muted-foreground" />
									<p className="text-sm font-medium">Phone Number</p>
								</div>
								{phone ? (
									<div className="flex items-center gap-2">
										<Phone number={phone} />
										<span className="ml-2 text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
											Active
										</span>
									</div>
								) : (
									<Link href="/onboarding">
										<Button variant="default" className="gap-2">
											Get Phone Number
										</Button>
									</Link>
								)}
							</div>
						</div>
						{/* Right Column */}
						<div className="space-y-6">
							<div>
								<div className="flex items-center gap-2 mb-2">
									<SpeakerIcon className="h-4 w-4 text-muted-foreground" />
									<p className="text-sm font-medium">Voice</p>
								</div>
								<Voice
									selected={inboundNumberDetails?.voice || "alloy"}
									displayOnly
									voices={voices || []}
								/>
							</div>
							<div>
								<div className="flex items-center gap-2 mb-2">
									<GlobeIcon className="h-4 w-4 text-muted-foreground" />
									<p className="text-sm font-medium">Language</p>
								</div>
								<Language
									selected={inboundNumberDetails?.language || "en"}
									displayOnly
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div className="space-y-1">
						<CardTitle>Recent Calls</CardTitle>
						<CardDescription>View your recent call logs</CardDescription>
					</div>
					<Button variant="outline" asChild size="sm">
						<Link href="/call-logs" className="flex items-center gap-2">
							<TableIcon className="h-4 w-4" />
							<span>Call Logs</span>
						</Link>
					</Button>
				</CardHeader>
				<CardContent className="p-6">
					{!inboundCalls?.calls?.length ? (
						<div className="text-center py-6">
							<PhoneIcon className="w-12 h-12 mx-auto text-muted-foreground/50" />
							<h3 className="mt-4 text-sm font-medium">No calls yet</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								When you receive calls, they'll appear here.
							</p>
						</div>
					) : (
						<div className="text-xs">
							<div className="grid grid-cols-4 gap-4 pb-2 border-b font-medium text-muted-foreground">
								<div>From</div>
								<div>Time</div>
								<div>Duration</div>
								<div>City</div>
							</div>
							{inboundCalls?.calls?.slice(0, 5).map((call: Call) => (
								<div
									key={call.id}
									className="grid grid-cols-4 gap-4 py-2 border-b last:border-0 items-center"
								>
									<div className="text-muted-foreground">{call.from}</div>
									<div className="text-muted-foreground">
										{moment(call.created_at).format("MMM DD, YYYY h:mm A")}
									</div>
									<div className="text-muted-foreground">
										{formatMinutes(call.call_length)}
									</div>
									<div className="text-muted-foreground">
										{call.variables?.city || "N/A"}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
			{/* Analytics Card */}
			<Card>
				<CardHeader>
					<CardTitle>Call Analytics</CardTitle>
					<CardDescription>
						View your call statistics and performance metrics
					</CardDescription>
				</CardHeader>
				<CardContent className="p-6">
					<Analytics calls={inboundCalls?.calls} />
				</CardContent>
			</Card>
		</div>
	);
}
