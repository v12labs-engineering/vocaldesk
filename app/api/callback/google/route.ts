import { createClient } from "@/utils/supabase/server";
import { google } from "googleapis";
import type { NextRequest } from "next/server";

function getBaseUrl(req: NextRequest): string {
	const host =
		req.headers.get("x-forwarded-host") ||
		req.headers.get("host") ||
		"localhost:4000";
	const protocol =
		req.headers.get("x-forwarded-proto") ||
		req.headers.get("x-forwarded-protocol") ||
		req.nextUrl.protocol.replace(":", "");
	return `${protocol}://${host}`;
}

export async function GET(req: NextRequest) {
	const url = req.nextUrl;
	const code = url.searchParams.get("code");

	if (!code) {
		return new Response(
			JSON.stringify({ error: "Missing authorization code" }),
			{
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}

	const baseUrl = getBaseUrl(req);
	const redirectUri = `${baseUrl}/api/callback/google`;

	const oauth2Client = new google.auth.OAuth2(
		process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
		process.env.GOOGLE_OAUTH_CLIENT_SECRET,
		redirectUri,
	);

	try {
		// Exchange the authorization code for tokens
		const { tokens } = await oauth2Client.getToken(code);

		const supabase = createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Could not get user session.");
		}

		const { error } = await supabase.from("oauth_tokens").upsert(
			[
				{
					user_id: user?.id,
					access_token: tokens.access_token,
					refresh_token: tokens.refresh_token,
					expires_in: tokens.expiry_date
						? new Date(tokens.expiry_date).toISOString()
						: null, // You might need to calculate the exact timestamp depending on how you're handling expiration.
					token_type: tokens.token_type,
					scope: tokens.scope,
					service: "google",
				},
			],
			{
				onConflict: "user_id, service",
			},
		);

		if (error) {
			console.error("Error upserting tokens for google calendar:", error);
			return new Response(JSON.stringify({ error: "Failed to save tokens" }), {
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		return new Response(
			JSON.stringify({ message: "Authorized successfully!" }),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("Failed to exchange the authorization code:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
