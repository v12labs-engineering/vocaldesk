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

export default function EmailNotify({
	userEmail,
}: {
	userEmail: string | undefined;
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
				<CardTitle>Email</CardTitle>
				<CardDescription>
					Please enter the email address you want to receive notifications.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
					<Input
						type="text"
						name="newEmail"
						className="w-1/2 p-3 rounded-md"
						defaultValue={userEmail ?? ""}
						placeholder="Your email"
					/>
					<p className="text-xs leading-none text-gray-500 dark:text-gray-400 mt-3">
						Tip: To add mutiple email addresses, separate them with a comma.
						E.g. email@abc.com,email@xyz.ai
					</p>
					<p className="text-xs leading-none text-gray-500 dark:text-gray-400 mt-3">
						Note: To disable email notifications, leave the field empty and
						update.
					</p>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<p className="pb-4 sm:pb-0 text-sm">
					We will send you call summary and transcripts link.
				</p>
				<Button type="submit" form="emailForm">
					Update Email
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
