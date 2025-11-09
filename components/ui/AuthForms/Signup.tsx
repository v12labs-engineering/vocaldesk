"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRequest } from "@/utils/auth-helpers/client";
import { signUp } from "@/utils/auth-helpers/server";
import {
	validateEmail,
	validatePassword,
	validatePasswordMatch,
} from "@/utils/form-validation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingDots from "../LoadingDots";
import Separator from "./Separator";

interface SignUpProps {
	allowEmail: boolean;
	redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
	const router = redirectMethod === "client" ? useRouter() : null;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [emailError, setEmailError] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");
	const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		const emailValidationError = validateEmail(email);
		if (emailValidationError) {
			setEmailError(emailValidationError);
			return;
		}

		const passwordValidationError = validatePassword(password);
		if (passwordValidationError) {
			setPasswordError(passwordValidationError);
			return;
		}

		const passwordMatchError = validatePasswordMatch(password, confirmPassword);
		if (passwordMatchError) {
			setConfirmPasswordError(passwordMatchError);
			return;
		}

		setEmailError("");
		setPasswordError("");
		setConfirmPasswordError("");
		setIsSubmitting(true);
		await handleRequest(e, signUp, router);
		setIsSubmitting(false);
	};

	return (
		<form noValidate onSubmit={handleSubmit} className="space-y-6">
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
				<div className="space-y-2">
					<label
						htmlFor="password"
						className="text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<Input
						id="password"
						type="password"
						name="password"
						placeholder="Create a password"
						autoComplete="new-password"
						required
						className={`w-full ${passwordError ? "border-red-500" : ""}`}
						onChange={() => setPasswordError("")}
					/>
					{passwordError && (
						<p className="text-sm text-red-500 mt-1">{passwordError}</p>
					)}
				</div>
				<div className="space-y-2">
					<label
						htmlFor="confirmPassword"
						className="text-sm font-medium text-gray-700"
					>
						Confirm Password
					</label>
					<Input
						id="confirmPassword"
						type="password"
						name="confirmPassword"
						placeholder="Confirm your password"
						autoComplete="new-password"
						required
						className={`w-full ${confirmPasswordError ? "border-red-500" : ""}`}
						onChange={() => setConfirmPasswordError("")}
					/>
					{confirmPasswordError && (
						<p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? <LoadingDots /> : "Create account"}
				</Button>
			</div>

			<div className="space-y-4">
				<Separator text="Already have an account?" />
				<div className="grid grid-cols-1 gap-3">
					<Link href="/signin/password_signin">
						<Button variant="outline" className="w-full">
							Sign in with password
						</Button>
					</Link>
					{allowEmail && (
						<Link href="/signin/email_signin">
							<Button variant="outline" className="w-full">
								Sign in with email
							</Button>
						</Link>
					)}
				</div>
			</div>
		</form>
	);
}
