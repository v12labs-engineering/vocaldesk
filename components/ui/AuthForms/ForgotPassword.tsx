"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRequest } from "@/utils/auth-helpers/client";
import { requestPasswordUpdate } from "@/utils/auth-helpers/server";
import { validateEmail } from "@/utils/form-validation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingDots from "../LoadingDots";
import Separator from "./Separator";

interface ForgotPasswordProps {
	allowEmail: boolean;
	redirectMethod: string;
	disableButton?: boolean;
}

export default function ForgotPassword({
	allowEmail,
	redirectMethod,
	disableButton,
}: ForgotPasswordProps) {
	const router = redirectMethod === "client" ? useRouter() : null;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [emailError, setEmailError] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;

		const emailValidationError = validateEmail(email);
		if (emailValidationError) {
			setEmailError(emailValidationError);
			return;
		}

		setEmailError("");
		setIsSubmitting(true);
		await handleRequest(e, requestPasswordUpdate, router);
		setIsSubmitting(false);
	};

	return (
		<form noValidate onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="email" className="text-sm font-medium text-gray-700">
						Email address
					</label>
					<Input
						id="email"
						type="email"
						name="email"
						placeholder="name@example.com"
						autoComplete="email"
						required
						className={`w-full ${emailError ? "border-red-500" : ""}`}
						onChange={() => setEmailError("")}
					/>
					{emailError && (
						<p className="text-sm text-red-500 mt-1">{emailError}</p>
					)}
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={disableButton || isSubmitting}
				>
					{isSubmitting ? <LoadingDots /> : "Reset password"}
				</Button>
			</div>

			<div className="space-y-4">
				<div className="text-center">
					<Link
						href="/signin/password_signin"
						className="text-sm text-gray-600 hover:text-gray-900"
					>
						Back to sign in
					</Link>
				</div>

				{allowEmail && (
					<>
						<Separator text="Or" />
						<div className="text-center">
							<Link
								href="/signin/email_signin"
								className="text-sm text-gray-600 hover:text-gray-900"
							>
								Continue with Email
							</Link>
						</div>
					</>
				)}
			</div>
		</form>
	);
}
