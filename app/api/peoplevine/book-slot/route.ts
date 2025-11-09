import { getPeoplevineAuthConfig } from "@/utils/auth-helpers/server";
import axios from "axios";
import { NextResponse } from "next/server";

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

async function bookAvailableSlot(slotDetails?: any) {
	if (!slotDetails) {
		return { data: null, error: "No slot details provided" };
	}

	const { authConfig, error } = await getPeoplevineAuthConfig(
		slotDetails?.phone_number,
	);
	if (error) {
		return { data: null, error };
	}

	if (!authConfig) {
		return { data: null, error: "No auth config found" };
	}

	const dataValue = {
		auth: authConfig,
		books: [
			{
				schedule_item_no: slotDetails?.schedule_item_no,
				schedule_slot_no: slotDetails?.schedule_slot_no,
				book_status: "booked",
				customer_no: 0,
			},
		],
	};

	try {
		const response = await axios({
			url: "https://api.peoplevine.com/scheduler.asmx/bookScheduleSlot",
			method: "post",
			data: JSON.stringify(dataValue),
			headers: { "Content-Type": "application/json; charset=utf-8" },
		});

		const result = response.data;
		if (result?.d) {
			const bookedSlot = JSON.parse(result.d).returnObject;
			return { data: JSON.stringify(bookedSlot), error: null };
		}
		return {
			data: "Unable to book slot",
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
		const { data, error } = await bookAvailableSlot(body);
		if (error) {
			throw (error as { response: { data: any } }).response?.data || error;
		}
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: corsHeaders,
		});
	} catch (error) {
		return NextResponse.json({ error });
	}
}
