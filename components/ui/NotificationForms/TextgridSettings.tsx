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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { saveTextgridSettings } from "@/utils/auth-helpers/server";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";

export default function TextgridSettings({ userTextgridSettings }: any) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCustomSMSEnabled, setIsCustomSMSEnabled] = useState(
		userTextgridSettings?.isEnabled || false,
	);
	const [formData, setFormData] = useState({
		accountSid: userTextgridSettings?.accountSid || "",
		authToken: userTextgridSettings?.authToken || "",
		senderType: userTextgridSettings?.senderType || "phoneNumber",
		sender: userTextgridSettings?.sender || "",
	});
	const [showAuthToken, setShowAuthToken] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSenderTypeChange = (value) => {
		setFormData((prev) => ({ ...prev, senderType: value, sender: "" }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsSubmitting(true);
		const { error } = await saveTextgridSettings({
			isEnabled: isCustomSMSEnabled,
			...formData,
		});
		if (error) {
			toast({
				title: "Oops! Something went wrong.",
				description: "Failed to save Textgrid settings. Please try again.",
				variant: "destructive",
			});
			return;
		}
		toast({
			title: "Success!",
			description: "Textgrid settings saved successfully.",
			variant: "default",
		});
		setIsSubmitting(false);
	};

	const toggleAuthTokenVisibility = () => {
		setShowAuthToken(!showAuthToken);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Textgrid SMS Settings</CardTitle>
				<CardDescription>
					Configure your Textgrid SMS settings for sending text messages.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="textgridForm" onSubmit={handleSubmit} className="space-y-6">
					<div className="flex items-center space-x-4 my-8">
						<Switch
							id="custom-sms"
							checked={isCustomSMSEnabled}
							onCheckedChange={setIsCustomSMSEnabled}
						/>
						<div className="flex flex-col">
							<Label htmlFor="custom-smtp">Enable Textgrid SMS</Label>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								Send text messages using Textgrid.
							</p>
						</div>
					</div>

					{isCustomSMSEnabled && (
						<div className="space-y-4 my-8">
							<div>
								<Label htmlFor="accountSid">Account SID</Label>
								<Input
									id="accountSid"
									name="accountSid"
									value={formData.accountSid}
									onChange={handleChange}
									className="mt-1"
									required
								/>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
									Your Textgrid Account SID
								</p>
							</div>
							<div>
								<Label htmlFor="authToken">Auth Token</Label>
								<div className="relative">
									<Input
										id="authToken"
										name="authToken"
										type={showAuthToken ? "text" : "password"}
										value={formData.authToken}
										onChange={handleChange}
										className="mt-1 pr-10"
										required
									/>
									<button
										type="button"
										onClick={toggleAuthTokenVisibility}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
									>
										{showAuthToken ? (
											<EyeOffIcon className="h-5 w-5" />
										) : (
											<EyeIcon className="h-5 w-5" />
										)}
									</button>
								</div>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
									Your Textgrid Auth Token
								</p>
							</div>
							<div>
								<Label>Sender Type</Label>
								<RadioGroup
									value={formData.senderType}
									onValueChange={handleSenderTypeChange}
									className="flex flex-col space-y-1 mt-1"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="phoneNumber" id="phoneNumber" />
										<Label htmlFor="phoneNumber">Phone Number</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="alphanumeric" id="alphanumeric" />
										<Label htmlFor="alphanumeric">Alphanumeric Sender ID</Label>
									</div>
								</RadioGroup>
							</div>
							<div>
								<Label htmlFor="sender">
									{formData.senderType === "phoneNumber"
										? "From Phone Number"
										: "Alphanumeric Sender ID"}
								</Label>
								<Input
									id="sender"
									name="sender"
									value={formData.sender}
									onChange={handleChange}
									className="mt-1"
									required
									placeholder={
										formData.senderType === "phoneNumber"
											? "+1234567890"
											: "YourCompany"
									}
								/>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
									{formData.senderType === "phoneNumber"
										? "The Textgrid phone number you'll be sending from"
										: "Your alphanumeric Sender ID (up to 11 characters)"}
								</p>
							</div>
						</div>
					)}
				</form>
			</CardContent>
			<CardFooter className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<p className="pb-4 sm:pb-0 text-sm">
					Your Textgrid credentials will be encrypted in our database.
				</p>
				<Button type="submit" form="textgridForm">
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
