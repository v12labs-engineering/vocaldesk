"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Calendar, CheckCircle2, PhoneCall } from "lucide-react";
import { InlineWidget } from "react-calendly";

export default function Onboarding() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold mb-4">Welcome to VocalDesk</h1>
				<p className="text-lg text-muted-foreground">
					Let's get your AI phone agent set up
				</p>
			</div>

			{/* Steps */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4 mb-4">
							<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
								<span className="font-semibold">1</span>
							</div>
							<PhoneCall className="w-5 h-5 text-primary" />
						</div>
						<h3 className="font-semibold mb-2">Book a Call</h3>
						<p className="text-sm text-muted-foreground">
							Schedule a quick call with our team to get your AI phone number
							set up.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4 mb-4">
							<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
								<span className="font-semibold">2</span>
							</div>
							<Calendar className="w-5 h-5 text-primary" />
						</div>
						<h3 className="font-semibold mb-2">Quick Setup</h3>
						<p className="text-sm text-muted-foreground">
							We'll help you configure your AI agent's voice, language, and
							business hours.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4 mb-4">
							<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
								<span className="font-semibold">3</span>
							</div>
							<CheckCircle2 className="w-5 h-5 text-primary" />
						</div>
						<h3 className="font-semibold mb-2">Go Live</h3>
						<p className="text-sm text-muted-foreground">
							Your AI phone agent will be ready to handle calls professionally.
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Calendly Widget */}
			<Card>
				<CardHeader>
					<CardTitle>Schedule Your Setup Call</CardTitle>
					<CardDescription>
						Book a 30-minute call with our team to get your phone number and
						configure your AI agent.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<InlineWidget
						url="https://calendly.com/vocaldesk-support/30min"
						styles={{ height: "700px" }}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
