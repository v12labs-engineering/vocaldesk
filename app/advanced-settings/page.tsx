import CallSettings from "@/components/ui/SettingForms/CallSettings";
import LiveTransfer from "@/components/ui/SettingForms/LiveTransfer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getInboundNumberDetails } from "@/utils/agent";
import { getUser } from "@/utils/auth-helpers/server";
import Link from "next/link";

export default async function AdvancedSettings() {
	const response = await getUser();
	const user = response?.data || null;
	let inboundNumberDetails;
	if (user) {
		inboundNumberDetails = await getInboundNumberDetails(
			user?.phones?.[0]?.number,
		);
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
			<h1 className="mb-4 text-lg font-semibold">Advanced Settings</h1>
			<LiveTransfer numberDetails={inboundNumberDetails} />
			<CallSettings numberDetails={inboundNumberDetails} />
		</div>
	);
}
