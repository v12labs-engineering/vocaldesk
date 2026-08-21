import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

const supportedMethods = new Set(["GET", "POST"]);

function getAllowedHosts() {
	return new Set(
		(process.env.API_PROXY_ALLOWED_HOSTS ?? "")
			.split(",")
			.map((host) => host.trim().toLowerCase())
			.filter(Boolean),
	);
}

export async function POST(request: NextRequest) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const payload = await request.json();
	const method = String(payload.method ?? "GET").toUpperCase();

	if (!supportedMethods.has(method)) {
		return NextResponse.json(
			{ error: "Only GET and POST requests are supported" },
			{ status: 400 },
		);
	}

	let target: URL;
	try {
		target = new URL(String(payload.url));
	} catch {
		return NextResponse.json({ error: "Invalid target URL" }, { status: 400 });
	}

	const allowedHosts = getAllowedHosts();
	if (
		target.protocol !== "https:" ||
		target.username ||
		target.password ||
		!allowedHosts.has(target.hostname.toLowerCase())
	) {
		return NextResponse.json(
			{
				error:
					"Target host is not allowed. Configure API_PROXY_ALLOWED_HOSTS with exact HTTPS hostnames.",
			},
			{ status: 403 },
		);
	}

	const headers = new Headers(payload.headers ?? {});
	headers.delete("host");
	headers.delete("content-length");

	const response = await fetch(target, {
		method,
		headers,
		body: method === "POST" ? String(payload.body ?? "") : undefined,
		redirect: "error",
	});

	return new NextResponse(response.body, {
		status: response.status,
		headers: {
			"content-type":
				response.headers.get("content-type") ?? "application/octet-stream",
		},
	});
}
