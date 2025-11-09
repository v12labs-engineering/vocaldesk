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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { saveSMTPSettings } from "@/utils/auth-helpers/server";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";

export default function SMTPSettingsForm({ userSMTPSettings }: any) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCustomSMTPEnabled, setIsCustomSMTPEnabled] = useState(
		userSMTPSettings?.isEnabled || false,
	);
	const [formData, setFormData] = useState({
		senderEmail: userSMTPSettings?.senderEmail || "",
		senderName: userSMTPSettings?.senderName || "",
		host: userSMTPSettings?.host || "",
		port: userSMTPSettings?.port || "",
		minInterval: userSMTPSettings?.minInterval || "1", // Default to 1 second
		username: userSMTPSettings?.username || "",
		password: userSMTPSettings?.password || "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsSubmitting(true);
		const { error } = await saveSMTPSettings({
			isEnabled: isCustomSMTPEnabled,
			...formData,
		});
		if (error) {
			toast({
				title: "Oops! Something went wrong.",
				description: "Failed to save SMTP settings. Please try again.",
				variant: "destructive",
			});
			return;
		}
		toast({
			title: "Success!",
			description: "SMTP settings saved successfully.",
			variant: "default",
		});
		setIsSubmitting(false);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleCustomSMTP = () => {
		setIsCustomSMTPEnabled(!isCustomSMTPEnabled);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>SMTP Settings</CardTitle>
				<CardDescription>
					Configure your SMTP server settings for sending emails.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="smtpForm" onSubmit={handleSubmit} className="space-y-6">
					<div className="flex items-center space-x-4 my-8">
						<Switch
							id="custom-smtp"
							checked={isCustomSMTPEnabled}
							onCheckedChange={toggleCustomSMTP}
						/>
						<div className="flex flex-col">
							<Label htmlFor="custom-smtp">Enable Custom SMTP</Label>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								Emails will be sent using your custom SMTP provider.
							</p>
						</div>
					</div>
					{isCustomSMTPEnabled && (
						<div className="space-y-4 my-8">
							<div>
								<Label htmlFor="senderEmail">Sender email</Label>
								<Input
									id="senderEmail"
									name="senderEmail"
									value={formData.senderEmail}
									onChange={handleChange}
									className="mt-1"
								/>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
									This is the email address the emails are sent from
								</p>
							</div>
							<div>
								<Label htmlFor="senderName">Sender name</Label>
								<Input
									id="senderName"
									name="senderName"
									value={formData.senderName}
									onChange={handleChange}
									className="mt-1"
								/>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
									Name displayed in the recipient's inbox
								</p>
							</div>
							<div>
								<Label htmlFor="host">Host</Label>
								<Input
									id="host"
									name="host"
									value={formData.host}
									onChange={handleChange}
									className="mt-1"
								/>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
									Hostname or IP address of your SMTP server
								</p>
							</div>
							<div>
								<Label htmlFor="port">Port number</Label>
								<Input
									id="port"
									name="port"
									type="number"
									value={formData.port}
									onChange={handleChange}
									className="mt-1"
								/>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
									Port used by your SMTP server. Common ports include 465 and
									587.
								</p>
							</div>
							<div>
								<Label htmlFor="minInterval">
									Minimum interval between emails (seconds)
								</Label>
								<Input
									id="minInterval"
									name="minInterval"
									type="number"
									value={formData.minInterval}
									onChange={handleChange}
									className="mt-1"
								/>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
									Minimum time between each email sent via your SMTP server
								</p>
							</div>
							<div>
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									name="username"
									value={formData.username}
									onChange={handleChange}
									className="mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										value={formData.password}
										onChange={handleChange}
										className="mt-1 pr-10"
									/>
									<button
										type="button"
										onClick={togglePasswordVisibility}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
									>
										{showPassword ? (
											<EyeOffIcon className="h-5 w-5" />
										) : (
											<EyeIcon className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>
						</div>
					)}
				</form>
			</CardContent>
			<CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<p className="pb-4 sm:pb-0 text-sm">
					Your SMTP credentials will be encrypted in our database.
				</p>
				<Button type="submit" form="smtpForm">
					Save Settings{" "}
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
