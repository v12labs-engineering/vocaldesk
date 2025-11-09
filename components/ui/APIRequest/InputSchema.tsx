"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Editor from "@monaco-editor/react";
import { CodeIcon, Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";

type InputSchema = {
	key: string;
	type: any;
	description: string;
	children?: InputSchema[];
};

function InputSchemaObject({
	index,
	input = { key: "", type: "", description: "", children: [] },
	removeInput,
	updateInput,
	addChildren,
}: any) {
	return (
		<div key={index} className="space-y-4 border rounded-md p-4 mb-5">
			<div className="flex justify-end">
				<button onClick={() => removeInput(index)}>
					<Cross1Icon className="h-4 w-4" />
				</button>
			</div>
			<div className="space-y-2">
				<Label htmlFor="input" className="font-semibold">
					Key
				</Label>
				<div className="flex items-center gap-2">
					<Input
						id={`input-${index}`}
						type="text"
						value={input.key}
						placeholder="Input name"
						onChange={(e) => updateInput(index, "key", e.target.value)}
					/>
				</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="inputType" className="font-semibold">
					Type
				</Label>
				<Select onValueChange={(e) => updateInput(index, "type", e)}>
					<SelectTrigger className="">
						<SelectValue placeholder="Input type" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem key="string" value="string">
								string
							</SelectItem>
							<SelectItem key="integer" value="integer">
								integer
							</SelectItem>
							<SelectItem key="number" value="number">
								number
							</SelectItem>
							<SelectItem key="boolean" value="boolean">
								boolean
							</SelectItem>
							<SelectItem key="object" value="object">
								object
							</SelectItem>
							<SelectItem key="array" value="array">
								array
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="inputDescription" className="font-semibold">
					Description
				</Label>
				<Textarea
					id={`description-${index}`}
					value={input.description}
					placeholder="Description of input"
					onChange={(e) => updateInput(index, "description", e.target.value)}
				/>
			</div>
			{input.type === "object" &&
				input?.children &&
				input?.children?.length > 0 && (
					<div className="space-y-4">
						<h4 className="font-semibold">Children</h4>
						{input?.children?.map((child: InputSchema, i: number) => (
							<div key={i}>
								<InputSchemaObject
									key={`${input.key}-children-${i}`}
									index={`${index}-children-${i}`}
									input={child}
									removeInput={removeInput}
									updateInput={updateInput}
									addChildren={addChildren}
								/>
							</div>
						))}
					</div>
				)}
			{input.type === "object" && (
				<Button variant="link" onClick={() => addChildren(index)}>
					<PlusIcon className="mr-2" />
					Add Children
				</Button>
			)}
		</div>
	);
}

export default function InputSchema({ inputSchema, setInputSchema }: any) {
	// const scrollRef = useRef<HTMLDivElement>(null);
	// const [inputs, setInputs] = useState<InputSchema[]>([]);
	const [editorState, setEditorState] = useState(
		Object.keys(inputSchema)?.length > 0
			? JSON.stringify({ ...inputSchema }, null, 2)
			: "",
	);

	// const addInput = () => {
	// 	setInputs([...inputs, { key: "", type: "", description: "" }]);
	// 	if (scrollRef.current) {
	// 		scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	// 	}
	// };

	// const removeInput = (index: number) => {
	// 	const newInputs = [...inputs];
	// 	if (index.toString().includes("children")) {
	// 		const parentIndex = Number.parseInt(index.toString().split("-")[0]);
	// 		const childIndex = Number.parseInt(index.toString().split("-")[2]);
	// 		newInputs[parentIndex].children?.splice(childIndex, 1);
	// 	} else {
	// 		newInputs.splice(index, 1);
	// 	}
	// 	setInputs(newInputs);
	// };

	// const updateInput = (index: number, field: keyof InputSchema, value: any) => {
	// 	const newInputs = [...inputs];
	// 	if (index.toString().includes("children")) {
	// 		const parentIndex = Number.parseInt(index.toString().split("-")[0]);
	// 		const childIndex = Number.parseInt(index.toString().split("-")[2]);
	// 		newInputs[parentIndex].children = newInputs[parentIndex]?.children?.map(
	// 			(child, i) => (i === childIndex ? { ...child, [field]: value } : child),
	// 		);
	// 	} else {
	// 		newInputs[index] = { ...newInputs[index], [field]: value };
	// 	}
	// 	setInputs(newInputs);
	// };

	// const addChildren = (index: number) => {
	// 	const newInputs = [...inputs];
	// 	if (index.toString().includes("children")) {
	// 		const parentIndex = Number.parseInt(index.toString().split("-")[0]);
	// 		const childIndex = Number.parseInt(index.toString().split("-")[2]);
	// 		newInputs[parentIndex].children = newInputs[parentIndex]?.children?.map(
	// 			(child, i) =>
	// 				i === childIndex
	// 					? {
	// 							...child,
	// 							children: [
	// 								...(child.children || []),
	// 								{ key: "", type: "", description: "", children: [] },
	// 							],
	// 						}
	// 					: child,
	// 		);
	// 	} else {
	// 		newInputs[index] = {
	// 			...newInputs[index],
	// 			children: [
	// 				...(newInputs[index]?.children || []),
	// 				{ key: "", type: "", description: "", children: [] },
	// 			],
	// 		};
	// 	}
	// 	setInputs(newInputs);
	// };

	// useEffect(() => {
	// 	if (inputs?.length === 0) return;
	// 	setEditorState(
	// 		JSON.stringify(
	// 			{
	// 				type: "object",
	// 				properties: inputs?.reduce(
	// 					(acc, input) => ({
	// 						...acc,
	// 						[input.key]: {
	// 							type: input.type,
	// 							description: input.description,
	// 							properties: input?.children?.reduce(
	// 								(acc, child) => ({
	// 									...acc,
	// 									[child.key]: {
	// 										type: child.type,
	// 										description: child.description,
	// 									},
	// 								}),
	// 								{},
	// 							),
	// 						},
	// 					}),
	// 					{},
	// 				),
	// 				required: inputs?.map((input) => input.key),
	// 			},
	// 			null,
	// 			2,
	// 		),
	// 	);
	// }, [inputs]);

	useEffect(() => {
		let schema = {};
		try {
			schema = JSON.parse(editorState ? editorState : "{}");
			setInputSchema({ ...schema });
		} catch (error) {
			console.log(error);
			setInputSchema(schema);
		}
	}, [editorState]);

	return (
		<div className="flex flex-row gap-4 px-4 py-6 items-center justify-between">
			{/* <div className="w-full flex flex-col gap-4">
				<ScrollArea
					className="h-[33vh] p-4 border border-dashed rounded-md w-full"
					ref={scrollRef}
				>
					{inputs?.length === 0 && (
						<div className="center">
							<p className="text-gray-500 dark:text-gray-400">
								No inputs added yet.
							</p>
						</div>
					)}
					{inputs?.map((input, index) => (
						<InputSchemaObject
							key={index}
							index={index}
							input={input}
							removeInput={removeInput}
							updateInput={updateInput}
							addChildren={addChildren}
						/>
					))}
				</ScrollArea>
				<Button variant="outline" onClick={addInput}>
					<PlusIcon className="mr-2" />
					Add Input
				</Button>
			</div> */}
			<div className="w-full border rounded-md dark:border-none">
				<h4 className="bg-gray-200 p-2 flex gap-1 items-center dark:bg-gray-700 dark:text-white">
					<CodeIcon className="h-4 w-4" /> Input Schema
				</h4>
				<Editor
					height="35vh"
					width="100%"
					options={{
						minimap: { enabled: false },
						readOnly: false,
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
					onChange={(value) => setEditorState(value as string)}
				/>
			</div>
		</div>
	);
}
