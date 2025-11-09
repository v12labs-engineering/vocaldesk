import { Button } from "@/components/ui/button";
import React from "react";

const Sidebar = ({ activeSection, setActiveSection }) => {
	const sections = [
		{ id: "api-requests", title: "API Requests" },
		{ id: "outbound-api", title: "Outbound API Call" },
	];

	return (
		<div className="w-64 h-full bg-background">
			<nav className="p-4">
				<ul className="space-y-2">
					{sections.map((section) => (
						<li key={section.id}>
							<Button
								variant={activeSection === section.id ? "default" : "ghost"}
								className="w-full justify-start"
								onClick={() => setActiveSection(section.id)}
							>
								{section.title}
							</Button>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;
