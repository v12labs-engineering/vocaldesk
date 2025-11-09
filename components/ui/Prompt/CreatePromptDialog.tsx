"use client";

import LoadingDots from "@/components/ui/LoadingDots";
import { useToast } from "@/components/ui/Toasts/use-toast";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePromptDialog({ userId }: { userId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(e.currentTarget);
		const promptName = formData.get("promptName") as string;
		const prompt = formData.get("prompt") as string;

		if (!promptName || !prompt) {
			toast({
				title: "Error",
				description: "Please fill in all fields.",
				variant: "destructive",
			});
			setIsSubmitting(false);
			return;
		}

		try {
			await axios.post("/api/agent/prompt", {
				name: promptName,
				prompt: prompt,
				userId: userId,
			});

			toast({
				title: "Success!",
				description: "Prompt created successfully.",
				variant: "default",
			});

			setIsOpen(false);
			router.refresh(); // Refresh the page to show the new prompt
		} catch (error) {
			console.error(error);
			toast({
				title: "Oops! Something went wrong.",
				description: "Failed to create prompt. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button onClick={() => setIsOpen(true)}>
					<PlusCircledIcon className="h-4 w-4 mr-2" />
					Create Prompt
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Prompt</DialogTitle>
					<DialogDescription>
						Create and store a prompt for future use.
					</DialogDescription>
				</DialogHeader>
				<form className="grid gap-4 py-4" onSubmit={handleSubmit}>
					<div className="items-center gap-4">
						<Label htmlFor="promptName">Name</Label>
						<Input id="promptName" name="promptName" placeholder="Name" />
					</div>
					<div className="items-center gap-4">
						<Label htmlFor="prompt">Prompt</Label>
						<Textarea
							id="prompt"
							name="prompt"
							rows={15}
							placeholder="Fits 8000 characters (approx 1600 words) of instructions. Try copy pasting your entire landing page's content here..."
						/>
					</div>
					<Button type="submit" disabled={isSubmitting}>
						Save{" "}
						{isSubmitting && (
							<span className="ml-2">
								<LoadingDots />
							</span>
						)}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
