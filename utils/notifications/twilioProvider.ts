import twilio from "twilio";
import NotificationProvider from "./notificationProvider";

class TwilioProvider extends NotificationProvider {
	async sendEmail(to: string[], subject: string, body: any) {
		throw new Error("Twilio does not support sending emails");
	}

	async sendSMS(to: string[], message: string, twilioSettings: any) {
		try {
			console.log(`Sending SMS via Twilio to ${to}`);
			const client = twilio(
				twilioSettings.accountSid,
				twilioSettings.authToken,
			);

			const messagePromises = to.map((number) => {
				return client.messages.create({
					body: message,
					from: twilioSettings.sender,
					to: number,
				});
			});

			const results = await Promise.allSettled(messagePromises);
			return { data: results, error: null };
		} catch (error) {
			console.error("Error sending SMS via Twilio", error);
			return { data: null, error: error };
		}
	}
}

export default TwilioProvider;
