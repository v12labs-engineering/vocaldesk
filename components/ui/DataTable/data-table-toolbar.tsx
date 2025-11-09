import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	search: {
		columnKey: string;
		placeholder: string;
	};
	facetedFilters: {
		columnKey: string;
		title: string;
		options: { label: string; value: string }[];
	}[];
}

export function DataTableToolbar<TData>({
	table,
	search,
	facetedFilters,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder={search.placeholder}
					value={
						(table.getColumn(search.columnKey)?.getFilterValue() as string) ??
						""
					}
					onChange={(event) =>
						table
							.getColumn(search.columnKey)
							?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{facetedFilters?.map((filter) => (
					<DataTableFacetedFilter
						key={filter.columnKey}
						column={table.getColumn(filter.columnKey)}
						title={filter.title}
						options={filter.options}
					/>
				))}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<Cross2Icon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
		</div>
	);
}
