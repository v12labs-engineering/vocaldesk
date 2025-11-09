import EmailSignIn from "@/components/ui/AuthForms/EmailSignIn";
import ForgotPassword from "@/components/ui/AuthForms/ForgotPassword";
import PasswordSignIn from "@/components/ui/AuthForms/PasswordSignIn";
import SignUp from "@/components/ui/AuthForms/Signup";
import UpdatePassword from "@/components/ui/AuthForms/UpdatePassword";
import {
	getAuthTypes,
	getDefaultSignInView,
	getRedirectMethod,
	getViewTypes,
} from "@/utils/auth-helpers/settings";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignIn({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: { disable_button: boolean };
}) {
	const { allowEmail, allowPassword } = getAuthTypes();
	const viewTypes = getViewTypes();
	const redirectMethod = getRedirectMethod();

	let viewProp: string;

	if (typeof params.id === "string" && viewTypes.includes(params.id)) {
		viewProp = params.id;
	} else {
		const preferredSignInView =
			cookies().get("preferredSignInView")?.value || null;
		viewProp = getDefaultSignInView(preferredSignInView);
		return redirect(`/signin/${viewProp}`);
	}

	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session && viewProp !== "update_password") {
		return redirect("/");
	}
	if (!session && viewProp === "update_password") {
		return redirect("/signin");
	}

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="font-semibold text-gray-900">
					{viewProp === "signup" ? "Create your account" : "Welcome back"}
				</h2>
				<p className="mt-2 text-sm text-gray-600">
					{viewProp === "signup"
						? "Sign up for an account"
						: "Sign in to your account"}
				</p>
			</div>

			<div className="space-y-6">
				{viewProp === "password_signin" && (
					<PasswordSignIn
						allowEmail={allowEmail}
						redirectMethod={redirectMethod}
					/>
				)}
				{viewProp === "email_signin" && (
					<EmailSignIn
						allowPassword={allowPassword}
						redirectMethod={redirectMethod}
						disableButton={searchParams.disable_button}
					/>
				)}
				{viewProp === "forgot_password" && (
					<ForgotPassword
						allowEmail={allowEmail}
						redirectMethod={redirectMethod}
						disableButton={searchParams.disable_button}
					/>
				)}
				{viewProp === "update_password" && (
					<UpdatePassword redirectMethod={redirectMethod} />
				)}
				{viewProp === "signup" && (
					<SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} />
				)}
			</div>
		</div>
	);
}
