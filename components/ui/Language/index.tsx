"use client";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface LanguageOption {
	code: string;
	name: string;
}

// Grouped by regions/variants for better organization
const languages: { group: string; options: LanguageOption[] }[] = [
	{
		group: "English Variants",
		options: [
			{ code: "en", name: "English (Default)" },
			{ code: "en-US", name: "English (US)" },
			{ code: "en-GB", name: "English (UK)" },
			{ code: "en-AU", name: "English (Australia)" },
			{ code: "en-NZ", name: "English (New Zealand)" },
			{ code: "en-IN", name: "English (India)" },
		],
	},
	{
		group: "Chinese Variants",
		options: [
			{ code: "zh", name: "Chinese (Simplified)" },
			{ code: "zh-CN", name: "Chinese (China)" },
			{ code: "zh-Hans", name: "Chinese (Hans)" },
			{ code: "zh-TW", name: "Chinese (Traditional)" },
			{ code: "zh-Hant", name: "Chinese (Hant)" },
		],
	},
	{
		group: "European Languages",
		options: [
			{ code: "de", name: "German" },
			{ code: "es", name: "Spanish" },
			{ code: "fr", name: "French" },
			{ code: "it", name: "Italian" },
			{ code: "nl", name: "Dutch" },
			{ code: "pl", name: "Polish" },
			{ code: "sv", name: "Swedish" },
			{ code: "da", name: "Danish" },
			{ code: "fi", name: "Finnish" },
			{ code: "el", name: "Greek" },
			{ code: "ru", name: "Russian" },
			{ code: "uk", name: "Ukrainian" },
			{ code: "bg", name: "Bulgarian" },
			{ code: "cs", name: "Czech" },
			{ code: "ro", name: "Romanian" },
			{ code: "sk", name: "Slovak" },
		],
	},
	{
		group: "Asian Languages",
		options: [
			{ code: "hi", name: "Hindi" },
			{ code: "hi-Latn", name: "Hindi (Latin)" },
			{ code: "ja", name: "Japanese" },
			{ code: "ko", name: "Korean" },
			{ code: "id", name: "Indonesian" },
			{ code: "ms", name: "Malay" },
			{ code: "tr", name: "Turkish" },
		],
	},
	{
		group: "Other Variants",
		options: [
			{ code: "es-419", name: "Spanish (Latin America)" },
			{ code: "fr-CA", name: "French (Canada)" },
			{ code: "pt", name: "Portuguese" },
			{ code: "pt-BR", name: "Portuguese (Brazil)" },
			{ code: "sv-SE", name: "Swedish (Sweden)" },
			{ code: "da-DK", name: "Danish (Denmark)" },
			{ code: "ko-KR", name: "Korean (Korea)" },
		],
	},
];

interface LanguageProps {
	selected: string;
	onLanguageChange?: (value: string) => void;
	displayOnly?: boolean;
}

export default function Language({
	selected,
	onLanguageChange,
	displayOnly = false,
}: LanguageProps) {
	const getLanguageName = (code: string): string => {
		for (const group of languages) {
			const language = group.options.find((lang) => lang.code === code);
			if (language) return language.name;
		}
		return code;
	};

	if (displayOnly) {
		return (
			<div className="text-sm">
				{getLanguageName(selected)}
			</div>
		);
	}

	return (
		<div className="grid gap-2">
			<Select value={selected} onValueChange={onLanguageChange}>
				<SelectTrigger>
					<SelectValue placeholder="Select language" />
				</SelectTrigger>
				<SelectContent>
					{languages.map((group) => (
						<div key={group.group}>
							<div className="px-2 py-1.5 text-sm font-semibold">
								{group.group}
							</div>
							{group.options.map((language) => (
								<SelectItem
									key={language.code}
									value={language.code}
									className="text-sm"
								>
									{language.name}
								</SelectItem>
							))}
						</div>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
