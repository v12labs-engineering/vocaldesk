import React from "react";

const OutboundAPIDoc = () => {
	return (
		<>
			<h2 className="text-primary text-lg font-semibold">Outbound API Call</h2>
			<div className="rounded-md p-4 space-y-8">
				<section className="space-y-4 tracking-tight">
					<p>
						The Outbound API Call allows you to programmatically initiate calls
						using our AI agents. This API enables you to integrate our calling
						capabilities into your own applications or workflows.
					</p>
				</section>
				<section className="space-y-4 tracking-tight">
					<h3 className="text-primary text-md font-semibold">Endpoint</h3>
					<p>
						<code className="bg-primary/20 p-1 rounded-lg text-sm">
							POST https://app.vocaldesk.co/api/agent/call
						</code>
					</p>
				</section>
				<section className="space-y-4 tracking-tight">
					<h3 className="text-primary text-md font-semibold">Authentication</h3>
					<p>
						To generate an API key and get started, visit the accounts page.
					</p>
					<p>Include your API key in the Authorization header:</p>
					<pre className="bg-primary/20 p-2 rounded-lg text-sm">
						Authorization: YOUR_API_KEY
					</pre>
				</section>
				<section className="space-y-4 tracking-tight">
					<h3 className="text-primary text-md font-semibold">
						Request Body Parameters
					</h3>
					<p>
						The request body should be a JSON object with the following
						parameters:
					</p>

					<div className="mt-4 space-y-4">
						<div>
							<h4 className="text-primary font-medium">phone (required)</h4>
							<p>Type: string</p>
							<p>
								The phone number to call, in E.164 format (e.g., +1234567890).
							</p>
						</div>

						<div>
							<h4 className="text-primary font-medium">promptId (required)</h4>
							<p>Type: string</p>
							<p>The ID of the pre-defined prompt to use for the call.</p>
						</div>

						<div>
							<h4 className="text-primary font-medium">
								callContext (optional)
							</h4>
							<p>Type: object</p>
							<p>
								Any JSON you put here will be visible to the AI agent during the
								call and can be referenced with Prompt Variables.
							</p>
							<p>Example usage:</p>
							<pre className="bg-primary/20 p-4 rounded-lg text-sm">
								{`{
  "phone_number": "+1...",
  "greetMessage": "Hello {{name}}! How are you doing today?",
  "callContext": {
    "name": "John Doe"
  }
}`}
							</pre>
							<p>
								In this example, name will be replaced with "John Doe" in the
								greetMessage and can be used similarly in saved prompts.
							</p>
						</div>

						<div>
							<h4 className="text-primary font-medium">voice (optional)</h4>
							<p>Type: string</p>
							<p>Default: "maya"</p>
							<p>
								The voice to use for the AI agent. You can find them in the AI
								agent form.
							</p>
						</div>

						<div>
							<h4 className="text-primary font-medium">
								greetMessage (optional)
							</h4>
							<p>Type: string</p>
							<p>
								A custom greeting message for the AI agent to use at the start
								of the call.
							</p>
						</div>

						<div>
							<h4 className="text-primary font-medium">
								interruptionThreshold (optional)
							</h4>
							<p>Type: number</p>
							<p>
								The threshold for interruptions, in milliseconds. Affects how
								quickly the AI responds to pauses.
							</p>
						</div>

						<div>
							<h4 className="text-primary font-medium">
								temperature (optional)
							</h4>
							<p>Type: number</p>
							<p>Default: 0.5</p>
							<p>
								Controls the randomness of the AI's responses. Higher values
								make the output more random.
							</p>
						</div>

						<div>
							<h4 className="text-primary font-medium">
								transferPhoneNumber (optional)
							</h4>
							<p>Type: string</p>
							<p>A phone number to transfer the call to if needed.</p>
						</div>

						<div>
							<h4 className="text-primary font-medium">
								transferList (optional)
							</h4>
							<p>Type: object</p>
							<p>
								A list of phone numbers that the AI can transfer the call to
								under specific conditions. The key should be the name of the
								condition, and the value should be the phone number to transfer
								to.
							</p>
							<p>Example usage:</p>
							<pre className="bg-primary/20 p-4 rounded-lg text-sm">
								{`{
  "transferList": {
    "support": "+1234567890",
    "billing": "+1234567891"
  }
}`}
							</pre>
						</div>

						<div>
							<h4 className="text-primary font-medium">
								maxDuration (optional)
							</h4>
							<p>Type: number</p>
							<p>Default: 30</p>
							<p>The maximum duration of the call in minutes.</p>
						</div>

						<div>
							<h4 className="text-primary font-medium">metadata (optional)</h4>
							<p>Type: object</p>
							<p>
								Additional metadata to associate with the call. Anything that
								you put here will be returned in your webhook or in the call
								details under metadata.
							</p>
							<p>Example usage:</p>
							<pre className="bg-primary/20 p-4 rounded-lg text-sm">
								{`{
  "metadata": {
    "user_id": "123",
    "account_id": "7890"
  }
}`}
							</pre>
						</div>
					</div>
				</section>
				<section className="space-y-4 tracking-tight">
					<h3 className="text-primary text-md font-semibold">Response</h3>
					<p>
						The API will respond with a JSON object containing the call details:
					</p>
					<pre className="bg-primary/20 p-4 rounded-lg text-sm">
						{`{
  "data": {
    "message": "string",
    "status": "string",
    "callId": "string"
  }
}`}
					</pre>
				</section>
				<section className="space-y-4 tracking-tight">
					<h3 className="text-primary text-md font-semibold">Example Usage</h3>
					<pre className="bg-primary/20 p-4 rounded-lg text-sm">
						{`fetch('https://app.vocaldesk.co/api/agent/call', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    phone: '+1234567890',
    promptId: '0e20205c-90bb-45a0-9a64-ba96d41781db',
    voice: 'john',
    greetMessage: 'Hello, this is a test call.',
    maxDuration: 15
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
					</pre>
				</section>
			</div>
		</>
	);
};

export default OutboundAPIDoc;
