import { getVoiceSample } from "@/utils/agent";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();
		const { data, error } = await getVoiceSample(body?.voice_id);
		if (error) {
			throw (error as { response: { data: any } }).response?.data || error;
		}
		const response = new NextResponse(data);
		response.headers.set("Content-Type", "audio/mpeg");
		return response;
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
