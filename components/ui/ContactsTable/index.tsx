import { columns } from "@/components/ui/DataTable/contacts-table-columns";
import { DataTable } from "@/components/ui/DataTable/data-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function ContactsTable({
	data,
	onRemoveContact,
}: {
	data: any;
	onRemoveContact: (contact: any) => void;
}) {
	const columnsWithActions = columns.map((col) => {
		if (col.id === "actions") {
			return {
				...col,
				cell: ({ row }: { row: any }) => {
					const contact = row.original;

					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="h-8 w-8 p-0"
									type="button"
									onClick={(e) => e.stopPropagation()}
								>
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem
									onClick={(e) => {
										e.stopPropagation();
										onRemoveContact(contact);
									}}
								>
									Remove
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			};
		}
		return col;
	});

	return (
		<div className="px-4">
			<DataTable data={data || []} columns={columnsWithActions} noPagination />
		</div>
	);
}
