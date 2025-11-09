import { getPeoplevineAuthConfig } from "@/utils/auth-helpers/server";
import { convertToDate } from "@/utils/helpers";
import axios from "axios";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
	return new Response("", {
		status: 200,
		headers: corsHeaders,
	});
}

async function getAvailableSlots(phoneNumber?: string) {
	if (!phoneNumber) {
		return { data: null, error: "No phone number provided" };
	}

	const { authConfig, error } = await getPeoplevineAuthConfig(phoneNumber);
	if (error) {
		return { data: null, error };
	}

	if (!authConfig) {
		return { data: null, error: "No auth config found" };
	}

	const dataValue = {
		auth: authConfig,
		fields: {
			includePast: false,
			includeBooked: false,
		},
	};

	try {
		const response = await axios({
			url: "https://api.peoplevine.com/scheduler.asmx/returnScheduleSlots",
			method: "post",
			data: JSON.stringify(dataValue),
			headers: { "Content-Type": "application/json; charset=utf-8" },
		});

		const result = response.data;
		if (result?.d) {
			const availableSlots = JSON.parse(result.d).returnObject;
			if (availableSlots && availableSlots.length > 0) {
				const formattedAvailableSlots = availableSlots.map((slot) => {
					return {
						slot_id: slot.slot_id,
						slot_subject: slot.slot_subject,
						schedule_item_no: slot.schedule_item_no,
						schedule_slot_no: slot.schedule_slot_no,
						start_time: convertToDate(slot.slot_start, slot.timezone_id),
						end_time: convertToDate(slot.slot_end, slot.timezone_id),
						timezone_id: slot.timezone_id,
					};
				});
				return { data: formattedAvailableSlots, error: null };
			}
		}
		return {
			data: "No slots available",
			error: null,
		};
	} catch (error) {
		console.log("Axios call failed:", error);
		return { data: null, error };
	}
}

export async function POST(request: Request): Promise<Response> {
	try {
		const body = await request.json();
		const regex = /"phone_number":\s*(\+\d+)/;

		const match = body.match(regex);
		if (!match) {
			return new Response(
				JSON.stringify({
					data: null,
					error: "No phone number provided",
				}),
				{
					status: 400,
					headers: corsHeaders,
				},
			);
		}

		const phoneNumber = match[1];
		const { data, error } = await getAvailableSlots(phoneNumber);
		return new Response(JSON.stringify({ data, error }), {
			status: 200,
			headers: corsHeaders,
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				data: null,
				error: "Unable to fetch slots at the moment, please try again later.",
			}),
			{
				status: 400,
				headers: corsHeaders,
			},
		);
	}
}
