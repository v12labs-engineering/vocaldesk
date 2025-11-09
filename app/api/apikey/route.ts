import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
	try {
		const supabase = createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if the user already has an API key
		const { data: existingKey, error } = await supabase
			.from("api_keys")
			.select("api_key")
			.eq("user_id", user.id)
			.single();

		if (error) {
			console.error("Error retrieving API key:", error);
			return NextResponse.json(
				{ error: "Failed to retrieve API key" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ apiKey: existingKey.api_key }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
