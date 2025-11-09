import { updateInboundNumberDetails } from "@/utils/agent";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();
		const { data, error } = await updateInboundNumberDetails(body);
		if (error) {
			throw (error as { response: { data: any } }).response?.data || error;
		}
		return NextResponse.json({ data }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
