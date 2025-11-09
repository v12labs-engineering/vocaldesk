"use client";

import Editor from "@monaco-editor/react";
import { CodeIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";

export default function APIRequestStructure({ formData, setFormData }: any) {
	const [editorState, setEditorState] = useState(
		JSON.stringify({ ...formData }, null, 2),
	);

	return (
		<div className="w-full border rounded-md dark:border-none">
			<h4 className="bg-gray-200 p-2 flex gap-1 items-center dark:bg-gray-700 dark:text-white">
				<CodeIcon className="h-4 w-4" /> API Request Structure
			</h4>
			<Editor
				height="35vh"
				width="100%"
				options={{
					minimap: { enabled: false },
					readOnly: true,
					wordWrap: "on",
					scrollBeyondLastLine: false,
					automaticLayout: true,
				}}
				defaultLanguage="json"
				defaultValue={JSON.stringify(
					{
						type: "object",
						properties: {
							example_property: {
								type: "string",
								description: "Description for example_property",
							},
						},
						required: ["example_property"],
					},
					null,
					2,
				)}
				value={editorState}
			/>
		</div>
	);
}
