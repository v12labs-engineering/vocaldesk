import { getDefaultSignInView } from "@/utils/auth-helpers/settings";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default function SignIn() {
	const cookieStore = cookies();
	const preferredSignInView =
		cookieStore.get("preferredSignInView")?.value || null;
	const defaultView = getDefaultSignInView(preferredSignInView);

	// const headersList = headers();
	// let referer = headersList.get("referer");
	// if (referer && referer.indexOf("call-logs") !== -1) {
	// 	// Create a URL object from the referer
	// 	const url = new URL(referer);

	// 	console.log(url);

	// 	// Get the redirect_to parameter
	// 	const redirectTo = url.searchParams.get("redirect_to");

	// 	// If the redirect_to parameter exists and is not the desired URL, remove it
	// 	// biome-ignore lint/complexity/useOptionalChain: <explanation>
	// 	if (redirectTo && redirectTo.includes("/signin/password_signin")) {
	// 		url.searchParams.delete("redirect_to");
	// 		referer = url.toString();
	// 	}

	// 	return redirect(`/signin/${defaultView}?redirect_to=${referer}`);
	// }

	return redirect(`/signin/${defaultView}`);
}
