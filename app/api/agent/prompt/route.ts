import { createPrompt, deletePrompt } from "@/utils/agent";
import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();

		const data = await createPrompt(body);

		const supabase = createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Could not get user session.");
		}

		// Fetch the current prompts for the user
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("prompts")
			.eq("id", user.id)
			.single();

		if (userError) {
			throw userError;
		}

		// Parse the existing prompts or initialize an empty array
		const existingPrompts: string[] = userData?.prompts ? userData.prompts : [];

		// Check if the new prompt ID already exists
		if (!existingPrompts.includes(data?.prompt?.id)) {
			// Add the new prompt ID to the array
			existingPrompts.push(data?.prompt?.id);

			// Update the user's prompts in the database
			const { error: updateError } = await supabase
				.from("users")
				.update({ prompts: existingPrompts })
				.eq("id", user.id);

			if (updateError) {
				throw updateError;
			}
		} else {
			console.log("Prompt already exists for this user.");
		}

		return NextResponse.json({ data }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 400 });
	}
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
	try {
		// Extract promptId from the URL
		const url = new URL(request.url);
		const promptId = url.searchParams.get("promptId");

		if (!promptId) {
			throw new Error("promptId is required");
		}

		await deletePrompt(promptId);

		const supabase = createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Could not get user session.");
		}

		// Fetch the current prompts for the user
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("prompts")
			.eq("id", user.id)
			.single();

		if (userError) {
			throw userError;
		}

		// Parse the existing prompts or initialize an empty array
		const existingPrompts: string[] = userData?.prompts ? userData.prompts : [];

		if (existingPrompts.includes(promptId)) {
			// Check if the prompt ID exists in the array
			// Remove the prompt ID from the array
			existingPrompts.splice(existingPrompts.indexOf(promptId), 1);

			// Update the user's prompts in the database
			const { error: updateError } = await supabase
				.from("users")
				.update({ prompts: existingPrompts })
				.eq("id", user.id);

			if (updateError) {
				throw updateError;
			}
		} else {
			console.log("Prompt not found for this user.");
		}

		return NextResponse.json({ data: promptId }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 400 });
	}
}
