// import { CheerioCrawler } from "crawlee";
// import { type NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
// 	try {
// 		const { url } = await request.json();

// 		if (!url) {
// 			return NextResponse.json({ error: "URL is required" }, { status: 400 });
// 		}

// 		const crawledData = [];

// 		const crawler = new CheerioCrawler({
// 			// Use preNavigationHooks to set custom headers
// 			preNavigationHooks: [
// 				(crawlingContext, gotOptions) => {
// 					gotOptions.headers = {
// 						...gotOptions.headers,
// 						"User-Agent": "Your Custom User-Agent",
// 						// Add other headers as needed
// 					};
// 				},
// 			],
// 			async requestHandler({ request, $, enqueueLinks, log }) {
// 				const pageContent = $("body").text();
// 				crawledData.push({ url: request.url, content: pageContent });
// 				log.info(`Processed: ${request.url}`);

// 				// Enqueue all links found on the current page
// 				await enqueueLinks();
// 			},
// 			maxRequestsPerCrawl: 50, // Limit the number of pages to crawl
// 		});

// 		// Start the crawler with the initial URL
// 		await crawler.run([url]);

// 		return NextResponse.json({ data: crawledData });
// 	} catch (error) {
// 		console.error("Error during crawling:", error);
// 		return NextResponse.json(
// 			{ error: "Failed to crawl the website" },
// 			{ status: 500 },
// 		);
// 	}
// }
