"use client";

import LoadingDots from "@/components/ui/LoadingDots";
import { useToast } from "@/components/ui/Toasts/use-toast";
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
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function Webhook({ webhook }: { webhook: string }) {
	const [webhookUrl, setWebhookUrl] = useState(webhook);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			const { error } = await supabase
				.from("users")
				.update({ webhook: webhookUrl })
				.eq("id", user.id);

			if (error) {
				toast({
					title: "Error",
					description: "Failed to update webhook URL. Please try again.",
					variant: "destructive",
				});
			} else {
				toast({
					title: "Success",
					description: "Webhook URL updated successfully.",
					variant: "default",
				});
			}
		}

		setIsSubmitting(false);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Webhook</CardTitle>
				<CardDescription>
					Enter the URL where you want to receive webhook notifications for call
					events.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="webhookForm" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<Input
							id="webhookUrl"
							type="url"
							value={webhookUrl}
							onChange={(e) => setWebhookUrl(e.target.value)}
							placeholder="https://your-webhook-url.com/endpoint"
							className="w-full"
						/>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<p className="pb-4 sm:pb-0 text-sm">
					We will send call summary and other details to this URL.
				</p>
				<Button type="submit" form="webhookForm">
					{isSubmitting ? <LoadingDots /> : "Update Webhook"}
				</Button>
			</CardFooter>
		</Card>
	);
}
