import axios from "axios";

interface PurchaseInboundNumber {
	area_code: string;
	webhook_url: string;
	country_code: string;
}

interface UpdateInboundNumberDetails {
	name: string;
	id: string;
	webhook_url: string;
}

export async function purchaseInboundNumber(data: any) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.post(
			`${process.env.BLAND_API_URL}/inbound/purchase`,
			data,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function getInboundNumberDetails(phone_number: string) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
			encrypted_key: process.env.TWILIO_ENCRYPTED_KEY as string,
			"Content-Type": "application/json",
		},
	};

	try {
		const response = await axios.get(
			`${process.env.BLAND_API_URL}/inbound/${encodeURIComponent(
				phone_number,
			)}`,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return {};
	}
}

export async function updateInboundNumberDetails(data: any) {
	const { phone_number, ...body } = data;
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
			encrypted_key: process.env.TWILIO_ENCRYPTED_KEY as string,
		},
	};

	try {
		const response = await axios.post(
			`${process.env.BLAND_API_URL}/inbound/${encodeURIComponent(
				phone_number,
			)}`,
			{ encrypted_key: process.env.TWILIO_ENCRYPTED_KEY, ...body },
			options,
		);
		return { data: response.data, error: null };
	} catch (err) {
		return { data: null, error: err };
	}
}

export async function getVoices(reduce_latency = true) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.get(
			`${process.env.BLAND_API_URL}/voices?reduce_latency=${reduce_latency}`,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function getVoiceSample(voice_id: string) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
			"Content-Type": "application/json",
		},
	};

	const body = JSON.stringify({
		text: "Hello, I hope you're having a wonderful day! How may I assist you today?",
	});

	try {
		const response = await axios.post(
			`${process.env.BLAND_API_URL}/voices/${voice_id}/sample`,
			body,
			{ ...options, responseType: "stream" },
		);
		return { data: response.data, error: null };
	} catch (err) {
		console.error(err);
		return { data: null, error: err };
	}
}

export async function getInboundCalls(phone_number: string) {
	if (!phone_number || phone_number === " ") {
		return [];
	}
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
		params: {
			to_number: phone_number,
		},
	};

	try {
		const response = await axios.get(
			`${process.env.BLAND_API_URL}/calls`,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function getInboundCallDetails(call_id: string) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.get(
			`${process.env.BLAND_API_URL}/calls/${call_id}`,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function analyzeCall(call_id: string, questions: any) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.post(
			`${process.env.BLAND_API_URL}/calls/${call_id}/analyze`,
			{
				goal: questions
					? "Extract answers to questions asked by the caller."
					: "Extract the leads from the call, so that we can follow up with them.",
				questions: questions || [
					["What was the call about?", "string"],
					["Was the customer satisfied with the call?", "string"],
					["Was the customer interested in the service?", "string"],
				],
			},
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function getOutboundCalls(phone_number: string) {
	if (!phone_number || phone_number === "" || phone_number === " ") {
		return [];
	}

	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.get(
			`${process.env.BLAND_API_URL}/batches`,
			options,
		);

		// Filter batches where metadata.phone_number matches
		const filteredData = {
			...response.data,
			batches:
				response.data?.batches?.filter(
					(batch: any) =>
						batch?.call_params?.metadata?.phone_number === phone_number,
				) || [],
		};

		return filteredData;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function createOutboundBatch(data: any) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.post(
			`${process.env.BLAND_API_URL}/batches`,
			data,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function getOutboundBatchDetails(batch_id: string) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.get(
			`${process.env.BLAND_API_URL}/batches/${batch_id}`,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function getPrompts() {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.get(
			`${process.env.BLAND_API_URL}/prompts`,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return { data: null, error: err };
	}
}

export async function createPrompt(data: any) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.post(
			`${process.env.BLAND_API_URL}/prompts`,
			data,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function deletePrompt(promptId: string) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.delete(
			`${process.env.BLAND_API_URL}/prompts/${promptId}`,
			options,
		);
		return response.data;
	} catch (err) {
		console.error("Error while deleting prompt", err?.response?.data);
		return err;
	}
}

export async function createTool(data: any) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	console.log("data:=========================", data);

	try {
		const response = await axios.post(
			`${process.env.BLAND_API_URL}/tools`,
			data,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function getTools() {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.get(
			`${process.env.BLAND_API_URL}/tools`,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function getToolDetails(tool_id: string) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.get(
			`${process.env.BLAND_API_URL}/tools/${tool_id}`,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function updateTool(data: any) {
	const { tool_id, ...body } = data;
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.post(
			`${process.env.BLAND_API_URL}/tools/${tool_id}`,
			body,
			options,
		);
		return { data: response.data, error: null };
	} catch (err) {
		return { data: null, error: err };
	}
}

export async function deleteTool(tool_id: string) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
		},
	};

	try {
		const response = await axios.delete(
			`${process.env.BLAND_API_URL}/tools/${tool_id}`,
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}

export async function getRecordings(call_id: string) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
			accept: "application/json",
		},
	};

	try {
		const response = await axios.get(
			`${process.env.BLAND_API_URL}/calls/${call_id}/recording`,
			options,
		);
		return response.data;
	} catch (err) {
		return null;
	}
}

export async function analyzeCallEmotions(call_id: string) {
	const options = {
		headers: {
			authorization: process.env.BLAND_API_KEY as string,
			"Content-Type": "application/json",
		},
	};

	try {
		const response = await axios.post(
			`${process.env.BLAND_API_URL}/intelligence/emotions`,
			{
				callId: call_id,
			},
			options,
		);
		return response.data;
	} catch (err) {
		console.error(err);
		return err;
	}
}
