import APIRequest from "@/components/ui/APIRequest";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getInboundNumberDetails } from "@/utils/agent";
import { getUser } from "@/utils/auth-helpers/server";

export default async function APIRequests() {
	const response = await getUser();
	const user = response?.data || null;
	let inboundNumberDetails: any = {};
	if (user) {
		inboundNumberDetails = await getInboundNumberDetails(
			user?.phones?.[0]?.number,
		);
	}

	return (
		<div className="px-4">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/integrations">Integrations</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Add API Request</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="mt-8">
				<APIRequest numberDetails={inboundNumberDetails} tool={null} />
			</div>
		</div>
	);
}
