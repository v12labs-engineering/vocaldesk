"use client";
import Logo from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSection,
} from "@/components/ui/sidebar";
import { useDomainConfig } from "@/hooks/useDomainConfig";
import { useUser } from "@/hooks/useUser";
import { handleRequest } from "@/utils/auth-helpers/client";
import { SignOut } from "@/utils/auth-helpers/server";
import { getRedirectMethod } from "@/utils/auth-helpers/settings";
import { cn } from "@/utils/cn";
import { LogOutIcon, PhoneIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getFilteredNavItems } from "./nav-items";

export default function AppSidebar() {
	const pathname = usePathname();
	const router = getRedirectMethod() === "client" ? useRouter() : null;
	const domainConfig = useDomainConfig();
	const { user } = useUser();

	const filteredNavItems = getFilteredNavItems(user);

	return (
		<Sidebar className="border-r border-gray-100">
			<SidebarHeader className="border-b border-gray-100 p-4">
				<Link href="/" className="flex items-center gap-2">
					{domainConfig && domainConfig?.companyName !== "VocalDesk" ? (
						<div className="flex items-center gap-2">
							<Image
								src={domainConfig.logo}
								alt={domainConfig.companyName}
								width={40}
								height={40}
								style={{ objectFit: "contain" }}
							/>
							<h2 className="text-xl font-bold">{domainConfig.companyName}</h2>
						</div>
					) : (
						<Logo />
					)}
				</Link>
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu className="p-3 space-y-2">
					{filteredNavItems.map((item) => {
						if ("type" in item && item.type === "section") {
							return (
								<SidebarSection key={item.title} title={item.title}>
									{item.items.map((subItem) => (
										<Link
											href={subItem.href}
											passHref
											legacyBehavior
											key={subItem.href}
										>
											<SidebarMenuItem>
												<SidebarMenuButton
													isActive={pathname === subItem.href}
													tooltip={subItem.title}
													className={cn(
														"p-2 font-medium w-full rounded-md",
														pathname === subItem.href && [
															"bg-primary/20",
															"[&_svg]:text-primary",
															"!text-primary",
														],
													)}
												>
													{subItem.icon}
													<span>{subItem.title}</span>
												</SidebarMenuButton>
											</SidebarMenuItem>
										</Link>
									))}
								</SidebarSection>
							);
						}

						return (
							<SidebarMenuItem key={item.href}>
								<Link href={item.href} passHref legacyBehavior>
									<SidebarMenuButton
										isActive={pathname === item.href}
										tooltip={item.title}
										className={cn(
											"p-2 font-medium w-full rounded-md",
											pathname === item.href && [
												"bg-primary/20",
												"[&_svg]:text-primary",
												"!text-primary",
											],
										)}
									>
										{item.icon}
										<span>{item.title}</span>
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter className="border-t border-b border-gray-100">
				{!user?.phones?.[0]?.number && (
					<div className="p-4 border-b border-gray-100 relative">
						<div className="mb-3">
							<div className="flex items-center gap-2">
								<h4 className="text-sm font-medium">Setup Required</h4>
								<span className="flex h-2.5 w-2.5 items-center">
									<span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-primary/60 opacity-75" />
									<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
								</span>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Schedule a quick call with our team to get your AI phone number
								set up.
							</p>
						</div>
						<Link href="/onboarding">
							<Button variant="default" className="w-full gap-2">
								<PhoneIcon className="h-4 w-4" />
								Get Phone Number
							</Button>
						</Link>
					</div>
				)}
				<DropdownMenu>
					<DropdownMenuTrigger>
						<div className="flex items-center gap-2 px-2">
							<div className="flex items-center justify-center text-xs w-8 h-8 rounded-lg bg-primary text-primary-foreground">
								{user?.user_metadata?.full_name ? (
									<span>
										{user.user_metadata.full_name
											.split(" ")
											.map((n: string) => n[0])
											.join("")
											.toUpperCase()}
									</span>
								) : (
									<span>{user?.email?.[0].toUpperCase()}</span>
								)}
							</div>
							<span className="text-sm font-medium text-muted-foreground">
								{user?.user_metadata?.full_name || user?.email}
							</span>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[200px]">
						<form onSubmit={(e) => handleRequest(e, SignOut, router)}>
							<DropdownMenuItem asChild>
								<button type="submit" className="w-full flex items-center">
									<LogOutIcon className="h-4 w-4 mr-2" />
									Log Out
								</button>
							</DropdownMenuItem>
						</form>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
