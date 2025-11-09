import EmailNotify from "@/components/ui/NotificationForms/EmailNotify";
import SMSNotify from "@/components/ui/NotificationForms/SMSNotify";
import SMTPSettingsForm from "@/components/ui/NotificationForms/SMTPSettings";
import TextgridSettings from "@/components/ui/NotificationForms/TextgridSettings";
import TwilioSettings from "@/components/ui/NotificationForms/TwilioSettings";
import Webhook from "@/components/ui/NotificationForms/Webhook";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Notifications() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/signin");
	}

	const { data: userDetails } = await supabase
		.from("users")
		.select(
			"notify_email, notify_sms, webhook, smtp_settings, twilio_settings, textgrid_settings",
		)
		.eq("id", user?.id)
		.single();

	return (
		<div className="px-4 space-y-8">
			<h1 className="mb-4 text-lg font-semibold">Notifications</h1>
			<EmailNotify userEmail={userDetails?.notify_email} />
			<SMSNotify phone={userDetails?.notify_sms} />
			<Webhook webhook={userDetails?.webhook} />

			<h1 className="mt-8 text-lg font-semibold">
				Custom Notification Settings
			</h1>
			<SMTPSettingsForm userSMTPSettings={userDetails?.smtp_settings ?? {}} />
			<TwilioSettings userTwilioSettings={userDetails?.twilio_settings ?? {}} />
			<TextgridSettings
				userTextgridSettings={userDetails?.textgrid_settings ?? {}}
			/>
		</div>
	);
}
