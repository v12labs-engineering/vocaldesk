import type { DomainConfig } from "@/config/domains";
import { getDomainConfig } from "@/utils/helpers";
import { useEffect, useState } from "react";

export function useDomainConfig() {
	const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null);

	useEffect(() => {
		const getConfig = () => {
			const host = window.location.hostname;
			const domain = getDomainConfig(host);
			return domain;
		};

		setDomainConfig(getConfig());
	}, []);

	return domainConfig;
}
