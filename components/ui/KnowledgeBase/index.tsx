import LoadingDots from "@/components/ui/LoadingDots";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Globe, PenLine, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface KnowledgeBaseProps {
	value: string;
	onChange: (value: string) => void;
}

export function KnowledgeBase({ value, onChange }: KnowledgeBaseProps) {
	const [websiteUrl, setWebsiteUrl] = useState("");
	const [isUrlProcessing, setIsUrlProcessing] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [isFileProcessing, setIsFileProcessing] = useState(false);
	const [crawlProgress, setCrawlProgress] = useState(0);
	const [currentOperation, setCurrentOperation] = useState("");
	const [stats, setStats] = useState<{
		processedPages: number;
		totalPages: number;
		totalLinks: number;
	}>({
		processedPages: 0,
		totalPages: 0,
		totalLinks: 0,
	});

	const handleWebsiteCrawl = async () => {
		if (!websiteUrl) return;

		setIsUrlProcessing(true);
		setCrawlProgress(0);
		setCurrentOperation("");
		setStats({
			processedPages: 0,
			totalPages: 0,
			totalLinks: 0,
		});

		try {
			const response = await axios.post(
				"/api/knowledge/crawl",
				{ url: websiteUrl },
				{
					responseType: "stream",
					headers: {
						Accept: "text/event-stream",
						"Cache-Control": "no-cache",
					},
				},
			);

			const reader = response.data.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split("\n");

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						const data = JSON.parse(line.slice(6));

						switch (data.type) {
							case "progress":
								setCrawlProgress(Math.round(data.progress));
								setCurrentOperation(`Crawling ${data.currentUrl}`);
								setStats({
									processedPages: data.processedPages,
									totalPages: data.totalPages,
									totalLinks: data.totalLinks || 0,
								});
								break;

							case "complete":
								onChange(data.content);
								setIsUrlProcessing(false);
								setCrawlProgress(100);
								setCurrentOperation("Crawl completed");
								setStats(data.stats);
								toast.success(
									`Website crawled successfully. Processed ${data.stats.totalPages} pages.`,
								);
								break;

							case "error":
								toast.error(data.message);
								setIsUrlProcessing(false);
								setCurrentOperation("Error occurred");
								break;
						}
					}
				}
			}
		} catch (error) {
			console.error("Error crawling website:", error);
			toast.error("Failed to crawl website");
			setIsUrlProcessing(false);
			setCurrentOperation("Error occurred");
		}
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		const allowedTypes = [
			// Document formats
			"text/plain", // .txt
			"application/pdf", // .pdf
			"application/msword", // .doc
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
			// Media formats
			"audio/mpeg", // .mp3
			"audio/mp3", // .mp3 (alternative MIME type)
			"video/mp4", // .mp4
		];
		const maxSize = 50 * 1024 * 1024; // 50MB to accommodate media files

		const validFiles = files.filter((file) => {
			if (!allowedTypes.includes(file.type)) {
				toast.error(`${file.name} is not a supported file type`);
				return false;
			}
			if (file.size > maxSize) {
				toast.error(`${file.name} exceeds 50MB limit`);
				return false;
			}
			return true;
		});

		setUploadedFiles(validFiles);
		if (validFiles.length > 0) {
			setIsFileProcessing(true);
			const formData = new FormData();
			validFiles.forEach((file) => formData.append("files", file));

			try {
				const response = await axios.post("/api/knowledge/upload", formData);
				onChange(response.data.content);
				toast.success("Files processed successfully");
			} catch (error) {
				toast.error("Failed to process files. Please try again.");
			} finally {
				setIsFileProcessing(false);
			}
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Knowledge Base</CardTitle>
				<CardDescription>
					Add information that your AI agent should know about.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="manual" className="space-y-4">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="manual" className="flex items-center gap-2">
							<PenLine className="w-4 h-4" />
							Manual Input
						</TabsTrigger>
						<TabsTrigger value="website" className="flex items-center gap-2">
							<Globe className="w-4 h-4" />
							Website
						</TabsTrigger>
						<TabsTrigger value="upload" className="flex items-center gap-2">
							<Upload className="w-4 h-4" />
							Upload Files
						</TabsTrigger>
					</TabsList>

					<TabsContent value="manual">
						<Textarea
							value={value}
							rows={15}
							placeholder="Fits 8000 characters (approx 1600 words) of instructions. Try copy pasting your entire landing page's content here..."
							onChange={(e) => onChange(e.target.value)}
						/>
					</TabsContent>

					<TabsContent value="website">
						<div className="space-y-4">
							<Input
								type="url"
								placeholder="Enter your website URL (e.g., https://example.com)"
								value={websiteUrl}
								onChange={(e) => setWebsiteUrl(e.target.value)}
							/>
							<Button
								onClick={handleWebsiteCrawl}
								disabled={!websiteUrl || isUrlProcessing}
								className="w-full"
							>
								{isUrlProcessing ? <LoadingDots /> : "Crawl Website"}
							</Button>

							{(isUrlProcessing || currentOperation) && (
								<div className="space-y-2">
									<div className="flex justify-between text-sm text-muted-foreground">
										<span>{currentOperation}</span>
										<span>{crawlProgress}%</span>
									</div>
									<Progress value={crawlProgress} className="h-2" />
									{stats.totalPages > 0 && (
										<div className="text-sm text-muted-foreground">
											Processed {stats.processedPages} of {stats.totalPages}{" "}
											pages
											{stats.totalLinks > 0 && (
												<span> • Found {stats.totalLinks} links</span>
											)}
										</div>
									)}
								</div>
							)}

							<p className="text-xs text-muted-foreground">
								This will crawl all accessible pages on your website and extract
								the content. The process might take a few minutes depending on
								the size of your website.
							</p>
						</div>
					</TabsContent>

					<TabsContent value="upload">
						<div className="space-y-4">
							<Input
								type="file"
								multiple
								accept=".txt,.pdf,.doc,.docx,.mp3,.mp4"
								onChange={handleFileUpload}
								disabled={isFileProcessing}
							/>
							<p className="text-xs text-muted-foreground">
								Supported files: PDF, MP3, MP4, TXT, DOCX (Max 50MB per file)
							</p>
							{uploadedFiles.length > 0 && (
								<div className="text-sm text-muted-foreground">
									{uploadedFiles.map((file) => (
										<div key={file.name}>{file.name}</div>
									))}
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
