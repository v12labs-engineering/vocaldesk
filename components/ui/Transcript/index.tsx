import React from "react";

type Transcript = {
	user: string;
	text: string;
	created_at: string;
};

const Transcript = ({ transcript }: { transcript: Transcript[] }) => {
	return (
		<div className="pr-4">
			{transcript.map((entry, index) => (
				<div key={`${entry.created_at}-${index}`} className="mb-4">
					<p
						className={`font-medium ${
							entry.user === "user" ? "text-blue-500/70" : "text-green-700"
						}`}
					>
						{entry.user === "user" ? "User" : "Assistant"}{" "}
						<span className="">
							{new Date(entry.created_at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
								hour12: true,
							})}
						</span>
					</p>
					<div className="my-2 border-b border-gray-200 dark:border-gray-800" />
					<p className=" text-sm">{entry.text}</p>
				</div>
			))}
		</div>
	);
};

export default Transcript;
