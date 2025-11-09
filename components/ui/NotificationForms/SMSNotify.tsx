"use client";

import LoadingDots from "@/components/ui/LoadingDots";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { handleRequest } from "@/utils/auth-helpers/client";
import { updateNotificationSettings } from "@/utils/auth-helpers/server";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SMSNotify({
	phone,
}: {
	phone: string | undefined;
}) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsSubmitting(true);
		await handleRequest(e, updateNotificationSettings, router);
		setIsSubmitting(false);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>SMS</CardTitle>
				<CardDescription>
					Please enter the phone number you want to receive SMS notifications.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="phoneForm" onSubmit={(e) => handleSubmit(e)}>
					<Input
						type="text"
						name="phone"
						className="w-1/2 p-3 rounded-md"
						defaultValue={phone ?? ""}
						placeholder="Your phone number with country code"
					/>
					<p className="text-xs leading-none text-gray-500 dark:text-gray-400 mt-3">
						Tip: To add mutiple phone numbers, separate them with a comma. E.g.
						+19198765432,+12123456789
					</p>
					<p className="text-xs leading-none text-gray-500 dark:text-gray-400 mt-3">
						Note: To disable SMS notifications, leave the field empty and
						update.
					</p>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<p className="pb-4 sm:pb-0 text-sm">
					Make sure to add country code, we will send you call summary.
				</p>
				<Button type="submit" form="phoneForm">
					Update Phone
					{isSubmitting && (
						<span className="ml-2">
							<LoadingDots />
						</span>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}
