import { useEffect, useState } from "react";
import { useDomainConfig } from "./useDomainConfig";

export function useDomainStyles() {
	const domainConfig = useDomainConfig();
	const [styles, setStyles] = useState<string>("");

	useEffect(() => {
		if (domainConfig) {
			const styleString = `
        :root {
          --color-primary: ${domainConfig.primaryColor};
        }
      `;
			setStyles(styleString);
		}
	}, [domainConfig]);

	return styles;
}
