"use server";

import { getUserById } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import type { UserResponse } from "@/utils/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthTypes } from "utils/auth-helpers/settings";
import {
	getErrorRedirect,
	getStatusRedirect,
	getURL,
	isValidEmail,
} from "utils/helpers";

export async function redirectToPath(path: string) {
	return redirect(path);
}

export async function SignOut(formData: FormData) {
	const pathName = String(formData.get("pathName")).trim();

	const supabase = createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		return getErrorRedirect(
			pathName,
			"Oops! Something went wrong.",
			"You could not be signed out.",
		);
	}

	return "/signin";
}

export async function signInWithEmail(formData: FormData) {
	const cookieStore = cookies();
	const domain = String(formData.get("domain")).trim();
	const callbackURL = `${domain}/auth/callback`;

	const email = String(formData.get("email")).trim();
	let redirectPath: string;

	if (!isValidEmail(email)) {
		redirectPath = getErrorRedirect(
			"/signin/email_signin",
			"Invalid email address.",
			"Please try again.",
		);
	}

	const supabase = createClient();
	const options = {
		emailRedirectTo: callbackURL,
		shouldCreateUser: true,
	};

	// If allowPassword is false, do not create a new user
	const { allowPassword } = getAuthTypes();
	// if (allowPassword) options.shouldCreateUser = false;
	const { data, error } = await supabase.auth.signInWithOtp({
		email,
		options: options,
	});

	if (error) {
		redirectPath = getErrorRedirect(
			"/signin/email_signin",
			"You could not be signed in.",
			error.message,
		);
	} else if (data) {
		cookieStore.set("preferredSignInView", "email_signin", { path: "/" });
		redirectPath = getStatusRedirect(
			"/signin/email_signin",
			"Success!",
			"Please check your email for a magic link. You may now close this tab.",
			true,
		);
	} else {
		redirectPath = getErrorRedirect(
			"/signin/email_signin",
			"Oops! Something went wrong.",
			"You could not be signed in.",
		);
	}

	return redirectPath;
}

export async function requestPasswordUpdate(formData: FormData) {
	const callbackURL = getURL("/auth/reset_password");

	// Get form data
	const email = String(formData.get("email")).trim();
	let redirectPath: string;

	if (!isValidEmail(email)) {
		redirectPath = getErrorRedirect(
			"/signin/forgot_password",
			"Invalid email address.",
			"Please try again.",
		);
	}

	const supabase = createClient();

	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: callbackURL,
	});

	if (error) {
		redirectPath = getErrorRedirect(
			"/signin/forgot_password",
			error.message,
			"Please try again.",
		);
	} else if (data) {
		redirectPath = getStatusRedirect(
			"/signin/forgot_password",
			"Success!",
			"Please check your email for a password reset link. You may now close this tab.",
			true,
		);
	} else {
		redirectPath = getErrorRedirect(
			"/signin/forgot_password",
			"Oops! Something went wrong.",
			"Password reset email could not be sent.",
		);
	}

	return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
	const cookieStore = cookies();
	const email = String(formData.get("email")).trim();
	const password = String(formData.get("password")).trim();
	const domain = String(formData.get("domain")).trim();
	let redirectPath: string;

	const supabase = createClient();
	const { error, data } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		redirectPath = getErrorRedirect(
			"/signin/password_signin",
			"Sign in failed.",
			error.message,
		);
	} else if (data.user) {
		if (domain === process.env.NEXT_PUBLIC_SITE_URL) {
			cookieStore.set("preferredSignInView", "password_signin", { path: "/" });
			redirectPath = getStatusRedirect(
				"/",
				"Success!",
				"You are now signed in.",
			);
			return redirectPath;
		}

		// Check if the user is associated with the current domain
		const { data: userDomain, error: userDomainError } = await supabase
			.from("users")
			.select("*")
			.eq("id", data.user.id)
			.eq("domain", domain)
			.single();

		if (userDomainError || !userDomain) {
			// If the user is not associated with this domain, sign them out and return an error
			await supabase.auth.signOut();
			redirectPath = getErrorRedirect(
				"/signin/password_signin",
				"Access denied.",
				"You are not authorized to access this application.",
			);
		} else {
			cookieStore.set("preferredSignInView", "password_signin", { path: "/" });
			redirectPath = getStatusRedirect(
				"/",
				"Success!",
				"You are now signed in.",
			);
		}
	} else {
		redirectPath = getErrorRedirect(
			"/signin/password_signin",
			"Oops! Something went wrong.",
			"You could not be signed in.",
		);
	}

	return redirectPath;
}

export async function signUp(formData: FormData) {
	const callbackURL = getURL("/auth/callback");

	const email = String(formData.get("email")).trim();
	const password = String(formData.get("password")).trim();
	let redirectPath: string;

	if (!isValidEmail(email)) {
		redirectPath = getErrorRedirect(
			"/signin/signup",
			"Invalid email address.",
			"Please try again.",
		);
	}

	const supabase = createClient();
	const { error, data } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: callbackURL,
		},
	});

	if (error) {
		redirectPath = getErrorRedirect(
			"/signin/signup",
			"Sign up failed.",
			error.message,
		);
	} else if (data.session) {
		redirectPath = getStatusRedirect("/", "Success!", "You are now signed in.");
	} else if (
		data.user &&
		data.user.identities &&
		data.user.identities.length == 0
	) {
		redirectPath = getErrorRedirect(
			"/signin/signup",
			"Sign up failed.",
			"There is already an account associated with this email address. Try resetting your password.",
		);
	} else if (data.user) {
		redirectPath = getStatusRedirect(
			"/",
			"Success!",
			"Please check your email for a confirmation link. You may now close this tab.",
		);
	} else {
		redirectPath = getErrorRedirect(
			"/signin/signup",
			"Oops! Something went wrong.",
			"You could not be signed up.",
		);
	}

	return redirectPath;
}

export async function updatePassword(formData: FormData) {
	const password = String(formData.get("password")).trim();
	const passwordConfirm = String(formData.get("passwordConfirm")).trim();
	let redirectPath: string;

	// Check that the password and confirmation match
	if (password !== passwordConfirm) {
		redirectPath = getErrorRedirect(
			"/signin/update_password",
			"Your password could not be updated.",
			"Passwords do not match.",
		);
	}

	const supabase = createClient();
	const { error, data } = await supabase.auth.updateUser({
		password,
	});

	if (error) {
		redirectPath = getErrorRedirect(
			"/signin/update_password",
			"Your password could not be updated.",
			error.message,
		);
	} else if (data.user) {
		redirectPath = getStatusRedirect(
			"/",
			"Success!",
			"Your password has been updated.",
		);
	} else {
		redirectPath = getErrorRedirect(
			"/signin/update_password",
			"Oops! Something went wrong.",
			"Your password could not be updated.",
		);
	}

	return redirectPath;
}

export async function updateEmail(formData: FormData) {
	// Get form data
	const newEmail = String(formData.get("newEmail")).trim();

	// Check that the email is valid
	if (!isValidEmail(newEmail)) {
		return getErrorRedirect(
			"/account",
			"Your email could not be updated.",
			"Invalid email address.",
		);
	}

	const supabase = createClient();

	const callbackUrl = getURL(
		getStatusRedirect("/account", "Success!", "Your email has been updated."),
	);

	const { error } = await supabase.auth.updateUser(
		{ email: newEmail },
		{
			emailRedirectTo: callbackUrl,
		},
	);

	if (error) {
		return getErrorRedirect(
			"/account",
			"Your email could not be updated.",
			error.message,
		);
	}
	return getStatusRedirect(
		"/account",
		"Confirmation email sent.",
		"You will need to confirm the update by clicking the link sent to new email addresses.",
	);
}

export async function updateName(formData: FormData) {
	// Get form data
	const fullName = String(formData.get("fullName")).trim();

	const supabase = createClient();
	const { error, data } = await supabase.auth.updateUser({
		data: { full_name: fullName },
	});

	if (error) {
		return getErrorRedirect(
			"/account",
			"Your name could not be updated.",
			error.message,
		);
	}
	if (data.user) {
		return getStatusRedirect(
			"/account",
			"Success!",
			"Your name has been updated.",
		);
	}
	return getErrorRedirect(
		"/account",
		"Oops! Something went wrong.",
		"Your name could not be updated.",
	);
}

export async function getUser(): Promise<UserResponse | undefined> {
	const supabase = createClient();
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { data: null, error: new Error("No authenticated user") };
		}

		const { data: userData } = await supabase
			.from("users")
			.select("*")
			.eq("id", user?.id)
			.single();

		const { data: phones } = await supabase
			.from("phones")
			.select("*")
			.eq("id", user?.id);

		return {
			data: { ...user, details: userData, phones: phones || [] },
			error: null,
		};
	} catch (error) {
		console.log("error", error);
		return { data: null, error: error as Error };
	}
}

export async function getUserByPhone(blandPhone: string) {
	const supabase = createClient();
	try {
		const { data: phone, error: phoneError } = await supabase
			.from("phones")
			.select("*")
			.eq("number", blandPhone)
			.single();

		if (phoneError) {
			throw phoneError;
		}

		const { data: user, error: userError } = await supabase
			.from("users")
			.select("*")
			.eq("id", phone.id)
			.single();

		if (userError) {
			throw userError;
		}

		return { data: user, error: null };
	} catch (error) {
		console.log("error", error);
		return { data: null, error: error as Error };
	}
}

export async function getUserNotificationConfig(
	blandPhone: string,
): Promise<UserResponse> {
	const supabase = createClient();
	try {
		const { data: phone, error: phoneError } = await supabase
			.from("phones")
			.select("*")
			.eq("number", blandPhone)
			.single();

		if (phoneError) {
			throw phoneError;
		}

		const { data: user, error: userError } = await supabase
			.from("users")
			.select(
				"notify_email,notify_sms,webhook,smtp_settings,twilio_settings,textgrid_settings,metadata",
			)
			.eq("id", phone.id)
			.single();

		if (userError) {
			throw userError;
		}

		return { data: user, error: null };
	} catch (error) {
		console.error("error", error);
		return { data: null, error: error as Error };
	}
}

export async function updateNotificationSettings(formData: FormData) {
	const newEmail = String(formData.get("newEmail")).trim();
	const phone = String(formData.get("phone")).trim();

	const supabase = createClient();
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("No authenticated user");
		}

		if (newEmail !== "null") {
			const { data: emails, error: emailError } = await supabase
				.from("users")
				.update({ notify_email: newEmail })
				.eq("id", user.id);

			if (emailError) {
				throw emailError;
			}
		}

		if (phone !== "null") {
			const { data: phones, error: phoneError } = await supabase
				.from("users")
				.update({ notify_sms: phone })
				.eq("id", user.id);

			if (phoneError) {
				throw phoneError;
			}
		}

		return getStatusRedirect(
			"/notifications",
			"Success!",
			"Your notifications have been updated.",
		);
	} catch (error) {
		console.log("error", error);
		return getErrorRedirect(
			"/notifications",
			"Your notifications could not be updated.",
			error?.message,
		);
	}
}

export async function getPeoplevineAuthConfig(blandPhone: string) {
	const supabase = createClient();
	try {
		const { data: phone, error: phoneError } = await supabase
			.from("phones")
			.select("*")
			.eq("number", blandPhone)
			.single();

		if (phoneError) {
			throw phoneError;
		}

		if (!phone) {
			throw new Error("No phone found");
		}

		if (phone?.id) {
			const { data: authStatus, error } = await supabase
				.from("oauth_tokens")
				.select("*")
				.eq("user_id", phone?.id)
				.eq("service", "peoplevine");

			if (error) {
				console.error("Error fetching auth status:", error);
				return { authConfig: null, error };
			}

			if (authStatus && authStatus.length > 0) {
				return { authConfig: authStatus?.[0]?.metadata || {}, error: null };
			}
		}
	} catch (error) {
		console.error("error", error);
		return { data: null, error: error as Error };
	}

	return { authConfig: null, error: null };
}

export async function getWhitelabelUsers(host: string) {
	const supabase = createClient();

	try {
		const { data: whitelabelUsers, error: whitelabelUsersError } =
			await supabase
				.from("users")
				.select("*")
				.eq("whitelabel_user", true)
				.eq("domain", host);

		if (whitelabelUsersError) {
			throw whitelabelUsersError;
		}

		// get asscoiated phone numbers from phones table
		const { data: phones, error: phonesError } = await supabase
			.from("phones")
			.select("*")
			.in(
				"id",
				whitelabelUsers?.map((user) => user.id),
			);

		if (phonesError) {
			throw phonesError;
		}

		const whitelabelUsersWithPhones = whitelabelUsers?.map((user) => {
			const phone = phones?.find((phone) => phone.id === user.id);
			return { ...user, ai_phone_number: phone?.number };
		});

		// get email of associated users using getUserbyId
		const results = await Promise.all(
			whitelabelUsersWithPhones?.map((user) => getUserById(user.id)),
		);

		const whitelabelUsersWithEmails = whitelabelUsersWithPhones?.map(
			(user, index) => {
				const userMetadata = results[index]?.data?.user;
				return {
					...user,
					email: userMetadata?.email,
					createdAt: userMetadata?.created_at,
					updatedAt: userMetadata?.updated_at,
					lastSignInAt: userMetadata?.last_sign_in_at,
				};
			},
		);

		return { data: whitelabelUsersWithEmails, error: null };
	} catch (error) {
		console.error("error", error);
		return { data: null, error: error as Error };
	}
}

export async function saveSMTPSettings(payload: any) {
	const supabase = createClient();
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("No authenticated user");
		}

		const { data, error } = await supabase
			.from("users")
			.update({ smtp_settings: payload })
			.eq("id", user.id);

		if (error) {
			throw error;
		}

		return { error: null };
	} catch (error) {
		console.error("error", error);
		return { error: error as Error };
	}
}

export async function saveTwilioSettings(payload: any) {
	const supabase = createClient();
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("No authenticated user");
		}

		const { data, error } = await supabase
			.from("users")
			.update({ twilio_settings: payload })
			.eq("id", user.id);

		if (error) {
			throw error;
		}

		return { error: null };
	} catch (error) {
		console.error("error", error);
		return { error: error as Error };
	}
}

export async function saveTextgridSettings(payload: any) {
	const supabase = createClient();
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("No authenticated user");
		}

		const { data, error } = await supabase
			.from("users")
			.update({ textgrid_settings: payload })
			.eq("id", user.id);

		if (error) {
			throw error;
		}

		return { error: null };
	} catch (error) {
		console.error("error", error);
		return { error: error as Error };
	}
}
