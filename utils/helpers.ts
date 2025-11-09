// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import crypto from "crypto";
import domainConfigs, { type DomainConfig } from "@/config/domains";
import type { Tables } from "@/database.types";
import moment from "moment-timezone";

type Price = Tables<"prices">;

export const getURL = (path = "") => {
	// Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
	let url =
		process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
		process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
		"http://localhost:4000/";

	// Trim the URL and remove trailing slash if exists.
	url = url.replace(/\/+$/, "");

	// Ensure path starts without a slash to avoid double slashes in the final URL.
	path = path.replace(/^\/+/, "");

	// Concatenate the URL and the path.
	return path ? `${url}/${path}` : url;
};

export const postData = async ({
	url,
	data,
}: {
	url: string;
	data?: { price: Price };
}) => {
	console.log("posting,", url, data);

	const res = await fetch(url, {
		method: "POST",
		headers: new Headers({ "Content-Type": "application/json" }),
		credentials: "same-origin",
		body: JSON.stringify(data),
	});

	return res.json();
};

export const toDateTime = (secs: number) => {
	var t = new Date(+0); // Unix epoch start.
	t.setSeconds(secs);
	return t;
};

export const calculateTrialEndUnixTimestamp = (
	trialPeriodDays: number | null | undefined,
) => {
	// Check if trialPeriodDays is null, undefined, or less than 2 days
	if (
		trialPeriodDays === null ||
		trialPeriodDays === undefined ||
		trialPeriodDays < 2
	) {
		return undefined;
	}

	const currentDate = new Date(); // Current date and time
	const trialEnd = new Date(
		currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000,
	); // Add trial days
	return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};

const toastKeyMap: { [key: string]: string[] } = {
	status: ["status", "status_description"],
	error: ["error", "error_description"],
};

const getToastRedirect = (
	path: string,
	toastType: string,
	toastName: string,
	toastDescription = "",
	disableButton = false,
	arbitraryParams = "",
): string => {
	const [nameKey, descriptionKey] = toastKeyMap[toastType];

	let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

	if (toastDescription) {
		redirectPath += `&${descriptionKey}=${encodeURIComponent(
			toastDescription,
		)}`;
	}

	if (disableButton) {
		redirectPath += `&disable_button=true`;
	}

	if (arbitraryParams) {
		redirectPath += `&${arbitraryParams}`;
	}

	return redirectPath;
};

export const getStatusRedirect = (
	path: string,
	statusName: string,
	statusDescription = "",
	disableButton = false,
	arbitraryParams = "",
) =>
	getToastRedirect(
		path,
		"status",
		statusName,
		statusDescription,
		disableButton,
		arbitraryParams,
	);

export const getErrorRedirect = (
	path: string,
	errorName: string,
	errorDescription = "",
	disableButton = false,
	arbitraryParams = "",
) =>
	getToastRedirect(
		path,
		"error",
		errorName,
		errorDescription,
		disableButton,
		arbitraryParams,
	);

export function isValidEmail(email: string) {
	const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	return regex.test(email);
}

export function getWindowParams() {
	const width = 500;
	const height = 600;
	const left = window.innerWidth / 2 - width / 2 + window.screenX;
	const top = window.innerHeight / 2 - height / 2 + window.screenY;
	return `width=${width},height=${height},top=${top},left=${left}`;
}

export async function pollAuthWindow(
	authWindow: Window | null | undefined,
): Promise<void> {
	return new Promise((resolve) => {
		const interval = setInterval(() => {
			try {
				if (
					authWindow?.document?.body?.textContent?.includes(
						"Authorized successfully!",
					)
				) {
					clearInterval(interval);
					authWindow?.close();
					console.log("Authentication process completed. Window closed.");
					resolve();
				}
			} catch (e) {
				// Errors are normal when the window has navigated away to the OAuth server
			}
		}, 800);
	});
}

export function verifyWebhookSignature(
	key: string,
	data: string,
	signature: string,
) {
	const expectedSignature = crypto
		.createHmac("sha256", key)
		.update(data)
		.digest("hex");

	return expectedSignature === signature;
}

export function formatMinutes(minutes: number) {
	if (!minutes) return "0m 0s";
	const totalSeconds = Math.round(minutes * 60);
	const displayMinutes = Math.floor(totalSeconds / 60);
	const displaySeconds = totalSeconds % 60;
	return `${displayMinutes}m ${displaySeconds}s`;
}

export function convertToDate(dateString: string, timezone: string) {
	if (!dateString) return null;
	const matchResult = dateString.match(/\d+/);
	if (!matchResult) return null;
	const timestamp = matchResult[0];
	// Use moment-timezone to handle the timezone
	const date = moment.tz(Number.parseInt(timestamp, 10), timezone);
	const formattedDate = date.format("YYYY-MM-DD HH:mm:ss");

	return formattedDate;
}

export function formatChartValue(value: number) {
	if (!value) return "0";
	return value.toString();
}

export function getDomainConfig(hostname: string): DomainConfig {
	// Remove 'www.' if present
	const cleanHostname = hostname.replace(/^www\./, "");

	// Check if the full hostname exists in the configs
	if (cleanHostname in domainConfigs) {
		return domainConfigs[cleanHostname];
	}

	// If not found, try to match the main domain (without subdomains)
	const mainDomain = cleanHostname.split(".").slice(-2).join(".");
	if (mainDomain in domainConfigs) {
		return domainConfigs[mainDomain];
	}

	// If no match is found, return the default config
	return domainConfigs.default;
}

export function generateApiKey(): string {
	const API_KEY_PREFIX = "in";
	const RANDOM_BYTES_LENGTH = 24;
	const randomBytes = crypto.randomBytes(RANDOM_BYTES_LENGTH);
	const randomString = randomBytes.toString("base64").replace(/[+/=]/g, "");
	return `${API_KEY_PREFIX}_${randomString}`;
}

export function convertFieldsToQuestions(
	fieldsToParse: Record<string, string>,
) {
	const originalObjectOrder = Object.keys(fieldsToParse);
	const questions = originalObjectOrder.map((key) => {
		const questionText = fieldsToParse[key];

		// Determine the appropriate type based on the field
		let questionType = "string";
		if (key === "callBackRequested") {
			questionType = "boolean";
		}

		return [questionText, questionType];
	});

	return {
		questions,
		originalObjectOrder,
	};
}

export function convertAnswersToObject(answers: any, originalObjectOrder: any) {
	// Use the original key order to reconstruct the object
	return originalObjectOrder.reduce((obj, key, index) => {
		obj[key] = answers[index];
		return obj;
	}, {});
}

export function calculateAverageDuration(calls: any[]) {
	if (!calls || calls.length === 0) {
		return "0m 0s";
	}

	const totalDuration = calls.reduce(
		(acc, call) => acc + Number(call?.call_length || 0),
		0,
	);
	return formatMinutes(totalDuration / calls.length);
}

function parseCallDate(dateStr) {
	return new Date(dateStr);
}

function getDayKey(dateObj) {
	// You could also use a library like moment.js, dayjs, or date-fns for convenience.
	// Here is a pure JS approach:
	const year = dateObj.getUTCFullYear();
	const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // 0-based index
	const day = String(dateObj.getUTCDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function getMonthName(dateObj: Date): string {
	return dateObj.toLocaleString("en-US", { month: "long" });
}

function getMonthKey(dateObj: Date): string {
	return getMonthName(dateObj);
}

function getYearKey(dateObj) {
	return String(dateObj.getUTCFullYear());
}

export function getCallsByDay(calls: any[]) {
	const dayCounts = {};

	if (!calls || calls.length === 0) {
		return [];
	}

	for (const call of calls) {
		const dateObj = parseCallDate(call.created_at);
		if (Number.isNaN(dateObj)) continue; // skip invalid date

		const dayKey = getDayKey(dateObj);
		dayCounts[dayKey] = (dayCounts[dayKey] || 0) + 1;
	}

	return Object.keys(dayCounts).map((day) => ({
		day,
		count: dayCounts[day],
	}));
}

export function getCallsByMonth(calls: any[]) {
	const monthCounts: { [key: string]: number } = {};

	if (!calls || calls.length === 0) {
		return [];
	}

	for (const call of calls) {
		const dateObj = parseCallDate(call.created_at);
		if (Number.isNaN(dateObj)) continue;

		const monthKey = getMonthKey(dateObj);
		monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
	}

	// Sort by date (newest first)
	return Object.keys(monthCounts)
		.sort((a, b) => {
			const months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			return months.indexOf(b) - months.indexOf(a);
		})
		.map((month) => ({
			month,
			count: monthCounts[month],
		}));
}

export function getCallsByYear(calls: any[]) {
	const yearCounts = {};

	if (!calls || calls.length === 0) {
		return [];
	}

	for (const call of calls) {
		const dateObj = parseCallDate(call.created_at);
		if (Number.isNaN(dateObj)) continue;

		const yearKey = getYearKey(dateObj);
		yearCounts[yearKey] = (yearCounts[yearKey] || 0) + 1;
	}

	return Object.keys(yearCounts).map((year) => ({
		year,
		count: yearCounts[year],
	}));
}

export function getCallsByCity(calls: any[]) {
	const cityCounts = {};

	if (!calls || calls.length === 0) {
		return [];
	}

	for (const call of calls) {
		// city might be missing, so default to "Unknown"
		const city =
			call.variables && call.variables.city ? call.variables.city : "Unknown";

		cityCounts[city] = (cityCounts[city] || 0) + 1;
	}

	return Object.keys(cityCounts).map((city) => ({
		city,
		count: cityCounts[city],
	}));
}
