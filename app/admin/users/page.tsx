import { DataTable } from "@/components/ui/DataTable/data-table";
import { columns } from "@/components/ui/DataTable/user-columns";
import { getUser, getWhitelabelUsers } from "@/utils/auth-helpers/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Users() {
	const response = await getUser();
	const user = response?.data || null;

	if (!user) {
		return redirect("/signin");
	}

	if (!user?.details?.whitelabel_admin) {
		redirect("/dashboard");
	}

	const headersList = headers();
	const host = headersList.get("host");

	const { data: whitelabelUsers, error: whitelabelUsersError } =
		await getWhitelabelUsers(host as string);

	console.log(whitelabelUsers);

	return (
		<div className="px-4">
			<h1 className="mb-4 text-lg font-semibold">Users</h1>
			<div className="my-8">
				<DataTable
					data={whitelabelUsers || []}
					columns={columns}
					filters={{
						search: {
							columnKey: "email",
							placeholder: "Search by email",
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
