"use client";

import { DataTableColumnHeader } from "@/components/ui/DataTable/data-table-column-header";
import LoadingDots from "@/components/ui/LoadingDots";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const promptSchema = z.object({
	id: z.string(),
	name: z.string(),
	prompt: z.string(),
	createdAt: z.string(),
});

type Prompt = z.infer<typeof promptSchema>;

const deletePrompt = async (prompt: Prompt) => {
	const promptId = prompt.id;
	await axios.delete(`/api/agent/prompt/?promptId=${promptId}`);
};

export const columns: ColumnDef<Prompt>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="ID" />
		),
		cell: ({ row }) => {
			{
				const fullId = row.getValue("id") as string;
				return <div>{fullId.startsWith("PT-") ? fullId.slice(3) : fullId}</div>;
			}
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => <div className="p-2">{row.getValue("name")}</div>,
	},
	{
		accessorKey: "prompt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Prompt" />
		),
		cell: ({ row }) => {
			const prompt = row.original.prompt;
			const truncatedPrompt =
				prompt.length > 50 ? `${prompt.slice(0, 50)}...` : prompt;

			return (
				<div className="flex items-center space-x-1">
					<span className="truncate max-w-[300px]">{truncatedPrompt}</span>
					{prompt.length > 50 && (
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="link" size="sm" className="p-0">
									View more
								</Button>
							</DialogTrigger>
							<DialogContent>
								<div className="mt-4">
									<p className="text-sm whitespace-pre-wrap">{prompt}</p>
								</div>
							</DialogContent>
						</Dialog>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "last_updated",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Created At"
				className="flex-end"
			/>
		),
		cell: ({ row }) => (
			<div className="p-2">
				{moment(row.getValue("last_updated")).format("M/D/YYYY h:mm A")}
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const prompt = row.original;
			const router = useRouter();
			const [isOpen, setIsOpen] = useState(false);
			const [isDeleting, setIsDeleting] = useState(false);

			const handleDelete = async () => {
				setIsDeleting(true);
				try {
					await deletePrompt(prompt);
					setIsOpen(false); // Close the dialog only after successful deletion
					router.refresh();
				} catch (error) {
					console.error("Failed to delete prompt:", error);
					// Optionally add error handling UI here
				} finally {
					setIsDeleting(false);
				}
			};

			return (
				<>
					<Button
						onClick={() => setIsOpen(true)}
						className="rounded px-2 h-8 w-8 bg-destructive hover:bg-destructive/80"
					>
						<Trash2Icon className="h-4 w-4 text-center" />
					</Button>
					<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									prompt.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<Button
									onClick={(e) => {
										e.preventDefault();
										handleDelete();
									}}
									disabled={isDeleting}
									className="bg-destructive hover:bg-destructive/80"
								>
									{isDeleting ? <LoadingDots /> : "Delete"}
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			);
		},
	},
];
