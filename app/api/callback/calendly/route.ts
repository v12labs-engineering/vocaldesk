import OAuthHandler from "@/utils/oauth/OAuthHandler";
import { createClient } from "@/utils/supabase/server";
import type { NextRequest } from "next/server";

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

	const oauthHandler = new OAuthHandler({
		clientId: process.env.NEXT_PUBLIC_CALENDLY_OAUTH_CLIENT_ID as string,
		clientSecret: process.env.CALENDLY_OAUTH_CLIENT_SECRET as string,
		redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/callback/calendly`,
		providerUrls: {
			authorizationUrl: `${process.env.NEXT_PUBLIC_CALENDLY_AUTH_BASE_URL}/oauth/authorize`,
			tokenUrl: `${process.env.NEXT_PUBLIC_CALENDLY_AUTH_BASE_URL}/oauth/token`,
			refreshUrl: `${process.env.NEXT_PUBLIC_CALENDLY_AUTH_BASE_URL}/oauth/token`,
		},
	});

	try {
		// Exchange the authorization code for tokens
		const tokens = await oauthHandler.exchangeCodeForToken(code);

		const supabase = createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Could not get user session.");
		}

		const { data, error } = await supabase.from("oauth_tokens").upsert(
			[
				{
					user_id: user?.id,
					access_token: tokens.access_token,
					refresh_token: tokens.refresh_token,
					expires_in: tokens.expires_in
						? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
						: null,
					token_type: tokens.token_type,
					scope: tokens.scope,
					service: "calendly",
					metadata: {
						owner: tokens.owner,
						organization: tokens.organization,
					},
				},
			],
			{
				onConflict: "user_id, service",
			},
		);

		if (error) {
			console.error(`Error upserting tokens for calendly calendar:`, error);
			return false;
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
