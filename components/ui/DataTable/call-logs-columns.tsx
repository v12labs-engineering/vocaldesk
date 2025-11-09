"use client";
import { DataTableColumnHeader } from "@/components/ui/DataTable/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { formatMinutes } from "@/utils/helpers";
import type { ColumnDef } from "@tanstack/react-table";
import { PhoneIncoming, PhoneOutgoing } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { z } from "zod";

const callSchema = z.object({
	call_id: z.string(),
	call_length: z.number(),
	to: z.string(),
	from: z.string(),
	queue_status: z.string(),
	price: z.number(),
	created_at: z.string(),
	inbound: z.boolean().optional(),
});

type Call = z.infer<typeof callSchema>;

// Status descriptions and visual styling
const statusDescriptions: Record<string, string> = {
	new: "API request received",
	queued: "Call validated and authenticated",
	allocated: "Call being dispatched",
	started: "Call in progress",
	complete: "Call ended successfully",
	pre_queue_error: "Error before queuing (invalid parameters)",
	queue_error: "Error while queued (unserviced area)",
	call_error: "Error during call (invalid transfer)",
	complete_error: "Error after completion (webhook failure)",
};

const statusColors: Record<string, string> = {
	new: "bg-blue-100 text-blue-800",
	queued: "bg-indigo-100 text-indigo-800",
	allocated: "bg-purple-100 text-purple-800",
	started: "bg-green-100 text-green-800",
	complete: "bg-emerald-100 text-emerald-800",
	pre_queue_error: "bg-red-100 text-red-800",
	queue_error: "bg-orange-100 text-orange-800",
	call_error: "bg-amber-100 text-amber-800",
	complete_error: "bg-rose-100 text-rose-800",
};

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
		accessorKey: "inbound",
		header: () => <div />,
		cell: ({ row }) => {
			const isInbound = row.getValue("inbound") as boolean;
			return (
				<div className="p-2 flex justify-center">
					{isInbound ? (
						<PhoneIncoming
							className="h-5 w-5 text-green-600"
							aria-label="Inbound Call"
						/>
					) : (
						<PhoneOutgoing
							className="h-5 w-5 text-blue-600"
							aria-label="Outbound Call"
						/>
					)}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "call_id",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="ID" className="hidden" />
		),
		cell: ({ row }) => (
			<div className="truncate hidden">{row.getValue("call_id")}</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: "to",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="To" />
		),
		cell: ({ row }) => <div className="p-2">{row.getValue("to")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "from",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="From" />
		),
		cell: ({ row }) => <div className="p-2">{row.getValue("from")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "call_length",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Length" />
		),
		cell: ({ row }) => (
			<div className="p-2">{formatMinutes(row.getValue("call_length"))}</div>
		),
	},
	// {
	// 	accessorKey: "price",
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} title="Cost" />
	// 	),
	// 	cell: ({ row }) => (
	// 		<div className="p-2">
	// 			$ {Number.parseFloat(row.getValue("price")).toFixed(3)}
	// 		</div>
	// 	),
	// },
	{
		accessorKey: "queue_status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			const status = row.getValue("queue_status") as string;
			const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";

			return (
				<div className="p-2">
					<span
						className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}
					>
						{status === "complete" ? "Completed" : status}
					</span>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "created_at",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Created At"
				className="flex-end"
			/>
		),
		cell: ({ row }) => (
			<div className="p-2">
				{moment(row.getValue("created_at")).format("M/D/YYYY h:mm A")}
			</div>
		),
	},
	{
		accessorKey: "details",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Details" />
		),
		cell: ({ row }) => (
			<div className="p-2">
				<Link
					href={`/call-logs/${row.getValue("call_id")}`}
					className="underline"
				>
					View
				</Link>
			</div>
		),
		enableSorting: false,
	},
];
