import { getUser } from "@/utils/auth-helpers/server";
import { redirect } from "next/navigation";

export default async function Home() {
	const response = await getUser();
	const user = response?.data || null;

	if (!user) {
		return redirect("/signin");
	}

	return redirect("/dashboard");
}
