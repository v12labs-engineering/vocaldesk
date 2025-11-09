"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRequest } from "@/utils/auth-helpers/client";
import { updatePassword } from "@/utils/auth-helpers/server";
import {
	validatePassword,
	validatePasswordMatch,
} from "@/utils/form-validation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingDots from "../LoadingDots";

interface UpdatePasswordProps {
	redirectMethod: string;
}

export default function UpdatePassword({
	redirectMethod,
}: UpdatePasswordProps) {
	const router = redirectMethod === "client" ? useRouter() : null;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [passwordError, setPasswordError] = useState<string>("");
	const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("passwordConfirm") as string;

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

		setPasswordError("");
		setConfirmPasswordError("");
		setIsSubmitting(true);
		await handleRequest(e, updatePassword, router);
		setIsSubmitting(false);
	};

	return (
		<form noValidate onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="password"
						className="text-sm font-medium text-gray-700"
					>
						New password
					</label>
					<Input
						id="password"
						type="password"
						name="password"
						placeholder="Enter new password"
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
						htmlFor="passwordConfirm"
						className="text-sm font-medium text-gray-700"
					>
						Confirm new password
					</label>
					<Input
						id="passwordConfirm"
						type="password"
						name="passwordConfirm"
						placeholder="Confirm new password"
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
					{isSubmitting ? <LoadingDots /> : "Update password"}
				</Button>
			</div>
		</form>
	);
}
