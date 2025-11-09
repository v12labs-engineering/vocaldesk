import EmailNotificationTemplate from "@/components/templates/EmailNotificationTemplate";
import { Resend } from "resend";
import NotificationProvider from "./notificationProvider";

class ResendProvider extends NotificationProvider {
	async sendEmail(to: string[], subject: string, body: any) {
		try {
			console.log(`Sending email via Resend to ${to}`);
			const resend = new Resend(process.env.RESEND_API_KEY);
			// const batchEmails = to.map((email) => ({
			// 	from: "Infernix <notifications@infernix.ai>",
			// 	to: email,
			// 	subject: subject,
			// 	react: Notification({ ...body }),
			// }));
			// const response = await resend.batch.send(batcEmails);
			const response = await resend.emails.send({
				from: "VocalDesk <notifications@vocaldesk.co>",
				to: to,
				subject: subject,
				react: EmailNotificationTemplate({ ...body }),
			});
			return { data: response, error: null };
		} catch (error) {
			console.error("Error sending email via Resend", error);
			return { data: null, error: error };
		}
	}

	async sendSMS(to: string, message: string) {
		throw new Error("Resend does not support sending SMS");
	}
}

export default ResendProvider;
