import { Card } from "@/components/ui/card";

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		value: number;
		name: string;
	}>;
	label?: string;
}

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
	if (!active || !payload?.length) {
		return null;
	}

	return (
		<Card className="bg-white p-2 shadow-lg border border-gray-200">
			<p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
			{payload.map((item, index) => (
				<div key={index} className="flex items-center gap-1">
					<span className="text-sm font-medium text-primary">
						{item.value.toLocaleString()}
					</span>
					<span className="text-xs font-medium text-gray-500">calls</span>
				</div>
			))}
		</Card>
	);
}
