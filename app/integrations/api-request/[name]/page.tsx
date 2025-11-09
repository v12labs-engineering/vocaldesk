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

export default async function UpdateAPIRequest({
	params,
}: { params: { name: string } }) {
	const response = await getUser();
	const user = response?.data || null;
	let inboundNumberDetails: any = {};
	let tool: any;

	if (user) {
		inboundNumberDetails = await getInboundNumberDetails(
			user?.phones?.[0]?.number,
		);
		tool = inboundNumberDetails?.tools?.find(
			(tool: any) => tool.name === decodeURIComponent(params?.name),
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
						<BreadcrumbLink href="/integrations/api-request">
							API Request
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{decodeURIComponent(params?.name)}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="mt-8">
				<APIRequest numberDetails={inboundNumberDetails} tool={tool} />
			</div>
		</div>
	);
}
