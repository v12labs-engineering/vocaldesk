import { getUserNotificationConfig } from "@/utils/auth-helpers/server";
import NotificationProviderFactory from "./notificationProviderFactory";

class NotificationService {
	provider: any;

	constructor(providerName: string) {
		this.provider = NotificationProviderFactory.createProvider(providerName);
	}

	async getNotificationConfig(blandPhone: string) {
		return await getUserNotificationConfig(blandPhone);
	}

	async sendEmail(to: string[], subject: string, body: any, smtpSettings?: any) {
		return this.provider.sendEmail(to, subject, body, smtpSettings);
	}

	async sendSMS(to: string, message: string, twilioSettings?: any) {
		return this.provider.sendSMS(to, message, twilioSettings);
	}
}

export default NotificationService;
