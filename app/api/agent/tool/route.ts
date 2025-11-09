import { createTool, deleteTool, getTools, updateTool } from "@/utils/agent";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
	try {
		const { data, error } = await getTools();
		if (error) {
			throw (error as { response: { data: any } }).response?.data || error;
		}
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();
		const { data, error } = await createTool(body);
		if (error) {
			throw (error as { response: { data: any } }).response?.data || error;
		}
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();
		const { tool_id } = request.query;
		const { data, error } = await updateTool({ tool_id, ...body });
		if (error) {
			throw (error as { response: { data: any } }).response?.data || error;
		}
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
	try {
		const { tool_id } = request.query;
		const { data, error } = await deleteTool(tool_id as string);
		if (error) {
			throw (error as { response: { data: any } }).response?.data || error;
		}
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
