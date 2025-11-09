import React from "react";

const APIRequestDoc = () => {
	return (
		<>
			<h2 className="text-primary text-lg font-semibold">API Requests</h2>
			<div className="rounded-md p-4 space-y-8">
				<section className="space-y-4 tracking-tight">
					<p>
						API Requests allow you to interact with external APIs and retrieve
						data. You can use the data to create a custom response for your
						agent.
					</p>
				</section>
				<section className="space-y-4 tracking-tight">
					<p>API Request have the following properties:</p>

					<ul className="list-disc px-4 space-y-4">
						<li>
							<pre>name</pre> - A unique name for the agent to pickup. No two
							API requests can have the same name.
						</li>
						<li>
							<pre>description</pre> - A short explanation of what the API
							Request does.
						</li>
						<li>
							<pre>input_schema</pre> - A JSON schema describing the input data.
						</li>
						<li>
							<pre>speech(optional) </pre> - A string that will be spoken to the
							agent while your tool waits for a response.
						</li>
						<li>
							<pre>response_data</pre> - An array of objects that describe how
							to extract data from the response. Within the response data, you
							can create variables that the phone agent can reference in its
							prompt.
						</li>
					</ul>
				</section>
				<section className="space-y-4 tracking-tight">
					<h3 className="text-primary text-md font-semibold">
						Name & Description
					</h3>
					<p>
						The agent will see the name in the saved list of API Requests. The
						name, plus the description, help the AI phone agent when it decides
						which API Request to use. <br /> For this example we’ll set the name
						to{" "}
						<code className="bg-primary/20 p-1 text-sm rounded-lg">
							BookAppointment
						</code>{" "}
						and the description as{" "}
						<code className="bg-primary/20 p-1 rounded-lg text-sm">
							Books an appointment for the customer.​
						</code>
					</p>
				</section>
				<section className="space-y-4 tracking-tight">
					<h3 className="text-primary text-md font-semibold">Input Schema</h3>
					<p>
						The input schema is critical. It defines the shape of the API
						request, the different inputs the request can take, and also
						includes an example (which helps our system when creating requests).
					</p>
					<p>Here’s what the input schema could look like:</p>
					<pre className="bg-primary/20 p-4 rounded-lg text-sm">
						{` "input_schema": {
    // "example" is a special property that shows an example of what the input object the agent creates should look like
    "example": { 
        "speech": "Got it - one second while I book your appointment for tomorrow at 10 AM.",
        "date": "2024-04-20",
        "time": "10:00 AM",
        "service": "Haircut"
    },
    "type": "object",
    "properties": {
        "speech": "string",
        "date": "YYYY-MM-DD",
        "time": "HH:MM AM/PM",
        "service": "Haircut, Coloring, Trim, or Other"
    }
}`}
					</pre>
					<p>Two important notes about input schema:</p>
					<ul className="list-disc px-4 space-y-4">
						<li>
							<p>
								<strong>input_schema</strong> is converted into the variable{" "}
								<code className="bg-primary/20 p-1 rounded-lg text-sm">{`{{input}}`}</code>{" "}
								that you can use in the request body/query/headers
							</p>
						</li>
						<li>
							<p>
								To access nested properties, use dot notation:{" "}
								<code className="bg-primary/20 p-1 rounded-lg text-sm">{`{{input.property.subproperty}}`}</code>{" "}
							</p>
							<p>
								For example, later on you could use{" "}
								<code className="bg-primary/20 p-1 rounded-lg text-sm">{`{{input.service}}`}</code>{" "}
								to have whatever type of appointment that the customer wants
							</p>
						</li>
					</ul>
				</section>
				<section className="space-y-4 tracking-tight">
					<h3 className="text-primary text-md font-semibold">Speech</h3>
					<p>
						Because requesting external APIs might take a while, we enable you
						to define a speech property. The phone agent will say the speech
						while it makes the request.
					</p>
					<p>
						An example speech might look like:{" "}
						<code className="bg-primary/20 p-1 text-sm rounded-lg">
							Perfect, I'll schedule that right now, give me just a second.
						</code>{" "}
					</p>
					<p>
						For the restaurant ordering example, the speech could be{" "}
						<code className="bg-primary/20 p-1 text-sm rounded-lg">
							Thank you, placing that order now.
						</code>
					</p>
				</section>
				<section className="space-y-4 tracking-tight">
					<h3 className="text-primary text-md font-semibold">Response Data</h3>
					<p>
						Once the API request comes back, you need to extract the response
						data, and then make the phone agent aware of the new information.
						The variable name is case_sensitive and space_sensitive, use the
						exact name that you defined here in the prompt.
					</p>
					<p>
						The{" "}
						<code className="bg-primary/20 p-1 text-sm rounded-lg">data</code>{" "}
						field determines how you extract the data while the{" "}
						<code className="bg-primary/20 p-1 text-sm rounded-lg">name</code>{" "}
						field determines the variable name for reference in the prompt.
					</p>
					<p>Here’s an example response data:</p>

					<pre className="bg-primary/20 p-4 text-sm rounded-lg">
						{`"response": {
    "succesfully_booked_slot": "$.success",
    "stylist_name": "$.stylist_name", // if your API returns a JSON object with a key "stylist_name"
}`}
					</pre>
				</section>
				<section className="space-y-4 tracking-tight">
					<h3 className="text-primary text-md font-semibold">Full Example</h3>
					<pre className="bg-primary/20 p-4 rounded-lg text-sm">
						{`{
    "name": "BookAppointment",
    "description": "Books an appointment for the customer",
    "url": "https://your-api.com/book-appointment",
    "method": "POST",
    "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
    },
    "body": {
        "date": "{{input.date}}",
        "time": "{{input.time}}",
        "service": "{{input.service}}"
    },
    "input_schema": {
        "example": {
            "speech": "Got it - one second while I book your appointment for tomorrow at 10 AM.",
            "date": "2024-04-20",
            "time": "10:00 AM",
            "service": "Haircut"
        },
        "type": "object",
        "properties": {
            "speech": "string",
            "date": "YYYY-MM-DD",
            "time": "HH:MM AM/PM",
            "service": "Haircut, Coloring, Trim, or Other"
        }
    },
    "response": {
        "succesfully_booked_slot": "$.success",
        "stylist_name": "$.stylist_name"
    }
}`}
					</pre>
				</section>
			</div>
		</>
	);
};

export default APIRequestDoc;
