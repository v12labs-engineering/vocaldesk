import { saveJillsOfficeCallData } from "@/utils/supabase/admin";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const corsHeaders = {
	"Access-Control-Allow-Origin": "https://app.bland.ai",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
	return new Response("", {
		status: 200,
		headers: corsHeaders,
	});
}

export async function GET(request: NextRequest): Promise<Response> {
	const searchParams = request.nextUrl.searchParams;
	const phoneNumber = searchParams.get("phone_number");
	const callId = searchParams.get("call_id");

	try {
		if (!phoneNumber || !callId) {
			return NextResponse.json(
				{ message: "Phone number or call ID is required" },
				{ status: 400 },
			);
		}

		// Send a request to the Jill's Office API to get the prompt
		try {
			const response = await axios.get(
				`${process.env.JILLS_OFFICE_API}/infernix/get-ai-prompt`,
				{
					params: {
						phoneNumber: phoneNumber,
					},
					headers: {
						"Content-Type": "application/json",
						apiKey: process.env.JILLS_OFFICE_API_KEY as string,
					},
				},
			);

			// const response = {
			// 	data: {
			// 		greeting:
			// 			"Hello there, this is Jill's test, the AI system for Jill's Office.",
			// 		callFinishedEndpoint:
			// 			"https://jills-office-developer-6.ngrok.io/infernix/ai-call-finished",
			// 		jillsOfficeData: {
			// 			callId: 4728,
			// 		},
			// 		fieldsToParse: {
			// 			firstName: "The firstname of the caller",
			// 			lastName: "The lastname of the caller",
			// 			phoneNumber: "The phone number the caller provided",
			// 			reasonForCall: "The purpose of the call made",
			// 			callBackRequested:
			// 				"Decision regarding the callback requested by the caller",
			// 		},
			// 		prompt: `You are an inbound agent for Jill's Office Test.
			// 		You should gather the caller's firstname and lastname, phone number, reason for the call and ask if the caller needed a callback.
			// 		After you receive the information, please repeat it back to the caller and hangup the call.
			// 		`,
			// 	},
			// };

			const jillsOfficeWebhook = response?.data?.callFinishedEndpoint;
			if (jillsOfficeWebhook) {
				const metadata = {
					fieldsToParse: response.data.fieldsToParse,
					jillsOfficeData: response.data.jillsOfficeData,
					jillsOfficeWebhook,
				};

				await saveJillsOfficeCallData(callId as string, metadata);
			}
			return NextResponse.json({ ...response.data }, { status: 200 });
		} catch (err) {
			console.error("[Jill's Office] Error fetching prompt:", err);
			throw new Error("Error fetching prompt");
		}
	} catch (error) {
		return NextResponse.json({ message: `Error: ${error}` }, { status: 500 });
	}
}
