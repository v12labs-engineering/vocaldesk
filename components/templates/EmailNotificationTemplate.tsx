import Logo from "@/components/icons/Logo";
import {
	Body,
	Button,
	CodeBlock,
	Container,
	Head,
	Html,
	Preview,
	Section,
	Text,
	vs,
} from "@react-email/components";
import * as React from "react";

interface NotificationEmailProps {
	from: string;
	summary: string;
	date: string;
	link: string;
	jsonData: any;
}

const EmailNotificationTemplate = ({
	from,
	summary,
	date,
	link,
	jsonData,
}: NotificationEmailProps) => (
	<Html>
		<Head />
		<Preview>Recent Phone Call Summary</Preview>
		<Body style={main}>
			<Container style={container}>
				{/* <Logo email={true} /> */}
				<Section style={section}>
					<Text style={text}>Hi there!</Text>
					<Text style={text}>
						You received a call from <strong>{from}</strong>.
					</Text>
					<Text style={text}>Here's a quick summary:</Text>
					<Text style={summaryText}>{summary}</Text>

					<Text style={jsonHeader}>Additional Call Details:</Text>
					<CodeBlock
						language="json"
						theme={vs}
						code={JSON.stringify(jsonData, null, 2)}
						style={jsonBlock}
					/>
					{/* <Button style={button} href={link}>
						View Full Call Details
					</Button> */}
				</Section>
				{/* <Text style={noteText}>
					<strong>Note:</strong> If redirected to login after clicking button,
					please sign in and click the button again.
				</Text> */}
			</Container>
		</Body>
	</Html>
);

export default EmailNotificationTemplate;

const main = {
	color: "#24292e",
	fontFamily: "'Geist Sans', sans-serif",
	fontSize: "16px",
};

const container = {
	maxWidth: "570px",
	margin: "0 auto",
	padding: "20px 0 48px",
	fontFamily: "'Geist Sans', sans-serif",
};

const section = {
	padding: "24px",
	border: "solid 1px #dedede",
	borderRadius: "8px",
	textAlign: "center" as const,
	fontFamily: "'Geist Sans', sans-serif",
};

const text = {
	fontSize: "16px",
	margin: "0 0 10px 0",
	textAlign: "left" as const,
	fontFamily: "'Geist Sans', sans-serif",
};

const button = {
	fontSize: "16px",
	marginTop: "5px",
	backgroundColor: "#37996b",
	color: "#fff",
	lineHeight: 1.5,
	borderRadius: "0.5em",
	padding: "12px 24px",
	fontFamily: "'Geist Sans', sans-serif",
};

const summaryText = {
	...text,
	backgroundColor: "#f0f0f0",
	padding: "15px",
	borderRadius: "5px",
	marginBottom: "20px",
	fontFamily: "'Geist Sans', sans-serif",
};

const jsonHeader = {
	...text,
	marginTop: "20px",
};

const jsonBlock = {
	backgroundColor: "#f0f0f0",
	borderRadius: "5px",
	border: "none",
	padding: "10px",
	fontFamily: "monospace",
	fontSize: "12px",
	whiteSpace: "pre-wrap",
};

const noteText = {
	...text,
	fontSize: "14px",
	color: "#666",
	marginTop: "20px",
	fontStyle: "italic",
};
