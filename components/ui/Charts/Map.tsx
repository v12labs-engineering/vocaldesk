import LoadingDots from "@/components/ui/LoadingDots";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
	ZoomableGroup,
} from "react-simple-maps";

// World map GeoJSON (topojson format for better performance)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// In-memory cache for coordinates
const coordinateCache: Record<string, [number, number] | null> = {};

async function getCityCoordinates(
	city: string,
): Promise<[number, number] | null> {
	// Check cache first
	if (coordinateCache[city] !== undefined) {
		return coordinateCache[city];
	}

	try {
		// Add a delay to respect rate limits (1 request per second)
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
				city,
			)}&format=json&limit=1`,
			{
				headers: {
					"User-Agent": "VocalDesk/1.0", // Required by Nominatim's terms of use
					Accept: "application/json",
				},
			},
		);

		const data = await response.json();

		if (data && data[0]) {
			const coordinates: [number, number] = [
				Number.parseFloat(data[0].lon),
				Number.parseFloat(data[0].lat),
			];
			// Store in cache
			coordinateCache[city] = coordinates;
			return coordinates;
		}

		// Cache negative results too
		coordinateCache[city] = null;
		return null;
	} catch (error) {
		console.error(`Error fetching coordinates for ${city}:`, error);
		return null;
	}
}

interface CallData {
	city: string;
	count: number;
}

interface CityCoordinate {
	city: string;
	coordinates: [number, number];
	count: number;
}

interface AppMapChartProps {
	data: CallData[];
	title?: string;
}

export default function AppMapChart({
	data,
	title = "Global Call Distribution",
}: AppMapChartProps) {
	const [cityCoordinates, setCityCoordinates] = useState<CityCoordinate[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [tooltipContent, setTooltipContent] = useState("");
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		async function fetchCoordinates() {
			setIsLoading(true);

			// Filter out "Unknown" locations
			const validCities = data.filter((item) => item.city !== "Unknown");

			// Fetch coordinates for all cities
			const coordinates = await Promise.all(
				validCities.map(async (item) => {
					const coords = await getCityCoordinates(item.city);
					if (coords) {
						return {
							city: item.city,
							coordinates: coords,
							count: item.count,
						};
					}
					return null;
				}),
			);

			// Filter out null results
			setCityCoordinates(
				coordinates.filter((item): item is CityCoordinate => item !== null),
			);
			setIsLoading(false);
		}

		fetchCoordinates();
	}, [data]);

	// Calculate statistics
	const totalCalls = data.reduce((sum, item) => sum + item.count, 0);
	const mappedCalls = cityCoordinates.reduce(
		(sum, item) => sum + item.count,
		0,
	);
	const unknownCalls = totalCalls - mappedCalls;

	return (
		<Card className="w-full">
			<CardHeader>
				<h3 className="text-sm font-semibold mb-4">{title}</h3>
			</CardHeader>
			<CardContent className="relative w-full">
				{isLoading ? (
					<div className="flex items-center justify-center h-[300px]">
						<LoadingDots />
						<div className="ml-2 text-sm text-muted-foreground">
							Loading map data...
						</div>
					</div>
				) : (
					<div className="relative w-full h-[300px]">
						<ComposableMap projection="geoMercator" className="w-full h-full">
							<ZoomableGroup center={[0, 20]} zoom={1}>
								<Geographies geography={geoUrl}>
									{({ geographies }) =>
										geographies.map((geo) => (
											<Geography
												key={geo.rsmKey}
												geography={geo}
												fill="#e6e6e6"
												stroke="#ffffff"
												strokeWidth={0.5}
												style={{
													default: {
														outline: "none",
													},
													hover: {
														fill: "#d6d6d6",
														outline: "none",
													},
													pressed: {
														outline: "none",
													},
												}}
											/>
										))
									}
								</Geographies>

								{cityCoordinates.map((item) => (
									<Marker
										key={item.city}
										coordinates={item.coordinates}
										onMouseEnter={(e) => {
											setTooltipContent(`${item.city}: ${item.count} calls`);
											setTooltipPosition({
												x: e.clientX,
												y: e.clientY,
											});
										}}
										onMouseLeave={() => {
											setTooltipContent("");
										}}
									>
										<g>
											<circle
												r={Math.sqrt(item.count) * 4}
												fill="#2563eb"
												opacity={0.7}
												stroke="#fff"
												strokeWidth={2}
											/>
										</g>
									</Marker>
								))}
							</ZoomableGroup>
						</ComposableMap>

						{/* Interactive Tooltip - Adjusted positioning */}
						{tooltipContent && (
							<div
								className="fixed pointer-events-none bg-white/90 px-2 py-1 rounded-md shadow-sm border text-sm z-50"
								style={{
									left: `${tooltipPosition.x}px`,
									top: `${tooltipPosition.y - 10}px`,
									transform: "translate(-50%, -100%)",
								}}
							>
								{tooltipContent}
							</div>
						)}

						{/* Enhanced Legend - Added z-index */}
						<div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow-sm border z-40">
							<div className="text-sm font-medium mb-2">Call Volume</div>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-1">
									<circle cx={6} cy={6} r={4} fill="#2563eb" opacity={0.7} />
									<span className="text-xs">
										Size indicates number of calls
									</span>
								</div>
							</div>
							<div className="text-xs text-muted-foreground mt-2">
								<div>Total Calls: {totalCalls}</div>
								{unknownCalls > 0 && (
									<div>Unknown Location: {unknownCalls} calls</div>
								)}
							</div>
							<div className="text-xs text-muted-foreground mt-1">
								Hover over points for details
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
