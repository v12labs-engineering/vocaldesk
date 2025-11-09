import AppSidebar from "@/components/ui/Sidebar/index";
import { Toaster } from "@/components/ui/Toasts/toaster";
import { DomainStyleInjector } from "@/components/ui/domain-style-injector";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { UserProvider } from "@/context/UserContext";
import { getUser } from "@/utils/auth-helpers/server";
import { cn } from "@/utils/cn";
import { getDomainConfig } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { type PropsWithChildren, Suspense } from "react";
import "@fontsource/geist-sans/100.css";
import "@fontsource/geist-sans/200.css";
import "@fontsource/geist-sans/300.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "styles/main.css";

export async function generateMetadata(): Promise<Metadata> {
	const headersList = await headers();
	const host = headersList.get("host");
	const domainConfig = getDomainConfig(host as string);

	return {
		title: domainConfig?.companyName || "VocalDesk",
		description: "AI phone services for your business.",
		icons: {
			icon: domainConfig?.logo || "/vocaldesk.svg",
		},
	};
}

export default async function RootLayout({ children }: PropsWithChildren) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<DomainStyleInjector />
			</head>
			<body className="bg-background">
				<ThemeProvider
					attribute="class"
					forcedTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<UserProvider initialUser={user}>
						{!user ? (
							children
						) : (
							<SidebarProvider>
								<AppSidebar />
								<main className="w-full">
									<div className="py-6 mx-auto max-w-5xl">{children}</div>
								</main>
							</SidebarProvider>
						)}
					</UserProvider>
					<Suspense>
						<Toaster />
					</Suspense>
				</ThemeProvider>
			</body>
		</html>
	);
}
