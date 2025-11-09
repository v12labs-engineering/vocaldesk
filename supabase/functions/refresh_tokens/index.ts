import {
	type SupabaseClient,
	createClient,
} from "https://esm.sh/@supabase/supabase-js@2.7.1";

const refreshGoogleToken = async (row: any) => {
	let tokens = null;

	try {
		const data = {
			grant_type: "refresh_token",
			client_id: Deno.env.get("NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID"),
			client_secret: Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET"),
			refresh_token: row.refresh_token,
		};

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams(data),
		};

		const response = await fetch(
			"https://oauth2.googleapis.com/token",
			options,
		);
		tokens = await response.json();
		return tokens;
	} catch (error) {
		console.error("Error refreshing Google token:", error);
		return null;
	}
};

const upsertToken = async (supabaseClient: SupabaseClient, row: any) => {
	const { error } = await supabaseClient
		.from("oauth_tokens")
		.upsert([{ ...row }], {
			onConflict: "user_id, service",
		});

	if (error) {
		throw new Error("Upsert token failed");
	}
};

const updatePhoneAgent = async (data: any) => {
	const { phone_number, ...body } = data;
	const options = {
		headers: {
			authorization: Deno.env.get("BLAND_API_KEY"),
		},
	};

	try {
		const response = await fetch(
			`https://api.bland.ai/v1/inbound/${encodeURIComponent(phone_number)}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...options.headers,
				},
				body: JSON.stringify(body),
			},
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		return { data, error: null };
	} catch (err) {
		return { data: null, error: err };
	}
};

const fetchUserTimezone = async (accessToken: string) => {
	try {
		const response = await fetch(
			"https://www.googleapis.com/calendar/v3/users/me/settings/timezone",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.value;
	} catch (error) {
		console.error("Error fetching user timezone:", error);
		return "UTC"; // Default to UTC if there's an error
	}
};

const updateToolWithUpdatedToken = async (
	inboundNumberDetails,
	accessToken,
) => {

	const bookAppointmentTool = {
		name: "GoogleCalendarBookAppointment",
		description: "Book an appointment on your Google Calendar",
		method: "POST",
		url: "https://www.googleapis.com/calendar/v3/calendars/primary/events",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		speech: "Please wait while I book that appointment for you",
		input_schema: {
			example: {
				name: "Meeting with John",
				email: "john@example.com",
				startDate: "2024-08-21T09:00:00",
				endDate: "2024-08-21T10:00:00",
			},
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "Name of the event",
				},
				email: {
					type: "string",
					description: "Email address of the attendee",
				},
				startDate: {
					type: "string",
					description: "Start date and time of the event",
				},
				endDate: {
					type: "string",
					description: "End date and time of the event",
				},
			},
			required: ["name", "email", "startDate", "endDate"],
		},
		body: {
			summary: "{{input.name}}",
			start: {
				dateTime: "{{input.startDate}}",
				timeZone: "{{input.timeZone}}",
			},
			end: {
				dateTime: "{{input.endDate}}",
				timeZone: "{{input.timeZone}}",
			},
			attendees: [
				{
					email: "{{input.email}}",
				},
			],
			description: "{{phone_number}}",
		},
		response_data: [
			{
				name: "google_confirmation_message",
				data: "$.error.message",
			},
		],
		timeout: 99999999,
	};
	const timeZone = await fetchUserTimezone(accessToken);

	console.log("Fetched timezone:", timeZone);

	// Set the timeZone in the body
	bookAppointmentTool.body.start.timeZone = timeZone;
	bookAppointmentTool.body.end.timeZone = timeZone;

	try {
		const existingTool = inboundNumberDetails.tools.find(
			(t: any) => t.name === bookAppointmentTool.name,
		);

		if (!existingTool) {
			inboundNumberDetails.tools.push(bookAppointmentTool);
		}

		const payload = {
			phone_number: inboundNumberDetails.phone_number,
			tools: inboundNumberDetails.tools.map((t: any) =>
				t.name === bookAppointmentTool.name ? bookAppointmentTool : t,
			),
		};

		const results = await updatePhoneAgent(payload);
		if (results?.error) {
			throw new Error("Error updating phone agent");
		}

		return results?.data;
	} catch (error) {
		console.error("Error updating Google Calendar tool:", error);
		throw new Error("Error updating Google Calendar tool");
	}
};

const getInboundNumberDetails = async (phone_number: string) => {
	const options = {
		headers: {
			authorization: Deno.env.get("BLAND_API_KEY"),
		},
	};

	try {
		const response = await fetch(
			`https://api.bland.ai/v1/inbound/${encodeURIComponent(phone_number)}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					...options.headers,
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		return { data, error: null };
	} catch (err) {
		console.error("Error fetching phone agent details:", err);
		return { data: null, error: err };
	}
};

Deno.serve(async (req: Request) => {
	try {
		console.log("Deno server started!");
		const supabaseClient = createClient(
			Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") ?? "",
			Deno.env.get("SERVICE_ROLE_KEY") ?? "",
		);

		// Fetch tokens expiring in the next 15 minutes
		const expirationThreshold = new Date(
			Date.now() + 15 * 60 * 1000,
		).toISOString();

		const { data, error } = await supabaseClient
			.from("oauth_tokens")
			.select("*")
			.eq("service", "google")
			.lt("expires_in", expirationThreshold);

		if (error) {
			console.error("[Supabase]: Error fetching tokens:", error);
			return new Response(
				JSON.stringify({ message: "Error fetching tokens", error }),
				{
					headers: { "Content-Type": "application/json" },
					status: 400,
				},
			);
		}

		console.log(`Found ${data.length} tokens to refresh`);

		const results = [];
		for (const authToken of data) {
			const tokens = await refreshGoogleToken(authToken);
			if (tokens) {
				const newExpiresAt = new Date(
					Date.now() + tokens.expires_in * 1000,
				).toISOString();

				// Update oauth_tokens table with the new access tokens
				await upsertToken(supabaseClient, {
					user_id: authToken.user_id,
					access_token: tokens.access_token,
					refresh_token: authToken.refresh_token,
					expires_in: newExpiresAt,
					token_type: tokens.token_type,
					scope: tokens.scope,
					service: authToken.service,
					metadata: authToken.metadata,
				});

				// Fetch the phone agent details for the user
				const { data, error } = await supabaseClient
					.from("phones")
					.select("*")
					.eq("id", authToken.user_id)
					.single();

				console.log("[Supabase]: Fetched phone agent details:", data);

				if (error) {
					console.error(
						"[Supabase]: Error fetching phone agent details:",
						error,
					);
					return new Response(
						JSON.stringify({
							error: "[Supabase]: Error fetching phone agent details",
						}),
						{
							headers: { "Content-Type": "application/json" },
							status: 400,
						},
					);
				}

				// Get the phone agent details
				const inboundNumberDetails = await getInboundNumberDetails(
					data?.number,
				);

				console.log(
					"[Bland]: Fetched phone agent details:",
					inboundNumberDetails,
				);

				if (inboundNumberDetails?.error) {
					console.error(
						"[Bland]: Error fetching phone agent details:",
						inboundNumberDetails?.error,
					);
					return new Response(
						JSON.stringify({
							message: "[Bland]: Error fetching phone agent details",
							error: inboundNumberDetails?.error,
						}),
						{
							headers: { "Content-Type": "application/json" },
							status: 400,
						},
					);
				}

				// Update the phone agent with the new access token
				const updatedTools = await updateToolWithUpdatedToken(
					inboundNumberDetails?.data,
					tokens.access_token,
				);

				console.log("[Bland]: Agent updated tools:", updatedTools);

				results.push({ user_id: authToken.user_id, status: "refreshed" });
			} else {
				results.push({ user_id: authToken.user_id, status: "failed" });
			}
		}

		return new Response(
			JSON.stringify({ message: "Token refresh completed", results }),
			{
				headers: { "Content-Type": "application/json" },
				status: 200,
			},
		);
	} catch (error) {
		console.error("[Exception]: Error:", error);
		return new Response(JSON.stringify({ error: "Token refresh failed" }), {
			headers: { "Content-Type": "application/json" },
			status: 500,
		});
	}
});
