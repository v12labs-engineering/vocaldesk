"use client";

import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import type React from "react";
import { createContext, useEffect, useState } from "react";

interface BillingAddress {
	line1?: string;
	line2?: string;
	city?: string;
	state?: string;
	postal_code?: string;
	country?: string;
}

interface PaymentMethod {
	type?: string;
	card?: {
		brand?: string;
		last4?: string;
		exp_month?: number;
		exp_year?: number;
	};
}

interface SmtpSettings {
	host?: string;
	port?: number;
	username?: string;
	password?: string;
	from_email?: string;
}

interface TwilioSettings {
	account_sid?: string;
	auth_token?: string;
	phone_number?: string;
}

// User details from your database
interface UserDetails {
	id: string;
	full_name: string | null;
	avatar_url: string | null;
	billing_address: BillingAddress | null;
	payment_method: PaymentMethod | null;
	notify_email: string | null;
	notify_sms: string | null;
	whitelabel_admin: boolean | null;
	whitelabel_user: boolean | null;
	domain: string | null;
	prompts: string[] | null;
	webhook: string | null;
	smtp_settings: SmtpSettings | null;
	twilio_settings: TwilioSettings | null;
	mid_call_messages: any | null;
	metadata: any | null;
	textgrid_settings: any | null;
}

interface Phone {
	id: string;
	number: string | null;
	is_disabled: boolean | null;
	disabled_mechanism: any | null;
}

// Complete AppUser interface that combines Supabase User and our custom fields
interface AppUser extends User {
	details: UserDetails;
	phones: Phone[];
}

interface UserContextType {
	user: AppUser | null;
	loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
	undefined,
);

const supabase = createClient();

async function getUser(): Promise<AppUser | null> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (user) {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", user.id)
			.single();

		if (data && !error) {
			const { data: phones } = await supabase
				.from("phones")
				.select("*")
				.eq("id", user.id);

			return {
				...user,
				details: {
					...data,
					billing_address: data.billing_address as BillingAddress,
					payment_method: data.payment_method as PaymentMethod,
					smtp_settings: data.smtp_settings as SmtpSettings,
					twilio_settings: data.twilio_settings as TwilioSettings,
					mid_call_messages: data.mid_call_messages,
					metadata: data.metadata,
					textgrid_settings: data.textgrid_settings,
				},
				phones: (phones || []) as Phone[],
			};
		}
	}
	return null;
}

export function UserProvider({
	children,
	initialUser,
}: { children: React.ReactNode; initialUser: AppUser | null }) {
	const [user, setUser] = useState<AppUser | null>(initialUser);
	const [loading, setLoading] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getUser().then((user) => {
			setUser(user);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_IN") {
				getUser().then((user) => {
					setUser(user);
					setLoading(false);
				});
			} else if (event === "SIGNED_OUT") {
				setUser(null);
				setLoading(false);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [initialUser]);

	return (
		<UserContext.Provider value={{ user, loading }}>
			{children}
		</UserContext.Provider>
	);
}
