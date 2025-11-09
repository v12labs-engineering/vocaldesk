import { DataTable } from "@/components/ui/DataTable/data-table";
import { columns } from "@/components/ui/DataTable/outbound-calls-columns";
import { Button } from "@/components/ui/button";
import { getOutboundCalls } from "@/utils/agent";
import { getUser } from "@/utils/auth-helpers/server";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OutboundCalls() {
	const response = await getUser();
	const user = response?.data || null;
	let outboundCalls = [];
	if (user) {
		outboundCalls = await getOutboundCalls(user?.phones?.[0]?.number);
	} else {
		redirect("/signin");
	}

	return (
		<div className="px-4">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold">Outbound Calls</h1>
				<Link className="text-blue-500" href="/outbound-calls/new">
					<Button variant="default">
						<PlusCircledIcon className="h-4 w-4 mr-2" />
						Create Outbound Batch
					</Button>
				</Link>
			</div>
			<div className="my-8">
				<DataTable
					data={outboundCalls?.batches || []}
					columns={columns}
					filters={{
						search: {
							columnKey: "label",
							placeholder: "Search by name",
						},
						facetedFilters: [],
					}}
				/>
			</div>
		</div>
	);
}
