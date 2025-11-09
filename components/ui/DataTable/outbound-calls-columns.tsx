"use client";

import { DataTableColumnHeader } from "@/components/ui/DataTable/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import Link from "next/link";
import { z } from "zod";

const callSchema = z.object({
	label: z.string(),
	batch_id: z.number(),
	created_at: z.string(),
});

type Call = z.infer<typeof callSchema>;

export const columns: ColumnDef<Call>[] = [
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
		accessorKey: "label",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => (
			<div className="p-2">
				<Link href={`/outbound-calls/${row.getValue("batch_id")}`}>
					{row.getValue("label")}
				</Link>
			</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: "batch_id",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Batch Id" />
		),
		cell: ({ row }) => (
			<div className="truncate">{row.getValue("batch_id")}</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: "created_at",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created Date" />
		),
		cell: ({ row }) => (
			<div className="p-2">
				{moment(row.getValue("created_at")).format("M/D/YYYY h:mm A")}
			</div>
		),
	},
	{
		accessorKey: "details",
		header: "Details",
		cell: ({ row }) => (
			<div className="p-2 underline">
				<Link
					href={`/outbound-calls/${row.getValue("batch_id")}`}
				>
					View
				</Link>
			</div>
		),
		enableSorting: false,
	},
];
