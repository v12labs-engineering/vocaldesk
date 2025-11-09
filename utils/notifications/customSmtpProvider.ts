import EmailNotificationTemplate from "@/components/templates/EmailNotificationTemplate";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import NotificationProvider from "./notificationProvider";

class CustomSmtpProvider extends NotificationProvider {
	async sendEmail(to: string[], subject: string, body: any, smtpSettings: any) {
		try {
			console.log(`Sending email via custom SMTP to ${to}`);
			const transporter = nodemailer.createTransport({
				host: smtpSettings.host,
				port: Number.parseInt(smtpSettings.port),
				secure: Number.parseInt(smtpSettings.port) === 465,
				auth: {
					user: smtpSettings.username,
					pass: smtpSettings.password,
				},
			});

			const emailHtml = render(EmailNotificationTemplate({ ...body }));

			const response = await transporter.sendMail({
				from: `${smtpSettings.senderName} <${smtpSettings.senderEmail}>`,
				to,
				subject,
				html: emailHtml,
			});
			return { data: response, error: null };
		} catch (error) {
			console.error("Error sending email via custom SMTP", error);
			return { data: null, error: error };
		}
	}

	async sendSMS(to: string, message: string) {
		throw new Error("CustomSmtpProvider does not support sending SMS");
	}
}

export default CustomSmtpProvider;
