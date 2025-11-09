"use client";

import APIRequestDoc from "@/components/ui/APIRequest/APIRequestDoc";
import OutboundAPIDoc from "@/components/ui/Docs/OutboundAPIDoc";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sections = [
	{ id: "api-requests", title: "API Requests" },
	{ id: "outbound-api", title: "Outbound API" },
];

export default function Docs() {
	const [activeSection, setActiveSection] = useState("api-requests");

	return (
		<div className="px-4">
			<h1 className="mb-4 text-lg font-semibold">Documentation</h1>
			<div className="flex space-x-4 mb-6">
				{sections.map((section) => (
					<Button
						key={section.id}
						variant={activeSection === section.id ? "default" : "outline"}
						onClick={() => setActiveSection(section.id)}
					>
						{section.title}
					</Button>
				))}
			</div>
			<div className="mt-6">
				{activeSection === "api-requests" && <APIRequestDoc />}
				{activeSection === "outbound-api" && <OutboundAPIDoc />}
			</div>
		</div>
	);
}
