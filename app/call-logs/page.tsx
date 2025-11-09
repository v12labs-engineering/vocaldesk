import { columns } from "@/components/ui/DataTable/call-logs-columns";
import { DataTable } from "@/components/ui/DataTable/data-table";
import { getInboundCalls } from "@/utils/agent";
import { getUser } from "@/utils/auth-helpers/server";
import { redirect } from "next/navigation";

export default async function CallLogs() {
	const response = await getUser();
	const user = response?.data || null;
	let inboundCalls = [];
	if (user) {
		inboundCalls = await getInboundCalls(user?.phones?.[0]?.number);
	} else {
		redirect("/signin");
	}

	return (
		<div className="px-4">
			<h1 className="mb-4 text-lg font-semibold">Call Logs</h1>
			<div className="my-8">
				<DataTable
					data={inboundCalls?.calls || []}
					columns={columns}
					filters={{
						search: {
							columnKey: "from",
							placeholder: "Search by from number",
						},
						facetedFilters: [
							// {
							// 	columnKey: "queue_status",
							// 	title: "Status",
							// 	options: [
							// 		{ label: "Completed", value: "complete" },
							// 		{ label: "Error", value: "call_error" },
							// 	],
							// },
						],
					}}
				/>
			</div>
		</div>
	);
}
