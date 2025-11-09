import { generateApiKey } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const supabase = createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const apiKey = generateApiKey();

		// Check if the user already has an API key
		const { data: existingKey } = await supabase
			.from("api_keys")
			.select("*")
			.eq("user_id", user.id)
			.single();

		let result;
		if (existingKey) {
			// Update existing API key
			result = await supabase
				.from("api_keys")
				.update({ api_key: apiKey, created_at: new Date().toISOString() })
				.eq("id", existingKey.id)
				.select()
				.single();
		} else {
			// Insert new API key
			result = await supabase
				.from("api_keys")
				.insert({
					user_id: user.id,
					api_key: apiKey,
				})
				.select()
				.single();
		}

		if (result.error) {
			console.error("Error inserting/updating API key:", result.error);
			return NextResponse.json(
				{ error: "Failed to generate API key" },
				{ status: 500 },
			);
		}

		// Return only the API key, not the entire database record
		return NextResponse.json({ apiKey }, { status: 200 });
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 },
		);
	}
}
