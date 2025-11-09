// import { Readable } from "stream";
// import { createClient } from "@/utils/supabase/server";
// import { DocxLoader } from "langchain/document_loaders/fs/docx";
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { type NextRequest, NextResponse } from "next/server";

// // Helper function to convert Buffer to Readable stream
// function bufferToStream(buffer: Buffer) {
// 	return new Readable({
// 		read() {
// 			this.push(buffer);
// 			this.push(null);
// 		},
// 	});
// }

// async function processFile(file: File): Promise<string> {
// 	const buffer = await file.arrayBuffer();
// 	let text = "";

// 	try {
// 		switch (file.type) {
// 			case "application/pdf":
// 				const pdfLoader = new PDFLoader(bufferToStream(Buffer.from(buffer)));
// 				const pdfDocs = await pdfLoader.load();
// 				text = pdfDocs.map((doc) => doc.pageContent).join("\n");
// 				break;

// 			case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
// 			case "application/msword":
// 				const docxLoader = new DocxLoader(bufferToStream(Buffer.from(buffer)));
// 				const docxDocs = await docxLoader.load();
// 				text = docxDocs.map((doc) => doc.pageContent).join("\n");
// 				break;

// 			case "text/plain":
// 				const txtLoader = new TextLoader(bufferToStream(Buffer.from(buffer)));
// 				const txtDocs = await txtLoader.load();
// 				text = txtDocs.map((doc) => doc.pageContent).join("\n");
// 				break;

// 			case "audio/mpeg":
// 			case "audio/mp3":
// 			case "video/mp4":
// 				// For media files, we'll need to use a transcription service
// 				// This is a placeholder for where you'd implement audio/video transcription
// 				// You might want to use services like Whisper API or similar
// 				text = "Media file transcription not implemented";
// 				break;

// 			default:
// 				throw new Error(`Unsupported file type: ${file.type}`);
// 		}

// 		return text;
// 	} catch (error) {
// 		console.error(`Error processing file ${file.name}:`, error);
// 		throw new Error(`Failed to process file ${file.name}`);
// 	}
// }

// export async function POST(request: NextRequest) {
// 	try {
// 		const formData = await request.formData();
// 		const files = formData.getAll("files") as File[];

// 		if (!files || files.length === 0) {
// 			return NextResponse.json({ error: "No files provided" }, { status: 400 });
// 		}

// 		// Process all files and combine their content
// 		const processedContents = await Promise.all(
// 			files.map((file) => processFile(file)),
// 		);

// 		const combinedContent = processedContents.join("\n\n");

// 		return NextResponse.json({ content: combinedContent }, { status: 200 });
// 	} catch (error) {
// 		console.error("Error processing files:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to process files" },
// 			{ status: 500 },
// 		);
// 	}
// }
