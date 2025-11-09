import PhoneAgentForm from "@/components/ui/PhoneAgentForm";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import { getInboundNumberDetails, getVoices } from "@/utils/agent";
import { getUser } from "@/utils/auth-helpers/server";

export default async function Agent() {
	const response = await getUser();
	const user = response?.data || null;
	let inboundNumberDetails;
	let filteredVoices; //remove with name bland
	if (user) {
		inboundNumberDetails = await getInboundNumberDetails(
			user?.phones?.[0]?.number,
		);
		const voices = await getVoices();
		filteredVoices = voices?.voices.filter(
			(voice: any) =>
				!voice.name.toLowerCase().includes("bland") &&
				!voice.name.toLowerCase().includes("public"),
		);
	}

	if (!user) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>VocalDesk</CardTitle>
					<CardDescription>Build AI Phone Agents</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="space-y-1.5">
							<p className="text-gray-500 dark:text-gray-400">
								You must be signed in to access this page.
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
					<Link href="/signin">
						<Button>Sign In</Button>
					</Link>
				</CardFooter>
			</Card>
		);
	}
	return (
		<div className="px-4">
			<h1 className="mb-4 text-lg font-semibold">AI Phone Agent</h1>
			<div className="my-8">
				<PhoneAgentForm
					inboundNumberDetails={inboundNumberDetails}
					voices={filteredVoices}
				/>
			</div>
		</div>
	);
}
