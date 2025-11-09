class NotificationProvider {
	sendEmail(to: string[], subject: string, body: any, smtpSettings: any) {
		throw new Error("sendEmail() must be implemented");
	}

	sendSMS(to: string[], message: string, twilioSettings: any) {
		throw new Error("sendSMS() must be implemented");
	}
}

export default NotificationProvider;
