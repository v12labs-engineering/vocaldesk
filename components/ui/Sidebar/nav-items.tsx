import {
	BarChartIcon,
	BellIcon,
	BookCheckIcon,
	BotIcon,
	LayoutDashboardIcon,
	LibraryBigIcon,
	LinkIcon,
	PhoneOutgoingIcon,
	Settings2Icon,
	TableIcon,
	UserIcon,
	Users2Icon,
} from "lucide-react";

// Base nav items that are always shown
const baseNavItems = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: <LayoutDashboardIcon className="h-6 w-6 mr-2" />,
	},
	{
		title: "AI Phone Agent",
		href: "/ai-agent",
		icon: <BotIcon className="h-6 w-6 mr-2" />,
	},
	{
		title: "Call Logs",
		href: "/call-logs",
		icon: <TableIcon className="h-6 w-6 mr-2" />,
	},
	{
		title: "Outbound Calls",
		href: "/outbound-calls",
		icon: <PhoneOutgoingIcon className="h-6 w-6 mr-2" />,
	},
	{
		title: "Advanced Settings",
		href: "/advanced-settings",
		icon: <Settings2Icon className="h-6 w-6 mr-2" />,
	},
	{
		title: "Integrations",
		href: "/integrations",
		icon: <LinkIcon className="h-6 w-6 mr-2" />,
	},
	{
		title: "Prompts",
		href: "/prompts",
		icon: <LibraryBigIcon className="h-8 w-8 mr-2" />,
	},
	{
		title: "Notifications",
		href: "/notifications",
		icon: <BellIcon className="h-8 w-8 mr-2" />,
	},
	{
		title: "Account",
		href: "/account",
		icon: <UserIcon className="h-8 w-8 mr-2" />,
	},
];

// Admin section with its items
const adminSection = {
	type: "section",
	title: "Admin",
	items: [
		{
			title: "Users",
			href: "/admin/users",
			icon: <Users2Icon className="h-6 w-6 mr-2" />,
		},
		{
			title: "Analytics",
			href: "/admin/analytics",
			icon: <BarChartIcon className="h-6 w-6 mr-2" />,
		},
	],
};

// Documentation item for whitelabel admins
// const documentationItem = {
// 	title: "Documentation",
// 	href: "/docs",
// 	icon: <BookCheckIcon className="h-6 w-6 mr-2" />,
// };

// Export the full nav items array
export const sidebarNavItems = baseNavItems;

// Export a function to get filtered nav items based on user
export const getFilteredNavItems = (user: any) => {
	if (user?.details?.whitelabel_admin) {
		return [...baseNavItems, adminSection];
	}
	return sidebarNavItems;
};
