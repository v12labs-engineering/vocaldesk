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
import { updateName } from "@/utils/auth-helpers/server";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NameForm({ userName }: { userName: string }) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsSubmitting(true);
		// Check if the new name is the same as the old name
		if (e.currentTarget.fullName.value === userName) {
			e.preventDefault();
			setIsSubmitting(false);
			return;
		}
		await handleRequest(e, updateName, router);
		setIsSubmitting(false);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Name</CardTitle>
				<CardDescription>
					Please enter your full name, or a display name.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="nameForm" onSubmit={(e) => handleSubmit(e)}>
					<Input
						type="text"
						name="fullName"
						className="w-1/2 p-3 rounded-md"
						defaultValue={userName}
						placeholder="Your name"
						maxLength={64}
					/>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<p className="pb-4 sm:pb-0 text-sm">64 characters maximum</p>
				<Button type="submit" form="nameForm">
					Update Name{" "}
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
