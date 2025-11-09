"use client";

import { Label } from "@/components/ui/label";
import { type CountryCode, parsePhoneNumber } from "libphonenumber-js";
import { useEffect, useState } from "react";

interface PhoneProps {
	number: string;
}

export default function Phone({ number }: PhoneProps) {
	const [formattedNumber, setFormattedNumber] = useState(number);
	const [countryFlag, setCountryFlag] = useState<string>("");

	useEffect(() => {
		try {
			if (number) {
				const phoneNumber = parsePhoneNumber(number);
				if (phoneNumber) {
					// Get the national format
					const national = phoneNumber.formatNational();
					// Format it with parentheses around area code
					const formatted = national.replace(
						/^(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{4})$/,
						"($1) $2-$3",
					);
					setFormattedNumber(formatted);

					const country = phoneNumber.country;
					if (country) {
						const flagEmoji = getFlagEmoji(country);
						setCountryFlag(flagEmoji);
					}
				}
			}
		} catch (error) {
			console.log("Error parsing phone number:", error);
		}
	}, [number]);

	const getFlagEmoji = (countryCode: CountryCode) => {
		const codePoints = countryCode
			.toUpperCase()
			.split("")
			.map((char) => 127397 + char.charCodeAt(0));
		return String.fromCodePoint(...codePoints);
	};

	return (
		<div className="flex items-center gap-2">
			<span className="text-2xl bg-gray-50 px-1.5 rounded-lg">{countryFlag}</span>
			<span className="text-primary text-xl font-medium">
				{formattedNumber}
			</span>
		</div>
	);
}
