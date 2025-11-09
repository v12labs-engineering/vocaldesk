import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getOutboundBatchDetails } from "@/utils/agent";
import moment from "moment";

export default async function OutboundDetails({
	params,
}: { params: { id: string } }) {
	const outboundBatchDetails = await getOutboundBatchDetails(params?.id);
	return (
		<div className="px-4">
			<h1 className="text-lg font-semibold">Outbound Batch Details</h1>
			<div className="my-8">
				<div className="grid grid-cols-5 items-center gap-4">
					<div className="rounded-md border border-gray-200 dark:border-gray-800 p-4">
						<h2 className="text-sm font-semibold">Total</h2>
						<p className="text-xl font-bold">
							{outboundBatchDetails?.analysis?.total_calls}{" "}
							<span className="text-xs text-gray-500 dark:text-gray-400">
								calls
							</span>
						</p>
					</div>
					<div className="rounded-md border border-gray-200 dark:border-gray-800 p-4">
						<h2 className="text-sm font-semibold">Completed</h2>
						<p className="text-xl font-bold">
							{outboundBatchDetails?.analysis?.completed_calls}{" "}
							<span className="text-xs text-gray-500 dark:text-gray-400">
								calls
							</span>
						</p>
					</div>
					<div className="rounded-md border border-gray-200 dark:border-gray-800 p-4">
						<h2 className="text-sm font-semibold">In Progress</h2>
						<p className="text-xl font-bold">
							{outboundBatchDetails?.analysis?.in_progress_calls}{" "}
							<span className="text-xs text-gray-500 dark:text-gray-400">
								calls
							</span>
						</p>
					</div>
					<div className="rounded-md border border-gray-200 dark:border-gray-800 p-4">
						<h2 className="text-sm font-semibold">Failed</h2>
						<p className="text-xl font-bold">
							{outboundBatchDetails?.analysis?.queue_statuses?.call_error || 0}{" "}
							<span className="text-xs text-gray-500 dark:text-gray-400">
								calls
							</span>
						</p>
					</div>
					<div className="rounded-md border border-gray-200 dark:border-gray-800 p-4">
						<h2 className="text-sm font-semibold">Average Duration</h2>
						<p className="text-xl font-bold">
							{outboundBatchDetails?.analysis?.call_lengths?.average}{" "}
							<span className="text-xs text-gray-500 dark:text-gray-400">
								sec
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className="my-8 border border-gray-200 dark:border-gray-800 rounded-md p-4">
				<div className="grid grid-cols-4 gap-4">
					<div>
						<p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
						<p className="text-sm font-medium">
							{outboundBatchDetails?.batch_params?.label}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Initiated At
						</p>
						<p className="text-sm font-medium">
							{moment(outboundBatchDetails?.batch_params?.created_at).format(
								"M/D/YYYY h:mm A",
							)}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-500 dark:text-gray-400">Voice</p>
						<p className="text-sm font-medium">
							{outboundBatchDetails?.batch_params?.call_params?.voice}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
						<p className="text-sm font-medium">
							{outboundBatchDetails?.batch_params?.call_params?.model}
						</p>
					</div>
				</div>
				<div className="mt-4">
					<Accordion type="single" collapsible className="rounded-md p-4">
						<AccordionItem
							value="item-1"
							className="border-gray-200 dark:border-gray-800"
						>
							<AccordionTrigger>Prompt</AccordionTrigger>
							<AccordionContent className="text-sm text-muted-foreground">
								{outboundBatchDetails?.batch_params?.base_prompt}
							</AccordionContent>
						</AccordionItem>
						<AccordionItem
							value="item-2"
							className="border-gray-200 dark:border-gray-800"
						>
							<AccordionTrigger>Greeting</AccordionTrigger>
							<AccordionContent className="text-sm text-muted-foreground">
								{
									outboundBatchDetails?.batch_params?.call_params
										?.first_sentence
								}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
			<div className="my-8">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Phone number</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Duration</TableHead>
							<TableHead>Initiated At</TableHead>
							<TableHead>Details</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{outboundBatchDetails?.call_data?.map((call) => (
							<TableRow key={call.call_id} className="h-16">
								<TableCell className="font-medium">{call.to}</TableCell>
								<TableCell>${call.price}</TableCell>
								<TableCell>{call.queue_status}</TableCell>
								<TableCell>{call.call_length}sec</TableCell>
								<TableCell>
									{moment(call.created_at).format("M/D/YYYY h:mm A")}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
