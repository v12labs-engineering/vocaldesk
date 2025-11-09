"use client";

import { DataTableColumnHeader } from "@/components/ui/DataTable/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { date, z } from "zod";

const callSchema = z.object({
	phone_number: z.string(),
	business: z.number(),
	service: z.string(),
	date: z.string(),
	previous_customer: z.boolean(),
	city: z.string(),
	persons_name: z.string(),
});

type Call = z.infer<typeof callSchema>;

export const columns: ColumnDef<Call>[] = [
	{
		accessorKey: "phone_number",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Phone Number" />
		),
		cell: ({ row }) => (
			<div className="p-2">{row.getValue("phone_number")}</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: "persons_name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => (
			<div className="truncate">{row.getValue("persons_name")}</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: "business",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Business" />
		),
		cell: ({ row }) => <div className="p-2">{row.getValue("business")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Updated Date" />
		),
		cell: ({ row }) => (
			<div className="p-2">
				{moment(row.getValue("date")).format("M/D/YYYY h:mm A")}
			</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: "previous_customer",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Previous Customer" />
		),
		cell: ({ row }) => (
			<div className="p-2">
				{row.getValue("previous_customer") ? "Yes" : "No"}
			</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: "city",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="City" />
		),
		cell: ({ row }) => <div className="p-2">{row.getValue("city")}</div>,
		enableSorting: false,
	},
	{
		id: "actions",
		enableHiding: false,
	},
];
