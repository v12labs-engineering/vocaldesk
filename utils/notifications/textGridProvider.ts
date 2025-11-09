import axios from "axios";
import NotificationProvider from "./notificationProvider";

class TextGridProvider extends NotificationProvider {
	async sendEmail(to: string[], subject: string, body: any) {
		throw new Error("TextGrid does not support sending emails");
	}

	async sendSMS(to: string[], message: string, textGridSettings: any) {
		try {
			console.log(`Sending SMS via TextGrid to ${to}`);
			const accountSid = textGridSettings?.accountSid;
			const authToken = textGridSettings?.authToken;

			if (!accountSid || !authToken) {
				throw new Error("TextGrid account SID and auth token are required");
			}

			const credentials = btoa(`${accountSid}:${authToken}`);

			const messagePromises = to.map((number) => {
				return axios.post(
					`https://api.textgrid.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
					{
						from: textGridSettings.sender,
						to: number,
						body: message,
					},
					{
						headers: {
							Authorization: `Bearer ${credentials}`,
						},
					},
				);
			});

			const results = await Promise.allSettled(messagePromises);
			return { data: results, error: null };
		} catch (error) {
			console.error("Error sending SMS via TextGrid", error);
			return { data: null, error: error };
		}
	}
}

export default TextGridProvider;
