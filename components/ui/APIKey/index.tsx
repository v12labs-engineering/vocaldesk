"use client";

import LoadingDots from "@/components/ui/LoadingDots";
import { useToast } from "@/components/ui/Toasts/use-toast";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ApiKeyGenerator() {
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(true);
	const [apiKey, setApiKey] = useState<string | null>(null);
	const [isRevealed, setIsRevealed] = useState(false);

	const { toast } = useToast();

	useEffect(() => {
		const fetchApiKey = async () => {
			try {
				const response = await axios.get("/api/apikey");
				if (response.data.apiKey) {
					setApiKey(response.data.apiKey);
				}
			} catch (error) {
				console.error("Failed to fetch API key:", error);
			} finally {
				setIsFetching(false);
			}
		};

		fetchApiKey();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch("/api/apikey/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({}),
			});

			if (!response.ok) throw new Error("Failed to generate API key");

			const { apiKey: newApiKey } = await response.json();
			setApiKey(newApiKey);
			toast({
				title: "API Key Generated",
				description:
					"You can now use this API key to authenticate your requests.",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to generate API key. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const copyToClipboard = () => {
		if (apiKey) {
			navigator.clipboard.writeText(apiKey);
			toast({
				title: "Copied to clipboard",
				description: "API key has been copied to your clipboard.",
			});
		}
	};

	const toggleReveal = () => {
		setIsRevealed(!isRevealed);
	};

	const maskApiKey = (key: string) => {
		return `${key.slice(0, 8)}${"*".repeat(key.length - 12)}${key.slice(-4)}`;
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>{!apiKey && isFetching && <LoadingDots />}</div>
			{apiKey && (
				<div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg">
					<span className="flex-grow font-mono">
						{isRevealed ? apiKey : maskApiKey(apiKey)}
					</span>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={copyToClipboard}
						title="Copy to clipboard"
					>
						<CopyIcon className="h-4 w-4" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={toggleReveal}
						title={isRevealed ? "Hide API key" : "Reveal API key"}
					>
						{isRevealed ? (
							<EyeOffIcon className="h-4 w-4" />
						) : (
							<EyeIcon className="h-4 w-4" />
						)}
					</Button>
				</div>
			)}
			<Button type="submit" disabled={isLoading}>
				{isLoading ? <LoadingDots /> : "Generate new API Key"}
			</Button>
			<p className="text-sm text-gray-500">
				Once you generate a new API key, you will no longer be able to use the
				old one. Always keep your API key secure and never share it with anyone.
			</p>
		</form>
	);
}
