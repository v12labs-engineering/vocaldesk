import { OutboundCallBatchForm } from "@/components/ui/OutboundCallBatchForm";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getInboundNumberDetails, getVoices } from "@/utils/agent";
import { getUser } from "@/utils/auth-helpers/server";
import { redirect } from "next/navigation";

type VoiceType = {
	id: string;
	name: string;
	description: string;
};

type Props = {
	inboundNumberDetails: {
		phone_number?: string;
		voice?: string;
		language?: string;
	};
	voices: VoiceType[];
};

export default async function NewOutboundBatchCall() {
	const response = await getUser();
	const user = response?.data || null;

	if (!user) {
		redirect("/signin");
	}

	const inboundNumberDetails = await getInboundNumberDetails(
		user?.phones?.[0]?.number,
	);
	const voices = await getVoices();
	const filteredVoices = voices?.voices.filter(
		(voice: { name: string }) =>
			!voice.name.toLowerCase().includes("bland") &&
			!voice.name.toLowerCase().includes("public"),
	);

	return (
		<div>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/outbound-calls">
							Outbound calls
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>New outbound call batch</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="mt-8">
				<OutboundCallBatchForm
					inboundNumberDetails={inboundNumberDetails}
					voices={filteredVoices}
				/>
			</div>
		</div>
	);
}
