"use client";

import { ApiKeyGenerator } from "@/components/ui/APIKey";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function APIKey() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>API Key</CardTitle>
				<CardDescription>
					Your API key is used to authenticate your requests.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<ApiKeyGenerator />
				</div>
			</CardContent>
		</Card>
	);
}
