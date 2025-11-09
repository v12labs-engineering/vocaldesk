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
import { updateEmail } from "@/utils/auth-helpers/server";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmailForm({
	userEmail,
}: {
	userEmail: string | undefined;
}) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsSubmitting(true);
		// Check if the new email is the same as the old email
		if (e.currentTarget.newEmail.value === userEmail) {
			e.preventDefault();
			setIsSubmitting(false);
			return;
		}
		await handleRequest(e, updateEmail, router);
		setIsSubmitting(false);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Email</CardTitle>
				<CardDescription>
					Please enter the email address you want to use to login.
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
						maxLength={64}
					/>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<p className="pb-4 sm:pb-0 text-sm">
					Confirm the update by clicking the link sent to new email addresses.
				</p>
				<Button type="submit" form="emailForm">
					Update Email{" "}
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
