"use client";

import { useDomainStyles } from "@/hooks/useDomainStyles";

export function DomainStyleInjector() {
	const styles = useDomainStyles();

	// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
	return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}
