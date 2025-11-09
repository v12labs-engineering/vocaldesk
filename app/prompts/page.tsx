import { DataTable } from "@/components/ui/DataTable/data-table";
import { columns } from "@/components/ui/DataTable/prompt-columns";
import CreatePromptDialog from "@/components/ui/Prompt/CreatePromptDialog";
import { getPrompts } from "@/utils/agent";
import { getUser } from "@/utils/auth-helpers/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Prompts() {
	const response = await getUser();
	const user = response?.data || null;
	let prompts = [];

	if (user) {
		// Fetch all prompts
		const { prompts: allPrompts } = await getPrompts();

		// Fetch the user's prompt IDs
		const supabase = createClient();
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("prompts")
			.eq("id", user.id)
			.single();

		if (userError) {
			console.error("Error fetching user prompts:", userError);
		} else {
			const userPromptIds = userData?.prompts || [];

			// Filter prompts to only include those in the user's prompt list
			prompts = allPrompts.filter((prompt) =>
				userPromptIds.includes(prompt.id),
			);
		}
	} else {
		redirect("/signin");
	}

	return (
		<div className="px-4">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold">Prompts</h1>
				<CreatePromptDialog userId={user.id} />
			</div>
			<div className="my-8">
				<DataTable
					data={prompts || []}
					columns={columns}
					filters={{
						search: {
							columnKey: "name",
							placeholder: "Search by name",
						},
						facetedFilters: [],
					}}
				/>
			</div>
		</div>
	);
}
