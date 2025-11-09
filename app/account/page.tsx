import APIKey from "@/components/ui/AccountForms/APIKey";
import EmailForm from "@/components/ui/AccountForms/EmailForm";
import NameForm from "@/components/ui/AccountForms/NameForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Account() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/signin");
	}

	return (
		<div className="px-4 space-y-8">
			<h1 className="mb-4 text-lg font-semibold">Account</h1>
			<NameForm userName={user?.user_metadata?.full_name ?? ""} />
			<EmailForm userEmail={user.email} />
			{/* <APIKey /> */}
		</div>
	);
}
