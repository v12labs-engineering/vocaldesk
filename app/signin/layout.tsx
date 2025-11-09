import Logo from "@/components/icons/Logo";
import { getDomainConfig } from "@/utils/helpers";
import { headers } from "next/headers";
import Link from "next/link";

export default function AuthLayout({
	children,
}: { children: React.ReactNode }) {
	const headersList = headers();
	const host = headersList.get("host");
	const domainConfig = getDomainConfig(host as string);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-gray-50 via-gray-50 to-gray-100">
			{/* Brand Section */}
			<div className="w-full max-w-[400px] text-center mb-6">
				<Link href="/" className="inline-block">
					<Logo
						className="h-12 w-auto mx-auto transition-transform hover:scale-105"
						alt={domainConfig?.companyName || "VocalDesk"}
					/>
					{/* <h1 className="mt-4 text-xl font-semibold text-gray-900">
						{domainConfig?.companyName || "VocalDesk"}
					</h1> */}
				</Link>
			</div>

			{/* Auth Card Container */}
			<div className="w-full max-w-[400px] px-4">
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
					{children}
				</div>
			</div>

			{/* Footer Links */}
			<div className="mt-8 text-sm text-gray-500 flex items-center gap-4">
				<Link
					href="https://vocaldesk.co/terms"
					target="_blank"
					className="hover:text-gray-900 transition-colors"
				>
					Terms
				</Link>
				<span className="text-gray-300">·</span>
				<Link
					href="https://vocaldesk.co/privacy"
					target="_blank"
					className="hover:text-gray-900 transition-colors"
				>
					Privacy
				</Link>
			</div>
		</div>
	);
}
