"use client";
import { DataTableColumnHeader } from "@/components/ui/DataTable/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { z } from "zod";

// const user = {
// 	id: "f07b95f8-8ff1-4193-a27d-5b7cd3ccaa82",
// 	full_name: null,
// 	avatar_url: null,
// 	billing_address: null,
// 	payment_method: null,
// 	notify_email: "csharath@outlook.com,sharath@infernix.ai",
// 	notify_sms: null,
// 	whitelabel_admin: false,
// 	whitelabel_user: true,
// 	domain: "localhost:4000",
// 	ai_phone_number: "+14158401274",
// 	email: "sharath@infernix.ai",
// 	createdAt: "2024-05-31T05:39:07.528192Z",
// 	updatedAt: "2024-07-05T00:52:24.529321Z",
// 	lastSignInAt: "2024-07-05T00:52:24.521754Z",
// };

const userSchema = z.object({
	full_name: z.string().nullable(),
	avatar_url: z.string().nullable(),
	domain: z.string(),
	ai_phone_number: z.string(),
	email: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	lastSignInAt: z.string(),
});

type User = z.infer<typeof userSchema>;

export const columns: ColumnDef<User>[] = [
	// {
	// 	id: "select",
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={
	// 				table.getIsAllPageRowsSelected() ||
	// 				(table.getIsSomePageRowsSelected() && "indeterminate")
	// 			}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label="Select all"
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label="Select row"
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
	{
		accessorKey: "email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email" />
		),
		cell: ({ row }) => <div className="p-2">{row.getValue("email")}</div>,
	},
	{
		accessorKey: "ai_phone_number",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="AI Phone Number" />
		),
		cell: ({ row }) => (
			<div className="p-2">{row.getValue("ai_phone_number")}</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Created At"
				className="flex-end"
			/>
		),
		cell: ({ row }) => (
			<div className="p-2">
				{moment(row.getValue("createdAt")).format("M/D/YYYY h:mm A")}
			</div>
		),
	},
	{
		accessorKey: "lastSignInAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Sign In" />
		),
		cell: ({ row }) => (
			<div className="p-2">
				{moment(row.getValue("lastSignInAt")).format("M/D/YYYY h:mm A")}
			</div>
		),
	},
];
