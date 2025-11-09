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
import Editor from "@monaco-editor/react";
import { Cross1Icon, PlusIcon, RocketIcon } from "@radix-ui/react-icons";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function APIRequestForm({ formData, setFormData }: any) {
	const [method, setMethod] = useState(formData?.method || "GET");
	const [url, setUrl] = useState(formData?.url || "");
	const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
	const [body, setBody] = useState(
		Object.keys(formData?.body)?.length > 0
			? JSON.stringify({ ...formData?.body }, null, 2)
			: "",
	);
	const [query, setQuery] = useState<{ key: string; value: string }[]>([]);
	const [response, setResponse] = useState("");

	useEffect(() => {
		setFormData({ method, url, headers, query, body });
	}, [method, url, headers, query, body]);

	useEffect(() => {
		// set formData to headers
		if (
			formData?.headers &&
			typeof formData?.headers === "object" &&
			!Array.isArray(formData?.headers)
		) {
			const headersArray = Object.entries(formData?.headers).map(
				([key, value]) => ({ key, value }),
			);
			setHeaders(headersArray as { key: string; value: string }[]);
		} else {
			setHeaders(formData?.headers || []);
		}

		// set formData to query
		if (
			formData?.query &&
			typeof formData?.query === "object" &&
			!Array.isArray(formData?.query)
		) {
			const queryArray = Object.entries(formData?.query).map(
				([key, value]) => ({ key, value }),
			);
			setQuery(queryArray as { key: string; value: string }[]);
		} else {
			setQuery(formData?.query || []);
		}
	}, []);

	const onMethodChange = (selectedMethod: string) => {
		setMethod(selectedMethod);
	};

	const addHeader = () => {
		setHeaders([...headers, { key: "", value: "" }]);
	};

	const addQuery = () => {
		setQuery([...query, { key: "", value: "" }]);
	};

	const removeHeader = (index: number) => {
		const newHeaders = [...headers];
		newHeaders.splice(index, 1);
		setHeaders(newHeaders);
	};

	const removeQuery = (index: number) => {
		const newQuery = [...query];
		newQuery.splice(index, 1);
		setQuery(newQuery);
	};

	const handleHeaderChange = (index: number, key: string, value: string) => {
		const newHeaders = [...headers];
		newHeaders[index] = { ...newHeaders[index], [key]: value };
		setHeaders(newHeaders);
	};

	const handleQueryChange = (index: number, key: string, value: string) => {
		const newQuery = [...query];
		newQuery[index] = { ...newQuery[index], [key]: value };
		setQuery(newQuery);
	};

	const sendTestRequest = async () => {
		const formattedHeaders = headers.map((header) => [
			header.key,
			header.value,
		]);
		const headersObject = Object.fromEntries(formattedHeaders);
		const reqObj = {
			url,
			method,
			headers: headersObject,
		};
		if (method === "POST") {
			// @ts-ignore
			reqObj.body = body;
		}

		const res = await axios.post("/api/proxy", reqObj);
		if (res?.data) {
			setResponse(JSON.stringify(res.data, null, 2));
		}
	};

	return (
		<div className="flex flex-col gap-4 px-4 py-6 w-full">
			<div className="space-y-2">
				<Label htmlFor="url" className="font-semibold">
					URL
				</Label>
				<div className="flex gap-2 items-center justify-between">
					<div className="w-[15%]">
						<Select
							onValueChange={(e) => onMethodChange(e)}
							defaultValue={method}
						>
							<SelectTrigger className="">
								<SelectValue placeholder="Select a voice" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem key="get" value="GET">
										GET
									</SelectItem>
									<SelectItem key="post" value="POST">
										POST
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<Input
						id="url"
						value={url}
						placeholder="https://..."
						onChange={(e) => setUrl(e.target.value)}
					/>
				</div>
			</div>
			<div className="space-y-2 mt-2">
				<Label className="font-semibold">Headers</Label>
				<div className="space-y-2">
					{headers.map((header, index) => (
						<div
							className="flex items-center justify-between gap-2"
							key={index}
						>
							<div className="space-y-2 w-full">
								<Label htmlFor={`header-${index}-key`}>Key</Label>
								<Input
									id={`header-${index}-key`}
									placeholder="Key"
									value={header.key}
									onChange={(e) =>
										handleHeaderChange(index, "key", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2 w-full">
								<Label htmlFor={`header-${index}-value`}>Value</Label>
								<Input
									id={`header-${index}-value`}
									placeholder="Value"
									value={header.value}
									onChange={(e) =>
										handleHeaderChange(index, "value", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2 w-[10%]">
								<Label htmlFor="remove" className="invisible">
									Remove
								</Label>
								<Button
									id="remove"
									variant="outline"
									onClick={() => removeHeader(index)}
								>
									<Cross1Icon />
								</Button>
							</div>
						</div>
					))}
					<Button variant="outline" onClick={addHeader}>
						<PlusIcon className="mr-2" />
						Add Header
					</Button>
				</div>
			</div>
			<div className="space-y-2 mt-3">
				<Label className="font-semibold">Query Params</Label>
				<div className="space-y-2">
					{query?.map((header, index) => (
						<div
							className="flex items-center justify-between gap-2"
							key={index}
						>
							<div className="space-y-2 w-full">
								<Label htmlFor={`query-${index}-key`}>Key</Label>
								<Input
									id={`query-${index}-key`}
									placeholder="Key"
									value={header.key}
									onChange={(e) =>
										handleQueryChange(index, "key", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2 w-full">
								<Label htmlFor={`query-${index}-value`}>Value</Label>
								<Input
									id={`query-${index}-value`}
									placeholder="Value"
									value={header.value}
									onChange={(e) =>
										handleQueryChange(index, "value", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2 w-[10%]">
								<Label htmlFor="remove" className="invisible">
									Remove
								</Label>
								<Button
									id="remove"
									variant="outline"
									onClick={() => removeQuery(index)}
								>
									<Cross1Icon />
								</Button>
							</div>
						</div>
					))}
					<Button variant="outline" onClick={addQuery}>
						<PlusIcon className="mr-2" />
						Add Query Param
					</Button>
				</div>
			</div>
			{method === "POST" && (
				<div className="w-full border rounded-md dark:border-none">
					<h4 className="bg-gray-200 p-2 flex gap-1 items-center dark:bg-gray-700 dark:text-white">
						Body
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
						value={body}
						onChange={(value) => setBody(value as string)}
					/>
				</div>
			)}
			<div className="flex flex-col gap-2">
				<Button
					type="button"
					onClick={sendTestRequest}
					disabled={!method || !url}
				>
					<RocketIcon className="mr-2" /> Send Test Request
				</Button>
			</div>
			<span className="text-sm text-gray-500 dark:text-gray-400 -mt-0.5">
				<strong>Note: </strong>Make sure to put real data in the request
				body/query/headers. You can't use the variables in the request
				body/query/headers.
			</span>
			<div className="space-y-2 mt-3">
				<div className="w-full border rounded-md dark:border-none">
					<h4 className="bg-gray-200 p-2 flex gap-1 items-center dark:bg-gray-700 dark:text-white">
						{} Response
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
						value={response}
					/>
				</div>
			</div>
		</div>
	);
}
