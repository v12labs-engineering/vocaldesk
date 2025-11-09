import { analyzeCall } from "@/utils/agent";
import {
	convertAnswersToObject,
	convertFieldsToQuestions,
	formatMinutes,
} from "@/utils/helpers";
import NotificationService from "@/utils/notifications/notificationService";
import { getJillsOfficeCallData } from "@/utils/supabase/admin";
import axios from "axios";
import moment from "moment";

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

export async function POST(req: Request): Promise<Response> {
	const body = await req.text();
	const header = req.headers.get("x-webhook-signature");
	const webhookSecret = process.env.BLAND_WEBHOOK_SECRET;

	try {
		// if (!header || !webhookSecret) {
		// 	return new Response("Webhook secret not found.", { status: 400 });
		// }
		// const isValid = verifyWebhookSignature(
		// 	webhookSecret,
		// 	JSON.stringify(req.body),
		// 	header,
		// );
		// if (!isValid) {
		// 	return new Response("Invalid signature.", { status: 400 });
		// }

		const callDetails = JSON.parse(body);
		// console.log("📞 Webhook received", callDetails);
		// const call = await analyzeCall(callDetails?.call_id);
		// console.log("📞 Call analyzed:", call);

		const jsonData = {
			to: callDetails?.to,
			from: callDetails?.from,
			summary:
				callDetails?.summary?.replace("**Summary:** ", "") ??
				"Not enough information to generate summary.",
			transcript: callDetails?.concatenated_transcript,
			transferredTo: callDetails?.transferred_to,
			direction: callDetails?.inbound ? "inbound" : "outbound",
			caller: {
				firstName: callDetails?.analysis?.first_name,
				lastName: callDetails?.analysis?.last_name,
				email: callDetails?.analysis?.email_address,
				appointmentTime: callDetails?.analysis?.appointment_time || "N/A",
				phoneNumber: callDetails?.variables?.phone_number,
				address: {
					street: callDetails?.analysis?.street || "N/A",
					city: callDetails?.analysis?.city || "N/A",
					zip: callDetails?.analysis?.zip || "N/A",
					state: callDetails?.analysis?.state || callDetails?.variables?.state,
					country:
						callDetails?.analysis?.country || callDetails?.variables?.country,
					timeZone: callDetails?.variables?.timezone,
				},
			},
			metadata: callDetails?.metadata || {},
			duration: formatMinutes(callDetails?.call_length),
			createdAt: callDetails?.created_at,
		};

		let notificationService = new NotificationService(
			process.env.NOTIFICATION_PROVIDER as string,
		);
		const aiPhone = callDetails?.inbound ? callDetails?.to : callDetails?.from;
		const notificationConfig =
			await notificationService.getNotificationConfig(aiPhone);
		const notificationEmails = notificationConfig?.data?.notify_email;
		const notificationSMS = notificationConfig?.data?.notify_sms;
		let webhook = notificationConfig?.data?.webhook;
		const customSmtpSettings = notificationConfig?.data?.smtp_settings;
		const twilioSettings = notificationConfig?.data?.twilio_settings;
		const textgridSettings = notificationConfig?.data?.textgrid_settings;
		const metadata = notificationConfig?.data?.metadata;

		let webhookError = null;
		let jillsOfficeCallData: any = {};

		// Handle Jill's Office webhook
		if (metadata?.jillsOffice) {
			const { data, error } = await getJillsOfficeCallData(
				callDetails?.call_id,
			);
			jillsOfficeCallData = data;
			if (!error && jillsOfficeCallData?.metadata?.jillsOfficeWebhook) {
				webhook = jillsOfficeCallData?.metadata?.jillsOfficeWebhook;
			}
		}

		if (webhook && webhook !== "null") {
			const headers = {
				"Content-Type": "application/json",
			};

			const body = {
				...jsonData,
				callDurationInMinutes: callDetails?.call_length,
			};

			if (jillsOfficeCallData?.metadata) {
				const fieldsToParse = jillsOfficeCallData?.metadata?.fieldsToParse;
				const jillsOfficeData = jillsOfficeCallData?.metadata?.jillsOfficeData;

				headers.apiKey = process.env.JILLS_OFFICE_API_KEY;
				body.jillsOfficeData = jillsOfficeData;

				if (fieldsToParse) {
					const { questions, originalObjectOrder } =
						convertFieldsToQuestions(fieldsToParse);

					const callAnalysis = await analyzeCall(
						callDetails?.call_id,
						questions,
					);

					const parsedFields = convertAnswersToObject(
						callAnalysis?.answers,
						originalObjectOrder,
					);
					body.parsedFields = parsedFields;
				}
			}

			try {
				const response = await axios.post(webhook, body, { headers });
				console.log("Webhook successfully sent:", response.status);
			} catch (error: any) {
				webhookError = error;
				console.error("Webhook error:", error.message);
				if (error?.response) {
					console.error(
						"Webhook response error:",
						error.response.status,
						error.response.data,
					);
				} else if (error?.request) {
					console.error("Webhook request error: No response received");
				}
			}
		}

		if (notificationEmails && notificationEmails !== "null") {
			const emails = notificationEmails
				.split(",")
				.map((email: string) => email.trim());

			if (customSmtpSettings?.isEnabled) {
				notificationService = new NotificationService("smtp");
				await notificationService.sendEmail(
					notificationEmails,
					"Summary of Your Recent Phone Call",
					{
						from: callDetails?.from,
						summary:
							callDetails?.summary?.replace("**Summary:** ", "") ??
							"Not enough information to generate summary.",
						date: moment(callDetails?.created_at).format("llll"),
						link: `${process.env.NEXT_PUBLIC_SITE_URL}/call-logs/${callDetails?.call_id}`,
						jsonData,
					},
					customSmtpSettings,
				);
			} else {
				await notificationService.sendEmail(
					emails,
					"Summary of Your Recent Phone Call",
					{
						from: callDetails?.from,
						summary:
							callDetails?.summary?.replace("**Summary:** ", "") ??
							"Not enough information to generate summary.",
						date: moment(callDetails?.created_at).format("llll"),
						link: `${process.env.NEXT_PUBLIC_SITE_URL}/call-logs/${callDetails?.call_id}`,
						jsonData,
					},
				);
			}
		}

		if (notificationSMS && notificationSMS !== "null") {
			const phones = notificationSMS
				.split(",")
				.map((phone: string) => phone.trim());
			const message = `
Summary of Your Recent Phone Call

You received a call from ${jsonData.from}.

${jsonData?.summary?.replace("**Summary:** ", "")}
			`;
			if (twilioSettings?.isEnabled) {
				notificationService = new NotificationService("twilio");
				await notificationService.sendSMS(phones, message, twilioSettings);
			} else if (textgridSettings?.isEnabled) {
				notificationService = new NotificationService("textgrid");
				await notificationService.sendSMS(phones, message, textgridSettings);
			} else {
				// await notificationService.sendSMS(phones, "New call analysis");
			}
		}

		// Include webhook error in the response if it occurred
		const responseBody = {
			...callDetails,
			webhookStatus: webhookError ? "failed" : "success",
			webhookError: webhookError
				? {
						message: webhookError.message,
						details: webhookError.response
							? webhookError.response.data
							: "No response details available",
					}
				: null,
		};

		return new Response(JSON.stringify(responseBody), {
			status: 200,
			headers: corsHeaders,
		});
	} catch (err: any) {
		console.log(`❌ Error message: ${err.message}`);
		return new Response(`Webhook Error: ${err.message}`, { status: 400 });
	}
}
