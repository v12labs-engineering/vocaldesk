import { getUserNotificationConfig } from "@/utils/auth-helpers/server";
import NotificationService from "@/utils/notifications/notificationService";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
	const { aiPhone, callerPhone, message } = await request.json();
	const userNotificationConfig = await getUserNotificationConfig(aiPhone);

	if (!userNotificationConfig) {
		return NextResponse.json({ message: "User not found" }, { status: 404 });
	}

	const twilioConfig = userNotificationConfig?.data?.twilio_settings;
	const textgridConfig = userNotificationConfig?.data?.textgrid_settings;

	let notificationService;
	if (twilioConfig?.isEnabled) {
		notificationService = new NotificationService("twilio");
		await notificationService.sendSMS([callerPhone], message, twilioConfig);

		return NextResponse.json({ message: "Message sent" }, { status: 200 });
	}

	if (textgridConfig?.isEnabled) {
		notificationService = new NotificationService("textgrid");
		await notificationService.sendSMS([callerPhone], message, textgridConfig);

		return NextResponse.json({ message: "Message sent" }, { status: 200 });
	}

	return NextResponse.json(
		{ message: "Twilio is not enabled" },
		{ status: 400 },
	);
}
