import CustomSmtpProvider from "./customSmtpProvider";
import ResendProvider from "./resendProvider";
import TextGridProvider from "./textGridProvider";
import TwilioProvider from "./twilioProvider";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class NotificationProviderFactory {
	static createProvider(providerName: string) {
		switch (providerName) {
			case "resend":
				return new ResendProvider();
			case "textgrid":
				return new TextGridProvider();
			case "twilio":
				return new TwilioProvider();
			case "smtp":
				return new CustomSmtpProvider();
			default:
				throw new Error("Unknown provider");
		}
	}
}

export default NotificationProviderFactory;
