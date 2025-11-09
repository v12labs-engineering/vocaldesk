"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRequest } from "@/utils/auth-helpers/client";
import { signInWithPassword } from "@/utils/auth-helpers/server";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingDots from "../LoadingDots";
import Separator from "./Separator";

interface PasswordSignInProps {
	allowEmail: boolean;
	redirectMethod: string;
}

export default function PasswordSignIn({
	allowEmail,
	redirectMethod,
}: PasswordSignInProps) {
	const router = redirectMethod === "client" ? useRouter() : null;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [domain, setDomain] = useState("");
	const [emailError, setEmailError] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");

	useEffect(() => {
		setDomain(window.location.hostname);
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email.trim()) {
			setEmailError("Email is required");
			return;
		}

		if (!password.trim()) {
			setPasswordError("Password is required");
			return;
		}

		setEmailError("");
		setPasswordError("");
		setIsSubmitting(true);
		formData.append("domain", domain);
		await handleRequest(e, signInWithPassword, router);
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
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label
							htmlFor="password"
							className="text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<Link
							href="/signin/forgot_password"
							className="text-xs underline text-gray-500 hover:text-gray-900"
						>
							Forgot your password?
						</Link>
					</div>
					<Input
						id="password"
						type="password"
						name="password"
						placeholder="Enter your password"
						autoComplete="current-password"
						required
						className={`w-full ${passwordError ? "border-red-500" : ""}`}
						onChange={() => setPasswordError("")}
					/>
					{passwordError && (
						<p className="text-sm text-red-500 mt-1">{passwordError}</p>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? <LoadingDots /> : "Sign in"}
				</Button>
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

			<div className="text-center">
				<Separator text="Don't have an account?" />
				<Link href="/signin/signup">
					<Button variant="outline" className="w-full mt-2">
						Sign up
					</Button>
				</Link>
			</div>
		</form>
	);
}
