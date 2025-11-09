import { getInboundNumberDetails, getPrompts } from "@/utils/agent";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

async function validateApiKey(apiKey: string) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("api_keys")
		.select("user_id")
		.eq("api_key", apiKey)
		.single();

	if (error || !data) {
		return null;
	}

	return data.user_id;
}

async function getPhoneNumber(userId: string) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("phones")
		.select("number")
		.eq("id", userId)
		.single();

	if (error || !data) {
		return null;
	}

	return data?.number;
}

export async function POST(request: NextRequest) {
	const contentType = request.headers.get("Content-Type");
	if (contentType !== "application/json") {
		return NextResponse.json(
			{ error: "Content-Type must be application/json" },
			{ status: 400 },
		);
	}

	const apiKey = request.headers.get("Authorization");
	if (!apiKey) {
		return NextResponse.json({ error: "Missing API key" }, { status: 401 });
	}

	const userId = await validateApiKey(apiKey);
	if (!userId) {
		return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
	}

	const phoneNumber = await getPhoneNumber(userId);
	if (!phoneNumber) {
		return NextResponse.json(
			{ error: "Invalid user or unable to get phone number" },
			{ status: 401 },
		);
	}

	const inboundNumberDetails = await getInboundNumberDetails(phoneNumber);
	if (!inboundNumberDetails) {
		return NextResponse.json(
			{ error: "Invalid user or unable to get phone number details" },
			{ status: 401 },
		);
	}

	try {
		const body = await request.json();

		if (!body.phone || !body.promptId) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const promptResponse = await getPrompts();
		if (promptResponse?.error) {
			throw (
				(promptResponse?.error as { response: { data: any } }).response?.data ||
				promptResponse?.error
			);
		}

		const prompt = promptResponse?.prompts?.find(
			(prompt: any) => prompt.id === `PT-${body.promptId}`,
		)?.prompt;

		if (!prompt) {
			return NextResponse.json({ error: "Invalid prompt ID" }, { status: 400 });
		}

		// Prepare the request body for Bland AI
		const payload = {
			phone_number: body.phone,
			from: phoneNumber || body?.from,
			task: prompt || "Hey there!",
			voice: body?.voice || inboundNumberDetails?.voice || "maya",
			first_sentence: body?.greetMessage || "",
			interruption_threshold: body?.interruptionThreshold || 100,
			model: "enhanced",
			temperature: body?.temperature || 0.5,
			transfer_phone_number: body?.transferPhoneNumber || null,
			transfer_list: body?.transferList || {},
			request_data: body?.callContext || {},
			tools: body?.tools || inboundNumberDetails?.tools || null,
			dynamic_data: body?.dynamicData || [],
			voicemail_message: body?.voicemailMessage || "",
			voicemail_action: body?.voicemailAction || "hangup",
			max_duration: body?.maxDuration || 30,
			webhook: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/agent`,
			metadata: body?.metadata
				? { ...body?.metadata, promptId: body?.promptId }
				: { promptId: body?.promptId },
			analysis_schema: body?.analysisSchema ||
				inboundNumberDetails?.analysis_schema || {
					first_name: "string",
					last_name: "string",
					email_address: "email",
					street: "string",
					city: "string",
					zip: "string",
					state: "string",
					country: "string",
					appointment_time: "YYYY-MM-DD HH:MM:SS",
				},
		};

		const options = {
			headers: {
				authorization: process.env.BLAND_API_KEY as string,
			},
		};

		try {
			const response = await axios.post(
				`${process.env.BLAND_API_URL}/calls`,
				payload,
				options,
			);
			return NextResponse.json(
				{
					status: response?.data?.status,
					message: response?.data?.message,
					callId: response?.data?.call_id,
				},
				{ status: 200 },
			);
		} catch (err) {
			// biome-ignore lint/complexity/noUselessCatch: <explanation>
			throw err;
		}
	} catch (error) {
		console.error("Error processing request:", error?.response?.data);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
